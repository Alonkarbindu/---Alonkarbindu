// ================= BACK TO TOP BUTTON =================//
const backToTopBtn = document.querySelector(".button");

// Scroll to top when clicked
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// Show button when scrolling down
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.opacity = "1";
    backToTopBtn.style.pointerEvents = "auto";
  } else {
    backToTopBtn.style.opacity = "0";
    backToTopBtn.style.pointerEvents = "none";
  }
});







/* ======================================================
   GLOBAL CART SYNC (DO NOT REMOVE)
====================================================== */
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

/* ======================================================
   NAVBAR & UI
====================================================== */
document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const collapse = document.querySelector(".navbar-collapse");
  const closeBtn = document.querySelector(".close-btn");

  if (navbar && collapse) {
    navbar.addEventListener("click", function (e) {
      if (
        collapse.classList.contains("show") &&
        !collapse.contains(e.target) &&
        !e.target.classList.contains("navbar-toggler")
      ) {
        collapse.classList.remove("show");
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => collapse.classList.remove("show"));
  }
});

/* ======================================================
   LOADER + HERO + NAVBAR ANIMATION
====================================================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  const navbar = document.querySelector(".navbar");
  const heroTexts = document.querySelectorAll(".text-hidden");

  if (loader) setTimeout(() => loader.classList.add("hide"), 1600);

  setTimeout(() => {
    heroTexts.forEach(item =>
      item.classList.replace("text-hidden", "text-show")
    );
  }, 2000);

  if (navbar) {
    setTimeout(() => {
      navbar.classList.remove("nav-hidden");
      navbar.classList.add("nav-show");
    }, 2600);
  }
});

/* ======================================================
   SCROLL ANIMATION
====================================================== */
const animatedElements = document.querySelectorAll(
  ".featured-header, .featured-item, .animate-on-scroll"
);

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  },
  { threshold: 0.3 }
);

animatedElements.forEach(el => observer.observe(el));

/* ======================================================
   CART SIDEBAR
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const cartSidebar = document.getElementById("cartSidebar");
  const cartToggle = document.querySelector(".bi-bag")?.closest("a");
  const closeCart = document.getElementById("closeCart");
  const cartItemsContainer = document.getElementById("cartItems");
  const cartTotalElem = document.getElementById("cartTotal");
  const cartCountElem = document.querySelector(".cart-count");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const addToCartBtns = document.querySelectorAll(".add-to-cart");

  let cart = getCart();

  function renderCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty. <br>Do some shop  :(  </p>`;
    }

    cart.forEach((item, i) => {
      total += item.price * item.qty;
    
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
      <img src="${item.image}" class="cart-item-img">
    
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
      </div>
    
      <span class="cart-item-price">৳${item.price * item.qty}</span>
    
      <button class="cart-delete-btn" 
              data-i="${i}" 
              data-action="del">
          ✕
      </button>
    `;
      cartItemsContainer.appendChild(div);
    });
    

    if (cartTotalElem) cartTotalElem.textContent = `৳${total}`;
    if (cartCountElem)
      cartCountElem.textContent = cart.reduce((s, i) => s + i.qty, 0);

    if (checkoutBtn) {
      checkoutBtn.href = cart.length ? "checkout.html" : "#";
      checkoutBtn.style.pointerEvents = cart.length ? "auto" : "none";
      checkoutBtn.style.opacity = cart.length ? "1" : "0.5";
    }
  }

  cartToggle?.addEventListener("click", e => {
    e.preventDefault();
    cartSidebar?.classList.add("show");
    renderCart();
  });

  closeCart?.addEventListener("click", () =>
    cartSidebar?.classList.remove("show")
  );

  addToCartBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.name;
      const price = parseInt(btn.dataset.price);
      const image = btn.dataset.image;
  
      const item = cart.find(i => i.name === name);
  
      if (item) {
        item.qty++;
      } else {
        cart.push({
          name,
          price,
          image,
          qty: 1,
          size: 24
        });
      }
  
      setCart(cart);
      cartSidebar.classList.add("show");
    });
  });
  

  cartItemsContainer?.addEventListener("click", e => {
    const i = e.target.dataset.i;
    const action = e.target.dataset.action;
    if (!action) return;

    if (action === "inc") cart[i].qty++;
    if (action === "dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
    if (action === "del") cart.splice(i, 1);

    setCart(cart);
  });

  window.addEventListener("cartUpdated", () => {
    cart = getCart();
    renderCart();
  });

  renderCart();
});



/* ======================================================
   CHECKOUT PAGE
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const checkoutItems = document.getElementById("checkoutItems");
  const subtotalEl = document.getElementById("subtotal");
  const finalTotalEl = document.getElementById("finalTotal");
  const deliveryText = document.getElementById("deliveryText");
  const deliverySelect = document.getElementById("deliverySelect");

  if (!checkoutItems) return;

  let cart = getCart();
  let delivery = parseInt(deliverySelect.value);

  function renderCheckout() {
    checkoutItems.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, i) => {
      const total = item.price * item.qty;
      subtotal += total;

      checkoutItems.innerHTML += `
      <tr>
        <td class="checkout-product">
          <img src="${item.image}" class="checkout-img">
          <span>${item.name}</span>
        </td>
      
        <td>
  <div class="size-select-wrapper">
    <select onchange="updateSize(${i}, this.value)">

            <option value="24" ${item.size == 24 ? "selected" : ""}>24</option>
            <option value="26" ${item.size == 26 ? "selected" : ""}>26</option>
            <option value="28" ${item.size == 28 ? "selected" : ""}>28</option>
            </select>
            </div>
          </td>
          
      
        <td>
        <div class="qty-box">
          <button onclick="updateQty(${i},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${i},1)">+</button>
        </div>
      </td>
      
      
        <td>৳${total}</td>
        <td>
  <button class="delete-btn" onclick="removeItem(${i})">✕</button>
</td>

      </tr>
      `;
      
    });

    subtotalEl.textContent = `৳${subtotal}`;
    deliveryText.textContent = `৳${delivery}`;
    finalTotalEl.textContent = `৳${subtotal + delivery}`;
  }

  window.updateQty = (i, c) => {
    cart[i].qty = Math.max(1, cart[i].qty + c);
    setCart(cart);
  };

  window.updateSize = (i, s) => {
    cart[i].size = s;
    setCart(cart);
  };

  window.removeItem = i => {
    cart.splice(i, 1);
    setCart(cart);
  };

  deliverySelect.addEventListener("change", () => {
    delivery = parseInt(deliverySelect.value);
    renderCheckout();
  });

  window.addEventListener("cartUpdated", () => {
    cart = getCart();
    renderCheckout();
  });

  renderCheckout();
});






// ================= ORDER PLACE =================//
document.getElementById("placeOrderBtn").addEventListener("click", function () {

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const finalTotal = document.getElementById("finalTotal").innerText;

  if (!name || !phone || !address) {
    alert("Please fill all required fields.");
    return;
  }

  let items = "";
  const rows = document.querySelectorAll("#checkoutItems tr");

  rows.forEach((row, index) => {
    // Product name
    const product = row.querySelector(".checkout-product span")?.innerText.trim();

    // Size (select value)
    const sizeSelect = row.querySelector("td:nth-child(2) select");
    const selectedSize = sizeSelect ? sizeSelect.value : "";

    // Quantity (span inside .qty-box)
    const qtySpan = row.querySelector(".qty-box span");
    const quantity = qtySpan ? qtySpan.innerText.trim() : "1";

    if (product) {
      items += `${index + 1}. ${product}
Size: ${selectedSize}
Quantity: ${quantity}

`;
    }
  });

  const message = `
*New Order*

Name: ${name}
Phone: ${phone}
Address: ${address}

Order Items:
${items}

Total: ${finalTotal}
`;

  // Your WhatsApp number (replace with yours)
  const whatsappNumber = "8801320548226";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
});




// ================= ORDER PLACE & CLEAR CART =================//
document.getElementById("placeOrderBtn").addEventListener("click", function () {

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const finalTotal = document.getElementById("finalTotal").innerText;

  if (!name || !phone || !address) {
    alert("Please fill all required fields.");
    return;
  }

  let items = "";
  const rows = document.querySelectorAll("#checkoutItems tr");

  rows.forEach((row, index) => {
    // Product name
    const product = row.querySelector(".checkout-product span")?.innerText.trim();

    // Size (select value)
    const sizeSelect = row.querySelector("td:nth-child(2) select");
    const selectedSize = sizeSelect ? sizeSelect.value : "";

    // Quantity (span inside .qty-box)
    const qtySpan = row.querySelector(".qty-box span");
    const quantity = qtySpan ? qtySpan.innerText.trim() : "1";

    if (product) {
      items += `${index + 1}. ${product}
Size: ${selectedSize}
Quantity: ${quantity}

`;
    }
  });

  const message = `
🛍️ *New Order*

Name: ${name}
Phone: ${phone}
Address: ${address}

Order Items:
${items}

Total: ${finalTotal}
`;

  const whatsappNumber = "8801320548226";
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Open WhatsApp
  window.open(url, "_blank");

  // ======= CLEAR CART AFTER ORDER =======
  localStorage.removeItem("cart");      // remove cart from storage
  window.dispatchEvent(new Event("cartUpdated")); // refresh checkout & cart sidebar

  // Clear input fields (optional)
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
  document.getElementById("customerAddress").value = "";

  alert("Order placed successfully! Your cart is now empty.");
});