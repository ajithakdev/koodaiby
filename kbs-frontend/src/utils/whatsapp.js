// WhatsApp utility functions
const WHATSAPP_NUMBER = process.env.REACT_APP_WHATSAPP_NUMBER || '919123536601';

export const formatCartForWhatsApp = (cart, customerInfo = {}) => {
  const cartDetails = cart.map(item => 
    `┃ ${item.name}\n┃ Qty: ${item.quantity} × ₹${item.price.toLocaleString()} = *₹${(item.price * item.quantity).toLocaleString()}*`
  ).join('\n┃\n');
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const orderDate = new Date().toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  let message = `╔═══════════════════════╗\n`;
  message += `║    🛍️ *KBS STORE* 🛍️    ║\n`;
  message += `║   Premium Collection   ║\n`;
  message += `╚═══════════════════════╝\n\n`;
  
  message += `📅 *Order Date:* ${orderDate}\n`;
  message += `🆔 *Order ID:* #KBS${Date.now().toString().slice(-6)}\n\n`;
  
  if (customerInfo.name) {
    message += `👤 *Customer Details*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📝 Name: *${customerInfo.name}*\n`;
  }
  if (customerInfo.phone) {
    message += `📱 Phone: *${customerInfo.phone}*\n`;
  }
  if (customerInfo.address) {
    message += `📍 Address: *${customerInfo.address}*\n`;
  }
  
  message += `\n🛒 *Order Summary*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `${cartDetails}\n\n`;
  
  message += `💳 *Payment Summary*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💰 Subtotal: ₹${total.toLocaleString()}\n`;
  message += `🚚 Delivery: *FREE*\n`;
  message += `🎯 *TOTAL: ₹${total.toLocaleString()}*\n\n`;
  
  message += `✨ *Next Steps:*\n`;
  message += `• We'll confirm your order shortly\n`;
  message += `• Share your delivery address\n`;
  message += `• Payment on delivery available\n\n`;
  
  message += `📞 *Need Help?* Reply to this message\n`;
  message += `🌟 Thank you for choosing KBS Store!\n\n`;
  message += `_Powered by KBS Store - Your Premium Shopping Destination_ 🛍️`;
  
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
  const timestamp = new Date().toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  
  let message = `╔═══════════════════════╗\n`;
  message += `║    🔐 *KBS STORE* 🔐    ║\n`;
  message += `║   Admin Verification   ║\n`;
  message += `╚═══════════════════════╝\n\n`;
  
  message += `🕐 *Time:* ${timestamp}\n`;
  message += `🔑 *Your Verification PIN:*\n\n`;
  message += `┌─────────────────────┐\n`;
  message += `│      *${pin}*      │\n`;
  message += `└─────────────────────┘\n\n`;
  
  message += `⚠️ *Important:*\n`;
  message += `• PIN expires in 5 minutes\n`;
  message += `• Do not share with anyone\n`;
  message += `• Use only for admin access\n\n`;
  
  message += `🛡️ *Security Notice:*\n`;
  message += `If you didn't request this PIN, please ignore this message.\n\n`;
  
  message += `_KBS Store Security Team_ 🔒`;
  
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