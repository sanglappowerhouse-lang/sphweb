/* ============================================
   SPH NUTRITION SHOP - JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // 1. PRODUCT CATALOG DATA
    const PRODUCTS = [
        {
            id: "prot-1",
            name: "Whey Gold Standard (1kg)",
            category: "Protein",
            price: 3499,
            icon: "protein"
        },
        {
            id: "prot-2",
            name: "Iso-Zero Hydrolyzed Whey (1kg)",
            category: "Protein",
            price: 4299,
            icon: "protein"
        },
        {
            id: "prot-3",
            name: "Plant Protein Vegan Blend (1kg)",
            category: "Protein",
            price: 2999,
            icon: "protein"
        },
        {
            id: "creat-1",
            name: "Creatine Monohydrate (250g)",
            category: "Creatine",
            price: 999,
            icon: "creatine"
        },
        {
            id: "creat-2",
            name: "Micronized Creatine (250g)",
            category: "Creatine",
            price: 1299,
            icon: "creatine"
        },
        {
            id: "pre-1",
            name: "C4 Original Pre-Workout (30 Servings)",
            category: "Pre-Workout",
            price: 2499,
            icon: "preworkout"
        },
        {
            id: "pre-2",
            name: "Psycho Beast Pre-Workout (30 Servings)",
            category: "Pre-Workout",
            price: 2899,
            icon: "preworkout"
        },
        {
            id: "gainer-1",
            name: "Hyper Mass Gainer (3kg)",
            category: "Mass Gainer",
            price: 3199,
            icon: "gainer"
        },
        {
            id: "gainer-2",
            name: "Serious Mass Gainer (3kg)",
            category: "Mass Gainer",
            price: 3599,
            icon: "gainer"
        },
        {
            id: "other-1",
            name: "SPH Shaker Bottle (700ml)",
            category: "Others",
            price: 399,
            icon: "shaker"
        },
        {
            id: "other-2",
            name: "Multivitamin Elite (60 Tablets)",
            category: "Others",
            price: 799,
            icon: "vitamins"
        },
        {
            id: "other-3",
            name: "Omega-3 Fish Oil (90 Softgels)",
            category: "Others",
            price: 899,
            icon: "fishoil"
        },
        {
            id: "other-4",
            name: "BCAA Recovery Plus (30 Servings)",
            category: "Others",
            price: 1699,
            icon: "bcaa"
        }
    ];

    // 2. SVG ICON DICTIONARY (Placeholders for images)
    const SVG_ICONS = {
        protein: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="18" width="28" height="36" rx="4" />
            <path d="M22 10h20v8H22z" />
            <path d="M24 28h16M24 36h16M24 44h10" />
        </svg>`,
        creatine: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="14" y="20" width="36" height="34" rx="6" />
            <path d="M20 10h24v10H20z" />
            <circle cx="32" cy="37" r="7" />
            <path d="M28 37h8M32 33v8" />
        </svg>`,
        preworkout: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="18" width="28" height="36" rx="4" />
            <path d="M22 10h20v8H22z" />
            <path d="M34 26l-6 10h8l-6 10" />
        </svg>`,
        gainer: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="12" y="22" width="40" height="32" rx="5" />
            <path d="M16 12h32v10H16z" />
            <path d="M22 32h20M22 40h20M22 48h12" />
        </svg>`,
        shaker: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 18l4 36h16l4-36H20z" />
            <path d="M24 10h16v8H24z" />
            <path d="M32 5v5" />
            <path d="M25 28h14M25 36h14M25 44h14" />
        </svg>`,
        vitamins: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="16" width="28" height="38" rx="5" />
            <path d="M24 10h16v6H24z" />
            <path d="M32 26v12M26 32h12" />
        </svg>`,
        fishoil: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="16" width="28" height="38" rx="5" />
            <path d="M24 10h16v6H24z" />
            <path d="M32 24c4 0 6 4 6 8s-2 8-6 8-6-4-6-8 2-8 6-8z" />
        </svg>`,
        bcaa: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="18" y="18" width="28" height="36" rx="4" />
            <path d="M22 10h20v8H22z" />
            <path d="M26 30l12 12M38 30l-12 12" />
        </svg>`
    };

    // 3. STATE MANAGEMENT
    let cart = [];

    // Load cart from LocalStorage on init (if present)
    const storedCart = localStorage.getItem('sph_cart');
    if (storedCart) {
        try {
            cart = JSON.parse(storedCart);
        } catch (e) {
            cart = [];
        }
    }

    // 4. DOM ELEMENTS
    const shopGrid = document.getElementById('shopGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const floatingCartBtn = document.getElementById('floatingCartBtn');
    const cartBadge = document.getElementById('cartBadge');
    const cartCloseBtn = document.getElementById('cartCloseBtn');
    const cartBody = document.getElementById('cartBody');
    const cartTotalValue = document.getElementById('cartTotalValue');
    const whatsappCheckoutBtn = document.getElementById('whatsappCheckoutBtn');

    // 5. SHOP RENDERING FUNCTION
    function renderShop(filterCategory = 'All') {
        if (!shopGrid) return;
        
        shopGrid.innerHTML = '';
        const filteredProducts = filterCategory === 'All' 
            ? PRODUCTS 
            : PRODUCTS.filter(p => p.category.toLowerCase() === filterCategory.toLowerCase());

        if (filteredProducts.length === 0) {
            shopGrid.innerHTML = `
                <div class="shop-empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>No products found matching the selected category.</p>
                </div>
            `;
            return;
        }

        filteredProducts.forEach(product => {
            const isAdded = cart.some(item => item.product.id === product.id);
            const card = document.createElement('div');
            card.className = 'product-card section-hidden'; // works with original script intersection observer
            card.innerHTML = `
                <span class="product-badge">${product.category}</span>
                <div class="product-img-wrapper">
                    <div class="product-img-placeholder">
                        ${SVG_ICONS[product.icon] || SVG_ICONS.protein}
                    </div>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price-row">
                        <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                        <button class="add-to-cart-btn ${isAdded ? 'added' : ''}" data-id="${product.id}">
                            <i class="fas ${isAdded ? 'fa-check' : 'fa-shopping-cart'}"></i>
                            <span>${isAdded ? 'Added!' : 'Add To Cart'}</span>
                        </button>
                    </div>
                </div>
            `;
            shopGrid.appendChild(card);
            
            // Trigger animation fade in directly or let observer catch it
            setTimeout(() => {
                card.classList.add('section-visible');
            }, 50);
        });

        // Add event listeners to the new buttons
        document.querySelectorAll('.product-card .add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.getAttribute('data-id');
                addToCart(productId, btn);
            });
        });
    }

    // 6. CART STATE CONTROLLERS
    function addToCart(productId, btnElement = null) {
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.product.id === productId);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ product, qty: 1 });
        }

        // Save State
        saveCart();
        updateCartUI();

        // Button Ripple & Added feedback
        if (btnElement) {
            btnElement.classList.add('added');
            btnElement.querySelector('i').className = 'fas fa-check';
            btnElement.querySelector('span').textContent = 'Added!';

            // Reset text feedback after 1.5s but keep the styling if it is in cart
            setTimeout(() => {
                if (cart.some(item => item.product.id === productId)) {
                    btnElement.querySelector('span').textContent = 'Added!';
                } else {
                    btnElement.classList.remove('added');
                    btnElement.querySelector('i').className = 'fas fa-shopping-cart';
                    btnElement.querySelector('span').textContent = 'Add to Cart';
                }
            }, 1500);
        }

        // Pulse Floating Cart icon
        if (floatingCartBtn) {
            floatingCartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                floatingCartBtn.style.transform = '';
            }, 250);
        }
    }

    function changeQuantity(productId, amount) {
        const item = cart.find(item => item.product.id === productId);
        if (!item) return;

        item.qty += amount;
        if (item.qty <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.product.id !== productId);
        saveCart();
        updateCartUI();
        
        // Re-render shop grid to remove "Added" state if the removed item is visible
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute('data-category') : 'All';
        renderShop(activeCategory);
    }

    function saveCart() {
        localStorage.setItem('sph_cart', JSON.stringify(cart));
    }

    function calculateTotal() {
        return cart.reduce((sum, item) => sum + (item.product.price * item.qty), 0);
    }

    function updateCartUI() {
        // Update floating badge
        if (cartBadge) {
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
        }

        // Update Drawer Content
        if (!cartBody) return;

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Your cart is empty!</p>
                    <button class="shop-now-btn" id="shopNowBtn">Shop Supplements</button>
                </div>
            `;
            if (cartTotalValue) {
                cartTotalValue.textContent = '₹0';
            }
            
            // Bind close logic to empty state shop now button
            const shopNowBtn = document.getElementById('shopNowBtn');
            if (shopNowBtn) {
                shopNowBtn.addEventListener('click', closeCartDrawer);
            }
            return;
        }

        cartBody.innerHTML = '';
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-image">
                    ${SVG_ICONS[item.product.icon] || SVG_ICONS.protein}
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.product.name}</h4>
                    <span class="cart-item-price">₹${item.product.price.toLocaleString('en-IN')}</span>
                    <div class="cart-item-actions">
                        <div class="qty-selector">
                            <button class="qty-btn minus" data-id="${item.product.id}">-</button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn plus" data-id="${item.product.id}">+</button>
                        </div>
                        <button class="cart-item-remove" data-id="${item.product.id}" title="Remove Item">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </div>
            `;
            cartBody.appendChild(itemElement);
        });

        // Add action listeners inside cart
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => {
                changeQuantity(btn.getAttribute('data-id'), 1);
            });
        });

        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => {
                changeQuantity(btn.getAttribute('data-id'), -1);
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.getAttribute('data-id'));
            });
        });

        // Update Total
        if (cartTotalValue) {
            cartTotalValue.textContent = `₹${calculateTotal().toLocaleString('en-IN')}`;
        }
    }

    // 7. DRAWER INTERFACE TOGGLES
    function openCartDrawer() {
        document.body.classList.add('cart-open');
    }

    function closeCartDrawer() {
        document.body.classList.remove('cart-open');
    }

    if (floatingCartBtn) {
        floatingCartBtn.addEventListener('click', openCartDrawer);
    }

    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCartDrawer);
    }

    // Close when backdrop is clicked
    const backdrop = document.querySelector('.cart-backdrop');
    if (backdrop) {
        backdrop.addEventListener('click', closeCartDrawer);
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartDrawer();
        }
    });

    // 8. WHATSAPP CHECKOUT LOGIC
    if (whatsappCheckoutBtn) {
        whatsappCheckoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add some supplements first!');
                return;
            }

            // Construct Order Lines
            let orderLinesStr = '';
            cart.forEach(item => {
                const itemTotalPrice = item.product.price * item.qty;
                // Format: - [Product Name 1] (Qty: [X]) - ₹[Price]
                orderLinesStr += `- ${item.product.name} (Qty: ${item.qty}) - ₹${itemTotalPrice.toLocaleString('en-IN')}\n`;
            });

            const totalAmountStr = calculateTotal().toLocaleString('en-IN');

            // Format message exactly as required
            const rawMessage = `Hello SPH Team! I would like to order the following supplements from the website:

*Order Details:*
${orderLinesStr}
*Total Amount:* ₹${totalAmountStr}

Please confirm my order and send over the payment details!`;

            // URL Encode (spaces as %20, line breaks as %0A)
            const encodedMessage = encodeURIComponent(rawMessage);
            const whatsappUrl = `https://wa.me/916290941903?text=${encodedMessage}`;

            // Redirect user in a new tab
            window.open(whatsappUrl, '_blank');
        });
    }

    // 9. FILTER BUTTON CLICKS HANDLING
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');
            renderShop(category);
        });
    });

    // 10. INITIALIZE
    renderShop('All');
    updateCartUI();
});
