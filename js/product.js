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

  // Reset selected size when product changes
  selectedSize = null;

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
    let message = `Hello, I texted you from your website, I want to buy the ${currentProduct.name}`;
    if (currentProduct.sizes && currentProduct.sizes.length > 0) {
      message += ' (Size selection available on product page)';
    }
    buyNowLink.href = `https://wa.me/2347012357572?text=${encodeURIComponent(message)}`;
  }

  // Update add to cart button
  const addToCartBtn = document.getElementById('addToCartBtn');
  if (addToCartBtn) {
    addToCartBtn.setAttribute('data-product-id', currentProduct.id);
    addToCartBtn.setAttribute('data-add-id', String(currentProduct.id));
  }

  // Render size selector if product has sizes
  const sizeSelector = document.getElementById('sizeSelector');
  const sizeOptions = document.getElementById('sizeOptions');
  
  // Check if product has sizes property
  const hasSizes = currentProduct.sizes && Array.isArray(currentProduct.sizes) && currentProduct.sizes.length > 0;
  
  if (hasSizes) {
    if (sizeSelector) {
      sizeSelector.classList.remove('hidden');
    }
    if (sizeOptions) {
      // Clear any existing content
      sizeOptions.innerHTML = '';
      // Add size buttons
      currentProduct.sizes.forEach(size => {
        const button = document.createElement('button');
        button.textContent = size;
        button.setAttribute('data-size', size);
        button.className = 'size-btn px-4 py-2 border-2 border-gray-300 rounded-lg text-sm md:text-base font-medium transition-all hover:border-ejpink hover:text-ejpink';
        button.onclick = () => selectSize(size);
        sizeOptions.appendChild(button);
      });
    }
  } else {
    if (sizeSelector) {
      sizeSelector.classList.add('hidden');
    }
    if (sizeOptions) {
      sizeOptions.innerHTML = '';
    }
  }
}

let selectedSize = null;

function selectSize(size) {
  selectedSize = size;
  
  // Update button styles
  const sizeButtons = document.querySelectorAll('.size-btn');
  sizeButtons.forEach(btn => {
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('border-ejpink', 'bg-ejpink', 'text-white');
      btn.classList.remove('border-gray-300', 'hover:border-ejpink', 'hover:text-ejpink');
    } else {
      btn.classList.remove('border-ejpink', 'bg-ejpink', 'text-white');
      btn.classList.add('border-gray-300', 'hover:border-ejpink', 'hover:text-ejpink');
    }
  });
  
  // Hide warning if shown
  const sizeWarning = document.getElementById('sizeWarning');
  if (sizeWarning) sizeWarning.classList.add('hidden');
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
  if (!currentProduct) return;
  
  // Check if size is required
  if (currentProduct.sizes && currentProduct.sizes.length > 0) {
    if (!selectedSize) {
      const sizeWarning = document.getElementById('sizeWarning');
      if (sizeWarning) sizeWarning.classList.remove('hidden');
      return;
    }
    addToCart(currentProduct.id, selectedSize);
  } else {
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

