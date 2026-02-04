/**
 * Skills Section Component
 * Display skills grouped by category with proficiency bars
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';
import { SkeletonSkillItem } from '../common/Loading';

// Default skill icons by category
const categoryIcons = {
    frontend: '🎨',
    backend: '⚙️',
    database: '🗄️',
    devops: '🚀',
    tools: '🛠️',
    other: '💡'
};

const Skills = () => {
    const { t } = useLanguage();
    const [skills, setSkills] = useState([]);
    const [groupedSkills, setGroupedSkills] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await api.get('/skills');
                setSkills(response.data.data || []);
                setGroupedSkills(response.data.grouped || {});
            } catch (error) {
                console.error('Error fetching skills:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSkills();
    }, []);

    const categories = ['all', ...Object.keys(groupedSkills)];

    const filteredSkills = activeCategory === 'all'
        ? skills
        : groupedSkills[activeCategory] || [];

    return (
        <section id="skills" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 to-dark-900/50" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="section-title">{t('skills.title')}</h2>
                    <p className="section-subtitle">{t('skills.subtitle')}</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeCategory === category
                                    ? 'bg-primary-500 text-white shadow-glow-sm'
                                    : 'bg-dark-800/50 text-dark-300 hover:bg-dark-700/50 hover:text-dark-100'
                                }`}
                        >
                            {category === 'all' ? 'All' : t(`skills.categories.${category}`)}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <SkeletonSkillItem key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSkills.map((skill, index) => (
                            <div
                                key={skill._id || index}
                                className="group p-4 rounded-xl glass-dark border border-dark-700 hover:border-primary-500/30 transition-all hover:scale-[1.02]"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-primary-500/10 to-accent-500/10 text-2xl group-hover:scale-110 transition-transform">
                                        {skill.icon || categoryIcons[skill.category] || '💻'}
                                    </div>

                                    {/* Name & Progress */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-dark-100 truncate">
                                                {skill.name}
                                            </h3>
                                            <span className="text-sm text-primary-400 ml-2">
                                                {skill.proficiency}%
                                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${skill.proficiency}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredSkills.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-dark-400">{t('common.noResults')}</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Skills;
