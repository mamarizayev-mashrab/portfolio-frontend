import { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../../context/LanguageContext';

const Skills = () => {
    const { t, getLocalizedField } = useLanguage();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${API_URL}/skills`);
                setSkills(response.data.data || []);
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    // Group skills by category
    const categories = {
        'Frontend': skills.filter(s => s.category === 'Frontend'),
        'Backend': skills.filter(s => s.category === 'Backend'),
        'Mobile': skills.filter(s => s.category === 'Mobile'),
        'Other': skills.filter(s => !['Frontend', 'Backend', 'Mobile'].includes(s.category))
    };

    if (loading) return null;

    return (
        <section id="skills" className="py-24 bg-[var(--background)] border-y border-[var(--accents-2)]">
            <div className="v-container">
                <div className="mb-20">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block mb-4">// capabilities_map</span>
                    <h2 className="text-5xl font-bold tracking-tighter text-[var(--foreground)]">{t('skills.title', 'Technical Excellence')}</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {Object.entries(categories).map(([category, categorySkills]) => (
                        categorySkills.length > 0 && (
                            <div key={category} className="v-card hover:bg-[var(--accents-1)] transition-colors group">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold tracking-tight">{category}</h3>
                                        <p className="text-sm text-[var(--accents-5)] leading-relaxed">
                                            {t(`skills.categories.${category.toLowerCase()}`, `${category} Development Stack`)}
                                        </p>
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-[var(--accents-2)]">
                                        {categorySkills.map((skill) => (
                                            <div key={skill._id} className="flex items-center justify-between group/item">
                                                <span className="text-sm font-mono text-[var(--accents-6)] group-hover/item:text-[var(--foreground)] transition-colors">
                                                    {getLocalizedField(skill.name)}
                                                </span>
                                                <div className="flex gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className={`w-4 h-1 rounded-full ${i < Math.floor(skill.level / 20) ? 'bg-primary' : 'bg-[var(--accents-2)]'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
