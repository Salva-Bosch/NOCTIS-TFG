document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.getElementById('navItems');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu visibility
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navItems.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navItems.classList.remove('active');
        });
    });
});
