# GEOConsole Deployment Instructions

## 🚀 Ready-to-Deploy Files Created!

Your deployment files are ready in `/Users/manuelsierra/AI-apps/geoconsole-deployments/`:

```
geoconsole-deployments/
├── geoconsole-backend/     # For Railway
└── geoconsole-frontend/    # For Netlify  
```

## 📋 Step-by-Step Deployment Guide

### STEP 1: Deploy Backend to Railway

1. **Create Railway Project:**
   - Go to https://railway.app
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Connect the `geoconsole-backend` folder

2. **Add PostgreSQL Database:**
   - In Railway dashboard, click "New Service"
   - Choose "Database" → "PostgreSQL"  
   - Note the connection string

3. **Set Environment Variables in Railway:**
   ```env
   DATABASE_URL=postgresql://... (from Railway PostgreSQL)
   JWT_SECRET=your-super-secret-jwt-key-at-least-32-chars
   WASP_WEB_CLIENT_URL=https://your-frontend.netlify.app
   WASP_SERVER_URL=https://your-backend.railway.app
   SENDGRID_API_KEY=your-sendgrid-key
   NODE_ENV=production
   PORT=3001
   
   # Optional - for later
   STRIPE_API_KEY=sk_test_...
   DATAFORSEO_LOGIN=your_login
   DATAFORSEO_PASSWORD=your_password
   OPENROUTER_API_KEY=your_key
   ```

4. **Deploy:**
   - Railway will auto-deploy when you push to GitHub
   - Check logs for any errors

### STEP 2: Deploy Frontend to Netlify

1. **Create Netlify Site:**
   - Go to https://netlify.com
   - Click "Add new site" → "Import from Git"
   - Connect the `geoconsole-frontend` folder

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (These are already in `netlify.toml`)

3. **Set Environment Variables in Netlify:**
   ```env
   REACT_APP_API_URL=https://your-backend.railway.app
   NODE_ENV=production
   ```

4. **Deploy:**
   - Netlify will auto-deploy
   - Get your live URL

### STEP 3: Update CORS Settings

1. **Update Backend Environment:**
   - Go back to Railway
   - Update `WASP_WEB_CLIENT_URL` with your actual Netlify URL
   - Redeploy backend

### STEP 4: Test Deployment

1. **Visit your Netlify URL**
2. **Test signup/login**
3. **Check Railway logs for any errors**

## 🔧 Required API Keys

### Essential (for basic functionality):
- **SendGrid API Key** - For email verification
- **JWT Secret** - Generate: `openssl rand -base64 32`

### For GEOConsole features (can add later):
- **DataForSEO Account** - For keyword extraction
- **OpenRouter API Key** - For content generation  
- **Stripe Keys** - For payments

## 🔍 Troubleshooting

### Backend Issues:
- Check Railway logs
- Verify DATABASE_URL connection
- Ensure all required env vars are set

### Frontend Issues:  
- Check Netlify build logs
- Verify REACT_APP_API_URL is correct
- Check browser network tab for API errors

### Database Issues:
- Run migrations manually if needed: `npm run db-migrate-prod`

## 📚 Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Configure SendGrid** for production emails
3. **Add DataForSEO & OpenRouter** API keys
4. **Set up Stripe** for payments
5. **Configure Google OAuth** for social login

## 🎯 Current Status

✅ **Files prepared and ready to deploy**  
⏳ **Waiting for Railway + Netlify deployment**  
⏳ **Environment variables configuration**  
⏳ **API keys setup**  

**You're ready to deploy! Follow the steps above and you'll have GEOConsole live in production! 🚀**