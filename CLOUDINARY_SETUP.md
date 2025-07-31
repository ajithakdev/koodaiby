# 📸 Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Fill in your details:
   - Email: your-email@example.com
   - Password: create a strong password
   - Company Name: KBS Store (or your company name)
4. Verify your email

## Step 2: Get Your Credentials

1. After login, go to **Dashboard**
2. You'll see your credentials:
   ```
   Cloud Name: your_cloud_name
   API Key: 123456789012345
   API Secret: your_secret_key_here
   ```

## Step 3: Configure Your Environment

### Backend (.env file):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret_key_here
```

### Railway Deployment:
Add these as environment variables in Railway:
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Step 4: Test Image Upload

1. Start your backend server
2. Use the admin panel to add a new item
3. Upload an image - it should automatically upload to Cloudinary
4. Check your Cloudinary dashboard to see the uploaded image

## Free Tier Limits:
- ✅ 25GB storage
- ✅ 25GB monthly bandwidth
- ✅ 1000 transformations/month
- ✅ Perfect for small to medium projects

## Folder Structure:
Your images will be stored in: `kbs-items/` folder in Cloudinary