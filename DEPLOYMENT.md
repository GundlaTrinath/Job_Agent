# Job Agent - Production Deployment Guide

## 🚀 Free Hosting Deployment

This guide will help you deploy your Job Agent application to free hosting platforms.

---

## 📋 Prerequisites

Before deploying, ensure you have:
- GitHub account
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- Git installed on your computer

---

## 🔐 Step 1: Secure Your Environment Variables

### Backend Environment Setup

1. **Keep your .env file local** (already in .gitignore)
2. **Use .env.example as a template** for deployment platforms
3. **Never commit .env to Git**

Your `.env` should contain:
```
GEMINI_API_KEY=your_actual_api_key_here
COORDINATOR_MODEL=gemini-2.0-flash
SPECIALIST_MODEL=gemini-2.0-flash
```

---

## 📤 Step 2: Push to GitHub

```bash
# Navigate to project root
cd C:\Users\thrived\OneDrive\Documents\GitHub\Job_Agent

# Initialize git (if not already)
git init

# Add all files (sensitive files are excluded by .gitignore)
git add .

# Commit
git commit -m "Initial commit - Production ready Job Agent"

# Add remote (create a repo on GitHub first)
git remote add origin https://github.com/YOUR_USERNAME/Job_Agent.git

# Push
git push -u origin main
```

---

## 🎨 Frontend Deployment (Vercel - FREE)

**Vercel** is recommended for React frontends - completely FREE with unlimited bandwidth!

### Deploy to Vercel:

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up** with GitHub
3. **Click "Add New Project"**
4. **Import** your Job_Agent repository
5. **Configure:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Click Deploy**

Your frontend will be live at: `https://your-app-name.vercel.app`

---

## 🔧 Backend Deployment (Render - FREE)

**Render** offers free tier for Python backends with 750 hours/month.

### Deploy to Render:

1. **Go to [Render](https://render.com)**
2. **Sign up** with GitHub
3. **Click "New +" → "Web Service"**
4. **Connect** your Job_Agent repository
5. **Configure:**
   - Name: `job-agent-api`
   - Runtime: `Python 3`
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Add Environment Variables:**
   - `GEMINI_API_KEY`: Your actual API key
   - `COORDINATOR_MODEL`: `gemini-2.0-flash`
   - `SPECIALIST_MODEL`: `gemini-2.0-flash`
7. **Click "Create Web Service"**

Your backend will be live at: `https://job-agent-api.onrender.com`

### Important Notes for Render:
- Free tier spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- Upgrade to paid tier ($7/month) for always-on service

---

## 🔗 Step 3: Connect Frontend to Backend

After deploying backend, update your frontend to use the production API:

### Option A: Environment Variable (Recommended)

1. In Vercel dashboard → Your Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://job-agent-api.onrender.com`

3. Update `frontend/src` API calls:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.get(`${API_URL}/api/jobs`)
```

### Option B: Direct Update

Update all `http://localhost:8000` to your Render URL in:
- `frontend/src/pages/*.jsx`
- `frontend/src/components/*.jsx`

Then redeploy Vercel.

---

## 🌍 Alternative FREE Hosting Options

### Backend Alternatives:

1. **Railway** (FREE tier - 500 hours/month)
   - Easier setup than Render
   - https://railway.app

2. **Fly.io** (FREE tier - limited)
   - Global edge deployment
   - https://fly.io

3. **PythonAnywhere** (FREE tier)
   - Simple Python hosting
   - https://www.pythonanywhere.com

### Frontend Alternatives:

1. **Netlify** (FREE - unlimited bandwidth)
   - Similar to Vercel
   - https://netlify.com

2. **GitHub Pages** (FREE)
   - Limited to static sites
   - https://pages.github.com

3. **Cloudflare Pages** (FREE)
   - Fast global CDN
   - https://pages.cloudflare.com

---

## 🎯 Recommended Setup (Best FREE Combination)

- **Frontend:** Vercel (fastest, best for React)
- **Backend:** Render (generous free tier, easy to use)
- **Domain:** Use provided subdomains or connect custom domain on Vercel

### Total Cost: **$0/month** 🎉

---

## 🔒 Security Checklist

Before going live:

- [x] `.env` in `.gitignore`
- [x] No API keys in code
- [x] Environment variables set on hosting platforms
- [x] Database cleared of test data
- [ ] Update CORS settings in `backend/main.py`:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["https://your-frontend.vercel.app"],  # Update this!
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

---

## 📊 Post-Deployment

### Monitor Your App:

1. **Vercel Dashboard:** Check frontend performance and logs
2. **Render Dashboard:** Monitor backend health and logs
3. **Test All Features:**
   - Job search via chat
   - Skill tests
   - Learning paths
   - External job links

### Update Your App:

Just push to GitHub:
```bash
git add .
git commit -m "Update feature X"
git push
```

Both Vercel and Render will **auto-deploy** on push! 🚀

---

## 🆘 Troubleshooting

### Frontend not connecting to backend?
- Check CORS settings in `backend/main.py`
- Verify `VITE_API_URL` environment variable
- Check browser console for errors

### Backend errors on Render?
- Check logs in Render dashboard
- Verify environment variables are set
- Ensure `requirements.txt` is up to date

### Database issues?
- Render uses ephemeral storage - database resets on restart
- For production, use PostgreSQL (Render offers free tier)
- Or use Supabase for PostgreSQL (free tier)

---

## 🎉 Your App is Live!

Share your app:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://job-agent-api.onrender.com`

---

## 💡 Next Steps

1. **Custom Domain:** Connect your own domain on Vercel (requires domain purchase)
2. **Analytics:** Add Google Analytics or Vercel Analytics
3. **Monitoring:** Use Sentry for error tracking
4. **Upgrade:** Move to paid tiers for better performance if needed

---

## 📞 Support

If you encounter issues:
- Check platform documentation (Vercel Docs, Render Docs)
- Review deployment logs
- Verify environment variables
- Test locally first

Happy deploying! 🚀
