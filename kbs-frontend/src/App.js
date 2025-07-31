import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Plus, Upload, Eye, Trash2, X } from 'lucide-react';
import apiService from './utils/api';
import { sendOrderToWhatsApp, sendPinToWhatsApp, validatePhoneNumber } from './utils/whatsapp';
import { saveCartToStorage, loadCartFromStorage, clearCartFromStorage } from './utils/storage';

const KBSShoppingWebsite = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pin, setPin] = useState('');
  const [generatedPin, setGeneratedPin] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Load items from backend and cart from localStorage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load items from backend
        const itemsData = await apiService.getItems();
        setItems(itemsData);
        
        // Load cart from localStorage
        const savedCart = loadCartFromStorage();
        setCart(savedCart);
      } catch (error) {
        console.error('Failed to load items:', error);
        setError('Failed to load items. Using sample data.');
        
        // Fallback to sample items if backend is not available
        const sampleItems = [
          {
            id: 'item001',
            name: 'Premium Wireless Headphones',
            price: 2999,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            description: 'High-quality wireless headphones with noise cancellation'
          },
          {
            id: 'item002',
            name: 'Smart Watch Series X',
            price: 15999,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
            description: 'Latest smartwatch with health monitoring'
          },
          {
            id: 'item003',
            name: 'Bluetooth Speaker Pro',
            price: 4999,
            image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
            description: 'Portable speaker with premium sound quality'
          }
        ];
        setItems(sampleItems);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    saveCartToStorage(cart);
  }, [cart]);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const generatePin = async (phone) => {
    try {
      setLoading(true);
      const validPhone = validatePhoneNumber(phone);
      if (!validPhone) {
        alert('Please enter a valid phone number');
        return;
      }
      
      const response = await apiService.generatePin(validPhone);
      setGeneratedPin(response.pin); // Remove this in production
      
      // Send PIN via WhatsApp (in production, this would be handled by backend)
      sendPinToWhatsApp(response.pin, validPhone);
      
      alert(`PIN sent to WhatsApp: ${response.pin}`); // Remove this in production
    } catch (error) {
      console.error('Failed to generate PIN:', error);
      alert('Failed to generate PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminAccess = () => {
    const phone = prompt('Enter your phone number for PIN verification:');
    if (phone) {
      setAdminPhone(phone);
      generatePin(phone);
      setShowPinEntry(true);
      setShowMenu(false);
    }
  };

  const verifyPin = async () => {
    try {
      setLoading(true);
      const validPhone = validatePhoneNumber(adminPhone);
      
      const response = await apiService.verifyPin(validPhone, pin);
      
      if (response.verified) {
        setIsAdmin(true);
        setShowPinEntry(false);
        setShowAddItem(true);
        setPin('');
        setAdminPhone('');
      } else {
        alert('Invalid PIN');
      }
    } catch (error) {
      console.error('PIN verification failed:', error);
      alert('PIN verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Get customer info (in a real app, this would be a form)
    const customerName = prompt('Enter your name:');
    const customerPhone = prompt('Enter your phone number:');
    
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number to proceed.');
      return;
    }
    
    const customerInfo = {
      name: customerName,
      phone: customerPhone
    };
    
    // Send order to WhatsApp
    sendOrderToWhatsApp(cart, customerInfo);
    
    // Clear cart after successful order
    setCart([]);
    clearCartFromStorage();
    setShowCart(false);
    
    alert('Order sent to WhatsApp! We will contact you soon.');
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }
    
    try {
      setLoading(true);
      await apiService.deleteItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item:', error);
      alert('Failed to delete item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const ItemCard = ({ item, isAdmin }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isAdmin && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={() => handleDeleteItem(item.id)}
              className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-full hover:bg-red-600/80"
              disabled={loading}
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      <h3 className="text-white font-semibold text-lg mb-2">{item.name}</h3>
      <p className="text-white/70 text-sm mb-3 line-clamp-2">{item.description}</p>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">₹{item.price.toLocaleString()}</span>
        <button 
          onClick={() => addToCart(item)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center gap-2"
        >
          <Plus size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );

  const AddItemForm = () => {
    const [newItem, setNewItem] = useState({
      name: '',
      price: '',
      description: '',
      image: ''
    });

    const handleSubmit = async () => {
      if (!newItem.name || !newItem.price || !newItem.description || !newItem.image) {
        alert('Please fill in all fields');
        return;
      }
      
      try {
        setLoading(true);
        const itemData = {
          ...newItem,
          id: 'item' + Date.now(),
          price: parseFloat(newItem.price),
          category: 'general',
          inStock: true,
          featured: false
        };
        
        const createdItem = await apiService.createItem(itemData);
        setItems([...items, createdItem]);
        setNewItem({ name: '', price: '', description: '', image: '' });
        setShowAddItem(false);
        setIsAdmin(false);
        alert('Item added successfully!');
      } catch (error) {
        console.error('Failed to add item:', error);
        alert('Failed to add item. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Add New Item</h2>
            <button 
              onClick={() => { setShowAddItem(false); setIsAdmin(false); }}
              className="text-white/70 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              required
            />
            
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              required
            />
            
            <textarea
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({...newItem, description: e.target.value})}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 h-24 resize-none"
              required
            />
            
            <input
              type="url"
              placeholder="Image URL"
              value={newItem.image}
              onChange={(e) => setNewItem({...newItem, image: e.target.value})}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
              required
            />
            
            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-semibold"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Cart = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
          <button 
            onClick={() => setShowCart(false)}
            className="text-white/70 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>
        
        {cart.length === 0 ? (
          <p className="text-white/70 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.id} className="bg-white/5 rounded-xl p-4 flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{item.name}</h3>
                    <p className="text-white/70">₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="bg-white/10 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20"
                    >
                      -
                    </button>
                    <span className="text-white w-8 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="bg-white/10 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500/20 text-red-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-500/30 ml-2"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/20 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">Total: ₹{getTotalPrice().toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 font-semibold"
              >
                Checkout via WhatsApp
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white tracking-wider">KBS</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCart(true)}
                className="relative bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300"
              >
                <ShoppingCart size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowMenu(!showMenu)}
                  className="bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300"
                >
                  <Menu size={20} />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
                    <button 
                      onClick={handleAdminAccess}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    >
                      Add Items
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Premium Collection</h2>
          <p className="text-white/70 text-lg">Discover our latest tech products</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <ItemCard key={item.id} item={item} isAdmin={isAdmin} />
          ))}
        </div>
      </main>

      {/* PIN Entry Modal */}
      {showPinEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Enter PIN</h2>
            <input
              type="text"
              placeholder="Enter 6-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 text-center text-xl tracking-widest mb-6"
              maxLength={6}
            />
            <div className="flex gap-4">
              <button 
                onClick={() => { setShowPinEntry(false); setPin(''); }}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                onClick={verifyPin}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItem && <AddItemForm />}
      
      {/* Cart Modal */}
      {showCart && <Cart />}
    </div>
  );
};

export default KBSShoppingWebsite;