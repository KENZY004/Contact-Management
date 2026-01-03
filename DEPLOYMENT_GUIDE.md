# 🚀 Vercel Deployment Guide

## Overview
This guide will help you deploy your Contact Management application to Vercel. You'll deploy:
1. **Backend (Express API)** - Separate Vercel project
2. **Frontend (React App)** - Separate Vercel project

---

## 📋 Prerequisites

- [ ] GitHub account
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] MongoDB Atlas database (already set up)
- [ ] Code pushed to GitHub repository

---

## 🔧 Part 1: Deploy Backend (Express API)

### Step 1: Push Code to GitHub
```bash
# If not already done
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. Click **"Add New Project"**
3. **Import your GitHub repository**
4. **Configure the project:**
   - **Root Directory:** `server`
   - **Framework Preset:** Other
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

### Step 3: Add Environment Variables

In the Vercel project settings, add these environment variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `PORT` | `5000` (optional, Vercel handles this) |
| `NODE_ENV` | `production` |

**Where to find MongoDB URI:**
- Go to MongoDB Atlas → Database → Connect → Connect your application
- Copy the connection string
- Replace `<password>` with your actual password

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Copy your backend URL** (e.g., `https://your-backend.vercel.app`)

---

## 🎨 Part 2: Deploy Frontend (React App)

### Step 1: Update API URL

Before deploying frontend, update the API URL to point to your deployed backend:

**Option A: Create environment file**

Create `client/.env.production`:
```env
VITE_API_URL=https://your-backend.vercel.app
```

Then update all fetch calls to use:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
fetch(`${API_URL}/api/contacts`)
```

**Option B: Direct replacement (simpler for now)**

Replace all instances of `http://localhost:5000` with your Vercel backend URL in:
- `client/src/App.jsx`
- `client/src/components/ContactForm.jsx`
- `client/src/components/EditContactModal.jsx`

### Step 2: Deploy Frontend on Vercel

1. Go back to Vercel dashboard
2. Click **"Add New Project"** again
3. **Import the same GitHub repository**
4. **Configure the project:**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for deployment to complete
3. **Your app is live!** 🎉

---

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible (visit `https://your-backend.vercel.app/api/health`)
- [ ] Frontend loads correctly
- [ ] Can add new contacts
- [ ] Can edit contacts
- [ ] Can delete contacts
- [ ] Search works
- [ ] CSV export works
- [ ] No CORS errors in browser console

---

## 🐛 Troubleshooting

### CORS Errors

If you see CORS errors, update `server/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Backend Not Working

1. Check Vercel logs: Project → Deployments → Click deployment → View Function Logs
2. Verify environment variables are set correctly
3. Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

### Frontend Not Connecting to Backend

1. Check browser console for errors
2. Verify API URL is correct in frontend code
3. Test backend directly: `https://your-backend.vercel.app/api/contacts`

---

## 🔄 Updating Your Deployment

Whenever you push changes to GitHub:
- Vercel automatically redeploys both frontend and backend
- No manual steps needed!

---

## 📝 Important Notes

1. **MongoDB Atlas:** Make sure your IP whitelist includes `0.0.0.0/0` to allow Vercel's serverless functions
2. **Environment Variables:** Never commit `.env` files to GitHub
3. **Free Tier Limits:** Vercel free tier has limits on function execution time and bandwidth
4. **Cold Starts:** First request after inactivity may be slow (serverless limitation)

---

## 🎯 Quick Commands Reference

```bash
# Test backend locally
cd server
npm run dev

# Test frontend locally
cd client
npm run dev

# Build frontend for production
cd client
npm run build

# Preview production build locally
cd client
npm run preview
```

---

## 🌐 Your Deployed URLs

After deployment, save these URLs:

- **Frontend:** `https://your-frontend.vercel.app`
- **Backend:** `https://your-backend.vercel.app`
- **API Health Check:** `https://your-backend.vercel.app/api/health`

---

**Good luck with your deployment! 🚀**
