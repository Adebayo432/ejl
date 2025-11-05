
const PRODUCTS = [
  {
    id: 1,
    name: "POSITHIEF T-shirt",
    price: 24999,
    description: "250g luxury T-shirt",
    images: ["assets/t1.jpg", "assets/t2.jpg", "assets/t3.jpg", "assets/t4.jpg"]

  }
];


let cart = JSON.parse(localStorage.getItem('ejl_cart') || '[]');

function saveCart() { localStorage.setItem('ejl_cart', JSON.stringify(cart)); updateBadges(); }

function addToCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty++;
  else cart.push({ id: id, qty: 1 });
  saveCart();
}

function getCartItemsDetailed() {
  return cart.map(ci => {
    const p = PRODUCTS.find(p => p.id === ci.id);
    return { ...p, qty: ci.qty, lineTotal: p.price * ci.qty };
  });
}

function clearCart() { cart = []; saveCart(); }

function changeQty(id, delta) {
  const it = cart.find(i => i.id === id);
  if (!it) return;
  it.qty += delta;
  if (it.qty <= 0) { cart = cart.filter(x => x.id !== id); }
  saveCart();
}

function updateBadges() {
  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCountBadge') && (document.getElementById('cartCountBadge').textContent = totalQty);
  document.getElementById('cartCountBadge2') && (document.getElementById('cartCountBadge2').textContent = totalQty);
  document.getElementById('cartCountBadge3') && (document.getElementById('cartCountBadge3').textContent = totalQty);
}

function renderCart() {
  const listEl = document.getElementById('cartList');
  if (!listEl) return;
  const items = getCartItemsDetailed();
  if (items.length === 0) { listEl.innerHTML = '<p class="text-gray-600">Your cart is empty.</p>'; document.getElementById('cartTotal').textContent = '0'; return; }
  listEl.innerHTML = items.map(it => `
    <div class="flex items-center justify-between bg-gray-50 p-3 rounded">
      <div class="flex items-center gap-3"><img src="${it.images[0]}" class="w-16 h-16 object-cover rounded"><div><div class="font-medium">${it.name}</div><div class="text-sm text-gray-600">₦${it.price.toLocaleString()}</div></div></div>
      <div class="flex items-center gap-2">
        <button class="px-2 py-1 border" onclick="changeQty(${it.id}, -1)">-</button>
        <div>${it.qty}</div>
        <button class="px-2 py-1 border" onclick="changeQty(${it.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
  const total = items.reduce((s, it) => s + it.lineTotal, 0);
  document.getElementById('cartTotal').textContent = total.toLocaleString();
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  renderCart();
  const heroBtn = document.getElementById('addHeroBtn');
  if (heroBtn) { heroBtn.addEventListener('click', () => { addToCart(1); alert('Added to cart'); }); }
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) { addToCartBtn.addEventListener('click', () => { addToCart(1); alert('Added to cart'); }); }
});
