const products = [
  { id: 1, name: "Smartphone Premium", price: 598.990, category: "electronica", image: "images/smartPhone.jpg", description: "Último modelo con cámara de alta resolución"},
  { id: 2, name: "Laptop Gaming", price: 999.000, category: "electronica", image: "images/pcgamer.jpg", description: "Potente laptop para gaming y trabajo profesional"},
  { id: 3, name: "Camiseta Premium", price: 29.000, category: "ropa", image: "images/camiseta.jpg", description: "Camiseta de algodón 100% orgánico", discount: 45 },
  { id: 4, name: "Sofá Moderno", price: 699.990, category: "hogar", image: "images/sillon.jpg", description: "Sofá cómodo y elegante para tu sala" },
  { id: 5, name: "Auriculares Inalámbricos", price: 129.990, category: "electronica", image: "images/airpods.jpg", description: "Sonido premium con cancelación de ruido", discount: 15 },
  { id: 6, name: "Smart Tv", price: 278.990, category: "electronica", image: "images/smartTV.jpg", description: "Ultra 4k", discount: 25 },
];

let comments = [
  { id: 1, name: "María González", rating: 5, text: "Excelente servicio y productos de calidad. Muy recomendado!", date: "2024-01-15" },
  { id: 2, name: "Juan Pérez", rating: 4, text: "Buenos productos y entrega rápida. El soporte al cliente es muy bueno.", date: "2024-01-10" },
  { id: 3, name: "Ana López", rating: 5, text: "Me encanta comprar aquí. Siempre encuentro lo que busco.", date: "2024-01-05" },
];

let cart = [];

function renderProducts(filtered = products) {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  filtered.forEach(p => {
    const hasDiscount = p.discount && p.discount > 0;
    const finalPrice = hasDiscount ? (p.price * (1 - p.discount / 100)).toFixed(2) : p.price.toFixed(2);

    const col = document.createElement("div");
    col.className = "col-md-4 mb-4 d-flex justify-content-center";
    col.innerHTML = `
      <div class="card text-center shadow position-relative" style="width: 18rem;">
        ${hasDiscount ? `<span class="badge bg-danger position-absolute" style="top: 10px; right: 10px;">-${p.discount}%</span>` : ""}
        <img src="${p.image}" class="card-img-top" alt="${p.name}" />
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.description}</p>
          <h6 class="text-primary">$${finalPrice}</h6>
          <button class="btn btn-primary" onclick="addToCart(${p.id})">Agregar al carrito</button>
        </div>
      </div>`;
    grid.appendChild(col);
  });
}

function renderComments() {
  const list = document.getElementById("commentsList");
  list.innerHTML = "";
  comments.forEach(c => {
    const card = document.createElement("div");
    card.className = "comment-card";
    card.innerHTML = `
      <h5>${c.name} <span class="rating">${"★".repeat(c.rating)}${"☆".repeat(5 - c.rating)}</span></h5>
      <p>${c.text}</p>
      <p class="comment-meta">${c.date}</p>`;
    list.appendChild(card);
  });
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const totalAmount = document.getElementById("totalAmount");
  cartItems.innerHTML = "";
  cartCount.textContent = cart.length;

  let total = 0;
  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    const price = product.discount ? product.price * (1 - product.discount / 100) : product.price;
    const div = document.createElement("div");
    div.className = "cart-item p-2 border-bottom d-flex justify-content-between align-items-center";
    div.innerHTML = `
      <div>
        <strong>${product.name}</strong><br>
        <small>$${price.toFixed(2)} x ${item.qty}</small>
      </div>
      <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">&times;</button>`;
    cartItems.appendChild(div);
    total += price * item.qty;
  });

  totalAmount.textContent = total.toFixed(2);
}
function addToCart(productId) {
  const item = cart.find(i => i.id === productId);
  if (item) {
    item.qty++;
  } else {
    cart.push({ id: productId, qty: 1 });
  }
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  renderCart();
}

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("active");
  document.getElementById("cartOverlay").classList.toggle("active");
}

function closeCart() {
  document.getElementById("cartSidebar").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
}

function checkout() {
  alert("Gracias por tu compra!");
  cart = [];
  renderCart();
  closeCart();
}

function filterProducts() {
  const category = document.getElementById("categoryFilter").value.toLowerCase();
  const search = document.getElementById("searchProduct").value.toLowerCase();

  const filtered = products.filter(p => {
    return (category === "" || p.category.toLowerCase() === category) &&
           (search === "" || p.name.toLowerCase().includes(search));
  });
  renderProducts(filtered);
}

function submitComment(e) {
  e.preventDefault();
  const name = document.getElementById("commentName").value;
  const rating = parseInt(document.getElementById("commentRating").value);
  const text = document.getElementById("commentText").value;
  const date = new Date().toISOString().split("T")[0];

  comments.unshift({ id: Date.now(), name, rating, text, date });
  renderComments();
  e.target.reset();
}
window.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderComments();
  renderCart();
});
