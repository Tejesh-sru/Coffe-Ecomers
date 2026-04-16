// Initialize cart from local storage or set it to an empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to add a product to the cart
function addToCart(productName, productPrice) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(product => product.name === productName);

    if (existingProduct) {
        // If it exists, increase the quantity
        existingProduct.quantity += 1;
    } else {
        // Otherwise, add a new product with quantity 1
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    // Save updated cart to local storage
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${productName} added to cart!`);
}

// Attach event listeners to "Add to Cart" buttons on the product page
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const productElement = event.target.closest('.product');
        const productName = productElement.querySelector('h3').textContent;
        const productPrice = parseFloat(productElement.querySelector('p').textContent.replace('$', ''));
        addToCart(productName, productPrice);
    });
});

// Function to load and display cart items on the cart page
function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTable = document.getElementById('cart-items');
    let total = 0;

    // Clear existing items in the table
    cartTable.innerHTML = '';

    // Loop through cart items and create table rows for each item
    cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${index})">Remove</button></td>
        `;
        cartTable.appendChild(row);
    });

    // Update the total price in the UI
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Function to remove an item from the cart
function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item by index
    if (cartItems.length > 0) {
        cartItems.splice(index, 1);
        // Update local storage and reload the cart
        localStorage.setItem('cart', JSON.stringify(cartItems));
        loadCart();
    } else {
        alert('Cart is already empty.');
    }
}

// Function to handle checkout (clear the cart)
function checkout() {
    if (confirm('Are you sure you want to checkout?')) {
        // Clear cart in local storage
        localStorage.removeItem('cart');

        // Reload the cart to show it’s empty
        loadCart();
        alert('Thank you for your purchase!');
    }
}

// Load cart items when the cart page loads
document.addEventListener('DOMContentLoaded', loadCart);

// Attach event listener to the checkout button
const checkoutButton = document.getElementById('checkout-btn');
if (checkoutButton) {
    checkoutButton.addEventListener('click', checkout);
}
