# GEOConsole Monorepo Deployment Guide

## 🎯 Monorepo Structure

```
GEOConsole/
├── app/                  # Wasp development
├── deploy/              # Production deployments
│   ├── backend/         # Railway → Point here
│   ├── frontend/        # Netlify → Point here  
│   └── README.md
├── docs/               # Documentation
├── blog/               # Marketing site
└── e2e-tests/         # Testing
```

## 🚀 Deployment Process

### Step 1: Railway Backend Setup

1. **Create Railway Project:**
   - Go to https://railway.app  
   - New Project → "Deploy from GitHub repo"
   - Select: `manu030/geoconsole` repository

2. **Configure Build Settings:**
   - **Root Directory:** `deploy/backend`
   - **Build Command:** `npm ci --production` 
   - **Start Command:** `npm start`
   - **Port:** `3001` (or Railway auto-assigns)

3. **Add PostgreSQL Database:**
   - Add Service → Database → PostgreSQL
   - Copy the `DATABASE_URL` connection string

4. **Environment Variables:**
   ```env
   DATABASE_URL=postgresql://... (from Railway PostgreSQL)
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   WASP_WEB_CLIENT_URL=https://your-site.netlify.app
   WASP_SERVER_URL=https://your-backend.railway.app
   SENDGRID_API_KEY=your-sendgrid-api-key
   NODE_ENV=production
   PORT=3001
   ```

### Step 2: Netlify Frontend Setup

1. **Create Netlify Site:**
   - Go to https://netlify.com
   - Add new site → Import from Git
   - Select: `manu030/geoconsole` repository

2. **Configure Build Settings:**
   - **Base directory:** `deploy/frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `deploy/frontend/dist`

3. **Environment Variables:**
   ```env
   REACT_APP_API_URL=https://your-backend.railway.app
   NODE_ENV=production
   CI=false
   ```

### Step 3: Cross-Platform Configuration

1. **Update Backend CORS:**
   - In Railway, update `WASP_WEB_CLIENT_URL` to actual Netlify URL
   - Redeploy backend

2. **Test Connection:**
   - Visit Netlify URL
   - Try signup/login
   - Check Railway logs for connections

## 🔄 Development Workflow

### Making Changes:

1. **Develop in `/app` directory:**
   ```bash
   cd app
   wasp start  # Development server
   ```

2. **Build for production:**
   ```bash
   wasp build  # Creates .wasp/build/
   ```

3. **Update deployment files:**
   ```bash
   # Copy new builds
   cp -r app/.wasp/build/server/* deploy/backend/
   cp -r app/.wasp/build/web-app/* deploy/frontend/
   
   # Commit and push
   git add deploy/
   git commit -m "Update deployment builds"
   git push
   ```

4. **Auto-deployment:**
   - Railway and Netlify detect changes and redeploy automatically

## ✅ Advantages of Monorepo:

- ✅ **Single source of truth:** One repository for everything
- ✅ **Automatic deployments:** Push once, deploy everywhere  
- ✅ **Easier maintenance:** No sync issues between repos
- ✅ **Better CI/CD:** Can run tests before deployment
- ✅ **Documentation co-located:** Everything in one place

## 📋 Required API Keys:

### Essential (for basic functionality):
- **SendGrid API Key:** Email verification
- **JWT Secret:** Generate with `openssl rand -base64 32`

### GEOConsole Features (add later):
- **DataForSEO:** Keyword extraction and LLM scraping
- **OpenRouter:** AI content generation
- **Stripe:** Payment processing

## 🔧 Troubleshooting:

### Backend Issues:
- Check Railway logs in dashboard
- Verify all environment variables are set
- Test database connection

### Frontend Issues:
- Check Netlify build logs
- Verify `REACT_APP_API_URL` matches Railway URL
- Check browser network tab for API errors

## 🎯 Next Steps:

1. **Deploy backend to Railway** (point to `deploy/backend`)
2. **Deploy frontend to Netlify** (point to `deploy/frontend`)  
3. **Configure environment variables** on both platforms
4. **Test the live application**
5. **Add your API keys** for full GEOConsole functionality

**This monorepo approach is production-ready and much cleaner! 🚀**