// Wait until the entire HTML document has been fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {

  // Get the checkout form element by its ID
  const checkoutForm = document.getElementById('checkout-form');

  // Get all radio input elements for payment methods
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');

  // Get the container that holds the credit/debit card details section
  const cardDetails = document.getElementById('card-details');

  // Get the message element displayed when "cash" payment method is selected
  const cashMessage = document.getElementById('cash-message');

  // Get the container element where the order items will be displayed
  const orderItemsContainer = document.getElementById('order-items');

  // Get the element that displays the subtotal amount
  const subtotalElement = document.getElementById('subtotal');

  // Get the element that displays the tax amount
  const taxElement = document.getElementById('tax');

  // Get the element that displays the total amount
  const totalElement = document.getElementById('total');

  
  // Function: loadCartItems()
  // Purpose: Loads items from localStorage, displays them in the order list,
  // and calculates subtotal, tax, and total.
 
  function loadCartItems() {
    // Retrieve cart data from localStorage or use an empty array if none found
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Clear the container before adding new items
    orderItemsContainer.innerHTML = '';

    // If the cart is empty, display a message and reset totals
    if (cart.length === 0) {
      orderItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
      updateTotals(0); // Set totals to zero
      return; // Exit the function early
    }

    // Initialize subtotal to 0
    let subtotal = 0;

    // Loop through each item in the cart
    cart.forEach(item => {
      // Calculate total price for this item (price × quantity)
      const itemTotal = item.price * item.quantity;

      // Add this item's total to the subtotal
      subtotal += itemTotal;

      // Create a new HTML div element for the order item
      const itemElement = document.createElement('div');

      // Assign a class name to the created div for styling
      itemElement.className = 'order-item';

      // Define the HTML structure for displaying the item details
      itemElement.innerHTML = `
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-price">$${item.price.toFixed(2)} each</div>
        </div>
        <div class="item-quantity">Qty: ${item.quantity}</div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
      `;

      // Append the created item element to the order items container
      orderItemsContainer.appendChild(itemElement);
    });

    // Update subtotal, tax, and total values on the page
    updateTotals(subtotal);
  }

 
  // Function: updateTotals(subtotal)
  // Purpose: Calculates tax and total based on subtotal, and updates display.

  function updateTotals(subtotal) {
    // Calculate tax as 10% of subtotal
    const tax = subtotal * 0.1;

    // Calculate total as subtotal + tax
    const total = subtotal + tax;

    // Update subtotal display with 2 decimal places
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;

    // Update tax display with 2 decimal places
    taxElement.textContent = `$${tax.toFixed(2)}`;

    // Update total display with 2 decimal places
    totalElement.textContent = `$${total.toFixed(2)}`;
  }


  // Add event listeners for payment method selection

  paymentMethods.forEach(method => {
    // When user selects a payment method
    method.addEventListener('change', function() {
      // If the selected method is "card"
      if (this.value === 'card') {
        // Show card details section
        cardDetails.classList.remove('hidden');
        // Hide the cash payment message
        cashMessage.classList.add('hidden');
      } else {
        // Otherwise (if "cash" selected), hide card details
        cardDetails.classList.add('hidden');
        // Show cash payment message
        cashMessage.classList.remove('hidden');
      }
    });
  });


  // Add event listener for form submission

  checkoutForm.addEventListener('submit', function(e) {
    // Prevent the default form submission (page reload)
    e.preventDefault();

    // Get the cart data again from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Get values from form fields and trim extra spaces
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    // Get the selected payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    // Validate required fields (name, phone, address)
    if (!firstName || !lastName || !phone || !address) {
      alert('Please fill in all required fields.'); // Alert user if any field is missing
      return; // Stop form submission
    }

    // If payment method is "card", validate card details
    if (paymentMethod === 'card') {
      // Get and trim card detail inputs
      const cardNumber = document.getElementById('cardNumber').value.trim();
      const expiryDate = document.getElementById('expiryDate').value.trim();
      const cvv = document.getElementById('cvv').value.trim();

      // If any card field is missing, alert the user
      if (!cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details.');
        return;
      }
    }

    // (At this point, form validation passed — next steps like saving order or redirecting can go here)
  });

  
  // Format input fields for card details (card number, expiry, CVV)


  // Get input fields by their IDs
  const cardNumberInput = document.getElementById('cardNumber');
  const expiryDateInput = document.getElementById('expiryDate');
  const cvvInput = document.getElementById('cvv');

  // If card number field exists, format it as "#### #### #### ####"
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', e => {
      // Remove spaces and non-numeric characters
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');

      // Limit input to 16 digits
      if (value.length > 16) value = value.slice(0, 16);

      // Add a space every 4 digits for readability
      e.target.value = value.match(/.{1,4}/g)?.join(' ') || value;
    });
  }

  // If expiry date field exists, format it as "MM/YY"
  if (expiryDateInput) {
    expiryDateInput.addEventListener('input', e => {
      // Remove all non-numeric characters
      let value = e.target.value.replace(/[^0-9]/g, '');

      // Insert a slash after the first two digits
      if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);

      // Update input field with formatted value
      e.target.value = value;
    });
  }

  // If CVV field exists, restrict it to 3 digits only
  if (cvvInput) {
    cvvInput.addEventListener('input', e => {
      // Allow only numbers and limit to 3 characters
      e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 3);
    });
  }

 
  // Initial function call to load items into the checkout page
  
  loadCartItems();
});

