// Consolidate apex host to www (backup when Cloudflare 301 is not yet live)
(function () {
    if (window.location.hostname === 'skyesummithomes.com') {
        window.location.replace(
            'https://www.skyesummithomes.com' +
                window.location.pathname +
                window.location.search +
                window.location.hash
        );
    }
})();

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.footer-bottom p').forEach(function (el) {
        el.innerHTML = el.innerHTML.replace(/&copy;\s*\d{4}|©\s*\d{4}/, '© ' + new Date().getFullYear());
    });

    // Mobile menu functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('mobile-menu-active');
            this.classList.toggle('mobile-menu-open');
            
            // Prevent body scroll when menu is open
            if (!isExpanded) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('mobile-menu-active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!header.contains(e.target) && navMenu.classList.contains('mobile-menu-active')) {
                navMenu.classList.remove('mobile-menu-active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                mobileMenuToggle.classList.remove('mobile-menu-open');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Smooth scrolling for anchor links (only on same page)
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            // If target doesn't exist, let browser handle navigation normally
        });
    });

    // Search functionality
    const searchButton = document.querySelector('.search-bar .btn-primary');
    const searchInput = document.querySelector('.search-input');
    const priceSelect = document.querySelector('.search-select[title="Price Range"]');
    const bedsSelect = document.querySelector('.search-select[title="Bedrooms"]');
    const bathsSelect = document.querySelector('.search-select[title="Bathrooms"]');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value;
            const priceRange = priceSelect.value;
            const beds = bedsSelect.value;
            const baths = bathsSelect.value;
            if (typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost') {
                console.log('Search:', { keywords: searchTerm, priceRange: priceRange, beds: beds, baths: baths });
            }
            alert('Search functionality will be implemented with backend integration.');
        });
    }

    // Property card hover effects
    const propertyCards = document.querySelectorAll('.property-card');
    
    propertyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Blog card hover effects
    const blogCards = document.querySelectorAll('.blog-card');
    
    blogCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Header scroll effect with performance optimization
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeader() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        // Add shadow on scroll
        if (scrollTop > 50) {
            header.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // Contact form simulation
    const contactLinks = document.querySelectorAll('a[href="#contact"]');
    
    contactLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // If it's a contact link, show a contact form modal
            if (this.getAttribute('href') === '#contact') {
                e.preventDefault();
                showContactModal();
            }
        });
    });

    // Initialize any additional features
    initializeAnimations();
    
    // Back to top button functionality
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, { passive: true });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // FAQ Accordion functionality
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = document.getElementById(this.getAttribute('aria-controls'));
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    const otherAnswer = document.getElementById(q.getAttribute('aria-controls'));
                    if (otherAnswer) {
                        otherAnswer.classList.remove('active');
                    }
                }
            });
            
            // Toggle current FAQ item
            this.setAttribute('aria-expanded', !isExpanded);
            if (answer) {
                answer.classList.toggle('active');
            }
        });
    });
});

// Contact modal function
function showContactModal() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            position: relative;
        ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
            ">&times;</button>
            <h2 style="color: #0A2540; margin-bottom: 1rem;">Contact Dr. Jan Duffy</h2>
            <p style="color: #666; margin-bottom: 1.5rem;">Ready to find your dream home in Skye Summit? Let's connect!</p>
            <div style="margin-bottom: 1rem;">
                <strong>Phone:</strong> (702) 930-8222
            </div>
            <div style="margin-bottom: 1rem;">
                <strong>Email:</strong> DrJanSells@SkyeSummitHomes.com
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>Location:</strong> Las Vegas, Nevada
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #3A8DDE;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
    
    // Trigger first section immediately
    if (sections[0]) {
        sections[0].style.opacity = '1';
        sections[0].style.transform = 'translateY(0)';
    }
}

// Performance optimization: Lazy load images when added
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', lazyLoadImages);
} else {
    lazyLoadImages();
}

// RealScout: lazy-load web component script when listings section enters viewport
(function initRealScoutLazyLoad() {
    const REALSCOUT_SCRIPT = 'https://em.realscout.com/widgets/realscout-web-components.umd.js';
    let scriptRequested = false;

    function loadRealScoutScript() {
        if (scriptRequested) return;
        scriptRequested = true;
        if (document.querySelector('script[src="' + REALSCOUT_SCRIPT + '"]')) return;
        const script = document.createElement('script');
        script.src = REALSCOUT_SCRIPT;
        script.type = 'module';
        script.async = true;
        document.head.appendChild(script);
    }

    function showLoadingState() {
        const widget = document.querySelector('realscout-office-listings');
        if (widget && !customElements.get('realscout-office-listings')) {
            widget.style.opacity = '0.5';
            widget.style.pointerEvents = 'none';
        }
    }

    function hideLoadingState() {
        const widget = document.querySelector('realscout-office-listings');
        if (widget) {
            widget.style.opacity = '1';
            widget.style.pointerEvents = 'auto';
        }
    }

    function watchWidgetReady() {
        showLoadingState();
        const checkWidgetLoaded = setInterval(function() {
            if (customElements.get('realscout-office-listings')) {
                hideLoadingState();
                clearInterval(checkWidgetLoaded);
            }
        }, 500);
        setTimeout(function() {
            clearInterval(checkWidgetLoaded);
            hideLoadingState();
        }, 10000);
    }

    function setup() {
        const section = document.getElementById('realscout-listings');
        if (!section) return;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        loadRealScoutScript();
                        watchWidgetReady();
                        observer.disconnect();
                    }
                });
            }, { rootMargin: '240px 0px', threshold: 0.01 });
            observer.observe(section);
        } else {
            loadRealScoutScript();
            watchWidgetReady();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();

// Review request functionality
const reviewRequestBtn = document.getElementById('review-request-btn');

if (reviewRequestBtn) {
    reviewRequestBtn.addEventListener('click', () => {
        // Check if user has visited before
        const hasVisited = localStorage.getItem('hasVisitedBefore');
        
        if (!hasVisited) {
            // First-time visitor - show welcome message
            showReviewRequestModal('Welcome!', 
                'Thank you for visiting our Skye Summit real estate website! If you\'ve worked with Dr. Jan Duffy, we\'d love to hear about your experience.',
                'https://share.google/yoVmGzrpTUtHrvsnL&action=write_review');
            localStorage.setItem('hasVisitedBefore', 'true');
        } else {
            // Returning visitor - show review request
            showReviewRequestModal('Share Your Experience', 
                'If you\'ve had a great experience with Dr. Jan Duffy and Skye Summit real estate, please consider leaving a review to help others.',
                'https://share.google/yoVmGzrpTUtHrvsnL&action=write_review');
        }
    });
}

function showReviewRequestModal(title, message, reviewUrl) {
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
        <div class="review-modal-content">
            <div class="review-modal-header">
                <h3>${title}</h3>
                <button class="review-modal-close" aria-label="Close review request modal">&times;</button>
            </div>
            <div class="review-modal-body">
                <p>${message}</p>
                <div class="review-modal-stars">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
            </div>
            <div class="review-modal-footer">
                <a href="${reviewUrl}" target="_blank" rel="noopener" class="btn btn-primary">
                    <i class="fas fa-edit"></i> Write Review on Google
                </a>
                <button class="btn btn-secondary review-modal-close">Maybe Later</button>
            </div>
        </div>
    `;

    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .review-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .review-modal-content {
            background: white;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }
        
        .review-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 1.5rem 0;
        }
        
        .review-modal-header h3 {
            margin: 0;
            color: #0A2540;
            font-size: 1.5rem;
        }
        
        .review-modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        
        .review-modal-close:hover {
            background: #f0f0f0;
        }
        
        .review-modal-body {
            padding: 1rem 1.5rem;
            text-align: center;
        }
        
        .review-modal-body p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .review-modal-stars {
            display: flex;
            justify-content: center;
            gap: 0.25rem;
            margin: 1rem 0;
        }
        
        .review-modal-stars .fas.fa-star {
            color: #FFD700;
            font-size: 1.5rem;
        }
        
        .review-modal-footer {
            padding: 0 1.5rem 1.5rem;
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 480px) {
            .review-modal-footer {
                flex-direction: column;
            }
            
            .review-modal-content {
                margin: 1rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Close modal functionality
    const closeButtons = modal.querySelectorAll('.review-modal-close');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });
    });

    // Close on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            style.remove();
        }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            style.remove();
        }
    });
}

/**
 * Calendly: shared widget.css + widget.js for inline embeds, floating badge, and popup links.
 * Popup: <a href="https://calendly.com/drjanduffy/showing" class="calendly-popup-link">Schedule time with me</a>
 */
(function initCalendly() {
    var CALENDLY_DEFAULT_URL = 'https://calendly.com/drjanduffy/showing';
    var CALENDLY_CSS = 'https://assets.calendly.com/assets/external/widget.css';
    var CALENDLY_JS = 'https://assets.calendly.com/assets/external/widget.js';

    function injectCss() {
        if (document.querySelector('link[href="' + CALENDLY_CSS + '"]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = CALENDLY_CSS;
        document.head.appendChild(link);
    }

    function ensureWidgetScript(done) {
        if (window.Calendly) {
            done();
            return;
        }
        var existing = document.querySelector('script[src="' + CALENDLY_JS + '"]');
        if (existing) {
            if (window.Calendly) done();
            else existing.addEventListener('load', done);
            return;
        }
        var s = document.createElement('script');
        s.src = CALENDLY_JS;
        s.async = true;
        s.onload = done;
        document.body.appendChild(s);
    }

    function initBadge() {
        if (window.__calendlyBadgeInit) return;
        if (!window.Calendly || typeof Calendly.initBadgeWidget !== 'function') return;
        window.__calendlyBadgeInit = true;
        Calendly.initBadgeWidget({
            url: CALENDLY_DEFAULT_URL,
            text: 'Schedule time with me',
            color: '#0069ff',
            textColor: '#ffffff',
            branding: false
        });
    }

    document.addEventListener('click', function calendlyPopupLinkHandler(e) {
        var a = e.target.closest('a.calendly-popup-link');
        if (!a) return;
        e.preventDefault();
        var url = a.getAttribute('href') || CALENDLY_DEFAULT_URL;
        if (!/^https?:\/\//i.test(url)) url = CALENDLY_DEFAULT_URL;

        function openPopup() {
            if (window.Calendly && typeof Calendly.initPopupWidget === 'function') {
                Calendly.initPopupWidget({ url: url });
            } else {
                window.location.href = url;
            }
        }

        if (window.Calendly) {
            openPopup();
        } else {
            ensureWidgetScript(openPopup);
        }
    });

    injectCss();
    ensureWidgetScript(function onCalendlyReady() {
        if (document.readyState === 'complete') {
            initBadge();
        } else {
            window.addEventListener('load', initBadge);
        }
    });
})();
