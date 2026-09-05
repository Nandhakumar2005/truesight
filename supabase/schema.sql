-- ============================================================
-- TrueSight — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up all tables.
-- ============================================================

-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES
-- Extended user information linked to auth.users.
-- auth.users is managed entirely by Supabase Auth.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.profiles IS
    'User profile information. Extends Supabase auth.users.';

-- ── Trigger: keep updated_at current ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Trigger: auto-create profile on new user signup ───────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ANALYSES
-- Core analysis records.
-- ============================================================

CREATE TYPE public.media_type AS ENUM ('IMAGE', 'AUDIO', 'VIDEO', 'URL');
CREATE TYPE public.analysis_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
CREATE TYPE public.verdict AS ENUM (
    'LIKELY_AUTHENTIC',
    'SUSPICIOUS',
    'LIKELY_MANIPULATED',
    'INCONCLUSIVE'
);

CREATE TABLE IF NOT EXISTS public.analyses (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    media_type          public.media_type NOT NULL,
    filename            TEXT,
    file_url            TEXT,
    status              public.analysis_status NOT NULL DEFAULT 'PENDING',

    -- AI-assisted authenticity estimate: 0 (highly suspicious) → 100 (highly authentic).
    -- This is NOT a scientific certainty. It is an AI-assisted assessment.
    authenticity_score  NUMERIC(5, 2) CHECK (authenticity_score BETWEEN 0 AND 100),
    verdict             public.verdict,
    confidence          NUMERIC(4, 3) CHECK (confidence BETWEEN 0 AND 1),

    summary             TEXT,
    -- Signals stored as JSONB array for flexibility.
    signals             JSONB DEFAULT '[]'::jsonb,
    -- Raw technical metadata (EXIF, container info, etc.)
    metadata            JSONB DEFAULT '{}'::jsonb,

    error_message       TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.analyses IS
    'Media analysis results. authenticity_score is AI-assisted and not scientifically definitive.';
COMMENT ON COLUMN public.analyses.authenticity_score IS
    'AI-assisted authenticity estimate (0-100). Lower = more suspicious. NOT scientific fact.';

CREATE TRIGGER trg_analyses_updated_at
    BEFORE UPDATE ON public.analyses
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_analyses_user_id ON public.analyses(user_id);
CREATE INDEX idx_analyses_created_at ON public.analyses(created_at DESC);
CREATE INDEX idx_analyses_status ON public.analyses(status);

-- ============================================================
-- MEDIA
-- Uploaded media files stored in Supabase Storage.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.media (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    analysis_id         UUID REFERENCES public.analyses(id) ON DELETE SET NULL,

    filename            TEXT NOT NULL,
    original_filename   TEXT NOT NULL,
    content_type        TEXT NOT NULL,
    size_bytes          BIGINT NOT NULL,
    media_type          public.media_type NOT NULL,

    -- Storage path: media/{user_id}/{analysis_id}/{filename}
    storage_path        TEXT NOT NULL UNIQUE,

    -- SHA-256 hash of file content for deduplication.
    content_hash        TEXT,

    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.media IS
    'Uploaded media file records. Actual files are in Supabase Storage bucket "media".';

CREATE INDEX idx_media_user_id ON public.media(user_id);
CREATE INDEX idx_media_analysis_id ON public.media(analysis_id);

-- ============================================================
-- REPORTS
-- Shareable verification reports linked to analyses.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id     UUID NOT NULL REFERENCES public.analyses(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    title           TEXT NOT NULL,
    -- URL-safe slug for public sharing (e.g. /report/abc123)
    slug            TEXT NOT NULL UNIQUE,
    is_public       BOOLEAN NOT NULL DEFAULT FALSE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.reports IS
    'Shareable verification reports. is_public=true allows viewing without authentication.';

CREATE TRIGGER trg_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_reports_user_id ON public.reports(user_id);
CREATE INDEX idx_reports_slug ON public.reports(slug);

-- ============================================================
-- ROW LEVEL SECURITY
-- Users can only access their own data.
-- ============================================================

ALTER TABLE public.profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports   ENABLE ROW LEVEL SECURITY;

-- ── Profiles ──────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- ── Analyses ──────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own analyses"
    ON public.analyses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analyses"
    ON public.analyses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analyses"
    ON public.analyses FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analyses"
    ON public.analyses FOR DELETE
    USING (auth.uid() = user_id);

-- ── Media ─────────────────────────────────────────────────────────────────────

CREATE POLICY "Users can view their own media"
    ON public.media FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own media"
    ON public.media FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own media"
    ON public.media FOR DELETE
    USING (auth.uid() = user_id);

-- ── Reports ───────────────────────────────────────────────────────────────────

-- Owners can always see their own reports.
CREATE POLICY "Users can view their own reports"
    ON public.reports FOR SELECT
    USING (auth.uid() = user_id);

-- Public reports are readable by anyone (for sharing).
CREATE POLICY "Public reports are publicly readable"
    ON public.reports FOR SELECT
    USING (is_public = TRUE);

CREATE POLICY "Users can insert their own reports"
    ON public.reports FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
    ON public.reports FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
    ON public.reports FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET SETUP
-- Run these in Supabase Dashboard → Storage, or via SQL:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('media', 'media', false)
-- ON CONFLICT DO NOTHING;

-- Storage RLS policy: Users can only access their own folder.
-- CREATE POLICY "Users can upload to their own folder"
--     ON storage.objects FOR INSERT
--     WITH CHECK (
--         bucket_id = 'media'
--         AND auth.uid()::text = (storage.foldername(name))[2]
--     );
--
-- CREATE POLICY "Users can view their own files"
--     ON storage.objects FOR SELECT
--     USING (
--         bucket_id = 'media'
--         AND auth.uid()::text = (storage.foldername(name))[2]
--     );
--
-- CREATE POLICY "Users can delete their own files"
--     ON storage.objects FOR DELETE
--     USING (
--         bucket_id = 'media'
--         AND auth.uid()::text = (storage.foldername(name))[2]
--     );
