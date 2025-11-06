// Fetch products from JSON
let PRODUCTS = [];
let cart = JSON.parse(localStorage.getItem('ejl_cart') || '[]');

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch('data/products.json');
    PRODUCTS = await response.json();
    updateBadges();
  } catch (error) {
    console.error('Error loading products:', error);
    // Fallback products if JSON fails
    PRODUCTS = [
      {
        id: 1,
        name: "POSITHIEF T-shirt",
        price: 24999,
        description: "250g luxury T-shirt crafted for comfort and confident style. Minimal details, maximum presence.",
        images: ["assets/t1.jpg", "assets/t2.jpg", "assets/t3.jpg", "assets/t4.jpg"]
      },
      {
        id: 2,
        name: "POSITHIEF SnapBack",
        price: 14999,
        description: "Adjustable Luxury SnapBack crafted for comfort and confident style. Minimal details, maximum presence.",
        images: ["assets/t5.jpg.jpg", "assets/t6.jpg.jpg", "assets/t7.jpg.jpg", "assets/t8.jpg.jpg"]
      },
      {
        id: 3,
        name: "POSITHIEF Trucker Cap",
        price: 9999,
        description: "Adjustable Luxury Trucker Cap crafted for comfort and confident style. Minimal details, maximum presence.",
        images: ["assets/t9.jpg", "assets/t10.jpg", "assets/t11.jpg", "assets/t12.jpg"]
      },
      {
        id: 4,
        name: "POSITHIEF Full Stone SnapBack",
        price: 16999,
        description: "Adjustable Full stone SnapBack crafted for comfort and confident style. Minimal details, maximum presence.",
        images: ["assets/t13.jpg", "assets/t14.jpg", "assets/t15.jpg", "assets/t16.jpg"]
      }
    ];
    updateBadges();
  }
}

function saveCart() {
  localStorage.setItem('ejl_cart', JSON.stringify(cart));
  updateBadges();
  renderCart();
}

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id: id, qty: 1 });
  }
  saveCart();

  // Show notification
  showNotification('Added to cart');
}

function getCartItemsDetailed() {
  return cart.map(ci => {
    const p = PRODUCTS.find(p => p.id === ci.id);
    if (!p) return null;
    return { ...p, qty: ci.qty, lineTotal: p.price * ci.qty };
  }).filter(item => item !== null);
}

function clearCart() {
  cart = [];
  saveCart();
}

function changeQty(id, delta) {
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }
  saveCart();
}

function updateBadges() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const badgeEl = document.getElementById('cartCountBadge');
  const badgeElMobile = document.getElementById('cartCountBadgeMobile');
  if (badgeEl) {
    badgeEl.textContent = totalQty;
    badgeEl.style.display = totalQty > 0 ? 'flex' : 'none';
  }
  if (badgeElMobile) {
    badgeElMobile.textContent = totalQty;
    badgeElMobile.style.display = totalQty > 0 ? 'flex' : 'none';
  }
}

function renderCart() {
  const listEl = document.getElementById('cartList');
  if (!listEl) return;

  const items = getCartItemsDetailed();
  if (items.length === 0) {
    listEl.innerHTML = '<p class="text-gray-600 text-sm py-8 text-center">Your cart is empty.</p>';
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = '0';
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  listEl.innerHTML = items.map(it => `
    <div class="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 mb-2">
      <div class="flex items-center gap-3 flex-1">
        <img src="${it.images[0]}" class="w-16 h-16 object-cover rounded" alt="${it.name}">
        <div class="flex-1 min-w-0">
          <div class="font-medium text-sm text-gray-900">${it.name}</div>
          <div class="text-xs text-gray-600">₦${it.price.toLocaleString()}</div>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50" onclick="changeQty(${it.id}, -1)">-</button>
        <div class="text-sm w-8 text-center">${it.qty}</div>
        <button class="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50" onclick="changeQty(${it.id}, 1)">+</button>
      </div>
    </div>
  `).join('');

  const total = items.reduce((s, it) => s + it.lineTotal, 0);
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = total.toLocaleString();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.style.display = 'block';
}

function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add('show'), 10);

  // Hide and remove after 2 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

function openCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.classList.remove('hidden');
    renderCart();
  }
}

function closeCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.classList.add('hidden');
  }
}

function checkout() {
  const items = getCartItemsDetailed();
  if (items.length === 0) return;

  // Build WhatsApp message
  let message = 'Hello, I would like to purchase the following items:\n\n';
  items.forEach(item => {
    message += `${item.name} x${item.qty} - ₦${item.lineTotal.toLocaleString()}\n`;
  });
  const total = items.reduce((s, it) => s + it.lineTotal, 0);
  message += `\nTotal: ₦${total.toLocaleString()}`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/2347012357572?text=${encodedMessage}`;

  // Open WhatsApp
  window.open(whatsappUrl, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProducts().then(() => {
    updateBadges();
    renderCart();
  });

  // Close cart when clicking outside
  const cartModal = document.getElementById('cartModal');
  if (cartModal) {
    cartModal.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        closeCart();
      }
    });
  }
});
