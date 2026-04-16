# Fresher's Cafe Backend (MERN)

This backend has been migrated from Spring Boot to Node.js + Express + MongoDB.

## Tech Stack
- Node.js
- Express
- MongoDB + Mongoose

## Setup
1. Go to the backend folder.
2. Install dependencies.
3. Create `.env` from `.env.example`.
4. Start MongoDB.
5. Run the backend server.

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Default backend URL:
- `http://localhost:5000`

Health endpoint:
- `GET http://localhost:5000/api/health`

## Environment Variables
Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/freshers_cafe
FRONTEND_URLS=http://localhost:3000
```

For production, provide deployed frontend URLs as comma-separated values:

```env
FRONTEND_URLS=https://tejesh-sru.github.io/Coffe-Ecomers/,https://your-custom-domain.com
```

## Docker

Build locally:

```bash
cd backend
docker build -t coffe-ecomers-backend .
```

Run locally:

```bash
docker run --rm -p 5000:5000 --env-file .env coffe-ecomers-backend
```

GitHub Actions publishes image to GHCR:

`ghcr.io/tejesh-sru/coffe-ecomers-backend:latest`

## Public Backend Deployment (GitHub Actions + Fly.io)

Workflow: `.github/workflows/deploy-backend-fly.yml`

Required repository secrets:

- `FLY_API_TOKEN`
- `FLY_APP_NAME`

After deployment, public backend URL:

`https://<FLY_APP_NAME>.fly.dev`

API base URL:

`https://<FLY_APP_NAME>.fly.dev/api`

## Auth & Profile APIs
- `POST /api/auth/register`
  - Body: `{ "username": "john", "email": "john@example.com", "password": "secret" }`
- `POST /api/auth/login`
  - Body: `{ "email": "john@example.com", "password": "secret" }`
- `GET /api/auth/profile`
  - Header: `Authorization: Bearer <token>`
- `PUT /api/auth/profile`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "username": "newname" }`

## Cart APIs
- `GET /api/cart`
- `POST /api/cart/add`
  - Body: `{ "name": "Latte", "price": 6.49, "image": "...", "quantity": 1 }`
- `PUT /api/cart/quantity`
  - Body: `{ "name": "Latte", "quantity": 2 }`
- `DELETE /api/cart/{productName}`
- `DELETE /api/cart/clear`

All cart endpoints require:
- Header: `Authorization: Bearer <token>`
