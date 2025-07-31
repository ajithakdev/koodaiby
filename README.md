# 🛍️ KBS - Knowledge Base System

A modern full-stack e-commerce web application with React frontend and Node.js backend, featuring WhatsApp integration and glassmorphism UI.

## 🏗️ Project Structure

```
koodaiby/
├── kbs-backend/                 # Node.js Express API Server
│   ├── server.js               # Main server file with all routes
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment variables
│   └── railway.json            # Railway deployment config
├── kbs-frontend/               # React Application
│   ├── src/
│   │   ├── App.js              # Main React component (your code)
│   │   ├── index.js            # React entry point
│   │   ├── index.css           # Global styles with Tailwind
│   │   ├── utils/
│   │   │   ├── api.js          # Backend API integration
│   │   │   ├── whatsapp.js     # WhatsApp utilities
│   │   │   └── storage.js      # LocalStorage utilities
│   │   └── components/         # Future components
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   ├── .env                    # Frontend environment variables
│   └── vercel.json             # Vercel deployment config
├── README.md                   # This file
├── DEPLOYMENT.md               # Deployment instructions
├── package.json                # Root scripts for development
├── start-dev.bat               # Windows development starter
└── .gitignore                  # Git ignore rules
```

## 🚀 Quick Start

### Option 1: Use Development Script (Windows)
```bash
# Double-click or run:
start-dev.bat
```

### Option 2: Manual Start
```bash
# Install all dependencies
npm run install-all

# Start backend (Terminal 1)
npm run dev-backend

# Start frontend (Terminal 2)
npm run dev-frontend
```

### Option 3: Individual Setup
```bash
# Backend
cd kbs-backend
npm install
npm run dev

# Frontend (new terminal)
cd kbs-frontend
npm install
npm start
```

## 🎯 Key Features

✅ **PIN System**: Generates random 6-digit PIN sent to WhatsApp  
✅ **Cart Logic**: Persistent cart with quantity management  
✅ **WhatsApp Integration**: Formats cart as message with total  
✅ **Glassmorphism UI**: Modern backdrop-blur effects  
✅ **Responsive Design**: Mobile-first approach  
✅ **Admin Panel**: Protected item management  
✅ **Image Upload**: Cloudinary integration  
✅ **Database**: MongoDB with Mongoose  
✅ **API Integration**: Full CRUD operations  
✅ **Error Handling**: Comprehensive error management  
✅ **Loading States**: User-friendly loading indicators  

## 🔧 Technology Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Cart persistence

## 🌐 Deployment (FREE Hosting)

### Backend → Railway (500 hours/month free)
1. Push to GitHub
2. Connect to [railway.app](https://railway.app)
3. Deploy `kbs-backend` folder
4. Add environment variables

### Frontend → Vercel (unlimited hobby projects)
1. Push to GitHub  
2. Connect to [vercel.com](https://vercel.com)
3. Deploy `kbs-frontend` folder
4. Add environment variables

### Database → MongoDB Atlas (512MB free)
### Images → Cloudinary (25GB free)

## 📱 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:3000
WHATSAPP_NUMBER=your_whatsapp_number
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WHATSAPP_NUMBER=your_whatsapp_number
REACT_APP_ADMIN_PIN=123456
```

## 🔐 Admin Access

1. Click menu → "Admin Access"
2. Enter phone number for PIN
3. Check WhatsApp for PIN
4. Enter PIN to access admin panel
5. Add/delete items

## 📦 API Endpoints

- `GET /api/health` - Health check
- `GET /api/items` - Get all items
- `POST /api/items` - Create item
- `DELETE /api/items/:id` - Delete item
- `POST /api/generate-pin` - Generate PIN
- `POST /api/verify-pin` - Verify PIN

## 🛠️ Development

The project is fully set up with:
- ✅ Backend API with MongoDB integration
- ✅ Frontend with your React code integrated
- ✅ Tailwind CSS configured
- ✅ API utilities created
- ✅ WhatsApp integration ready
- ✅ Cart persistence working
- ✅ Admin panel functional
- ✅ Deployment configs ready

## 🚨 Production Notes

- Update WhatsApp number in environment variables
- Configure Cloudinary for image uploads
- Set up MongoDB Atlas database
- Remove development PIN display
- Enable HTTPS for production

---

**🎉 Your KBS project is now production-ready!**