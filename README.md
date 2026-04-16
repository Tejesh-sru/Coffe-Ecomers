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
	- Checks backend Node syntax
- `.github/workflows/deploy-frontend-pages.yml`
	- Deploys frontend to GitHub Pages
- `.github/workflows/publish-backend-ghcr.yml`
	- Builds and publishes backend Docker image to GitHub Container Registry (GHCR)

## Required GitHub Secrets

Add these in: `Repo Settings -> Secrets and variables -> Actions`

- `PROD_API_BASE_URL`
	- Example: `https://your-backend-domain.com/api`

No extra secret is required for GHCR publishing. GitHub Actions uses `GITHUB_TOKEN` automatically.

## Application Link

After frontend deployment succeeds, your app link will be:

`https://tejesh-sru.github.io/Coffe-Ecomers/`

## Notes

- Frontend API URL is now environment-based (`VITE_API_BASE_URL`)
- Backend allowed CORS origins are now environment-based (`FRONTEND_URLS`)
- Backend image is published to GHCR as:
	- `ghcr.io/tejesh-sru/coffe-ecomers-backend:latest`
- GitHub does not host long-running Node APIs directly. Use the GHCR image on any container host (VPS, Azure, Railway, etc.) and set that URL in `PROD_API_BASE_URL`.