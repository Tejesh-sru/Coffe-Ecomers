// Get the dropdown menu and button elements
const menuButton = document.getElementById('menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');

// Toggle dropdown menu on button click
menuButton.addEventListener('click', function() {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Close the dropdown if the user clicks outside of it
window.addEventListener('click', function(event) {
    if (!event.target.matches('#menu-btn') && !event.target.closest('.dropdown')) {
        dropdownMenu.style.display = 'none';
    }
});
