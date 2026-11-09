# ORIGINTRACE — Deployment & Operations Guide

**Last Updated:** 2026-11-08T23:07:05-08:00

---

## 1. Quick Start (Development)

The application runs a unified full-stack architecture using Express (`server.ts`) and Vite on port `3000`.

```bash
# 1. Install dependencies
npm install

# 2. Run the development server (Express + Vite middlewares)
npm run dev
```

The application will be live at `http://localhost:3000`.

---

## 2. Environment Variables

Create a `.env` file or provide environment variables in the host environment:

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Recommended | Google Gemini API key for Module C scam & message linguistic analysis. Automatically injected in AI Studio. |
| `PORT` | Optional | HTTP server listen port (default: `3000`). |
| `NODE_ENV` | Optional | Runtime mode (`development` or `production`). |

---

## 3. Production Build & Execution

```bash
# Build the client bundle
npm run build

# Start the production server
npm start
```

---

## 4. Docker Compose Setup (Standalone Cloud VPS)

```yaml
version: "3.8"

services:
  origintrace:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 5. Security & Operational Hardening

- **Private Network Isolation:** All backend outbound requests enforce SSRF filtering and will not contact private subnets (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, AWS/GCP metadata endpoints `169.254.169.254`).
- **No Client-Side Secrets:** Gemini API keys and sensitive credentials remain exclusively on the Node server.
- **Auditable Fingerprints:** All generated investigation outputs are deterministically hashed with SHA-256 for cryptographic tamper verification.
