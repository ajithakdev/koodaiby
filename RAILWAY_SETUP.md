# 🚂 Railway Backend Deployment Guide

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub account
4. Complete your profile setup

## Step 2: Deploy Backend

1. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `kbs-ecommerce` repository

2. **Configure Service**:
   - Railway will detect your project
   - Select "Deploy kbs-backend"
   - Railway will automatically detect it's a Node.js project

3. **Set Root Directory**:
   - Go to Settings → "Root Directory"
   - Set to: `kbs-backend`
   - Save changes

## Step 3: Configure Environment Variables

In Railway Dashboard → Variables tab, add:

```env
MONGODB_URI=mongodb+srv://cseajithak:ubKM5o7Rg9O9uTfa@cluster0.67e4d.mongodb.net/kbs?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
WHATSAPP_NUMBER=919123536601
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_jwt_secret_key_here
ADMIN_PIN=123456
PORT=5000
```

## Step 4: Deploy and Get URL

1. **Deploy**: Railway will automatically deploy
2. **Get URL**: After deployment, you'll get a URL like:
   ```
   https://kbs-backend-production-xxxx.up.railway.app
   ```
3. **Test API**: Visit `https://your-url.railway.app/api/health`

## Step 5: Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Click "Generate Domain" for a railway.app subdomain
3. Or add your custom domain

## Free Tier Limits:
- ✅ 500 hours/month (about 21 days)
- ✅ 1GB RAM
- ✅ 1GB storage
- ✅ Perfect for development and small projects

## Monitoring:
- View logs in Railway dashboard
- Monitor usage and performance
- Set up alerts for downtime

## Important Notes:
- ✅ Automatic deployments on git push
- ✅ HTTPS enabled by default
- ✅ Environment variables are secure
- ✅ Scales automatically