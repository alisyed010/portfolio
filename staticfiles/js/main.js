// ================= LIVE CLOCK FUNCTIONALITY =================
function initClock() {
    const clockElement = document.getElementById("clock-time");
    
    if (clockElement) {
        function updateClock() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const seconds = String(now.getSeconds()).padStart(2, "0");
            clockElement.textContent = hours + ":" + minutes + ":" + seconds;
        }
        
        updateClock();
        setInterval(updateClock, 1000);
    }
}

// Call init function
initClock();

// ================= DYNAMIC SEARCH FUNCTIONALITY =================
document.addEventListener("DOMContentLoaded", function() {
    const searchBox = document.querySelector(".search-box");
    
    if (!searchBox) {
        console.log("Search box not found");
        return;
    }

    // Define searchable content
    const searchableContent = [
        // Navigation items
        { title: "Home", category: "Navigation", url: "/" },
        { title: "About", category: "Navigation", url: "/about/" },
        { title: "Projects", category: "Navigation", url: "/projects/" },
        { title: "Tools", category: "Navigation", url: "/tools/" },
        { title: "Contact", category: "Navigation", url: "/contact/" },

        // About section
        { title: "Python & Django Developer", category: "About", keywords: "backend developer django" },
        { title: "Backend Engineer", category: "About", keywords: "backend systems apis" },
        { title: "Scalable Systems", category: "About", keywords: "scalable backend systems" },
        { title: "REST APIs", category: "About", keywords: "rest api development" },
        { title: "Distributed Systems", category: "About", keywords: "distributed systems" },

        // Skills/Tools (Add based on your actual tools)
        { title: "Python", category: "Skills", keywords: "programming language" },
        { title: "Django", category: "Skills", keywords: "web framework" },
        { title: "REST API", category: "Skills", keywords: "api development" },
        { title: "Database Design", category: "Skills", keywords: "sql database" },
        { title: "System Design", category: "Skills", keywords: "architecture design" },
        { title: "PostgreSQL", category: "Skills", keywords: "database" },
        { title: "Docker", category: "Skills", keywords: "containerization" },
        { title: "Git", category: "Skills", keywords: "version control" },

        // Projects (Add your actual projects)
        { title: "Portfolio Website", category: "Projects", keywords: "django frontend backend" },
        { title: "E-commerce Platform", category: "Projects", keywords: "django rest api" },
        { title: "Task Management App", category: "Projects", keywords: "django database" },

        // Contact
        { title: "Get in Touch", category: "Contact", keywords: "contact email message" },
        { title: "Send Email", category: "Contact", keywords: "contact form" },
    ];

    // Create search results container
    let searchResultsContainer = document.querySelector(".search-results");
    if (!searchResultsContainer) {
        searchResultsContainer = document.createElement("div");
        searchResultsContainer.className = "search-results";
        searchBox.parentElement.appendChild(searchResultsContainer);
    }

    // Search function
    function performSearch(query) {
        if (query.length === 0) {
            searchResultsContainer.innerHTML = "";
            searchResultsContainer.style.display = "none";
            return;
        }

        const lowerQuery = query.toLowerCase();
        const results = searchableContent.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(lowerQuery);
            const categoryMatch = item.category.toLowerCase().includes(lowerQuery);
            const keywordsMatch = item.keywords && item.keywords.toLowerCase().includes(lowerQuery);
            return titleMatch || categoryMatch || keywordsMatch;
        });

        displaySearchResults(results, query);
    }

    // Display search results
    function displaySearchResults(results, query) {
        if (results.length === 0) {
            searchResultsContainer.innerHTML = `
                <div class="search-result-item no-results">
                    <p>No results found for "${query}"</p>
                </div>
            `;
            searchResultsContainer.style.display = "block";
            return;
        }

        let html = "";
        results.slice(0, 8).forEach(item => {
            const icon = getCategoryIcon(item.category);
            html += `
                <div class="search-result-item" ${item.url ? `onclick="window.location.href='${item.url}'"` : ""}>
                    <span class="result-icon">${icon}</span>
                    <div class="result-content">
                        <div class="result-title">${highlightQuery(item.title, query)}</div>
                        <div class="result-category">${item.category}</div>
                    </div>
                </div>
            `;
        });

        if (results.length > 8) {
            html += `<div class="search-result-item view-more">View ${results.length - 8} more results</div>`;
        }

        searchResultsContainer.innerHTML = html;
        searchResultsContainer.style.display = "block";
    }

    // Highlight matching text
    function highlightQuery(text, query) {
        const regex = new RegExp(`(${query})`, "gi");
        return text.replace(regex, "<strong>$1</strong>");
    }

    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            "Navigation": "🏠",
            "About": "👤",
            "Skills": "⚙️",
            "Projects": "📁",
            "Contact": "💌",
        };
        return icons[category] || "🔍";
    }

    // Search input event listener
    searchBox.addEventListener("input", function(e) {
        performSearch(e.target.value);
    });

    // Close search results when clicking outside
    document.addEventListener("click", function(e) {
        if (!e.target.closest(".search-box") && !e.target.closest(".search-results")) {
            searchResultsContainer.style.display = "none";
        }
    });

    // Allow opening search results again on focus
    searchBox.addEventListener("focus", function() {
        if (this.value.length > 0) {
            performSearch(this.value);
        }
    });
});

// ================= HAMBURGER MENU TOGGLE =================
document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobileNav");
    const navItems = document.querySelectorAll(".mobile-nav .nav-item");

    if (hamburger) {
        hamburger.addEventListener("click", function() {
            console.log("Hamburger clicked");
            mobileNav.classList.toggle("active");
        });

        navItems.forEach(item => {
            item.addEventListener("click", function() {
                mobileNav.classList.remove("active");
                console.log("Mobile nav item clicked, closing menu");
            });
        });
    }

    document.addEventListener("click", function(e) {
        if (hamburger && !hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
            mobileNav.classList.remove("active");
        }
    });
});

// ================= THEME TOGGLE FUNCTIONALITY =================
document.addEventListener("DOMContentLoaded", function() {
    console.log("=== THEME TOGGLE INITIALIZED ===");
    
    const toggle = document.getElementById("switch");
    
    if (!toggle) {
        console.error("ERROR: Toggle element not found!");
        return;
    }

    console.log("Toggle element found:", toggle);

    function setTheme(lightMode) {
        console.log(">>> SETTING THEME: Light Mode =", lightMode);
        
        if (lightMode) {
            document.body.classList.add("light");
            toggle.checked = true;
            console.log("✓ Added 'light' class to body");
        } else {
            document.body.classList.remove("light");
            toggle.checked = false;
            console.log("✓ Removed 'light' class from body");
        }
    }

    try {
        const saved = localStorage.getItem("theme");
        console.log("Saved theme:", saved);
        if (saved === "light") {
            setTheme(true);
        } else {
            setTheme(false);
        }
    } catch (e) {
        console.log("localStorage unavailable, using dark mode");
        setTheme(false);
    }

    toggle.addEventListener("change", function() {
        console.log("CHANGE EVENT FIRED! Checkbox.checked =", toggle.checked);
        setTheme(toggle.checked);
        
        try {
            localStorage.setItem("theme", toggle.checked ? "light" : "dark");
            console.log("Saved theme to localStorage");
        } catch (e) {
            console.log("Could not save to localStorage:", e);
        }
    });

    console.log("=== THEME TOGGLE SETUP COMPLETE ===");
});

// ================= NAVIGATION ACTIVE STATE =================
document.addEventListener("DOMContentLoaded", function() {
    const desktopNavItems = document.querySelectorAll(".nav-center .nav-item");
    const mobileNavItems = document.querySelectorAll(".mobile-nav .nav-item");
    const currentPath = window.location.pathname;

    console.log("Current path:", currentPath);
    
    desktopNavItems.forEach(item => {
        const href = item.getAttribute("href");
        if (href === currentPath) {
            item.classList.add("active");
            console.log("Desktop nav marked active:", href);
        }
    });

    mobileNavItems.forEach(item => {
        const href = item.getAttribute("href");
        if (href === currentPath) {
            item.classList.add("active");
            console.log("Mobile nav marked active:", href);
        }
    });
});