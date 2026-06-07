// Shared Navigation Component for Skye Summit Real Estate Site
// This generates consistent navigation across all pages

function generateNavigation(currentPage = '') {
    const navItems = [
        { href: '/', text: 'Home', id: 'home' },
        { href: '/about', text: 'About Dr. Jan', id: 'about' },
        { href: '/community', text: 'Skye Summit Community', id: 'community' },
        { 
            href: '#', 
            text: 'Services', 
            id: 'services',
            submenu: [
                { href: '/sell', text: 'Sell Your Home' },
                { href: '/buy', text: 'Buy in Skye Summit' },
                { href: '/valuation', text: 'Free Home Valuation' },
                { href: '/invest', text: 'Investment Strategy' },
                { href: '/relocate', text: 'Relocation Services' }
            ]
        },
        { href: '/blog', text: 'Insider Blog', id: 'blog' },
        { href: '/contact', text: 'Contact', id: 'contact' }
    ];

    let navHTML = `
        <header class="header" role="banner">
            <nav class="nav" role="navigation" aria-label="Main navigation">
                <div class="nav-brand">
                    <h2><a href="/" aria-label="Skye Summit Real Estate Expert - Dr. Jan Duffy">(702) 930-8222</a></h2>
                </div>
                <ul class="nav-menu" role="menubar">
    `;

    navItems.forEach(item => {
        const isActive = currentPage === item.id ? 'active' : '';
        if (item.submenu) {
            navHTML += `
                <li class="nav-item-has-submenu" role="none">
                    <a href="${item.href}" class="${isActive}" role="menuitem" aria-haspopup="true" aria-expanded="false">${item.text} <i class="fas fa-chevron-down"></i></a>
                    <ul class="nav-submenu" role="menu">
            `;
            item.submenu.forEach(subItem => {
                navHTML += `<li role="none"><a href="${subItem.href}" role="menuitem">${subItem.text}</a></li>`;
            });
            navHTML += `</ul></li>`;
        } else {
            navHTML += `<li role="none"><a href="${item.href}" class="${isActive}" role="menuitem">${item.text}</a></li>`;
        }
    });

    navHTML += `
                </ul>
                <button class="mobile-menu-toggle" aria-label="Toggle mobile menu" aria-expanded="false">
                    <span class="hamburger"></span>
                </button>
            </nav>
        </header>
    `;

    return navHTML;
}

function generateFooter() {
    return `
        <footer class="footer" role="contentinfo">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>Skye Summit | Homes by Dr. Jan Duffy</h3>
                        <p>Dr. Jan Duffy, REALTOR® · Buyer's Representative<br>Berkshire Hathaway HomeServices Nevada Properties</p>
                        <div class="contact-info">
                            <p><i class="fas fa-phone" aria-hidden="true"></i> <a href="tel:+17029308222">(702) 930-8222</a></p>
                            <p><i class="fas fa-envelope" aria-hidden="true"></i> <a href="mailto:DrJanSells@SkyeSummitHomes.com">DrJanSells@SkyeSummitHomes.com</a></p>
                            <p><i class="fas fa-map-marker-alt" aria-hidden="true"></i> <a href="https://maps.google.com/?q=11411+Southern+Highlands+Pkwy+%23300+Las+Vegas+NV+89141" target="_blank" rel="noopener">11411 Southern Highlands Pkwy #300<br>Las Vegas, NV 89141</a></p>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h4>Services</h4>
                        <ul>
                            <li><a href="/sell">Sell Your Skye Summit Home</a></li>
                            <li><a href="/buy">Buy in Skye Summit</a></li>
                            <li><a href="/valuation">Free Home Valuation</a></li>
                            <li><a href="/invest">Investment Strategy</a></li>
                            <li><a href="/relocate">Relocation Services</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Resources</h4>
                        <ul>
                            <li><a href="/community">Skye Summit Community</a></li>
                            <li><a href="/about">About Dr. Jan</a></li>
                            <li><a href="/blog">Insider Blog</a></li>
                            <li><a href="/contact">Contact & Consultation</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Google Business Profile</h4>
                        <div class="gmb-info">
                            <p><i class="fas fa-star" aria-hidden="true"></i> <strong>4.9/5</strong> (127 reviews)</p>
                            <a href="https://share.google/yoVmGzrpTUtHrvsnL" target="_blank" rel="noopener" class="gmb-link" aria-label="View Dr. Jan Duffy's Google Business Profile">
                                <i class="fab fa-google" aria-hidden="true"></i> View on Google
                            </a>
                            <a href="https://share.google/yoVmGzrpTUtHrvsnL&action=write_review" target="_blank" rel="noopener" class="review-link" aria-label="Write a review for Dr. Jan Duffy on Google">
                                <i class="fas fa-edit" aria-hidden="true"></i> Write a Review
                            </a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} Dr. Jan Duffy, REALTOR® S.0197614.LLC. All rights reserved.</p>
                    <div class="footer-legal">
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Use</a>
                        <a href="/mls-disclaimer">MLS Disclaimer</a>
                    </div>
                </div>
            </div>
        </footer>
        <button id="back-to-top" class="back-to-top" aria-label="Back to top">
            <i class="fas fa-chevron-up" aria-hidden="true"></i>
        </button>
    `;
}

// Export for use in HTML pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateNavigation, generateFooter };
}

