import showPopup from './popup.js';

// JavaScript to handle the custom context menu
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();

    const contextMenu = document.getElementById('context-menu-right');
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.pageX}px`;
    contextMenu.style.top = `${e.pageY}px`;

}, false);

// Attach click event listeners to each <p> element inside color-details
document.querySelectorAll('.color-details p').forEach(function(colorOption) {
    colorOption.addEventListener('click', function() {
        const colorValue = this.textContent;
        showPopup("Color Copied", `${colorValue}`);
    });
});

// Hide the context menu when clicking outside
document.addEventListener('click', function() {
    const contextMenu = document.getElementById('context-menu-right');
    contextMenu.style.display = 'none';
});

