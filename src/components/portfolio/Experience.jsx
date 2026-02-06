import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

const Experience = () => {
    const { t, getLocalizedField } = useLanguage();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            try {
                const response = await api.get('/experiences');
                setExperiences(response.data.data || []);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, []);

    if (loading) return null;

    return (
        <section id="experience" className="py-24 bg-[var(--background)] border-t border-[var(--accents-2)]">
            <div className="v-container">
                <div className="mb-20">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block mb-4 font-bold">// growth_timeline</span>
                    <h2 className="text-5xl font-bold tracking-tighter">{t('experience.title', 'Experience')}</h2>
                </div>

                <div className="space-y-0 border-l border-[var(--accents-2)] ml-2 md:ml-0">
                    {experiences.map((exp) => (
                        <div key={exp._id} className="relative pl-8 pb-12 last:pb-0 group">
                            {/* Dot */}
                            <div className="absolute left-[-5px] top-2 w-[10px] h-[10px] rounded-full bg-[var(--accents-2)] border-2 border-[var(--background)] group-hover:bg-primary transition-colors" />

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                <div className="md:col-span-3">
                                    <span className="text-xs font-mono font-bold text-[var(--accents-4)] tracking-tighter uppercase">
                                        {new Date(exp.startDate).getFullYear()} - {exp.current ? t('experience.present', 'PRESENT') : new Date(exp.endDate).getFullYear()}
                                    </span>
                                </div>
                                <div className="md:col-span-9 space-y-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                        <h3 className="text-xl font-bold tracking-tight">{getLocalizedField(exp.role || exp.title)}</h3>
                                        <span className="text-sm font-mono text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded">@{typeof exp.company === 'string' ? exp.company : getLocalizedField(exp.company)}</span>
                                    </div>
                                    <p className="text-[var(--accents-5)] leading-relaxed max-w-2xl font-medium">
                                        {getLocalizedField(exp.description)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
