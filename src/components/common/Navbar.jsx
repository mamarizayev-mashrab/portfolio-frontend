/**
 * Navbar Component
 * Navigation with theme toggle, language switcher, and mobile menu
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = () => {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.about'), href: '#about' },
        { name: t('nav.skills'), href: '#skills' },
        { name: t('nav.projects'), href: '#projects' },
        { name: t('nav.experience'), href: '#experience' },
        { name: t('nav.contact'), href: '#contact' },
    ];

    const handleScrollTo = (e, href) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass-blur' : 'bg-transparent'
                }`}
        >
            <div className="v-container flex items-center justify-between h-16 md:h-20">
                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-mono font-bold tracking-tighter text-white hover:text-primary transition-colors">
                    &lt;/&gt; <span className="hidden sm:inline">MAMARIZAYEV</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScrollTo(e, link.href)}
                            className="text-[13px] font-mono tracking-tight text-dark-400 hover:text-white transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}

                    <div className="h-4 w-[1px] bg-dark-700 mx-2" />

                    {/* Language Switcher */}
                    <div className="flex gap-2 text-[11px] font-mono">
                        {['UZ', 'EN', 'RU'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang.toLowerCase())}
                                className={`px-1.5 py-0.5 border ${language === lang.toLowerCase()
                                        ? 'border-primary text-primary'
                                        : 'border-transparent text-dark-500 hover:text-dark-300'
                                    } transition-all`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-2 text-dark-400 hover:text-white"
                >
                    <div className={`w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? 'rotate-45' : ''}`} />
                    <div className={`w-6 h-0.5 bg-current mt-1.5 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                    <div className={`w-6 h-0.5 bg-current mt-1.5 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-[8px]' : ''}`} />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-background z-40 transition-transform duration-500 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden`}>
                <div className="v-container pt-32 flex flex-col gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScrollTo(e, link.href)}
                            className="text-4xl font-bold tracking-tighter hover:text-primary transition-colors text-white"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
