// Responsive Hamburger Menu Toggle
function toggleMenu() {
  const navUl = document.querySelector('nav ul');
  navUl.classList.toggle('show');
}

// Floating Cart Toggle
function toggleCart() {
  const cartPopup = document.getElementById('cart-popup');
  if (cartPopup.style.display === 'flex') {
    cartPopup.style.display = 'none';
  } else {
    cartPopup.style.display = 'flex';
  }
}

// Cart System
// Cart data now includes delivery and payment options
let cartData = {
  items: JSON.parse(localStorage.getItem('cartItems')) || [],
  delivery: localStorage.getItem('cartDelivery') || 'Delivery',
  payment: localStorage.getItem('cartPayment') || 'Cash'
};

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartData.items));
  localStorage.setItem('cartDelivery', cartData.delivery);
  localStorage.setItem('cartPayment', cartData.payment);
  updateCartUI();
}

function updateCartUI() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  cartCount.textContent = cartData.items.reduce((acc, item) => acc + item.quantity, 0);

  cartItems.innerHTML = '';
  let total = 0;
  cartData.items.forEach((item, index) => {
    total += item.price * item.quantity;
    const li = document.createElement('li');
    li.textContent = `${item.name} x${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Hapus';
    removeBtn.style.marginLeft = '10px';
    removeBtn.onclick = () => {
      removeFromCart(index);
    };
    li.appendChild(removeBtn);
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Rp${total.toLocaleString()}`;

  // Update delivery and payment UI selections
  const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
  deliveryRadios.forEach(radio => {
    radio.checked = (radio.value === cartData.delivery);
  });
  const paymentRadios = document.querySelectorAll('input[name="payment"]');
  paymentRadios.forEach(radio => {
    radio.checked = (radio.value === cartData.payment);
  });
}

function addToCart(name, price) {
  const existingIndex = cartData.items.findIndex(item => item.name === name);
  if (existingIndex !== -1) {
    cartData.items[existingIndex].quantity += 1;
  } else {
    cartData.items.push({ name, price, quantity: 1 });
  }
  saveCart();
  alert(`${name} berhasil ditambahkan ke keranjang.`);
}

function removeFromCart(index) {
  cartData.items.splice(index, 1);
  saveCart();
}

function checkout() {
  if (cartData.items.length === 0) {
    alert('Keranjang kosong!');
    return;
  }
  // Get delivery option
  const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
  // Get payment option
  const paymentOption = document.querySelector('input[name="payment"]:checked').value;

  // Prepare WhatsApp message
  let message = `Pesanan saya dari KOPI TANGERANG (Metode: ${deliveryOption}, Pembayaran: ${paymentOption}):%0A`;
  cartData.items.forEach(item => {
    message += `- ${item.name} x${item.quantity} = Rp${(item.price * item.quantity).toLocaleString()}%0A`;
  });
  const total = cartData.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  message += `Total: Rp${total.toLocaleString()}`;

  // WhatsApp number
  const waNumber = '6281234567890'; // Indonesia country code without '+'

  // Open WhatsApp chat with message
  const waUrl = `https://wa.me/${waNumber}?text=${message}`;
  window.open(waUrl, '_blank');

  // Clear cart and update UI
  cartData.items = [];
  saveCart();
  toggleCart();
}

// Filter Menu for produk.html
const menuItems = [
  { name: 'Espresso', category: 'panas', price: 15000, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80' },
  { name: 'Americano', category: 'panas', price: 18000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cappuccino', category: 'panas', price: 20000, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80' },
  { name: 'Cold Brew', category: 'dingin', price: 22000, image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80' },
  { name: 'Iced Latte', category: 'dingin', price: 21000, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80' },
  { name: 'Signature Latte', category: 'signature', price: 25000, image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=400&q=80' }
];

function filterMenu() {
  const filter = document.getElementById('category-filter').value;
  const menuList = document.getElementById('menu-list');
  menuList.innerHTML = '';

  const filteredItems = filter === 'all' ? menuItems : menuItems.filter(item => item.category === filter);

  filteredItems.forEach(item => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const title = document.createElement('h3');
    title.textContent = item.name;

    const price = document.createElement('p');
    price.textContent = `Rp${item.price.toLocaleString()}`;

    const btn = document.createElement('button');
    btn.textContent = 'Tambah ke Keranjang';
    btn.className = 'btn';
    btn.onclick = () => addToCart(item.name, item.price);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(btn);

    menuList.appendChild(card);
  });
}

// Form Validation for kontak.html
function validateForm() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) {
    alert('Nama harus diisi.');
    return false;
  }
  if (!email) {
    alert('Email harus diisi.');
    return false;
  }
  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Email tidak valid.');
    return false;
  }
  if (!message) {
    alert('Pesan harus diisi.');
    return false;
  }

  // Prepare WhatsApp message
  let waMessage = `Halo, saya ${name}.\nEmail saya: ${email}.\nPesan: ${message}`;

  // WhatsApp number
  const waNumber = '6281234567890'; // Indonesia country code without '+'

  // Encode message for URL
  const encodedMessage = encodeURIComponent(waMessage);

  // Open WhatsApp chat with message
  const waUrl = `https://wa.me/${waNumber}?text=${encodedMessage}`;
  window.open(waUrl, '_blank');

  document.getElementById('contact-form').reset();
  return false; // prevent actual form submission
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  if (document.getElementById('category-filter')) {
    filterMenu();
  }
});
