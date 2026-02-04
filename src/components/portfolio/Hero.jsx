import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();
    const [displayText, setDisplayText] = useState('');
    const typingTexts = t('hero.typingTexts') || [];
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!typingTexts.length) return;
        const speed = isDeleting ? 50 : 100;
        const currentText = typingTexts[textIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setDisplayText(currentText.slice(0, displayText.length + 1));
                if (displayText.length === currentText.length) {
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                setDisplayText(currentText.slice(0, displayText.length - 1));
                if (displayText.length === 0) {
                    setIsDeleting(false);
                    setTextIndex((prev) => (prev + 1) % typingTexts.length);
                }
            }
        }, speed);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, textIndex, typingTexts]);

    const handleScrollTo = (id) => {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-v-grid pt-20">
            {/* Background Narrative */}
            <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />

            <div className="v-container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                    {/* Monospace Narrative Block */}
                    <div className="lg:col-span-8 space-y-8 animate-reveal">
                        <div className="space-y-2">
                            <span className="v-text-mono text-primary font-bold">
                                // {t('hero.greeting')}
                            </span>
                            <h1 className="hero-title text-white">
                                {t('hero.name')}
                            </h1>
                        </div>

                        <div className="h-12 md:h-16 flex items-center">
                            <h2 className="text-2xl md:text-3xl font-mono text-dark-300">
                                {t('hero.title')} <span className="text-accent">_</span>
                                <span className="text-white bg-dark-800 px-2 ml-2 border border-dark-600">
                                    {displayText}
                                    <span className="animate-pulse">|</span>
                                </span>
                            </h2>
                        </div>

                        <p className="max-w-xl text-dark-400 text-lg leading-relaxed">
                            {t('hero.subtitle')}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <button
                                onClick={() => handleScrollTo('#projects')}
                                className="v-btn-primary group"
                            >
                                {t('hero.cta.projects')}
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleScrollTo('#contact')}
                                className="v-btn-secondary"
                            >
                                {t('hero.cta.contact')}
                            </button>
                        </div>
                    </div>

                    {/* Manga Style Accent */}
                    <div className="hidden lg:block lg:col-span-4 relative">
                        <div className="manga-panel-sharp aspect-[3/4] overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
                            {/* SVG Silhouette / Silhouette simulation */}
                            <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
                                <span className="text-[15rem] font-bold text-dark-700/50 select-none">&lt;/&gt;</span>
                            </div>
                            {/* Cyber Glow Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-overlay" />
                        </div>
                        {/* Decorative Manga Lines */}
                        <div className="absolute -top-4 -right-4 w-24 h-[2px] bg-primary" />
                        <div className="absolute -top-4 -right-4 w-[2px] h-24 bg-primary" />
                    </div>
                </div>
            </div>

            {/* Vercel-style Bottom Divider */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-dark-800" />
            <div className="absolute bottom-0 left-1/4 w-1/2 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </section>
    );
};

export default Hero;
