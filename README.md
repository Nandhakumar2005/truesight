# TrueSight

> **Don't trust everything you see. Verify it with TrueSight.**

TrueSight is a GenAI-powered media verification platform for everyday users. It helps determine whether images, audio, and video content may be AI-generated or manipulated — and explains the assessment in plain language.

---

## Architecture

```
User Browser
     │
     ▼
Next.js Frontend (Vercel)
     │  REST API calls
     ▼
FastAPI Backend (Render)
     │                    │
     ▼                    ▼
Gemini API          Supabase
(AI Analysis)   (Auth + DB + Storage)
```

**Data Flow:**
1. User uploads media or provides a URL via the Next.js frontend.
2. Frontend authenticates the request via Supabase Auth and sends it to the FastAPI backend.
3. Backend validates the file, extracts metadata, and sends it to the Gemini API for multimodal analysis.
4. Gemini returns structured analysis results; the backend computes an authenticity score and signals.
5. Results are persisted to Supabase (PostgreSQL) and returned to the frontend.
6. Users can view history, generate shareable reports, and manage their media library.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| Next.js 14 (App Router) | React framework |
| TypeScript (strict) | Type safety |
| Tailwind CSS | Utility-first styling |
| shadcn/ui | Accessible component library |
| Lucide Icons | Icon set |
| Framer Motion | Animations (future steps) |

### Backend
| Technology | Purpose |
|-----------|---------|
| Python 3.11+ | Runtime |
| FastAPI | Web framework |
| Pydantic v2 | Data validation & schemas |
| Uvicorn | ASGI server |

### AI
| Technology | Purpose |
|-----------|---------|
| Google Gemini API | Multimodal analysis (image, audio, video, text) |

### Database / Auth / Storage
| Technology | Purpose |
|-----------|---------|
| Supabase | PostgreSQL, Auth, Storage |
| Row Level Security | Per-user data isolation |

### Deployment
| Service | What it hosts |
|---------|--------------|
| Vercel | Next.js frontend |
| Render | FastAPI backend |
| Supabase | Database, auth, file storage |

---

## Project Structure

```
truesight/
├── frontend/               # Next.js application
│   ├── app/                # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx        # Landing (temp placeholder)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── analyze/
│   │   └── report/[id]/
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── analyzer/
│   │   ├── reports/
│   │   └── shared/
│   ├── lib/
│   │   ├── api.ts          # Centralized API client
│   │   ├── supabase.ts     # Supabase browser client
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── hooks/
│   ├── types/
│   │   ├── analysis.ts
│   │   ├── media.ts
│   │   ├── report.ts
│   │   └── user.ts
│   └── public/
│
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── main.py         # FastAPI app entry point
│   │   ├── api/v1/
│   │   │   ├── router.py
│   │   │   └── endpoints/
│   │   │       └── health.py
│   │   ├── core/
│   │   │   ├── config.py   # Settings (env vars)
│   │   │   └── security.py
│   │   ├── schemas/        # Pydantic request/response models
│   │   ├── models/         # DB model representations
│   │   ├── services/
│   │   │   ├── gemini_service.py
│   │   │   └── analysis_service.py
│   │   └── utils/
│   ├── requirements.txt
│   └── .env.example
│
├── supabase/
│   └── schema.sql          # Database schema with RLS
│
├── README.md
└── .gitignore
```

---

## Local Development

### Prerequisites
- Node.js 18+
- Python 3.11+
- A Supabase project (free tier works)
- A Google Gemini API key

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev
```

Frontend runs at: http://localhost:3000

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate      # Windows
# source .venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Copy and fill in environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key (safe for frontend) |
| `NEXT_PUBLIC_API_URL` | Backend API URL (e.g., `http://localhost:8000`) |

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (**server-side only — never expose to frontend**) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `FRONTEND_URL` | Frontend origin for CORS (e.g., `http://localhost:3000`) |

> ⚠️ **Security:** Never commit `.env` files or expose `SUPABASE_SERVICE_ROLE_KEY` to the frontend.

---

## API

### Base URL
- Local: `http://localhost:8000/api/v1`
- Production: `https://your-render-service.onrender.com/api/v1`

### Implemented Endpoints

#### `GET /api/v1/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "truesight-api"
}
```

### Planned Endpoints (STEP 5+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/analyze` | Submit media file for analysis |
| `POST` | `/api/v1/analyze/url` | Submit media URL for analysis |
| `GET` | `/api/v1/analyses` | List user's analyses |
| `GET` | `/api/v1/analyses/{id}` | Get a specific analysis |
| `POST` | `/api/v1/reports` | Generate a shareable report |
| `GET` | `/api/v1/reports/{id}` | Get a specific report |

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation"
  }
}
```

---

## Deployment

### Local Development

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in your values
npm run dev                   # → http://localhost:3000
```

#### Backend
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env          # then fill in your values
uvicorn app.main:app --reload --port 8000   # → http://localhost:8000
```

Health check: `GET http://localhost:8000/api/v1/health`

---

### Frontend Environment Variables (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key — safe for browser | `eyJ...` |
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |

> **Security:** `NEXT_PUBLIC_*` variables are embedded in the browser bundle. Never put secrets in them.

---

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server-side only** | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `FRONTEND_URL` | Comma-separated CORS origins | ✅ |
| `APP_ENV` | `development` or `production` | optional |
| `MAX_UPLOAD_SIZE_BYTES` | Max upload in bytes (default 50 MB) | optional |

> **Security:** `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` must **never** be set as `NEXT_PUBLIC_*` variables or exposed to the browser.

---

### Deploy Frontend → Vercel

1. Push the repository to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set **Root Directory** to `frontend` (not `apps/frontend` — this project uses `truesight/frontend`).
4. Framework preset: **Next.js** (auto-detected).
5. Add the following environment variables in the Vercel dashboard:

   | Variable | Value |
   |----------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
   | `NEXT_PUBLIC_API_URL` | `https://your-service.onrender.com` |

6. Click **Deploy**.

---

### Deploy Backend → Render

1. Create a **Web Service** in [Render](https://render.com).
2. Connect your GitHub repository.
3. Set **Root Directory** to `backend`.
4. Set **Runtime** to `Python`.
5. Set **Build Command**:
   ```
   pip install -r requirements.txt
   ```
6. Set **Start Command**:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
7. Set **Health Check Path**: `/api/v1/health`
8. Add the following environment variables in Render's dashboard:

   | Variable | Value |
   |----------|-------|
   | `SUPABASE_URL` | Your Supabase project URL |
   | `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
   | `GEMINI_API_KEY` | Your Google Gemini API key |
   | `FRONTEND_URL` | `https://your-app.vercel.app` |
   | `APP_ENV` | `production` |

   > Alternatively, use the included `render.yaml` Blueprint — all fields are pre-configured, just fill in the secrets.

---

### Connect Vercel Frontend to Render Backend

After both are deployed:

1. Copy your Render service URL (e.g., `https://truesight-api.onrender.com`).
2. In Vercel dashboard → Environment Variables, set:
   ```
   NEXT_PUBLIC_API_URL=https://truesight-api.onrender.com
   ```
3. Redeploy the Vercel frontend (trigger a new deployment).
4. In Render dashboard → Environment Variables, set:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Render will automatically restart the backend with the new CORS origin.

**CORS note:** `FRONTEND_URL` accepts comma-separated origins. To allow both local dev and production:
```
FRONTEND_URL=http://localhost:3000,https://your-app.vercel.app
```

---

### Deploy Database → Supabase

1. Create a [Supabase](https://supabase.com) project.
2. In the **SQL Editor**, run the contents of `supabase/schema.sql`.
3. Create a **Storage bucket** named `media` (private).
4. Copy your project URL and keys:
   - **Project URL** → `SUPABASE_URL` (backend) and `NEXT_PUBLIC_SUPABASE_URL` (frontend)
   - **Anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY` (frontend only)
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY` (backend only — never expose to frontend)

---

## API

### Base URL
- Local: `http://localhost:8000/api/v1`
- Production: `https://your-render-service.onrender.com/api/v1`

### Health Check
```
GET /api/v1/health
```
**Response:**
```json
{
  "status": "ok",
  "service": "truesight-api",
  "version": "0.1.0"
}
```

### Planned Endpoints (STEP 5+)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/analyze` | Submit media file for analysis |
| `POST` | `/api/v1/analyze/url` | Submit media URL for analysis |
| `GET` | `/api/v1/analyses` | List user's analyses |
| `GET` | `/api/v1/analyses/{id}` | Get a specific analysis |
| `POST` | `/api/v1/reports` | Generate a shareable report |
| `GET` | `/api/v1/reports/{id}` | Get a specific report |

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable explanation"
  }
}
```

---

## Development Stages

| Stage | Description | Status |
|-------|-------------|--------|
| STEP 1 | Foundation & architecture | ✅ Complete |
| STEP 2 | Landing page & design system | ✅ Complete |
| STEP 3 | Authentication & dashboard | ✅ Complete |
| STEP 4 | Media analysis interface | ✅ Complete |
| STEP 5 | AI analysis backend | 🔜 Next |
| STEP 6 | Reports, history & sharing | 🔜 |
| STEP 7 | Polish, testing & deployment | ✅ Deployment-ready |

---

## License

MIT

