# ⚡ Vercel Frontend Deployment Guide

## Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your GitHub account
4. Complete your profile setup

## Step 2: Deploy Frontend

1. **Import Project**:
   - Click "New Project"
   - Select your `kbs-ecommerce` repository
   - Click "Import"

2. **Configure Project**:
   - **Framework Preset**: Create React App (auto-detected)
   - **Root Directory**: `kbs-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

3. **Environment Variables**:
   Add these variables:
   ```env
   REACT_APP_API_URL=https://your-railway-backend-url.railway.app/api
   REACT_APP_WHATSAPP_NUMBER=919123536601
   REACT_APP_ADMIN_PIN=123456
   ```

## Step 3: Deploy

1. Click "Deploy"
2. Vercel will:
   - Install dependencies
   - Build your React app
   - Deploy to global CDN

3. **Get URL**: You'll get a URL like:
   ```
   https://kbs-ecommerce-xxxx.vercel.app
   ```

## Step 4: Update Backend CORS

After getting your Vercel URL, update Railway environment:
```env
FRONTEND_URL=https://your-vercel-url.vercel.app
```

## Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Free Tier Limits:
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Perfect for React apps

## Features:
- ✅ Automatic deployments on git push
- ✅ Preview deployments for branches
- ✅ Analytics and performance monitoring
- ✅ Edge functions support

## Testing Deployment:
1. Visit your Vercel URL
2. Test shopping cart functionality
3. Test admin panel with PIN
4. Test WhatsApp integration
5. Test item management

## Important Notes:
- ✅ Builds are cached for faster deployments
- ✅ Environment variables are secure
- ✅ Automatic SSL certificates
- ✅ Global edge network