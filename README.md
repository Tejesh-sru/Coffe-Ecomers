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
- `.github/workflows/deploy-backend-render.yml`
	- Triggers backend deployment on Render using deploy hook

## Required GitHub Secrets

Add these in: `Repo Settings -> Secrets and variables -> Actions`

- `PROD_API_BASE_URL`
	- Example: `https://your-backend.onrender.com/api`
- `RENDER_DEPLOY_HOOK_URL`
	- Render service deploy hook URL

## Application Link

After frontend deployment succeeds, your app link will be:

`https://tejesh-sru.github.io/Coffe-Ecomers/`

## Notes

- Frontend API URL is now environment-based (`VITE_API_BASE_URL`)
- Backend allowed CORS origins are now environment-based (`FRONTEND_URLS`)