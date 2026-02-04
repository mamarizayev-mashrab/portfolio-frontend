import { useLanguage } from '../../context/LanguageContext';

const About = () => {
    const { t } = useLanguage();

    return (
        <section id="about" className="py-24 bg-background relative overflow-hidden">
            <div className="v-container">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-1 border border-dark-700 bg-dark-700 manga-panel">

                    {/* Panel 1: Headline */}
                    <div className="md:col-span-12 bg-background p-12 flex flex-col justify-center">
                        <span className="v-text-mono text-primary mb-4">// {t('about.title')}</span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">
                            Crafting Experiences at the Intersection of <span className="text-primary italic">Logic</span> and <span className="text-accent italic">Art</span>.
                        </h2>
                    </div>

                    {/* Panel 2: Content (Manga storytelling layout) */}
                    <div className="md:col-span-7 bg-background p-12 border-t md:border-t-0 md:border-r border-dark-700 hover:bg-dark-900 transition-colors group">
                        <p className="text-dark-300 text-lg leading-relaxed mb-8">
                            {t('about.content')}
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-xs font-mono text-dark-500">
                                <span className="w-12 h-px bg-dark-700" />
                                <span>SYSTEM_COORDINATES: O7, UZ</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-mono text-dark-500">
                                <span className="w-12 h-px bg-dark-700" />
                                <span>STATUS: ACTIVE_DEVELOPER</span>
                            </div>
                        </div>
                    </div>

                    {/* Panel 3: Stats/Tech Callout */}
                    <div className="md:col-span-5 bg-background p-12">
                        <div className="relative h-full flex items-end justify-start">
                            <div className="space-y-6 relative z-10 w-full">
                                <div className="p-6 border border-primary/20 bg-primary/5 space-y-2">
                                    <span className="text-3xl font-bold text-white tracking-tighter">100%</span>
                                    <p className="text-xs font-mono text-dark-400 uppercase">Commitment to Quality</p>
                                </div>
                                <div className="p-6 border border-accent/20 bg-accent/5 space-y-2">
                                    <span className="text-3xl font-bold text-white tracking-tighter">24/7</span>
                                    <p className="text-xs font-mono text-dark-400 uppercase">Continuous Evolution</p>
                                </div>
                            </div>
                            {/* Decorative Background Text */}
                            <span className="absolute top-0 right-0 text-9xl font-bold text-dark-800 pointer-events-none select-none">
                                BIO
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visual Manga Line Divider */}
            <div className="absolute top-0 right-0 w-px h-full bg-dark-800/50" />
        </section>
    );
};

export default About;
