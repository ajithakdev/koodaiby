const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'https://koodaiby.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// MongoDB connection with error handling
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kbs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Enhanced Item Schema
const itemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, default: 'general' },
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
itemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Item = mongoose.model('Item', itemSchema);

// PIN Schema for WhatsApp verification
const pinSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  pin: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, default: Date.now, expires: 300 } // 5 minutes
});

const Pin = mongoose.model('Pin', pinSchema);

// Routes

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'KBS Backend API is running',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/items',
      'POST /api/items',
      'POST /api/generate-pin',
      'POST /api/verify-pin'
    ]
  });
});

// API root route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'KBS Backend API is running',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/items',
      'POST /api/items',
      'POST /api/generate-pin',
      'POST /api/verify-pin'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'KBS Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all items with optional filtering
app.get('/api/items', async (req, res) => {
  try {
    const { category, featured, inStock } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    if (inStock !== undefined) filter.inStock = inStock === 'true';
    
    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single item
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findOne({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new item with image upload
app.post('/api/items', upload.single('image'), async (req, res) => {
  try {
    let imageUrl = req.body.image;
    
    // If file is uploaded, upload to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'kbs-items' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = result.secure_url;
    }
    
    const itemData = {
      ...req.body,
      image: imageUrl,
      id: req.body.id || Date.now().toString()
    };
    
    const item = new Item(itemData);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    if (error.code === 11000) {
      res.status(400).json({ error: 'Item with this ID already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update item
app.put('/api/items/:id', upload.single('image'), async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // If new image is uploaded, upload to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'kbs-items' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      updateData.image = result.secure_url;
    }
    
    const item = await Item.findOneAndUpdate(
      { id: req.params.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const item = await Item.findOneAndDelete({ id: req.params.id });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate PIN for WhatsApp verification
app.post('/api/generate-pin', async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Generate 6-digit PIN
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save PIN to database
    await Pin.findOneAndUpdate(
      { phone },
      { phone, pin, verified: false },
      { upsert: true, new: true }
    );
    
    // In a real application, you would send this PIN via WhatsApp API
    // For now, we'll return it in the response (remove this in production)
    const response = { 
      message: 'PIN generated successfully',
      pin: pin, // Remove this line in production
      phone: phone
    };
    
    console.log('✅ Sending response:', response);
    res.json(response);
  } catch (error) {
    console.error('❌ Error generating PIN:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify PIN
app.post('/api/verify-pin', async (req, res) => {
  try {
    const { phone, pin } = req.body;
    
    if (!phone || !pin) {
      return res.status(400).json({ error: 'Phone number and PIN are required' });
    }
    
    const pinRecord = await Pin.findOne({ phone, pin });
    
    if (!pinRecord) {
      return res.status(400).json({ error: 'Invalid PIN or phone number' });
    }
    
    // Mark as verified
    pinRecord.verified = true;
    await pinRecord.save();
    
    res.json({ 
      message: 'PIN verified successfully',
      verified: true
    });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Route not found',
    method: req.method,
    path: req.originalUrl,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/items',
      'POST /api/items',
      'POST /api/generate-pin',
      'POST /api/verify-pin'
    ]
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 KBS Backend Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}/api`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is busy, trying port ${PORT + 1}...`);
    const fallbackPort = PORT + 1;
    app.listen(fallbackPort, () => {
      console.log(`🚀 KBS Backend Server running on port ${fallbackPort}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL: http://localhost:${fallbackPort}/api`);
      console.log(`⚠️  Update your frontend .env file: REACT_APP_API_URL=http://localhost:${fallbackPort}/api`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
});