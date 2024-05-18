document.addEventListener('DOMContentLoaded', function () {
    const navButton = document.querySelector('.nav-hamburger');
    const navUl = document.querySelector('nav ul');

    // Function to toggle the navigation menu
    // Only toggles the menu if the screen width is less than 550px
    function toggleMenu() {
        if (window.innerWidth < 550) {
            navUl.classList.toggle('show');
        }
    }

    // Attach event listener to navButton for click events
    navButton.addEventListener('click', toggleMenu);

    // Function to handle the window resize event
    function handleResize() {
        if (window.innerWidth >= 550) {
            // Ensures the menu is not in the 'show' state when the screen is wide
            navUl.classList.remove('show');
        }
    }

    // Attach event listener to window for resize events
    window.addEventListener('resize', handleResize);
});
