import { useLanguage } from '../../context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 bg-[var(--background)]">
            <div className="v-container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">

                    <div className="md:col-span-4 space-y-4">
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest">// expertise_profile</span>
                        <h2 className="text-4xl font-bold tracking-tighter text-[var(--foreground)]">Mission Statement</h2>
                    </div>

                    <div className="md:col-span-8">
                        <div className="space-y-8">
                            <p className="text-2xl md:text-3xl text-[var(--foreground)] leading-tight tracking-tight font-medium">
                                Developing systems that bridge the gap between <span className="text-[var(--accents-5)] underline decoration-1 underline-offset-4">technical precision</span> and <span className="text-[var(--accents-5)] underline decoration-1 underline-offset-4">human intuition</span>.
                            </p>

                            <p className="text-lg text-[var(--accents-5)] leading-relaxed max-w-2xl">
                                {t('about.content')}
                            </p>

                            <div className="v-divider" />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <span className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">Philosophy</span>
                                    <p className="text-sm text-[var(--accents-6)]">Minimalism as a functional requirement, not just an aesthetic choice.</p>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">Output</span>
                                    <p className="text-sm text-[var(--accents-6)]">Engineered for performance, designed for meaningful interaction.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
