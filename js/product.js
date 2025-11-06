// Product page functionality
let currentProduct = null;

async function loadProduct() {
  // Get product ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;

  // Wait for products to load
  while (PRODUCTS.length === 0) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  currentProduct = PRODUCTS.find(p => p.id === productId);
  
  if (!currentProduct) {
    currentProduct = PRODUCTS[0]; // Default to first product
  }

  renderProduct();
  renderAllProducts();
}

function renderProduct() {
  if (!currentProduct) return;

  // Update page title
  document.title = `${currentProduct.name} — EJ Luxe`;

  // Update product name
  document.getElementById('productName').textContent = currentProduct.name;
  
  // Update description
  document.getElementById('productDescription').textContent = currentProduct.description;
  
  // Update price
  document.getElementById('productPrice').textContent = currentProduct.price.toLocaleString();
  
  // Update product details
  document.getElementById('productDetails').textContent = currentProduct.description;

  // Update images
  const mainImg = document.getElementById('mainImg');
  if (mainImg && currentProduct.images.length > 0) {
    mainImg.src = currentProduct.images[0];
    mainImg.alt = currentProduct.name;
  }

  // Update thumbnails
  const thumbnailContainer = document.getElementById('thumbnailImages');
  if (thumbnailContainer) {
    thumbnailContainer.innerHTML = currentProduct.images.map((img, index) => `
      <button onclick="changeMainImage('${img}', ${index})" class="aspect-square overflow-hidden rounded-md border-2 border-gray-200 hover:border-ejblue transition-colors">
        <img src="${img}" alt="${currentProduct.name} ${index + 1}" class="w-full h-full object-cover">
      </button>
    `).join('');
  }

  // Update buy now link
  const buyNowLink = document.getElementById('buyNowLink');
  if (buyNowLink) {
    const message = encodeURIComponent(`Hello, I texted you from your website, I want to buy the ${currentProduct.name}`);
    buyNowLink.href = `https://wa.me/2347012357572?text=${message}`;
  }

  // Update add to cart button
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.setAttribute('data-product-id', currentProduct.id);
    addToCartBtn.setAttribute('data-add-id', String(currentProduct.id));
  }
}

function changeMainImage(imgSrc, index) {
  const mainImg = document.getElementById('mainImg');
  if (mainImg) {
    mainImg.src = imgSrc;
  }
  
  // Update border on thumbnail
  const thumbnails = document.querySelectorAll('#thumbnailImages button');
  thumbnails.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('border-ejblue');
      btn.classList.remove('border-gray-200');
    } else {
      btn.classList.remove('border-ejblue');
      btn.classList.add('border-gray-200');
    }
  });
}

function addToCartFromPage() {
  if (currentProduct) {
    addToCart(currentProduct.id);
  }
}

function renderAllProducts() {
  const container = document.getElementById('allProducts');
  if (!container) return;

  container.innerHTML = PRODUCTS.map(product => `
    <a href="product.html?id=${product.id}" class="group reveal">
      <div class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div class="aspect-square overflow-hidden">
          <img src="${product.images[0]}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 lux-glow">
        </div>
        <div class="p-4">
          <h3 class="text-sm md:text-base font-semibold mb-2 text-gray-900 group-hover:text-ejblue transition-colors">${product.name}</h3>
          <p class="text-gray-600 text-xs md:text-sm font-light mb-3 line-clamp-2">${product.description}</p>
          <div class="text-base md:text-lg font-semibold text-ejblue">₦${product.price.toLocaleString()}</div>
        </div>
      </div>
    </a>
  `).join('');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadProduct();
});

