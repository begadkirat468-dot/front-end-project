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
