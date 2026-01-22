// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", function() {
    const toggle = document.getElementById("switch");
    
    if (!toggle) return;

    function setTheme(theme) {
        if (theme === "light") {
            document.body.classList.add("light");
        } else {
            document.body.classList.remove("light");
        }
        toggle.checked = theme === "light";
        localStorage.setItem("theme", theme);
    }

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);

    // Toggle theme on change
    toggle.addEventListener("change", function() {
        const newTheme = toggle.checked ? "light" : "dark";
        setTheme(newTheme);
    });
});

// Navigation Active State
document.addEventListener("DOMContentLoaded", function() {
    const navItems = document.querySelectorAll(".nav-item");
    const currentPath = window.location.pathname;

    navItems.forEach(item => {
        if (item.getAttribute("href") === currentPath) {
            item.classList.add("active");
        }
    });
});