/**
 * Experience Section Component
 * Timeline display of work history and education
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';
import { SkeletonExperienceItem } from '../common/Loading';

const Experience = () => {
    const { t, getLocalizedField, language } = useLanguage();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await api.get('/experiences');
                setExperiences(response.data.data || []);
            } catch (error) {
                console.error('Error fetching experiences:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'short' };

        const localeMap = {
            uz: 'uz-UZ',
            en: 'en-US',
            ru: 'ru-RU'
        };

        return date.toLocaleDateString(localeMap[language] || 'en-US', options);
    };

    const typeColors = {
        work: 'bg-primary-500',
        education: 'bg-accent-500',
        freelance: 'bg-green-500',
        other: 'bg-gray-500'
    };

    return (
        <section id="experience" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('experience.title')}</h2>
                    <p className="section-subtitle">{t('experience.subtitle')}</p>
                </div>

                {/* Timeline */}
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="space-y-0">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonExperienceItem key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 via-accent-500 to-primary-500/20" />

                            {/* Experience items */}
                            <div className="space-y-8">
                                {experiences.map((exp, index) => (
                                    <div
                                        key={exp._id || index}
                                        className="relative pl-10 group"
                                    >
                                        {/* Timeline dot */}
                                        <div
                                            className={`absolute left-0 top-1.5 w-6 h-6 rounded-full ${typeColors[exp.type] || typeColors.other} border-4 border-dark-950 group-hover:scale-125 transition-transform`}
                                        />

                                        {/* Content card */}
                                        <div className="glass-dark rounded-xl p-6 border border-dark-700 hover:border-primary-500/30 transition-all group-hover:translate-x-2">
                                            {/* Date range */}
                                            <div className="flex items-center gap-2 text-sm text-dark-400 mb-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>
                                                    {formatDate(exp.startDate)} — {exp.current ? t('experience.present') : formatDate(exp.endDate)}
                                                </span>
                                                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${exp.type === 'work' ? 'bg-primary-500/20 text-primary-400' :
                                                        exp.type === 'education' ? 'bg-accent-500/20 text-accent-400' :
                                                            'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {t(`experience.types.${exp.type}`)}
                                                </span>
                                            </div>

                                            {/* Title & Company */}
                                            <h3 className="text-xl font-bold text-dark-100 mb-1 group-hover:text-gradient transition-colors">
                                                {getLocalizedField(exp, 'title')}
                                            </h3>
                                            <p className="text-primary-400 font-medium mb-3">
                                                {exp.company}
                                                {exp.location && (
                                                    <span className="text-dark-500 ml-2">• {exp.location}</span>
                                                )}
                                            </p>

                                            {/* Description */}
                                            {getLocalizedField(exp, 'description') && (
                                                <p className="text-dark-400 leading-relaxed">
                                                    {getLocalizedField(exp, 'description')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && experiences.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📋</div>
                            <p className="text-dark-400 text-lg">Experience coming soon...</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Experience;
