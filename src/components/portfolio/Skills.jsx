import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

const Skills = () => {
    const { t, getLocalizedField } = useLanguage();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills');
                setSkills(response.data.data || []);
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    // Group skills by category (case-insensitive check)
    const getCategorySkills = (cat) => skills.filter(s =>
        s.category?.toLowerCase() === cat.toLowerCase()
    );

    const categories = {
        'Frontend': getCategorySkills('frontend'),
        'Backend': getCategorySkills('backend'),
        'Mobile': getCategorySkills('mobile'),
        'Database': getCategorySkills('database'),
        'DevOps': getCategorySkills('devops'),
        'Tools': getCategorySkills('tools'),
        'Other': skills.filter(s => !['frontend', 'backend', 'mobile', 'database', 'devops', 'tools'].includes(s.category?.toLowerCase()))
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
                                                            className={`w-4 h-1 rounded-full ${i < Math.floor((skill.level || skill.proficiency || 0) / 20) ? 'bg-primary' : 'bg-[var(--accents-2)]'}`}
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
