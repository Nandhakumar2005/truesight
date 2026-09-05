# Testing Strategy & Checklist

This document outlines the basic smoke-testing strategy for developers working on the TrueSight application. Given the hackathon constraints, we prioritize critical user flows and deployment health over comprehensive unit test coverage.

## 1. Backend Health Check
Before testing the frontend, ensure the FastAPI backend is running and healthy.

- **Start Backend:** `cd backend && python -m uvicorn app.main:app --reload`
- **Verify Health:** Visit `http://localhost:8000/api/v1/health`
- **Expected:** `{"status": "ok", ...}`

## 2. Frontend Build Check
Ensure that the Next.js application compiles successfully without TypeScript or Linting errors.

- **Run Build:** `cd frontend && npm run build`
- **Expected:** Successful build with a `0` exit code. All static pages generated.

## 3. Critical User Flows (Smoke Tests)

Launch the frontend dev server (`cd frontend && npm run dev`) and manually verify the following flows:

### Analyzer Flow (Image/Audio/Video)
- [ ] Upload a valid image, audio, or video file.
- [ ] Verify the upload area transitions to the file preview state.
- [ ] Click "Analyze Media".
- [ ] Verify the scanning animation completes and transitions to the Result view.
- [ ] Verify the "Methodology & Limitations" disclaimer is visible.

### Analyzer Flow (URL)
- [ ] Select the "URL" tab.
- [ ] Enter a valid URL (e.g., `https://example.com`).
- [ ] Click "Analyze Media" (or press Enter).
- [ ] Verify the result view shows the analyzed URL and the appropriate summary.

### Demo Cases
- [ ] Click on each of the demo case cards below the upload area.
- [ ] Verify the correct demo data is loaded and the scanning animation completes.
- [ ] Ensure the "Suspicious News Article" (URL demo) works correctly.

### Report Page
- [ ] From an analysis result, click "View Full Report".
- [ ] Verify the Report page loads correctly with the corresponding ID.
- [ ] Verify the Signal Breakdown and the "Methodology & Limitations" section are correctly formatted.
- [ ] Verify the "Share Report" button copies the URL to the clipboard.

### Dashboard
- [ ] Navigate to the Dashboard.
- [ ] Verify the stats (Analyses Completed, Average Score, etc.) load correctly.
- [ ] Verify the Recent Analyses table displays demo records correctly.

## 4. Privacy & Security
- [ ] Verify the privacy disclaimer is clearly visible below the upload area on the Analyzer page.
- [ ] Ensure no API keys (e.g., `GEMINI_API_KEY`) are exposed in the frontend client bundle (they should not be prefixed with `NEXT_PUBLIC_`).
