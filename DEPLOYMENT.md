# KBS Deployment Guide

## 🚀 Quick Deployment Steps

### Backend Deployment (Railway)

1. **Prepare Backend**
   ```bash
   cd kbs-backend
   npm install
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select `kbs-backend` folder
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     CLOUDINARY_CLOUD_NAME=your_cloudinary_name
     CLOUDINARY_API_KEY=your_cloudinary_key
     CLOUDINARY_API_SECRET=your_cloudinary_secret
     FRONTEND_URL=https://your-frontend-domain.vercel.app
     ```

### Frontend Deployment (Vercel)

1. **Prepare Frontend**
   ```bash
   cd kbs-frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select `kbs-frontend` folder
   - Add environment variables:
     ```
     REACT_APP_API_URL=https://your-backend-domain.railway.app/api
     REACT_APP_WHATSAPP_NUMBER=your_whatsapp_number
     REACT_APP_ADMIN_PIN=your_admin_pin
     ```

## 🔧 Environment Setup

### Required Services

1. **MongoDB Atlas** (Free 512MB)
   - Create cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Get connection string
   - Add to backend environment

2. **Cloudinary** (Free 25GB)
   - Sign up at [cloudinary.com](https://cloudinary.com)
   - Get API credentials
   - Add to backend environment

3. **WhatsApp Business** (Optional)
   - For production PIN delivery
   - Integrate WhatsApp Business API

## 📱 Local Development

### Start Backend
```bash
cd kbs-backend
npm run dev
```

### Start Frontend
```bash
cd kbs-frontend
npm start
```

## 🔐 Security Notes

- Change default admin PIN in production
- Use environment variables for all secrets
- Enable CORS only for your frontend domain
- Implement rate limiting for PIN generation
- Use HTTPS in production

## 🎯 Features Checklist

- ✅ PIN System with WhatsApp integration
- ✅ Cart persistence with localStorage
- ✅ Admin panel for item management
- ✅ Responsive glassmorphism UI
- ✅ Image upload with Cloudinary
- ✅ MongoDB integration
- ✅ WhatsApp order integration
- ✅ Error handling and loading states

## 🚨 Production Checklist

- [ ] Update WhatsApp number in environment
- [ ] Configure Cloudinary for image uploads
- [ ] Set up MongoDB Atlas database
- [ ] Update CORS settings for production domain
- [ ] Remove development PIN display
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy