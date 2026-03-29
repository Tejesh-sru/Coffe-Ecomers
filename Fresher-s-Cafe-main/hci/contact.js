// Get the form and confirmation message elements
const form = document.getElementById('contact-form');
const confirmationMessage = document.getElementById('confirmation-message');

// Add an event listener for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Show the confirmation message
    confirmationMessage.style.display = 'block';

    // Optionally, reset the form fields
    form.reset();
});
