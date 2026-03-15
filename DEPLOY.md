# Deployment Guide: Vercel (Frontend) + Railway (Backend)

Deploy the backend first (Railway), then the frontend (Vercel) so you have the API URL for the env var.

---

## Part 1: Deploy Backend to Railway

### 1.1 Sign up / Log in

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub

### 1.2 Create a new project

1. Click **"New Project"**
2. Choose **"Deploy from GitHub repo"**
3. Select your `unihack` repo (or connect GitHub if needed)
4. When asked what to deploy, pick **"Configure"** or **"Add Service"**

### 1.3 Configure the backend service

1. Click on the service (the box that was created)
2. Go to **Settings** (gear icon) or **Variables**
3. Set **Root Directory**: `backend`
   - This tells Railway your app lives in the `backend/` folder
4. Railway will auto-detect Python and use `requirements.txt` + `Procfile`

### 1.4 Add environment variables

1. Go to **Variables** tab
2. Click **+ New Variable**
3. Add:
   - `GOOGLE_PLACES_API_KEY` = your actual Google Places API key

### 1.5 Deploy

1. Railway deploys automatically when you connect the repo
2. If not, click **Deploy** or push a commit
3. Wait for the build to finish (green checkmark)

### 1.6 Get your backend URL

1. Go to **Settings** → **Networking** (or **Deployments**)
2. Click **Generate Domain** (or **Public Networking**)
3. Copy the URL, e.g. `https://your-app-name.up.railway.app`
4. **Save this URL** — you need it for Vercel

---

## Part 2: Deploy Frontend to Vercel

### 2.1 Sign up / Log in

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub

### 2.2 Import the project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repo (same `unihack` repo)
3. Vercel will detect it as a Vite project

### 2.3 Configure the project

1. **Framework Preset**: Vite (should be auto-detected)
2. **Root Directory**: leave as `.` (root)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `dist` (default)
5. **Install Command**: `npm install` (default)

### 2.4 Add environment variable

1. Expand **Environment Variables**
2. Add:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-app-name.up.railway.app` (your Railway URL from Part 1, no trailing slash)
   - Apply to: Production, Preview, Development (all three)

### 2.5 Deploy

1. Click **Deploy**
2. Wait for the build to finish
3. Vercel will give you a URL like `https://unihack26-xxx.vercel.app`

---

## Part 3: Verify

1. Open your Vercel URL
2. Go to **Maps**, set filters in **Presets**, click **Apply preset**
3. You should see the map with pins and meal cards
4. If nothing loads, check:
   - Browser console (F12) for errors
   - Railway logs: Railway dashboard → your service → **Deployments** → click deployment → **View Logs**
   - CORS: backend has `allow_origins=["*"]` so it should work

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Frontend shows "No meals found" but backend works | Set `VITE_API_URL` in Vercel to your Railway URL. Redeploy. |
| CORS errors in console | Backend allows `*`. If still failing, check Railway URL has no typo. |
| Railway build fails | Ensure Root Directory is `backend`. Check `requirements.txt` and `Procfile` exist in backend/. |
| Vercel build fails | Run `npm run build` locally. Fix any TypeScript errors. |

---

## Quick reference

- **Railway URL**: `https://[your-service].up.railway.app`
- **Vercel URL**: `https://[your-project].vercel.app`
- **Backend health check**: `https://[railway-url]/api/health`
- **Backend docs**: `https://[railway-url]/docs`
