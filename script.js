// ======================== CART DATA ========================

// Load saved cart data from localStorage or create an empty array if none exists
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize total price to 0
let total = 0;

// Define pizza prices for each size and type
const pizzaPrices = {
  margherita: { small: 25, medium: 30, large: 35 },
  pepperoni: { small: 30, medium: 35, large: 40 },
  hawaiian: { small: 28, medium: 33, large: 38 },
  veggie: { small: 26, medium: 31, large: 36 },
  meat: { small: 35, medium: 40, large: 45 },
  bbq: { small: 32, medium: 37, large: 42 },
  supreme: { small: 34, medium: 39, large: 44 },
  buffalo: { small: 31, medium: 36, large: 41 },
  fourcheese: { small: 29, medium: 34, large: 39 },
};

// ======================== HELPERS ========================

// Save the current cart array into localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Show a temporary popup message at the bottom-right corner of the screen
function showPopup(message) {
  // Create a new <div> element for the popup
  const popup = document.createElement('div');
  // Set the popup text
  popup.textContent = message;
  // Apply inline CSS styles to make it look nice
  Object.assign(popup.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    background: '#333',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '8px',
    fontFamily: 'sans-serif',
    fontSize: '14px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    zIndex: 9999,
    opacity: '1',
    transition: 'opacity 0.3s ease',
  });
  // Add the popup to the page
  document.body.appendChild(popup);
  // After 2.5 seconds, fade it out and remove it
  setTimeout(() => {
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 300);
  }, 2500);
}

// ======================== PRICING ========================

// Get the selected pizza size's price based on its ID
function getPrice(pizzaId) {
  const sizeSelect = document.getElementById(`size-${pizzaId}`);
  if (!sizeSelect) return 0; // If no select found, return 0
  const selectedSize = sizeSelect.value; // e.g. 'medium'
  return pizzaPrices[pizzaId][selectedSize]; // Return the price
}

// Get the name of the selected size (e.g., "Medium" instead of the value)
function getSize(pizzaId) {
  const sizeSelect = document.getElementById(`size-${pizzaId}`);
  if (!sizeSelect) return ''; // If not found, return empty string
  const selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
  return selectedOption.text.split(' - ')[0]; // Extract only the size name
}

// Update the displayed price next to the pizza based on selected size
function updatePrice(pizzaId) {
  const price = getPrice(pizzaId); // Get the current price
  const priceEl = document.getElementById(`price-${pizzaId}`); // Find the price element
  if (priceEl) priceEl.textContent = `$${price.toFixed(2)}`; // Update text like "$25.00"
}

// ======================== CART LOGIC ========================

// Add a selected pizza to the cart
function addToCart(baseName, price, size) {
  // Combine pizza name and size (e.g. "Margherita (Medium)")
  const name = `${baseName} (${size})`;
  // Check if the item already exists in the cart
  const existingItem = cart.find((item) => item.name === name && item.price === price);

  // If it exists, increase its quantity; otherwise, add it as a new item
  if (existingItem) existingItem.quantity += 1;
  else cart.push({ name, price: Number(price), quantity: 1 });

  // Save and update cart display
  saveCart();
  updateCart();
  
  // Show confirmation popup
  showPopup(`Added to cart: ${name}`);
}


// Update the cart display in the cart modal
function updateCart() {
  const cartCount = document.getElementById('cart-count'); // Small cart icon number
  const cartItems = document.getElementById('cart-items'); // List of cart items
  const checkoutBtn = document.getElementById('checkout-btn'); // Checkout button
  if (!cartItems) return; // Stop if cart elements not found

  cartItems.innerHTML = ''; // Clear old items
  total = 0; // Reset total

  // If cart is empty, show message and disable checkout
  if (cart.length === 0) {
    cartItems.innerHTML = '<li style="text-align:center; color:#666;">Your cart is empty</li>';
    document.getElementById('total').textContent = '0.00';
    if (checkoutBtn) checkoutBtn.disabled = true;
    if (cartCount) cartCount.textContent = '0';
    return;
  }

  // For each item in the cart, create an <li> element
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity; // Calculate item total
    total += itemTotal; // Add to overall total

    // Create HTML for cart item
    const li = document.createElement('li');
    li.classList.add('cart-item');
    li.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong><br>
        $${item.price.toFixed(2)} each
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
        <span class="qty">${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
        <button class="remove-btn" onclick="removeFromCart(${index})">🗑️</button>
      </div>
    `;
    cartItems.appendChild(li); // Add to list
  });

  // Update total price
  document.getElementById('total').textContent = total.toFixed(2);

  // Update total item count for icon badge
  const totalItems = cart.reduce((sum, it) => sum + it.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;

  // Disable checkout if cart empty
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

  // Save the cart again
  saveCart();
}

// Change the quantity of a specific item (+1 or -1)
function changeQty(index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta; // Add or subtract from quantity
  if (cart[index].quantity <= 0) cart.splice(index, 1); // Remove item if quantity is 0
  saveCart(); // Save new state
  updateCart(); // Refresh display
}

// Remove an item from the cart completely
function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return; // Check valid index
  const removed = cart[index].name; // Save item name for message
  cart.splice(index, 1); // Remove it
  saveCart(); // Save new cart
  updateCart(); // Refresh
  showPopup(`Removed ${removed}`); // Show popup confirmation
}

// ======================== MODALS ========================

// Open the pizza image in a large modal view
function openImageModal(src) {
  document.getElementById('full-image').src = src;
  document.getElementById('image-modal').style.display = 'flex';
}

// Close the image modal
function closeImageModal() {
  document.getElementById('image-modal').style.display = 'none';
}

// Close the shopping cart modal
function closeCart() {
  document.getElementById('cart').style.display = 'none';
}

// ======================== INIT ========================

// When user clicks a "Cart" link, open the cart modal
document.querySelectorAll('a[href="#cart"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    e.preventDefault(); // Stop normal link behavior
    document.getElementById('cart').style.display = 'flex'; // Show the cart
    updateCart(); // Update the cart contents
  });
});

// Run this code once the page finishes loading
document.addEventListener('DOMContentLoaded', () => {
  // Update prices for all pizzas on page load
  Object.keys(pizzaPrices).forEach((key) => {
    if (document.getElementById(`size-${key}`)) updatePrice(key);
  });

  // Update cart from saved data
  updateCart();

  // Handle checkout button click
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      // If there are items in the cart, go to checkout page
      if (cart.length > 0) window.location.href = 'checkout.html';
    });
  }
});
