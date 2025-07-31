// WhatsApp utility functions
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '919123536601';

export const formatCartForWhatsApp = (cart, customerInfo = {}) => {
  const cartDetails = cart.map(item => 
    `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`
  ).join('\n');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let message = `*🛒 KBS Store Order*\n\n`;
  
  if (customerInfo.name) {
    message += `*Customer:* ${customerInfo.name}\n`;
  }
  if (customerInfo.phone) {
    message += `*Phone:* ${customerInfo.phone}\n`;
  }
  if (customerInfo.address) {
    message += `*Address:* ${customerInfo.address}\n`;
  }
  
  message += `\n*📦 Order Details:*\n${cartDetails}\n\n`;
  message += `*💰 Total Amount: ₹${total.toLocaleString()}*\n\n`;
  message += `Please confirm your order and provide delivery details if needed.`;
  
  return message;
};

export const sendWhatsAppMessage = (message, phoneNumber = WHATSAPP_NUMBER) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  
  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
};

export const sendOrderToWhatsApp = (cart, customerInfo = {}) => {
  const message = formatCartForWhatsApp(cart, customerInfo);
  sendWhatsAppMessage(message);
};

export const sendPinToWhatsApp = (pin, phoneNumber) => {
  const message = `*🔐 KBS Store Admin PIN*\n\nYour verification PIN is: *${pin}*\n\nThis PIN will expire in 5 minutes.\n\nDo not share this PIN with anyone.`;
  sendWhatsAppMessage(message, phoneNumber);
};

export const validatePhoneNumber = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Check if it's a valid Indian mobile number
  const indianMobileRegex = /^[6-9]\d{9}$/;
  
  if (cleanPhone.length === 10 && indianMobileRegex.test(cleanPhone)) {
    return `91${cleanPhone}`;
  }
  
  // Check if it already includes country code
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    const mobileNumber = cleanPhone.substring(2);
    if (indianMobileRegex.test(mobileNumber)) {
      return cleanPhone;
    }
  }
  
  return null;
};

export const formatPhoneForDisplay = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    const number = cleanPhone.substring(2);
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  }
  
  if (cleanPhone.length === 10) {
    return `${cleanPhone.substring(0, 5)} ${cleanPhone.substring(5)}`;
  }
  
  return phone;
};