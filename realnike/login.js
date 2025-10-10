const apiURL = 'https://68ce9cc36dc3f350777f8211.mockapi.io/REALNIKE123';
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box i');

let cart = [];

// Fetch cart from MockAPI
async function fetchCart() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        cart = data;
        renderCart();
        updateCartCount();
    } catch (err) {
        console.error('Error fetching cart:', err);
    }
}

// Render cart items on the cart page
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center;">Your cart is empty.</p>';
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
                <button onclick="removeFromCart(${item.id})">Delete</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
}

// Update cart count in header
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Add item to cart (from product cards)
document.querySelectorAll('.product-card button').forEach(btn => {
    btn.addEventListener('click', async e => {
        const card = e.target.closest('.product-card');
        const name = card.querySelector('h3').textContent;
        const price = parseFloat(card.querySelector('p').textContent.replace('$',''));
        const img = card.querySelector('img').src;
        addCartItem(name, price, img);
    });
});

// Add cart item helper
async function addCartItem(name, price, img) {
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
    } catch (err) {
        console.error('Error adding to cart:', err);
    }
}

// Remove item from cart
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

// Search bar functionality
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const searchValue = searchInput.value.trim().toLowerCase();
    if(!searchValue) return alert('Please enter a shoe name!');

    try {
        const res = await fetch(apiURL);
        const products = await res.json();
        const product = products.find(p => p.REALNIKE123_name.toLowerCase() === searchValue);

        if (!product) return alert('Product not found!');

        addCartItem(product.REALNIKE123_name, product.REALNIKE123_price, product.REALNIKE123_img);
    } catch (err) {
        console.error('Error searching product:', err);
        alert('Something went wrong while searching.');
    }
}

// Initial load
fetchCart();
