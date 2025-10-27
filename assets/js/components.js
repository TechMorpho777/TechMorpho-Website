// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS - NAVIGATION & FOOTER
//  Update navbar and footer here - changes appear on ALL pages!
// ═══════════════════════════════════════════════════════════════

// ┌────────────────────────────────────────────────────────────┐
// │  NAVIGATION BAR                                             │
// │  Edit this once, appears on all pages                      │
// └────────────────────────────────────────────────────────────┘
const navigationHTML = `
    <nav class="navbar" id="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <!-- LOGO: Company Logo Image -->
                <a href="index.html" class="logo">
                    <img src="assets/images/logo/techmorpho.png" alt="TechMorpho IT Solutions Logo" class="logo-image">
                </a>
                
                <!-- NAVIGATION LINKS -->
                <div class="nav-menu" id="navMenu">
                    <a href="index.html" class="nav-link" data-page="index">Home</a>
                    <a href="services.html" class="nav-link" data-page="services">Services</a>
                    <!-- <a href="portfolio.html" class="nav-link" data-page="portfolio">Portfolio</a> -->
                    <a href="about.html" class="nav-link" data-page="about">About</a>
                    <a href="contact.html" class="nav-link" data-page="contact">Contact</a>
                </div>
                
                <!-- MOBILE MENU BUTTON -->
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </div>
    </nav>
`;

// ┌────────────────────────────────────────────────────────────┐
// │  FOOTER                                                     │
// │  Edit this once, appears on all pages                      │
// └────────────────────────────────────────────────────────────┘
const footerHTML = `
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Company Info -->
                <div class="footer-col">
                    <a href="index.html" class="footer-logo">
                        <img src="assets/images/logo/techmorpho.png" alt="TechMorpho IT Solutions" class="footer-logo-img">
                    </a>
                    <p class="footer-description">
                        Transforming businesses through innovative IT solutions and digital excellence.
                    </p>
                </div>
                
                <!-- Services Links -->
                <div class="footer-col">
                    <h4 class="footer-title">Services</h4>
                    <ul class="footer-links">
                        <li><a href="services.html">Website Development</a></li>
                        <li><a href="services.html">Web Applications</a></li>
                        <li><a href="services.html">Digital Marketing</a></li>
                        <li><a href="services.html">Graphic Design</a></li>
                    </ul>
                </div>
                
                <!-- Company Links -->
                <div class="footer-col">
                    <h4 class="footer-title">Company</h4>
                    <ul class="footer-links">
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="services.html">Our Services</a></li>
                        <!-- <li><a href="portfolio.html">Portfolio</a></li> -->
                        <li><a href="contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <!-- Social Media - UPDATE WITH YOUR LINKS -->
                <div class="footer-col">
                    <h4 class="footer-title">Connect</h4>
                    <div class="social-links">
                        <a href="#" class="social-link" aria-label="Facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" aria-label="Instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Copyright -->
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} TechMorpho IT Solutions. All rights reserved.</p>
                <div class="footer-bottom-links">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
`;

// ═══════════════════════════════════════════════════════════════
//  INSERT COMPONENTS INTO PAGE
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    // Insert Navigation at the top of body
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        navPlaceholder.innerHTML = navigationHTML;
    }
    
    // Insert Footer at the bottom
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        footerPlaceholder.innerHTML = footerHTML;
    }
    
    // Set active page in navigation
    setActivePage();
    
    // Initialize mobile menu (after navbar is inserted)
    initializeMobileMenu();
});

// ═══════════════════════════════════════════════════════════════
//  AUTOMATICALLY HIGHLIGHT CURRENT PAGE
// ═══════════════════════════════════════════════════════════════
function setActivePage() {
    // Get current page name
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    
    // Find and activate the correct nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ═══════════════════════════════════════════════════════════════
//  MOBILE MENU FUNCTIONALITY
// ═══════════════════════════════════════════════════════════════
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn && navMenu) {
        // Toggle menu on button click
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// ═══════════════════════════════════════════════════════════════
//  NAVBAR SCROLL EFFECT
// ═══════════════════════════════════════════════════════════════
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

