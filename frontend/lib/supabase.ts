/**
 * TrueSight — Supabase Browser Client
 *
 * IMPORTANT SECURITY NOTES:
 * - This client uses the ANON key — safe for browser use.
 * - NEVER use or expose SUPABASE_SERVICE_ROLE_KEY on the frontend.
 * - The service role key is backend-only (backend/app/core/config.py).
 */

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Singleton Supabase browser client.
 * Use this in Client Components and browser-side code.
 *
 * Throws a descriptive error at runtime (not at build time) if env vars are missing.
 */
export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
    );
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Pre-built client for convenience — only use in environments where
 * NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are guaranteed set.
 */
export const supabase = supabaseUrl && supabaseAnonKey
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;

/** Type alias for the Supabase client — useful for typing function arguments. */
export type SupabaseClient = ReturnType<typeof createBrowserClient>;
