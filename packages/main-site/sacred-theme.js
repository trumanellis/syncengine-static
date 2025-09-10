// Synchronicity Engine Sacred Theme JavaScript
// Shared interactions and animations for all pages

// Centralized Navigation Structure
function createNavigation() {
    const navHTML = `
        <div class="nav-container">
            <a href="/" class="nav-logo">Synchronicity Engine</a>
            <ul class="nav-links">
                <li><a href="/" class="nav-link">Home</a></li>
                <li><a href="/philosophy" class="nav-link">Philosophy</a></li>
                <li><a href="/temples" class="nav-link">Temples</a></li>
                <li><a href="/agua-lila" class="nav-link">Água Lila</a></li>
                <li><a href="/tractor" class="nav-link">Support</a></li>
            </ul>
        </div>
    `;
    
    // Find nav element and inject centralized structure
    const nav = document.querySelector('nav.nav');
    if (nav && nav.children.length === 0) {
        nav.innerHTML = navHTML;
        
        // Set active state based on current page
        const currentPath = window.location.pathname;
        const navLinks = nav.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
                link.classList.add('active');
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