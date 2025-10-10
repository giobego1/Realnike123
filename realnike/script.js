const apiURL = 'https://68ce9cc36dc3f350777f8211.mockapi.io/REALNIKE123';

const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box i');

let cart = [];

// Hide cart on page load
cartModal.style.display = 'none';

// Open/close cart
cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCart();
});
closeCart.addEventListener('click', () => cartModal.style.display = 'none');

// Fetch cart from MockAPI
async function fetchCart() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        cart = data;
        updateCartCount();
    } catch (err) {
        console.error('Error fetching cart:', err);
    }
}

// Render cart items
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.REALNIKE123_img}" alt="${item.REALNIKE123_name}">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.REALNIKE123_name}</span>
                <span>$${item.REALNIKE123_price}</span>
            </div>
            <div class="cart-item-controls">
                <input type="number" min="1" value="${item.REALNIKE123_quantity}" onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="removeFromCart(${item.id})">Delete</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Remove item
async function removeFromCart(id) {
    try {
        await fetch(`${apiURL}/${id}`, { method: 'DELETE' });
        cart = cart.filter(item => item.id != id);
        renderCart();
        updateCartCount();
    } catch(err) {
        console.error('Error removing item:', err);
    }
}

// Update quantity using PATCH
async function updateQuantity(id, newQuantity) {
    const qty = parseInt(newQuantity);
    if (qty < 1) return;

    try {
        const res = await fetch(`${apiURL}/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ REALNIKE123_quantity: qty })
        });
        const updatedItem = await res.json();
        cart = cart.map(item => item.id == id ? updatedItem : item);
        renderCart();
        updateCartCount();
    } catch(err) {
        console.error('Error updating quantity:', err);
    }
}

// Add item to cart from search
async function addItemToCart(name, price, img) {
    const quantity = 1;
    const cartItem = { REALNIKE123_name: name, REALNIKE123_price: price, REALNIKE123_quantity: quantity, REALNIKE123_img: img };

    try {
        const res = await fetch(apiURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cartItem)
        });
        const newItem = await res.json();
        cart.push(newItem);
        updateCartCount();
        alert(`${name} added to cart!`);
    } catch(err) {
        console.error('Error adding to cart:', err);
    }
}

// Search shoe in your product cards
searchBtn.addEventListener('click', () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    if (!searchValue) return alert('Please enter a shoe name.');

    // Look for a matching product card
    const cards = document.querySelectorAll('.product-card');
    let found = false;

    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name === searchValue) {
            const price = parseFloat(card.querySelector('p').textContent.replace('$',''));
            const img = card.querySelector('img').src;
            addItemToCart(card.querySelector('h3').textContent, price, img);
            found = true;
        }
    });

    if (!found) alert('Shoe not found.');
});

// Add to cart button on product cards
document.querySelectorAll('.product-card button').forEach(btn => {
    btn.addEventListener('click', e => {
        const card = e.target.closest('.product-card');
        const name = card.querySelector('h3').textContent;
        const price = parseFloat(card.querySelector('p').textContent.replace('$',''));
        const img = card.querySelector('img').src;
        addItemToCart(name, price, img);
    });
});

// Initial load
fetchCart();
