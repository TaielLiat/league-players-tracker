// theme.js

// Get elements
const themeToggleButton = document.getElementById('themeToggle');
const body = document.body;

// Load saved theme preference and apply it
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Modo Claro';
    } else {
        themeToggleButton.textContent = 'Modo Oscuro';
    }
});

// Toggle between dark mode and light mode
themeToggleButton.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        themeToggleButton.textContent = 'Modo Oscuro';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Modo Claro';
        localStorage.setItem('theme', 'dark');
    }
});