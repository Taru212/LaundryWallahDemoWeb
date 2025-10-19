 // Simple Cart Management System
let cart = [];
let cartCounter = 0;

// Wait for page to load completely
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing cart system...');
    initializeCart();
    setupAddButtons();
    setupForm();
});

// Initialize cart display
function initializeCart() {
    updateCartDisplay();
    disableForm();
}

// Setup all "Add Item" buttons and create "Remove Item" buttons
function setupAddButtons() {
    // Get all add buttons
    const addButtons = document.querySelectorAll('.st');
    console.log('Found', addButtons.length, 'add buttons');
    
    addButtons.forEach((button, index) => {
        // Create remove button for each add button
        createRemoveButton(button);
        
        button.addEventListener('click', function() {
            console.log('Add button clicked:', index);
            
            // Find the parent service item
            const serviceRow = button.closest('.sss');
            
            // Extract service name - get the first div inside .info
            const serviceNameElement = serviceRow.querySelector('.info > div');
            const serviceName = serviceNameElement.textContent.trim();
            
            // Extract price - get text from .price element
            const priceElement = serviceRow.querySelector('.price');
            const priceText = priceElement.textContent.trim();
            const servicePrice = parseFloat(priceText.replace('₹', '').replace(',', '').trim());
            
            console.log('Adding to cart:', serviceName, servicePrice);
            addToCart(serviceName, servicePrice);
        });
    });
}

// Create remove button next to add button
function createRemoveButton(addButton) {
    // Create remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'st-remove';
    removeButton.innerHTML = 'Remove Item <ion-icon class="plus" name="remove-circle-outline"></ion-icon>';
    
    // Style the remove button (same as add button but different colors)
    removeButton.style.background = '#ffe9ebff';
    removeButton.style.color = 'red';
    removeButton.style.border = 'none';
    removeButton.style.padding = '10px 20px';
    removeButton.style.borderRadius = '10px';
    removeButton.style.cursor = 'pointer';
    removeButton.style.fontWeight = '100%';
    removeButton.style.display = 'none'; // Initially hidden
    
    // Insert remove button after add button
    addButton.parentNode.insertBefore(removeButton, addButton.nextSibling);
    
    // Add click event to remove button
    removeButton.addEventListener('click', function() {
        console.log('Remove button clicked');
        
        // Find the parent service item
        const serviceRow = removeButton.closest('.sss');
        
        // Extract service name
        const serviceNameElement = serviceRow.querySelector('.info > div');
        const serviceName = serviceNameElement.textContent.trim();
        
        console.log('Removing from cart:', serviceName);
        removeFromServicesList(serviceName);
    });
}

// Add item to cart
function addToCart(serviceName, price) {
    // Check if item already exists
    const existingItem = cart.find(item => item.name === serviceName);
    
    if (existingItem) {
        showMessage('Item already in cart!', 'warning');
        return;
    }
    
    // Add to cart
    cartCounter++;
    const newItem = {
        id: cartCounter,
        name: serviceName,
        price: price
    };
    
    cart.push(newItem);
    console.log('Cart updated:', cart);
    
    updateCartDisplay();
    updateButtonsVisibility();
    showMessage('Item added to cart!', 'success');
}

// Remove item from cart using service name
function removeFromServicesList(serviceName) {
    const itemIndex = cart.findIndex(item => item.name === serviceName);
    
    if (itemIndex === -1) {
        showMessage('Item not found in cart!', 'warning');
        return;
    }
    
    cart.splice(itemIndex, 1);
    console.log('Item removed, cart:', cart);
    
    updateCartDisplay();
    updateButtonsVisibility();
    showMessage('Item removed from cart!', 'info');
}

// Update button visibility based on cart contents
function updateButtonsVisibility() {
    const addButtons = document.querySelectorAll('.st');
    const removeButtons = document.querySelectorAll('.st-remove');
    
    addButtons.forEach((addButton, index) => {
        const removeButton = removeButtons[index];
        const serviceRow = addButton.closest('.sss');
        const serviceNameElement = serviceRow.querySelector('.info > div');
        const serviceName = serviceNameElement.textContent.trim();
        
        // Check if this service is in cart
        const isInCart = cart.some(item => item.name === serviceName);
        
        if (isInCart) {
            addButton.style.display = 'none';
            removeButton.style.display = 'inline-block';
        } else {
            addButton.style.display = 'inline-block';
            removeButton.style.display = 'none';
        }
    });
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    console.log('Item removed, cart:', cart);
    updateCartDisplay();
    showMessage('Item removed from cart!', 'info');
}

// Update cart display
function updateCartDisplay() {
    const cartList = document.getElementById('cart-list');
    const cartEmpty = document.getElementById('cart-empty');
    const totalPrice = document.getElementById('price');
    
    if (cart.length === 0) {
        // Show empty cart message
        cartEmpty.style.display = 'block';
        cartList.innerHTML = '';
        totalPrice.textContent = '₹ 0.00';
        disableForm();
    } else {
        // Hide empty message and show cart items
        cartEmpty.style.display = 'none';
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price;
            cartHTML += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <div style="display: flex; align-items: center;">
                        <span style="width: 30px;">${index + 1}</span>
                        <span>${item.name}</span>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <span style="color: #016dd2; font-weight: bold;">₹ ${item.price.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        cartList.innerHTML = cartHTML;
        totalPrice.textContent = `₹ ${total.toFixed(2)}`;
        enableForm();
    }
}

// Disable form when cart is empty
function disableForm() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input');
    const button = document.getElementById('order-btn');
    
    inputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.6';
    });
    
    button.disabled = true;
    button.style.opacity = '0.6';
    button.style.backgroundColor = '#ccc';
    button.textContent = 'Add items to cart first';
}

// Enable form when cart has items
function enableForm() {
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input');
    const button = document.getElementById('order-btn');
    
    inputs.forEach(input => {
        input.disabled = false;
        input.style.opacity = '1';
    });
    
    button.disabled = false;
    button.style.opacity = '1';
    button.style.backgroundColor = '#016dd2';
    button.textContent = 'Book Now';
}

// Setup form submission
function setupForm() {
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleBooking();
    });
}

// Handle booking submission
function handleBooking() {
    console.log('Booking submitted');
    
    // Check if cart is empty
    if (cart.length === 0) {
        showMessage('Please add items to cart first!', 'error');
        return;
    }
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validate form
    if (!name || !phone || !email) {
        showMessage('Please fill in all fields!', 'error');
        return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email!', 'error');
        return;
    }
    
    // Validate phone (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        showMessage('Please enter a valid 10-digit phone number!', 'error');
        return;
    }
    
    // Prepare email data
    const emailData = prepareEmailData(name, phone, email);
    
    // Send email
    sendEmail(emailData);
}

// Prepare email data
function prepareEmailData(name, phone, email) {
    let servicesList = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        servicesList += `${index + 1}. ${item.name} - ₹${item.price.toFixed(2)}\n`;
        total += item.price;
    });
    
    return {
        customer_name: name,
        customer_phone: phone,
        customer_email: email,
        services_booked: servicesList,
        total_amount: `₹${total.toFixed(2)}`,
        booking_date: new Date().toLocaleDateString(),
        booking_time: new Date().toLocaleTimeString()
    };
}
    
// Send two emails: one to admin and one to customer
function sendEmail(emailData) {
    const button = document.getElementById('order-btn');

    // Show loading
    button.textContent = 'Sending...';
    button.disabled = true;

    // Your EmailJS service ID and templates
    const serviceID = 'service_q85ijzb';   // keep your existing service ID
    const adminTemplateID = 'template_eytjg7l'; // admin email template (you already have)
    const customerTemplateID = 'template_e19b3yc'; // new customer confirmation template

    // Add your admin email manually so EmailJS sends to you
    const adminEmailData = {
        ...emailData,
        to_email: 'yourEmail@example.com' // Replace with your own email ID
    };

    // Send to Admin first
    emailjs.send(serviceID, adminTemplateID, adminEmailData)
        .then(function(response) {
            console.log('Admin email sent successfully!', response);

            // Now send confirmation to Customer
            return emailjs.send(serviceID, customerTemplateID, emailData);
        })
        .then(function(response) {
            console.log('Customer confirmation email sent successfully!', response);

            // Show success message
            showMessage(
                '<span style="display: inline-flex; align-items: center; gap: 6px;">' +
                '<ion-icon name="checkmark-circle-outline" style="font-size: 18px; vertical-align: middle; color: green;"></ion-icon>' +
                '<span>Order placed successfully! Confirmation email sent.</span>' +
                '</span>',
                'success'
            );

            resetForm();
        })
        .catch(function(error) {
            console.error('Email failed to send:', error);
            showMessage('Failed to send email. Please try again or contact support.', 'error');
            button.textContent = 'Book Now';
            button.disabled = false;
        });
}


// Reset form and cart after successful booking
function resetForm() {
    // Clear cart
    cart = [];
    cartCounter = 0;
    
    // Reset form
    document.getElementById('checkout-form').reset();
    
    // Update display
    updateCartDisplay(); // This updates cart HTML and total price
    updateButtonsVisibility(); // This ensures add/remove buttons reset properly
    
    setTimeout(() => {
        showMessage(    '<span style="display: inline-flex; align-items: center; gap: 6px;">' +
      '<ion-icon name="alert-circle-outline" style="font-size: 18px; vertical-align: middle; color: green;"></ion-icon>' +
      '<span>Email has been sent successfully!</span>' +
    '</span>',
    'success');
    }, 1000);
}


// Show messages
function showMessage(message, type) {
    const msgDiv = document.getElementById('msg');
    
    const colors = {
        success: '#d4edda',
        error: '#f8d7da',
        warning: '#fff3cd',
        info: '#d1ecf1'
    };
    
    const textColors = {
        success: '#155724',
        error: '#721c24',
        warning: '#856404',
        info: '#0c5460'
    };
    
    msgDiv.innerHTML = `
        <div style="padding: 10px; margin: 10px 0; border-radius: 5px; 
                    background-color: ${colors[type]}; 
                    color: ${textColors[type]}; 
                    border: 1px solid ${colors[type]};">
            ${message}
        </div>
    `;
    
    // Clear message after 3 seconds
    setTimeout(() => {
        msgDiv.innerHTML = '';
    }, 3000);
}

// Make removeFromCart function global so onclick can access it
window.removeFromCart = removeFromCart;

console.log('Cart script loaded successfully!');
