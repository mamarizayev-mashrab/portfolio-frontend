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
            <div className="absolute inset-0 noise-overlay opacity-20 pointer-events-none" />

            <div className="v-container relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                    <div className="lg:col-span-7 space-y-12 animate-reveal">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                                        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                                    </svg>
                                </div>
                                <span className="v-text-mono text-primary font-black tracking-widest uppercase">
                                    // protocol_established
                                </span>
                            </div>
                            <h1 className="hero-title text-white">
                                {t('hero.name')}
                            </h1>
                        </div>

                        <div className="inline-flex items-center bg-dark-900 border border-dark-700 px-6 py-4 rounded-[12px] shadow-vercel transition-transform hover:scale-[1.02] duration-300">
                            <h2 className="text-xl md:text-3xl font-mono text-dark-300">
                                {t('hero.title')}<span className="text-white bg-primary px-2 ml-4 rounded-[4px]">{displayText}</span>
                                <span className="text-primary animate-pulse ml-1 opacity-50">_</span>
                            </h2>
                        </div>

                        <p className="max-w-xl text-dark-400 text-lg leading-relaxed font-medium">
                            {t('hero.subtitle')}
                        </p>

                        <div className="flex flex-wrap gap-6 pt-4">
                            <button
                                onClick={() => handleScrollTo('#projects')}
                                className="v-btn-primary group !rounded-[12px] h-14"
                            >
                                {t('hero.cta.projects')}
                                {/* iOS Style Rounded Arrow */}
                                <svg className="w-5 h-5 ml-3 transform group-hover:translate-x-1.5 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14m-7-7l7 7-7 7" />
                                </svg>
                            </button>
                            <button
                                onClick={() => handleScrollTo('#contact')}
                                className="v-btn-secondary !rounded-[12px] h-14 px-10"
                            >
                                {t('hero.cta.contact')}
                            </button>
                        </div>
                    </div>

                    <div className="hidden lg:block lg:col-span-5 relative">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-dark-900 ring-1 ring-white/10 rounded-[31px] aspect-[4/5] flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 bg-v-grid opacity-20" />
                                <span className="text-[12rem] font-black text-dark-800 pointer-events-none select-none drop-shadow-2xl font-mono">&lt;ios&gt;</span>
                                {/* iOS Style Floating Symbols */}
                                <div className="absolute top-10 left-10 w-12 h-12 bg-white/5 backdrop-blur-md rounded-[12px] border border-white/10 flex items-center justify-center animate-float">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#FF2D55]"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                                </div>
                                <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/5 backdrop-blur-md rounded-[16px] border border-white/10 flex items-center justify-center animate-float delay-700">
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#5856D6]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-dark-800" />
        </section>
    );
};

export default Hero;
