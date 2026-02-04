/**
 * Projects Section Component
 * Display portfolio projects with hover effects
 */

import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../api/axios';
import { SkeletonProjectCard } from '../common/Loading';

const Projects = () => {
    const { t, getLocalizedField } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects?status=published');
                setProjects(response.data.data || []);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <section id="projects" className="py-24 relative">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900/50 to-dark-950" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="section-title">{t('projects.title')}</h2>
                    <p className="section-subtitle">{t('projects.subtitle')}</p>
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <SkeletonProjectCard key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project, index) => (
                            <article
                                key={project._id || index}
                                className="group relative rounded-xl overflow-hidden glass-dark border border-dark-700 hover:border-primary-500/30 transition-all duration-300 hover:shadow-glow-sm"
                            >
                                {/* Featured Badge */}
                                {project.featured && (
                                    <div className="absolute top-4 right-4 z-20">
                                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30">
                                            {t('projects.featured')}
                                        </span>
                                    </div>
                                )}

                                {/* Project Image */}
                                <div className="relative h-52 overflow-hidden">
                                    {project.image ? (
                                        <img
                                            src={project.image}
                                            alt={getLocalizedField(project, 'title')}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                                            <span className="text-5xl text-dark-600 font-mono">&lt;/&gt;</span>
                                        </div>
                                    )}

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Action buttons on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                                {t('projects.viewLive')}
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-lg bg-dark-700 text-white font-medium hover:bg-dark-600 transition-colors flex items-center gap-2"
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                                </svg>
                                                {t('projects.viewCode')}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-dark-100 mb-2 group-hover:text-primary-400 transition-colors">
                                        {getLocalizedField(project, 'title')}
                                    </h3>
                                    <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                                        {getLocalizedField(project, 'description')}
                                    </p>

                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2">
                                        {(project.technologies || []).slice(0, 4).map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 text-xs rounded-full bg-dark-700/50 text-dark-300 border border-dark-600"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {(project.technologies || []).length > 4 && (
                                            <span className="px-2 py-1 text-xs rounded-full bg-dark-700/50 text-dark-400">
                                                +{project.technologies.length - 4}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && projects.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🚧</div>
                        <p className="text-dark-400 text-lg">Projects coming soon...</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Projects;
