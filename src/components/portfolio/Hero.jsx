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
        const speed = isDeleting ? 30 : 60;
        const currentText = typingTexts[textIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setDisplayText(currentText.slice(0, displayText.length + 1));
                if (displayText.length === currentText.length) {
                    setTimeout(() => setIsDeleting(true), 2500);
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

    const scrollTo = (id) => {
        document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            className="bg-[var(--background)] min-h-screen flex items-center relative overflow-hidden v-grid-bg"
            aria-labelledby="hero-heading"
            itemScope
            itemType="https://schema.org/WPHeader"
        >
            <div className="v-container relative z-10 pt-20">
                <div className="max-w-4xl">
                    <div
                        className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--accents-1)] border border-[var(--accents-2)] text-[10px] font-mono font-bold tracking-widest text-[var(--accents-5)] uppercase mb-8 animate-fade-in"
                        role="status"
                        aria-live="polite"
                    >
                        {t('hero.systemStatus', 'System status: Active_Deployment_v5')}
                    </div>

                    <h1
                        id="hero-heading"
                        className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--foreground)] mb-8 leading-[0.9]"
                        itemProp="name"
                    >
                        {t('hero.name')}<span className="text-[var(--accents-3)]" aria-hidden="true">.</span>
                    </h1>

                    <div className="h-12 md:h-16 flex items-center mb-10" role="presentation">
                        <span className="text-xl md:text-2xl font-mono text-[var(--accents-5)]" itemProp="jobTitle">
                            {t('hero.title')}: <span className="text-[var(--foreground)] bg-[var(--accents-1)] px-2 border border-[var(--accents-2)]" aria-label={displayText || 'Developer'}>{displayText}<span className="animate-pulse" aria-hidden="true">|</span></span>
                        </span>
                    </div>

                    <p
                        className="max-w-2xl text-lg md:text-xl text-[var(--accents-5)] mb-12 leading-relaxed"
                        itemProp="description"
                    >
                        {t('hero.subtitle')}
                    </p>

                    <nav className="flex flex-wrap gap-4" aria-label="Primary actions">
                        <button
                            onClick={() => scrollTo('#projects')}
                            className="v-btn-primary h-12 px-8 text-base shadow-lg"
                            aria-label={t('hero.cta.projects', 'View Projects') + ' - scroll to projects section'}
                        >
                            {t('hero.cta.projects', 'View Projects')}
                        </button>
                        <button
                            onClick={() => scrollTo('#contact')}
                            className="v-btn-ghost h-12 px-8 text-base border border-[var(--accents-2)] overflow-hidden relative group"
                            aria-label={t('hero.cta.contact', 'Contact Me') + ' - scroll to contact section'}
                        >
                            <span className="relative z-10">{t('hero.cta.contact', 'Contact Me')}</span>
                            <div className="absolute inset-0 bg-[var(--accents-1)] translate-y-full group-hover:translate-y-0 transition-transform duration-200" aria-hidden="true" />
                        </button>
                    </nav>
                </div>
            </div>

            {/* Gradient bottom decoration like Vercel */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" aria-hidden="true" />
        </section>
    );
};

export default Hero;
