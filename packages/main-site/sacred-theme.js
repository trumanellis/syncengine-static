// Synchronicity Engine Sacred Theme JavaScript
// Shared interactions and animations for all pages

// Centralized Navigation Structure
function createNavigation() {
    const nav = document.querySelector('nav.nav, #main-nav');
    if (!nav) return;
    
    // Create the complete navigation structure
    const navContainer = document.createElement('div');
    navContainer.className = 'nav-container';
    
    const navElement = document.createElement('nav');
    navElement.className = 'nav';
    
    navElement.innerHTML = `
        <a href="index.html" class="logo">
            <div class="logo-symbol">SE</div>
            Synchronicity Engine
        </a>
        <ul class="nav-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="eden-game.html">Eden Game</a></li>
            <li><a href="temples.html">Temples</a></li>
            <li><a href="agua-lila.html">Água Lila</a></li>
            <li><a href="tractor.html">Support</a></li>
        </ul>
        <button class="mobile-menu-toggle">☰</button>
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

    // Add mobile menu toggle functionality
    const mobileToggle = navContainer.querySelector('.mobile-menu-toggle');
    const navLinksContainer = navContainer.querySelector('.nav-links');

    if (mobileToggle && navLinksContainer) {
        console.log('Mobile menu elements found:', mobileToggle, navLinksContainer);

        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Mobile toggle clicked');
            navLinksContainer.classList.toggle('mobile-active');
            mobileToggle.classList.toggle('active');
            console.log('Mobile active state:', navLinksContainer.classList.contains('mobile-active'));
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navContainer.contains(event.target)) {
                navLinksContainer.classList.remove('mobile-active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize centralized navigation
    createNavigation();
    // Navigation scroll effects
    const nav = document.querySelector('.nav');
    
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
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
});