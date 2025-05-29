const products = [
    {
        id: 1,
        name: "Smartphone Premium",
        price: 598990,
        category: "electronica",
        images: [
            "images/smartPhone.jpg",
            "images/smartPhone2.jpg",
            "images/smartPhone3.jpg"
        ],
        description: "Último modelo con cámara de alta resolución y procesador de última generación"
    },
    {
        id: 2,
        name: "Laptop Gaming",
        price: 999000,
        category: "electronica",
        images: [
            "images/pcgamer.jpg",
            "images/pcgamer2.jpg",
            "images/pcgamer3.jpg"
        ],
        description: "Potente laptop para gaming y trabajo profesional con tarjeta gráfica dedicada"
    },
    {
        id: 3,
        name: "Camiseta Premium",
        price: 29000,
        category: "ropa",
        images: [
            "images/camiseta.jpg",
            "images/camiseta2.jpg",
            "images/camiseta3.jpg"
        ],
        description: "Camiseta de algodón 100% orgánico, cómoda y duradera",
        discount: 45
    },
    {
        id: 4,
        name: "Sofá Moderno",
        price: 699990,
        category: "hogar",
        images: [
            "images/sillon.jpg",
            "images/sillon2.jpg",
            "images/sillon3.jpg"
        ],
        description: "Sofá cómodo y elegante para tu sala de estar"
    },
    {
        id: 5,
        name: "Auriculares Inalámbricos",
        price: 129990,
        category: "electronica",
        images: [
            "images/airpods.jpg",
            "images/airpods2.jpg",
            "images/airpods3.jpg"
        ],
        description: "Sonido premium con cancelación de ruido activa",
        discount: 15
    },
    {
        id: 6,
        name: "Smart TV 4K",
        price: 278990,
        category: "electronica",
        images: [
            "images/smartTV.jpg",
            "images/smartTV2.jpg",
            "images/smartTV3.jpg"
        ],
        description: "Televisor Ultra 4K con tecnología HDR y Smart TV",
        discount: 25
    }
];

let comments = [
    {
        id: 1,
        name: "María González",
        rating: 5,
        text: "Excelente servicio y productos de calidad. Muy recomendado! La entrega fue súper rápida.",
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Juan Pérez",
        rating: 4,
        text: "Buenos productos y entrega rápida. El soporte al cliente es muy bueno y siempre están disponibles.",
        date: "2024-01-10"
    },
    {
        id: 3,
        name: "Ana López",
        rating: 5,
        text: "Me encanta comprar aquí. Siempre encuentro lo que busco y a excelentes precios.",
        date: "2024-01-05"
    }
];

let cart = [];
let filteredProducts = products;
let carouselIntervals = {};

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }, 1000);
    renderProducts();
    renderComments();
    updateCartDisplay();
    setupEventListeners();
    setupNavbarScroll();
    setupScrollToTop();
    observeElementsForAnimation();
});

function setupEventListeners() {
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }

    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            if (!cartSidebar.contains(e.target) && !e.target.closest('[onclick="toggleCart()"]')) {
                toggleCart();
            }
        }
    });
}

function renderProducts(filtered = products) {
    const grid = document.getElementById("productGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    filtered.forEach(p => {
        const hasDiscount = p.discount && p.discount > 0;
        const finalPrice = hasDiscount ? (p.price * (1 - p.discount / 100)) : p.price;
        
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4 d-flex justify-content-center fade-in-up";
        
        const imagesHtml = p.images.map((img, index) => 
            `<img src="${img}" 
                 class="product-img ${index === 0 ? 'main' : index === 1 ? 'alt1' : 'alt2'}" 
                 alt="${p.name}" 
                 onerror="this.src='images/placeholder.jpg'">`
        ).join('');
        
        const indicatorsHtml = p.images.map((_, index) => 
            `<div class="carousel-indicator ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
        ).join('');
        
        col.innerHTML = `
            <div class="card custom-card h-100">
                <div class="product-image-container" 
                     onmouseenter="startImageCarousel(${p.id})" 
                     onmouseleave="stopImageCarousel(${p.id})">
                    ${imagesHtml}
                    ${hasDiscount ? `<div class="discount-badge">-${p.discount}%</div>` : ''}
                    <div class="carousel-indicators">
                        ${indicatorsHtml}
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text flex-grow-1">${p.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            ${hasDiscount ? 
                                `<span class="text-muted text-decoration-line-through">$${formatNumber(p.price)}</span>` : 
                                ''
                            }
                            <span class="price">$${formatNumber(finalPrice)}</span>
                        </div>
                        <button class="btn btn-primary-custom w-100 btn-animated" onclick="addToCart(${p.id})">
                            <i class="fas fa-cart-plus me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        grid.appendChild(col);
    });
}

function startImageCarousel(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.images.length <= 1) return;
    
    const container = event.currentTarget;
    const images = container.querySelectorAll('.product-img');
    const indicators = container.querySelectorAll('.carousel-indicator');
    let currentIndex = 0;
    
    if (carouselIntervals[productId]) {
        clearInterval(carouselIntervals[productId]);
    }
    carouselIntervals[productId] = setInterval(() => {
        images[currentIndex].style.opacity = '0';
        indicators[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].style.opacity = '1';
        indicators[currentIndex].classList.add('active');
    }, 1000); 
}

function stopImageCarousel(productId) {
    if (carouselIntervals[productId]) {
        clearInterval(carouselIntervals[productId]);
        delete carouselIntervals[productId];
    }
    
    const container = event.currentTarget;
    const images = container.querySelectorAll('.product-img');
    const indicators = container.querySelectorAll('.carousel-indicator');
    
    images.forEach((img, index) => {
        img.style.opacity = index === 0 ? '1' : '0';
    });
    
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === 0);
    });
}

function renderComments() {
    const list = document.getElementById("commentsList");
    if (!list) return;
    
    list.innerHTML = "";
    
    comments.forEach((c, index) => {
        const card = document.createElement("div");
        card.className = "col-md-6 mb-4 fade-in-up";
        card.style.animationDelay = `${index * 0.1}s`;
        
        const stars = "⭐".repeat(c.rating);
        
        card.innerHTML = `
            <div class="comment-card h-100">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h6 class="mb-1">${c.name}</h6>
                        <div class="rating">${stars}</div>
                    </div>
                    <small class="comment-meta">${formatDate(c.date)}</small>
                </div>
                <p class="mb-0">${c.text}</p>
            </div>
        `;
        
        list.appendChild(card);
    });
}

function handleCommentSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('userName').value;
    const rating = parseInt(document.getElementById('userRating').value);
    const text = document.getElementById('userComment').value;
    
    if (!name || !rating || !text) {
        showNotification('Por favor completa todos los campos', 'warning');
        return;
    }

    const newComment = {
        id: comments.length + 1,
        name: name,
        rating: rating,
        text: text,
        date: new Date().toISOString().split('T')[0]
    };
    
    comments.unshift(newComment);
    renderComments();
    
    e.target.reset();
    
    showNotification('¡Gracias por tu comentario!', 'success');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito`, 'success');
    
    const button = event.target;
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    showNotification('Producto eliminado del carrito', 'info');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const totalAmount = document.getElementById("totalAmount");
    const emptyCart = document.getElementById("emptyCart");
    
    if (!cartItems || !cartCount || !totalAmount) return;
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
        totalAmount.textContent = '0';
        return;
    }
    
    cartItems.style.display = 'block';
    emptyCart.style.display = 'none';
    cartItems.innerHTML = "";
    
    let total = 0;
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        
        const price = product.discount ? 
            product.price * (1 - product.discount / 100) : 
            product.price;
        
        const itemTotal = price * item.quantity;
        total += itemTotal;
        
        const div = document.createElement("div");
        div.className = "cart-item p-3 border-bottom d-flex justify-content-between align-items-center";
        div.innerHTML = `
            <div class="flex-grow-1">
                <h6 class="mb-1">${product.name}</h6>
                <small class="text-muted">$${formatNumber(price)} c/u</small>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-secondary btn-animated me-2" onclick="updateQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="mx-2">${item.quantity}</span>
                <button class="btn btn-sm btn-outline-secondary btn-animated me-2" onclick="updateQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-animated" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItems.appendChild(div);
    });
    
    totalAmount.textContent = formatNumber(total);
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    
    if (!sidebar || !overlay) return;
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    showNotification('Redirigiendo a la página de pago...', 'info');
    
    setTimeout(() => {
        showNotification('¡Gracias por tu compra!', 'success');
        cart = [];
        updateCartDisplay();
        toggleCart();
    }, 2000);
}

function filterProducts() {
    const category = document.getElementById('categoryFilter')?.value;
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        const matchesCategory = !category || category === 'todos' || product.category === category;
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);
        
        return matchesCategory && matchesSearch;
    });
    
    renderProducts(filteredProducts);
}

function searchProducts() {
    filterProducts();
}

function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getIconForType(type)} me-2"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function getIconForType(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function observeElementsForAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

function formatNumber(num) {
    return num.toLocaleString('es-CL');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

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

const debouncedSearch = debounce(searchProducts, 300);

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debouncedSearch);
    }
});

function handleImageError(img) {
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4=';
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cartButton = document.querySelector('[onclick="toggleCart()"]');
    if (cartButton) {
        cartButton.setAttribute('aria-label', 'Abrir carrito de compras');
        cartButton.setAttribute('role', 'button');
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const cartSidebar = document.getElementById('cartSidebar');
            if (cartSidebar && cartSidebar.classList.contains('active')) {
                toggleCart();
            }
        }
    });
});
