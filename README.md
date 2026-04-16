# Coffe-Ecomers (MERN)

This project is now fully MERN:
- Frontend: React + Vite in `Fresher-s-Cafe-main`
- Backend: Node.js + Express + MongoDB in `backend`

## Local Run

### Frontend
```bash
cd Fresher-s-Cafe-main
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

## GitHub Actions

Workflows added:
- `.github/workflows/ci.yml`
	- Builds frontend
	- Builds backend (Node validation + Docker image build)
- `.github/workflows/deploy-frontend-pages.yml`
	- Deploys frontend to GitHub Pages
- `.github/workflows/deploy-backend-fly.yml`
	- Deploys backend publicly to Fly.io
- `.github/workflows/publish-backend-ghcr.yml`
	- Builds and publishes backend Docker image to GitHub Container Registry (GHCR)

## Required GitHub Secrets

Add these in: `Repo Settings -> Secrets and variables -> Actions`

- `PROD_API_BASE_URL`
	- Example: `https://your-backend-domain.com/api`
- `FLY_API_TOKEN`
	- Fly.io access token
- `FLY_APP_NAME`
	- Fly app name (for example: `coffe-ecomers-api`)

No extra secret is required for GHCR publishing. GitHub Actions uses `GITHUB_TOKEN` automatically.

## Application Links

- Frontend: `https://tejesh-sru.github.io/Coffe-Ecomers/`
- Backend: `https://<FLY_APP_NAME>.fly.dev`
- Backend Health: `https://<FLY_APP_NAME>.fly.dev/api/health`

## Notes

- Frontend API URL is now environment-based (`VITE_API_BASE_URL`)
- Backend allowed CORS origins are now environment-based (`FRONTEND_URLS`)
- Backend image is published to GHCR as:
	- `ghcr.io/tejesh-sru/coffe-ecomers-backend:latest`
- Public backend deployment URL format via Fly.io:
	- `https://<FLY_APP_NAME>.fly.dev`
	- API base URL to use in `PROD_API_BASE_URL`: `https://<FLY_APP_NAME>.fly.dev/api`