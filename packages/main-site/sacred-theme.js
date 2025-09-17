// Synchronicity Engine Sacred Theme JavaScript
// Shared interactions and animations for all pages

// Enhanced Navigation Structure with Error Handling
function createNavigation() {
    try {
        const nav = document.querySelector('nav.nav, #main-nav');
        if (!nav) {
            console.warn('Navigation element not found');
            return;
        }

        // Create the complete navigation structure
        const navContainer = document.createElement('div');
        navContainer.className = 'nav-container';

        const navElement = document.createElement('nav');
        navElement.className = 'nav';
        navElement.setAttribute('role', 'navigation');
        navElement.setAttribute('aria-label', 'Main navigation');

        navElement.innerHTML = `
            <a href="index.html" class="logo" aria-label="Synchronicity Engine Homepage">
                <img src="../../images/logo-triquetra.png" alt="Synchronicity Engine - Triquetra Logo" class="logo-image" width="32" height="32">
                Synchronicity Engine
            </a>
            <ul class="nav-links" role="menubar">
                <li role="none"><a href="index.html" role="menuitem">Home</a></li>
                <li role="none"><a href="eden-game.html" role="menuitem">Eden Game</a></li>
                <li role="none"><a href="temples.html" role="menuitem">Temples</a></li>
                <li role="none"><a href="agua-lila.html" role="menuitem">Água Lila</a></li>
                <li role="none"><a href="tractor.html" role="menuitem">Support</a></li>
            </ul>
            <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false" aria-controls="mobile-menu">
                <span aria-hidden="true">☰</span>
            </button>
        `;

        navContainer.appendChild(navElement);

        // Replace the existing nav with our complete structure
        nav.parentNode.replaceChild(navContainer, nav);

    // Set active state based on current page
    const currentPath = window.location.pathname;
    const navLinks = navContainer.querySelectorAll('ul.nav-links a');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath ||
            (currentPath === '/' && linkPath === '/') ||
            (currentPath.includes('tractor') && linkPath.includes('tractor'))) {
            link.parentElement.classList.add('active');
        }
    });

        // Enhanced mobile menu toggle functionality
        const mobileToggle = navContainer.querySelector('.mobile-menu-toggle');
        const navLinksContainer = navContainer.querySelector('.nav-links');

        if (mobileToggle && navLinksContainer) {
            // Set up ARIA attributes
            navLinksContainer.id = 'mobile-menu';

            mobileToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const isOpen = navLinksContainer.classList.contains('mobile-active');
                navLinksContainer.classList.toggle('mobile-active');
                mobileToggle.classList.toggle('active');

                // Update ARIA attributes
                mobileToggle.setAttribute('aria-expanded', (!isOpen).toString());

                // Focus management for accessibility
                if (!isOpen) {
                    const firstLink = navLinksContainer.querySelector('a');
                    firstLink?.focus();
                }
            });

            // Enhanced keyboard navigation
            mobileToggle.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    mobileToggle.click();
                }
            });

            // Close mobile menu when clicking on a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navLinksContainer.classList.remove('mobile-active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close mobile menu when clicking outside or pressing Escape
            document.addEventListener('click', function(event) {
                if (!navContainer.contains(event.target) && navLinksContainer.classList.contains('mobile-active')) {
                    closeMobileMenu();
                }
            });

            document.addEventListener('keydown', function(event) {
                if (event.key === 'Escape' && navLinksContainer.classList.contains('mobile-active')) {
                    closeMobileMenu();
                    mobileToggle.focus();
                }
            });

            function closeMobileMenu() {
                navLinksContainer.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        }
    } catch (error) {
        console.error('Error creating navigation:', error);
        // Fallback: ensure basic navigation still works
        const fallbackNav = document.querySelector('nav.nav, #main-nav');
        if (fallbackNav && !fallbackNav.innerHTML.trim()) {
            fallbackNav.innerHTML = '<p>Navigation temporarily unavailable</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize centralized navigation
        createNavigation();

        // Navigation scroll effects
        const nav = document.querySelector('.nav');

        if (nav) {
            let ticking = false;
            function updateNavOnScroll() {
                if (window.scrollY > 100) {
                    nav.classList.add('scrolled');
                } else {
                    nav.classList.remove('scrolled');
                }
                ticking = false;
            }

            window.addEventListener('scroll', function() {
                if (!ticking) {
                    requestAnimationFrame(updateNavOnScroll);
                    ticking = true;
                }
            });
        }

        // Enhanced Intersection Observer for animations and lazy loading
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        // Animation observer
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Lazy loading observer for images
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;

                    // Replace data-src with src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    // Add loading class for fade-in effect
                    img.classList.add('loading');

                    img.onload = function() {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };

                    img.onerror = function() {
                        console.warn('Failed to load image:', img.dataset.src || img.src);
                        img.classList.add('error');
                    };

                    lazyImageObserver.unobserve(img);
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .animate-cascade').forEach(el => {
            animationObserver.observe(el);
        });

        // Observe lazy loading images
        document.querySelectorAll('img[data-src], img[loading="lazy"]').forEach(img => {
            lazyImageObserver.observe(img);
        });
    
    // Parallax effect for hero sacred circle
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const sacredCircle = document.querySelector('.sacred-circle');
        if (sacredCircle && scrolled < window.innerHeight) {
            const rate = scrolled * -0.2;
            sacredCircle.style.transform = `translateY(${rate}px) rotate(${scrolled * 0.1}deg)`;
        }
    });
    
    // Initialize blessing particles with random properties
    document.querySelectorAll('.blessing-particle').forEach((particle, index) => {
        particle.style.animationDelay = `-${Math.random() * 20}s`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${20 + Math.random() * 10}s`;
    });
    
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error initializing page functionality:', error);
        // Graceful fallback for critical navigation
        const nav = document.querySelector('nav.nav, #main-nav');
        if (nav && !nav.innerHTML.trim()) {
            nav.innerHTML = '<p>Loading navigation...</p>';
        }
    }
});