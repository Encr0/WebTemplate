const products = [
    {
        "id": 1,
        "name": "Laptop Gaming ASUS ROG Strix",
        "price": 1299990,
        "category": "laptops",
        "image": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400",
        "description": "Laptop gaming de alto rendimiento con RTX 4060"
    },
    {
        "id": 2,
        "name": "iPhone 15 Pro 256GB",
        "price": 899990,
        "category": "smartphones",
        "image": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
        "description": "iPhone 15 Pro con chip A17 Pro y cámara profesional"
    },
    {
        "id": 3,
        "name": "Samsung Galaxy S24 Ultra",
        "price": 749990,
        "category": "smartphones", 
        "image": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
        "description": "Galaxy S24 Ultra con S Pen y cámara de 200MP"
    },
    {
        "id": 4,
        "name": "PlayStation 5 Console",
        "price": 649990,
        "category": "gaming",
        "image": "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400",
        "description": "Consola PlayStation 5 con SSD ultra rápido"
    },
    {
        "id": 5,
        "name": "Xbox Series X",
        "price": 599990,
        "category": "gaming",
        "image": "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400",
        "description": "Xbox Series X con 4K gaming y Quick Resume"
    },
    {
        "id": 6,
        "name": "MacBook Air M3 13\"",
        "price": 1199990,
        "category": "laptops",
        "image": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
        "description": "MacBook Air con chip M3 y hasta 18 horas de batería"
    },
    {
        "id": 7,
        "name": "Monitor Gaming LG 27\" 144Hz",
        "price": 399990,
        "category": "accessories",
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400",
        "description": "Monitor gaming QHD con 144Hz y 1ms de respuesta"
    },
    {
        "id": 8,
        "name": "Audífonos Sony WH-1000XM5",
        "price": 299990,
        "category": "audio",
        "image": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
        "description": "Audífonos inalámbricos con cancelación de ruido"
    },
    {
        "id": 9,
        "name": "Teclado Mecánico RGB Corsair",
        "price": 89990,
        "category": "accessories",
        "image": "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400",
        "description": "Teclado mecánico con switches Cherry MX y RGB"
    },
    {
        "id": 10,
        "name": "Mouse Gaming Logitech G Pro",
        "price": 49990,
        "category": "accessories",
        "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
        "description": "Mouse gaming profesional con sensor HERO 25K"
    },
    {
        "id": 11,
        "name": "SSD NVMe 1TB Samsung 980",
        "price": 89990,
        "category": "components",
        "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400",
        "description": "SSD NVMe M.2 de 1TB con velocidades hasta 3,500 MB/s"
    },
    {
        "id": 12,
        "name": "RAM Corsair 16GB DDR4",
        "price": 79990,
        "category": "components",
        "image": "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=400",
        "description": "Memoria RAM DDR4 16GB 3200MHz con disipador"
    }
];

const categories = [
    {"id": "all", "name": "Todos los Productos", "icon": "fas fa-th"},
    {"id": "laptops", "name": "Laptops", "icon": "fas fa-laptop"},
    {"id": "smartphones", "name": "Smartphones", "icon": "fas fa-mobile-alt"},
    {"id": "gaming", "name": "Gaming", "icon": "fas fa-gamepad"},
    {"id": "audio", "name": "Audio", "icon": "fas fa-headphones"},
    {"id": "accessories", "name": "Accesorios", "icon": "fas fa-keyboard"},
    {"id": "components", "name": "Componentes", "icon": "fas fa-microchip"}
];

let cart = [];
let currentCategory = 'all';
let currentSearchTerm = '';

let productsGrid, cartCount, cartModal, cartItems, cartTotal, cartEmpty, searchInput, loadingSpinner, noResults;

window.scrollToProducts = function() {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: 'smooth'
        });
    }
};

window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showAddToCartAnimation();
    showNotification('Producto agregado al carrito', 'success');
};

window.updateQuantity = function(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartDisplay();
        renderCart();
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    renderCart();
    showNotification('Producto eliminado del carrito', 'error');
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Get DOM elements
    productsGrid = document.getElementById('productsGrid');
    cartCount = document.getElementById('cartCount');
    cartItems = document.getElementById('cartItems');
    cartTotal = document.getElementById('cartTotal');
    cartEmpty = document.getElementById('cartEmpty');
    searchInput = document.getElementById('searchInput');
    loadingSpinner = document.getElementById('loadingSpinner');
    noResults = document.getElementById('noResults');
    
    const cartModalElement = document.getElementById('cartModal');
    if (cartModalElement) {
        cartModal = new bootstrap.Modal(cartModalElement);
    }
    
    initializeApp();
    setupEventListeners();

    console.log('Displaying products...');
    displayProducts(products);
    
    setTimeout(() => {
        setupScrollAnimations();
    }, 100);
});

function initializeApp() {
    renderCategories();
    updateCartDisplay();
    applyTheme();
}

function setupEventListeners() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            if (cartModal) {
                cartModal.show();
                renderCart();
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.addEventListener('click', handleCategoryFilter);
    });
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
}

function renderCategories() {
    const categoryPills = document.getElementById('categoryPills');
    if (!categoryPills) return;
    
    categoryPills.innerHTML = categories.map(category => `
        <a href="#" class="category-pill ${category.id === 'all' ? 'active' : ''}" data-category="${category.id}">
            <i class="${category.icon}"></i>
            ${category.name}
        </a>
    `).join('');

    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.addEventListener('click', handleCategoryPill);
    });
}

function handleCategoryPill(e) {
    e.preventDefault();
    const category = e.target.closest('.category-pill').dataset.category;
    

    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    e.target.closest('.category-pill').classList.add('active');
    
    currentCategory = category;
    filterAndDisplayProducts();
}

function handleCategoryFilter(e) {
    e.preventDefault();
    const category = e.target.dataset.category;

    document.querySelectorAll('.category-filter').forEach(filter => {
        filter.classList.remove('active');
    });
    e.target.classList.add('active');
    
    document.querySelectorAll('.category-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.dataset.category === category) {
            pill.classList.add('active');
        }
    });
    
    currentCategory = category;
    filterAndDisplayProducts();
    
    window.scrollToProducts();
}


function handleSearch(e) {
    currentSearchTerm = e.target.value.toLowerCase().trim();
    filterAndDisplayProducts();
}

// Filter and display products
function filterAndDisplayProducts() {
    if (!productsGrid) return;
    
    showLoading();
    
    setTimeout(() => {
        let filteredProducts = products;
        
        // Filter by category
        if (currentCategory !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === currentCategory
            );
        }
        
        // Filter by search term
        if (currentSearchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(currentSearchTerm) ||
                product.description.toLowerCase().includes(currentSearchTerm)
            );
        }
        
        hideLoading();
        displayProducts(filteredProducts);
    }, 300);
}

// Show loading spinner
function showLoading() {
    if (loadingSpinner) {
        loadingSpinner.classList.remove('d-none');
    }
    if (productsGrid) {
        productsGrid.style.opacity = '0.5';
    }
    if (noResults) {
        noResults.classList.add('d-none');
    }
}

// Hide loading spinner
function hideLoading() {
    if (loadingSpinner) {
        loadingSpinner.classList.add('d-none');
    }
    if (productsGrid) {
        productsGrid.style.opacity = '1';
    }
}

// Display products
function displayProducts(productList) {
    console.log('Displaying products:', productList.length);
    
    if (!productsGrid) {
        console.error('Products grid element not found');
        return;
    }
    
    if (productList.length === 0) {
        productsGrid.innerHTML = '';
        if (noResults) {
            noResults.classList.remove('d-none');
        }
        return;
    }
    
    if (noResults) {
        noResults.classList.add('d-none');
    }
    
    productsGrid.innerHTML = productList.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card product-card scroll-reveal">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="card-body product-info">
                    <h5 class="product-name">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${formatPrice(product.price)}</div>
                    <button class="btn add-to-cart-btn w-100" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus me-2"></i>Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    console.log('Products HTML updated');
    
    // Trigger scroll animations for new products
    setTimeout(() => {
        setupScrollAnimations();
    }, 100);
}

// Format price to Chilean Peso format
function formatPrice(price) {
    return new Intl.NumberFormat('es-CL').format(price);
}

// Show add to cart animation
function showAddToCartAnimation() {
    const cartIcon = document.querySelector('#cartToggle i');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate-bounce');
        }, 600);
    }
    
    const cartBadge = document.getElementById('cartCount');
    if (cartBadge) {
        cartBadge.classList.add('cart-badge-bounce');
        setTimeout(() => {
            cartBadge.classList.remove('cart-badge-bounce');
        }, 600);
    }
}

// Update cart display
function updateCartDisplay() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'inline' : 'none';
    }
}

// Render cart items
function renderCart() {
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '';
        if (cartEmpty) {
            cartEmpty.classList.remove('d-none');
        }
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = true;
        }
    } else {
        if (cartEmpty) {
            cartEmpty.classList.add('d-none');
        }
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.disabled = false;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${formatPrice(item.price)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="updateQuantity(${item.id}, parseInt(this.value))" min="1">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">Total: $${formatPrice(item.price * item.quantity)}</div>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})" title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal) {
        cartTotal.textContent = `$${formatPrice(total)}`;
    }
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) return;
    
    showNotification('¡Gracias por tu compra! Redirigiendo al proceso de pago...', 'success');
    
    // Simulate checkout process
    setTimeout(() => {
        cart = [];
        updateCartDisplay();
        renderCart();
        if (cartModal) {
            cartModal.hide();
        }
        showNotification('Compra realizada exitosamente', 'success');
    }, 2000);
}

// Theme toggle functionality
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Apply theme on load
function applyTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = prefersDark ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Setup scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : 
                      type === 'error' ? 'alert-danger' : 'alert-info';
    
    const notification = document.createElement('div');
    notification.className = `alert ${alertClass} position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideInRight 0.3s ease-out;
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
