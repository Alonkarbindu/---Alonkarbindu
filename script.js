window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    const navbar = document.querySelector(".navbar");
    const heroTexts = document.querySelectorAll(".text-hidden");
  
    // Loader fade out
    setTimeout(() => loader.classList.add("hide"), 1600);
  
    // Hero text slide/fade down
    setTimeout(() => {
      heroTexts.forEach(item => item.classList.replace("text-hidden", "text-show"));
    }, 2000);
  
    // Navbar slide/fade down
    setTimeout(() => {
      navbar.classList.remove("nav-hidden");
      navbar.classList.add("nav-show");
    }, 2600);
  });
  
  const animatedElements = document.querySelectorAll(
    '.featured-header, .featured-item, .animate-on-scroll'
  );

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    },
    { threshold: 0.3 }
  );

  animatedElements.forEach(el => observer.observe(el));


  document.addEventListener("DOMContentLoaded", () => {
    // ELEMENTS
    const cartSidebar = document.getElementById("cartSidebar");
    const cartToggle = document.querySelector(".bi-bag").closest("a");
    const closeCart = document.getElementById("closeCart");
    const cartItemsContainer = document.getElementById("cartItems");
    const cartTotalElem = document.getElementById("cartTotal");
    const cartCountElem = document.querySelector(".cart-count");
    const checkoutBtn = document.getElementById("checkoutBtn");
    const addToCartBtns = document.querySelectorAll(".add-to-cart");
  
    const deliverySelect = document.getElementById("deliverySelect");
    const customerNameInput = document.getElementById("customerName");
    const customerMobileInput = document.getElementById("customerMobile");
    const customerAddressInput = document.getElementById("customerAddress");
  
    // LOAD CART FROM localStorage OR START FRESH
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let deliveryCharge = parseInt(localStorage.getItem("deliveryCharge")) || parseInt(deliverySelect.value);
  
    // Update delivery select to saved value
    deliverySelect.value = deliveryCharge;
  
    // OPEN SIDEBAR
    cartToggle.addEventListener("click", (e) => {
      e.preventDefault();
      cartSidebar.classList.add("show");
      renderCart();
    });
  
    // CLOSE SIDEBAR
    closeCart.addEventListener("click", () => cartSidebar.classList.remove("show"));
  
    // DELIVERY CHANGE
    deliverySelect.addEventListener("change", (e) => {
      deliveryCharge = parseInt(e.target.value);
      localStorage.setItem("deliveryCharge", deliveryCharge);
      renderCart();
    });
  
    // ADD TO CART
    addToCartBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
  
        const existing = cart.find(i => i.name === name);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({ name, price, qty: 1, size: "24" });
        }
  
        saveCart();
        cartSidebar.classList.add("show");
        renderCart();
      });
    });
  
    // CUSTOMER INFO INPUTS - UPDATE CART LINK ON TYPING
    [customerNameInput, customerMobileInput, customerAddressInput].forEach(input => {
      input.addEventListener("input", renderCart);
    });
  
    // SAVE CART TO localStorage
    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  
    // RENDER CART FUNCTION
    function renderCart() {
      cartItemsContainer.innerHTML = "";
      let totalItemsPrice = 0;
  
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty.</p>`;
      }
  
      cart.forEach((item, index) => {
        totalItemsPrice += item.price * item.qty;
  
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <span class="cart-item-name">${item.name}</span>
  
          <select class="cart-size" data-i="${index}">
            <option value="24" ${item.size === "24" ? "selected" : ""}>Size 24</option>
            <option value="26" ${item.size === "26" ? "selected" : ""}>Size 26</option>
            <option value="28" ${item.size === "28" ? "selected" : ""}>Size 28</option>
          </select>
  
          <div class="cart-item-qty">
            <button data-i="${index}" data-action="dec">−</button>
            <span>${item.qty}</span>
            <button data-i="${index}" data-action="inc">+</button>
            <button data-i="${index}" data-action="del">🗑</button>
          </div>
  
          <span>৳${item.price * item.qty}</span>
        `;
        cartItemsContainer.appendChild(div);
      });
  
      // CALCULATE TOTAL
      const finalTotal = totalItemsPrice + deliveryCharge;
      cartTotalElem.textContent = `৳${finalTotal}`;
      cartCountElem.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  
      // CUSTOMER INFO
      const customerName = customerNameInput.value || "N/A";
      const customerMobile = customerMobileInput.value || "N/A";
      const customerAddress = customerAddressInput.value || "N/A";
  
      // WhatsApp Checkout Link
      checkoutBtn.href =
        `https://wa.me/8801320548226?text=` +
        encodeURIComponent(
          `Name: ${customerName}\n` +
          `Mobile: ${customerMobile}\n` +
          `Address: ${customerAddress}\n\n` +
          cart.map(i => `${i.name} x${i.qty} (Size: ${i.size}) = ৳${i.price*i.qty}`).join("\n") +
          `\nDelivery: ৳${deliveryCharge}` +
          `\nTotal: ৳${finalTotal}`
        );
  
      // SIZE CHANGE HANDLER
      document.querySelectorAll(".cart-size").forEach(select => {
        select.addEventListener("change", (e) => {
          const i = e.target.dataset.i;
          cart[i].size = e.target.value;
          saveCart();
          renderCart();
        });
      });
    }
  
    // QUANTITY AND DELETE HANDLER
    cartItemsContainer.addEventListener("click", (e) => {
      const i = e.target.dataset.i;
      const action = e.target.dataset.action;
      if (!action) return;
  
      if (action === "inc") cart[i].qty += 1;
      if (action === "dec") cart[i].qty = Math.max(1, cart[i].qty - 1);
      if (action === "del") cart.splice(i, 1);
  
      saveCart();
      renderCart();
    });
  
    // INITIAL RENDER
    renderCart();
  });
  

  document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("filterBtn");
    const menu = document.getElementById("filterMenu");

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.style.display =
        menu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
      menu.style.display = "none";
    });
  });



  





