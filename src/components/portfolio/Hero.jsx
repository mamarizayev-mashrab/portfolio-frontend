/**
 * Hero Section Component
 * Landing section with typing animation and CTA buttons
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const typingTexts = t('hero.typingTexts') || [];

    // Typing animation effect
    useEffect(() => {
        if (!typingTexts.length) return;

        const currentFullText = typingTexts[currentTextIndex];
        const typingSpeed = isDeleting ? 50 : 100;
        const pauseTime = 2000;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing forward
                if (displayText.length < currentFullText.length) {
                    setDisplayText(currentFullText.slice(0, displayText.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), pauseTime);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % typingTexts.length);
                }
            }
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentTextIndex, typingTexts]);

    const handleScrollTo = (sectionId) => {
        const element = document.querySelector(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section
            id="home"
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-950/50 to-dark-950" />

            {/* Glowing orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-float-slow" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float-slow delay-300" />

            {/* Content */}
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Greeting */}
                    <p className="text-dark-400 text-lg md:text-xl mb-4 animate-fade-in">
                        {t('hero.greeting')}
                    </p>

                    {/* Name */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-slide-up">
                        <span className="text-gradient">{t('hero.name')}</span>
                    </h1>

                    {/* Title with typing animation */}
                    <div className="h-16 md:h-20 flex items-center justify-center mb-6">
                        <h2 className="text-2xl md:text-4xl font-semibold text-dark-100">
                            <span className="mr-2">{t('hero.title')}</span>
                            <span className="text-primary-400">|</span>
                            <span className="ml-2 text-accent-400">
                                {displayText}
                                <span className="animate-pulse">|</span>
                            </span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <p className="text-dark-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto animate-fade-in delay-200">
                        {t('hero.subtitle')}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up delay-300">
                        <button
                            onClick={() => handleScrollTo('#projects')}
                            className="btn-primary group"
                        >
                            <span>{t('hero.cta.projects')}</span>
                            <svg
                                className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>
                        <button
                            onClick={() => handleScrollTo('#contact')}
                            className="btn-secondary"
                        >
                            {t('hero.cta.contact')}
                        </button>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
                        <button
                            onClick={() => handleScrollTo('#about')}
                            className="p-2 rounded-full text-dark-500 hover:text-primary-400 transition-colors"
                            aria-label="Scroll down"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Manga-style decorative elements */}
            <div className="absolute top-20 right-10 md:right-20 text-6xl md:text-8xl font-bold text-dark-800/20 font-mono rotate-12 select-none">
                &lt;/&gt;
            </div>
            <div className="absolute bottom-20 left-10 md:left-20 text-4xl md:text-6xl font-bold text-dark-800/20 font-mono -rotate-12 select-none">
                { }
            </div>
        </section>
    );
};

export default Hero;
