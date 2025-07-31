// Local storage utility functions for cart persistence
const CART_STORAGE_KEY = 'kbs_cart';
const USER_PREFERENCES_KEY = 'kbs_user_preferences';

export const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

export const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return [];
  }
};

export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};

export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error('Failed to save user preferences to localStorage:', error);
  }
};

export const loadUserPreferences = () => {
  try {
    const savedPreferences = localStorage.getItem(USER_PREFERENCES_KEY);
    return savedPreferences ? JSON.parse(savedPreferences) : {};
  } catch (error) {
    console.error('Failed to load user preferences from localStorage:', error);
    return {};
  }
};

export const getCartItemCount = () => {
  const cart = loadCartFromStorage();
  return cart.reduce((total, item) => total + item.quantity, 0);
};

export const getCartTotal = () => {
  const cart = loadCartFromStorage();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

// Utility to check if localStorage is available
export const isStorageAvailable = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
};