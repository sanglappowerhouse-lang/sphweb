/* ============================================
   SANGLAP POWER HOUSE GYM - JAVASCRIPT
   ============================================ */

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const body = document.body;

// ============================================
// MOBILE MENU TOGGLE
// ============================================

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// SMOOTH SCROLLING
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// SCROLL TO CONTACT FUNCTION
// ============================================

function scrollToContact() {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        contactSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function scrollToMentors() {
    const mentorsSection = document.querySelector('#mentors');
    if (mentorsSection) {
        mentorsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// NAVBAR BACKGROUND ON SCROLL
// ============================================

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.95)';
    } else {
        navbar.style.backgroundColor = '';
    }
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections for animation — use class-based approach instead of
// inline opacity:0, which caused Chrome/Android to permanently hide
// sections when the observer threshold wasn't met on tall layouts.
document.querySelectorAll('section').forEach(section => {
    section.classList.add('section-hidden');
    observer.observe(section);
});

// Failsafe: Force all sections visible after 2.5s in case
// IntersectionObserver fails (common on some Android Chrome versions
// with unusual viewport/scroll configurations)
setTimeout(() => {
    document.querySelectorAll('section.section-hidden').forEach(section => {
        section.classList.add('section-visible');
    });
}, 2500);

// ============================================
// 3D INTERACTIVE TILT & GLOW EFFECTS
// ============================================

const interactiveCards = document.querySelectorAll('.pricing-card, .info-card, .trust-badge');

interactiveCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set mouse coordinates for spotlight css gradient
        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);

        if (window.innerWidth > 768) {
            // Calculate tilt angle based on cursor position relative to card center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const tiltY = ((x - centerX) / centerX) * 12; // max 12 deg
            const tiltX = -((y - centerY) / centerY) * 12;

            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
        }
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.removeProperty('--mouse-x');
        this.style.removeProperty('--mouse-y');
    });
});

// Floor card hover (subtle scale)
const floorCards = document.querySelectorAll('.floor-card');
floorCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.filter = 'drop-shadow(0 0 20px rgba(255, 107, 53, 0.3))';
    });
    card.addEventListener('mouseleave', function() {
        this.style.filter = 'drop-shadow(0 0 0px transparent)';
    });
});

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================

function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (event.clientX - button.offsetLeft - radius) + 'px';
    circle.style.top = (event.clientY - button.offsetTop - radius) + 'px';
    circle.classList.add('ripple');

    const ripple = button.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

document.querySelectorAll('.cta-button, .pricing-btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// ============================================
// ACTIVE NAV LINK HIGHLIGHTING
// ============================================

const sections = document.querySelectorAll('section, header');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.style.borderBottomColor = 'var(--color-primary)';
            link.style.color = 'var(--color-primary)';
        } else {
            link.style.borderBottomColor = 'transparent';
            link.style.color = 'var(--color-text)';
        }
    });
});

// ============================================
// COUNTER ANIMATION FOR STATS (IF NEEDED)
// ============================================

const animateValue = (element, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

// ============================================
// FORM SUBMISSION HANDLING (IF FORM ADDED)
// ============================================

const handleFormSubmit = (event) => {
    event.preventDefault();
    // You can add form handling logic here
    // For now, just show a success message
    alert('Thank you for your interest! We will contact you soon.');
    event.target.reset();
};

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ============================================
// TOOLTIP SUPPORT (OPTIONAL)
// ============================================

const tooltipElements = document.querySelectorAll('[data-tooltip]');
tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltipText = this.getAttribute('data-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        document.body.appendChild(tooltip);

        const rect = this.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
        tooltip.style.zIndex = '10000';
    });

    element.addEventListener('mouseleave', function() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) tooltip.remove();
    });
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================

window.addEventListener('load', () => {
    body.classList.add('loaded');
});

// ============================================
// PRINT STYLES (OPTIONAL)
// ============================================

window.addEventListener('beforeprint', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'none';
});

window.addEventListener('afterprint', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) navbar.style.display = 'block';
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ============================================
// ACCESSIBILITY IMPROVEMENTS
// ============================================

// Add focus visible styles for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// ============================================
// SOCIAL MEDIA LINK HANDLING
// ============================================

document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});

// ============================================
// CONTACT BUTTON INTERACTIVITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const phoneLink = document.querySelector('a[href^="tel:"]');
    if (phoneLink) {
        phoneLink.addEventListener('click', (e) => {
            // Add analytics or tracking here if needed
            console.log('Phone link clicked: ', phoneLink.href);
        });
    }

    const instagramLink = document.querySelector('a[href*="instagram.com"]');
    if (instagramLink) {
        instagramLink.addEventListener('click', (e) => {
            // Add analytics or tracking here if needed
            console.log('Instagram link clicked');
        });
    }
});

// ============================================
// CUSTOM STYLES FOR KEYBOARD NAVIGATION
// ============================================

const style = document.createElement('style');
style.textContent = `
    body.keyboard-nav a:focus,
    body.keyboard-nav button:focus {
        outline: 3px solid var(--color-primary);
        outline-offset: 2px;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .tooltip {
        background: var(--color-primary);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.85rem;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10000;
    }
`;
document.head.appendChild(style);

// ============================================
// 3D INTERACTIVE TILT EFFECT FOR HERO CARD
// ============================================
const heroSection = document.querySelector('.hero');
const tiltCard = document.querySelector('.hero-dimensional-card');

if (heroSection && tiltCard) {
    heroSection.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate degrees relative to center cursor offset
            const rotateY = ((x - centerX) / centerX) * 20; 
            const rotateX = -((y - centerY) / centerY) * 20;

            // Combine tilt offset with baseline perspective rotation
            tiltCard.style.transform = `rotateY(${rotateY - 10}deg) rotateX(${rotateX + 8}deg) scale(1.03)`;
        }
    });

    heroSection.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) {
            tiltCard.style.transform = `rotateY(-18deg) rotateX(12deg) rotateZ(1deg) scale(1)`;
        }
    });
}

// ============================================
// CONSOLE LOG (DEVELOPMENT)
// ============================================

console.log('%c🏋️ Sanglap Power House Gym Website Loaded Successfully! 🏋️', 
    'color: #FF6B35; font-size: 16px; font-weight: bold;');
console.log('For support, contact: +91 9836336565');
