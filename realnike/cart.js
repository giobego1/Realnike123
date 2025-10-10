const apiURL = 'https://68ce9cc36dc3f350777f8211.mockapi.io/REALNIKE123';
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const buyNowBtn = document.getElementById('buy-now');
const searchInput = document.querySelector('.search-box input');
const searchBtn = document.querySelector('.search-box i');

let cart = [];

// Fetch cart
async function fetchCart() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        cart = data;
        renderCart();
        updateCartCount();
        updateCartTotal();
    } catch (err) {
        console.error(err);
    }
}

// Render cart items
function renderCart() {
    cartItemsContainer.innerHTML = '';
    if(cart.length === 0){
        cartItemsContainer.innerHTML = '<p style="text-align:center;">Your cart is empty.</p>';
        cartTotalEl.textContent = '0.00';
        return;
    }
    cart.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src="${item.REALNIKE123_img}" alt="${item.REALNIKE123_name}">
            <div class="cart-item-details">
                <span class="cart-item-name">${item.REALNIKE123_name}</span>
                <span class="price">$${item.REALNIKE123_price}</span>
            </div>
            <div class="cart-item-controls">
                <button onclick="removeFromCart(${item.id})">Delete</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });
    updateCartTotal();
}

// Update cart count
function updateCartCount() { cartCount.textContent = cart.length; }

// Update total price
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.REALNIKE123_price, 0);
    cartTotalEl.textContent = total.toFixed(2);
}

// Remove item
async function removeFromCart(id) {
    try {
        await fetch(`${apiURL}/${id}`, { method:'DELETE' });
        cart = cart.filter(item => item.id != id);
        renderCart();
        updateCartCount();
    } catch(err) { console.error(err); }
}

// Buy Now
buyNowBtn.addEventListener('click', () => {
    if(cart.length === 0) return alert('Your cart is empty!');
    alert(`Your total is $${cart.reduce((sum, item)=>sum+item.REALNIKE123_price,0).toFixed(2)}. Proceeding to checkout...`);
});

// Search functionality using API
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', e => { if(e.key === 'Enter') handleSearch(); });

async function handleSearch() {
    const searchValue = searchInput.value.trim().toLowerCase();
    if(!searchValue) return alert('Please enter a shoe name!');
    try {
        const res = await fetch(apiURL);
        const products = await res.json();
        const product = products.find(p => p.REALNIKE123_name.toLowerCase() === searchValue);
        if(!product) return alert('Product not found!');
        await addCartItem(product.REALNIKE123_name, product.REALNIKE123_price, product.REALNIKE123_img);
    } catch(err) { console.error(err); alert('Error searching product'); }
}

// Add item helper
async function addCartItem(name, price, img){
    const exists = cart.find(item => item.REALNIKE123_name === name);
    if(exists) return alert('Item already in cart!');
    const res = await fetch(apiURL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ REALNIKE123_name:name, REALNIKE123_price:price, REALNIKE123_img:img }) });
    const newItem = await res.json();
    cart.push(newItem);
    renderCart();
    updateCartCount();
}

// Initialize
fetchCart();
