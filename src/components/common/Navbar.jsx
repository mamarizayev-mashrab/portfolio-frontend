/**
 * Navbar Component - iOS Style
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
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    // iOS Style Flag SVGs (Apple Style)
    const FlagIcon = ({ lang }) => {
        const flags = {
            uz: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-sm overflow-hidden">
                    <rect width="24" height="8" fill="#0099B5" />
                    <rect y="8" width="24" height="1" fill="#D21034" />
                    <rect y="9" width="24" height="6" fill="#FFFFFF" />
                    <rect y="15" width="24" height="1" fill="#D21034" />
                    <rect y="16" width="24" height="8" fill="#1EB53A" />
                    <circle cx="5" cy="12" r="2.5" fill="#FFFFFF" fillOpacity="0.1" />
                </svg>
            ),
            en: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-sm overflow-hidden">
                    <rect width="24" height="24" fill="#00247D" />
                    <path d="M0 0l24 24M24 0L0 24" stroke="#fff" strokeWidth="3" />
                    <path d="M0 0l24 24M24 0L0 24" stroke="#CF142B" strokeWidth="2" />
                    <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="5" />
                    <path d="M12 0v24M0 12h24" stroke="#CF142B" strokeWidth="3" />
                </svg>
            ),
            ru: (
                <svg viewBox="0 0 24 24" className="w-5 h-5 rounded-sm overflow-hidden text-border">
                    <rect width="24" height="8" fill="#FFFFFF" />
                    <rect y="8" width="24" height="8" fill="#0039A6" />
                    <rect y="16" width="24" height="8" fill="#D52B1E" />
                </svg>
            )
        };
        return flags[lang] || null;
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-blur h-16' : 'bg-transparent h-20'}`}>
            <div className="v-container h-full flex items-center justify-between">
                {/* iOS Style Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 bg-white text-black rounded-[10px] flex items-center justify-center shadow-vercel group-hover:scale-105 transition-transform duration-300">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold tracking-tighter text-white font-mono hidden sm:block uppercase">Mamarizayev.ios</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-10">
                    <div className="flex gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleScrollTo(e, link.href)}
                                className="text-[12px] font-mono font-bold tracking-widest text-dark-400 hover:text-white transition-colors duration-300"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Language Switch / iOS Style Segments */}
                    <div className="flex items-center bg-dark-800 rounded-[10px] p-1 border border-dark-700">
                        {['UZ', 'EN', 'RU'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang.toLowerCase())}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-[8px] transition-all duration-300 ${language === lang.toLowerCase()
                                        ? 'bg-dark-600 text-white shadow-sm'
                                        : 'text-dark-500 hover:text-dark-300'
                                    }`}
                            >
                                <FlagIcon lang={lang.toLowerCase()} />
                                <span className="text-[10px] font-bold font-mono">{lang}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theme Toggle (Apple Style Switch simulation) */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-dark-800 transition-colors"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 stroke-[2] stroke-white fill-none">
                        <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1.5"
                >
                    <div className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`} />
                    <div className={`h-0.5 w-6 bg-white rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`} />
                </button>
            </div>

            {/* iOS Style Full-Screen Menu Overlay */}
            <div className={`fixed inset-0 bg-background/95 backdrop-blur-2xl z-40 transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-110'}`}>
                <div className="v-container h-full flex flex-col justify-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => handleScrollTo(e, link.href)}
                            className="text-5xl font-bold tracking-tightest hover:text-primary transition-colors text-white"
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="h-px bg-dark-800 w-full" />
                    <div className="flex gap-4">
                        {['UZ', 'EN', 'RU'].map((l) => (
                            <button key={l} onClick={() => setLanguage(l.toLowerCase())} className="text-xl font-mono text-dark-400">[{l}]</button>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
