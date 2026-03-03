import React from 'react';
import AppLogo from './AppLogo';

const Footer: React.FC = () => {
    const links = [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
    ];

    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <AppLogo size={28} text="ClientPortal" className="text-primary-600" />

                    {/* Links */}
                    <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
                        {links.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors focus:outline-none focus:text-primary-600"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* Social + Copyright */}
                    <div className="flex items-center gap-4">
                        <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-gray-700 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-700 transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <span className="text-sm text-gray-400">© 2026 ClientPortal</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;