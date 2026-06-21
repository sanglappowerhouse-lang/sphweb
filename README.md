# Sanglap Power House Gym - SPH GYM (FastAPI & HTML split)

This repository contains the refactored Frontend and Backend architecture for the SPH Gym website, separated to facilitate standalone deployments (e.g., hosting the frontend on **Vercel** and the backend on **Render** or **Railway**).

## Project Structure

```text
├── frontend/                     # Static Frontend Web App (suitable for Vercel)
│   ├── index.html                # Main Gym landing page with Drona AI chatbot
│   ├── admin.html                # Admin Dashboard table & charts
│   ├── dronacharya-section.html  # Elite Training booking page
│   ├── css/                      # Stylesheets (style.css, drona-ai.css, etc.)
│   ├── js/                       # Client JS scripts (drona-ai.js, script.js, etc.)
│   └── assets/                   # Images and logos
│
├── backend/                      # Python FastAPI Service (suitable for Render/Railway)
│   ├── main.py                   # FastAPI Application and all API endpoints
│   ├── models.py                 # SQLAlchemy SQLite database models
│   ├── requirements.txt          # Python dependencies
│   └── test_main.py              # Endpoint tests utilizing TestClient
│
└── README.md                     # Deployment & setup instructions (this file)
```

---

## Local Development Setup

### 1. Running the Backend Locally
1. Navigate to the `backend` directory.
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=sqlite:///drona_ai.db
   GEMINI_API_KEY=your_google_gemini_api_key_here
   PORT=8000
   ```
5. Run the FastAPI application:
   ```bash
   python main.py
   ```
   *The backend server will run on [http://localhost:8000](http://localhost:8000).*

### 2. Running the Frontend Locally
Since the frontend is built using static files:
1. Load `frontend/index.html` in your browser.
2. For the best local testing experience, run it using a local HTTP server (like VS Code's **Live Server** extension or `npx serve frontend`).
3. The JavaScript files automatically detect if you are running on `localhost` or `127.0.0.1` and will point to your local FastAPI backend on port `8000` (`http://localhost:8000/api`).

---

## Deployment & Hosting Instructions

### Step 1: Deploying the Backend on Render or Railway

#### Option A: Render (Free Tier)
1. Sign in to [Render](https://render.com/).
2. Create a new **Web Service** and connect it to your GitHub Repository.
3. In the configuration settings, set the following:
   - **Root Directory:** `backend`
   - **Runtime:** `Python`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Add the following **Environment Variables** in the Render settings:
   - `DATABASE_URL` = `sqlite:///drona_ai.db` (or a persistent PostgreSQL URL)
   - `GEMINI_API_KEY` = `your_gemini_api_key`
5. Click **Deploy Web Service**.
6. Once deployed, Render will provide you with a backend URL, for example: `https://sph-gym-backend.onrender.com`. Save this URL!

#### Option B: Railway
1. Sign in to [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repository**.
3. Select your repository, and in settings, specify:
   - **Root Directory:** `backend`
4. In the variables section, add `GEMINI_API_KEY` and `PORT` (Railway will automatically provision `$PORT`).
5. Click deploy. Railway will generate a domain like `https://backend-production.up.railway.app`.

---

### Step 2: Pointing the Frontend to Your Live Backend

Before deploying your frontend, you must configure the production API base URL so the Vercel-hosted frontend can talk to your live backend.

1. Open [frontend/js/drona-ai.js](file:///c:/Users/dassh/OneDrive/Desktop/CSE/PROJECT&FREELANCING/sph%20upd%203/frontend/js/drona-ai.js) and locate the `API_BASE_URL` setup at the top of the file:
   ```javascript
   const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
       ? "http://localhost:8000/api"
       : "https://your-backend-api-url.onrender.com/api"; // <-- Update this URL!
   ```
2. Replace `https://your-backend-api-url.onrender.com/api` with your actual live backend endpoint URL (make sure it ends with `/api`).
3. Open [frontend/admin.html](file:///c:/Users/dassh/OneDrive/Desktop/CSE/PROJECT&FREELANCING/sph%20upd%203/frontend/admin.html) and apply the same update at the top of the script tag (around line 365):
   ```javascript
   const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
       ? "http://localhost:8000/api"
       : "https://your-backend-api-url.onrender.com/api"; // <-- Update this URL!
   ```
4. Commit and push these modifications to your repository.

---

### Step 3: Deploying the Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New** -> **Project** and select your GitHub repository.
3. In the configuration settings:
   - **Framework Preset:** `Other` (or select `Vite` / `Next.js` if you choose to build a React application, but since it's static, select `Other`).
   - **Root Directory:** Select the `frontend` folder. (This tells Vercel to only host your HTML/CSS/JS frontend).
4. Click **Deploy**.
5. Once complete, Vercel will give you a live production frontend link, e.g., `https://sanglap-powerhouse-gym.vercel.app`.

---

### CORS Verification
The FastAPI backend is pre-configured with CORS middleware allowing all origins:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```
This ensures your newly deployed Vercel domain will be able to query the Render/Railway API seamlessly without any browser blockages.
