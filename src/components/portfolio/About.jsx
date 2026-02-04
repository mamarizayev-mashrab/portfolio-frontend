/**
 * About Section Component
 * Personal story and stats with manga-style layout
 */

import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';

const About = () => {
    const { t, getLocalizedField } = useLanguage();
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get('/settings');
                setSettings(response.data.data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const stats = [
        { value: '3+', label: t('about.stats.experience') },
        { value: '20+', label: t('about.stats.projects') },
        { value: '15+', label: t('about.stats.clients') }
    ];

    return (
        <section id="about" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('about.title')}</h2>
                    <p className="section-subtitle">{t('about.subtitle')}</p>
                </div>

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image/Visual Side - Manga Panel Style */}
                    <div className="relative">
                        <div className="manga-panel bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-xl p-8 aspect-square max-w-md mx-auto">
                            {/* Profile image placeholder with glow */}
                            <div className="relative w-full h-full rounded-lg overflow-hidden glow-purple">
                                {settings?.about?.image ? (
                                    <img
                                        src={settings.about.image}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-accent-500/20">
                                        <span className="text-8xl font-bold text-gradient font-mono">&lt;/&gt;</span>
                                    </div>
                                )}
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -top-4 -right-4 px-4 py-2 rounded-lg glass-dark border border-primary-500/30 animate-float">
                                <span className="text-primary-400 font-mono text-sm">React.js</span>
                            </div>
                            <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-lg glass-dark border border-accent-500/30 animate-float delay-200">
                                <span className="text-accent-400 font-mono text-sm">Node.js</span>
                            </div>
                        </div>
                    </div>

                    {/* Text Content Side */}
                    <div className="space-y-6">
                        {/* Story text */}
                        <div className="space-y-4">
                            <p className="text-dark-300 text-lg leading-relaxed">
                                {settings?.about?.content
                                    ? getLocalizedField(settings.about, 'content')
                                    : t('about.content')}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-6 pt-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-4 rounded-xl glass-dark border border-dark-700 hover:border-primary-500/30 transition-colors"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-dark-400 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Tech stack hint */}
                        <div className="flex flex-wrap gap-3 pt-4">
                            {['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'MongoDB'].map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 text-sm rounded-full bg-dark-800 text-dark-300 border border-dark-700 hover:border-primary-500/30 transition-colors"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
