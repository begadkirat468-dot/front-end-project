document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('card-details');
    const cashMessage = document.getElementById('cash-message');
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');

    // Load and display cart items
    function loadCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        orderItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            orderItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>';
            updateTotals(0);
            return;
        }

        let subtotal = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">$${item.price.toFixed(2)} each</div>
                </div>
                <div class="item-quantity">Qty: ${item.quantity}</div>
                <div class="item-total">$${itemTotal.toFixed(2)}</div>
                <button class="remove-btn" data-index="${index}">×</button>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Add event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemFromCart(index);
            });
        });

        updateTotals(subtotal);
    }

    // Function to remove item from cart
    function removeItemFromCart(index) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems(); // Reload the cart items to update the display
        }
    }

    // Update totals including tax
    function updateTotals(subtotal) {
        const tax = subtotal * 0.10; // 10% tax
        const total = subtotal + tax;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    // Handle payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.classList.remove('hidden');
                cashMessage.classList.add('hidden');
            } else {
                cardDetails.classList.add('hidden');
                cashMessage.classList.remove('hidden');
            }
        });
    });

    // Form submission handler
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if cart is empty
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty. Please add items before checking out.');
            return;
        }

        // Basic validation
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').value;

        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields.');
            return;
        }

        if (selectedPayment === 'card') {
            const cardNumber = document.getElementById('cardNumber').value.trim();
            const expiryDate = document.getElementById('expiryDate').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            if (!cardNumber || !expiryDate || !cvv) {
                alert('Please fill in all card details.');
                return;
            }
        }

        // Simulate form submission and clear cart
        alert('Order placed successfully! Thank you for your purchase.');
        localStorage.removeItem('cart'); // Clear cart after successful order
        window.location.href = 'index.html'; // Redirect to main page
    });

    // Input formatting for card fields
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ');
            if (formattedValue) {
                e.target.value = formattedValue;
            }
        });
    }

    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
        });
    }

    // Load cart items when page loads
    loadCartItems();
});
