import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';

const Projects = () => {
    const { t, getLocalizedField } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                const fetchedProjects = response.data.data || [];
                // Filter only published projects
                setProjects(fetchedProjects.filter(p => p.status === 'published'));
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) return <div className="py-24 text-center">Loading projects...</div>;

    return (
        <section
            id="projects"
            className="py-24 bg-[var(--background)]"
            aria-labelledby="projects-heading"
        >
            <div className="v-container">
                <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block font-bold" aria-hidden="true">// deployment_registry</span>
                        <h2 id="projects-heading" className="text-5xl font-bold tracking-tighter">{t('projects.title', 'Selected Works')}</h2>
                    </div>
                    <p className="text-[var(--accents-5)] max-w-xs text-sm font-medium">
                        {t('projects.subtitle', 'Focused on performance, reliability, and modern web architecture.')}
                    </p>
                </header>

                <div
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    role="list"
                    aria-label="Portfolio projects"
                >
                    {projects.map((project) => (
                        <article
                            key={project._id}
                            className="v-card group flex flex-col justify-between min-h-[320px] hover:bg-[var(--accents-1)] transition-all"
                            itemScope
                            itemType="https://schema.org/CreativeWork"
                            role="listitem"
                        >
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex flex-col h-full"
                                aria-label={`${getLocalizedField(project.title)} - ${t('projects.viewProject', 'View project')}`}
                                itemProp="url"
                            >
                                <div className="space-y-6 flex-1">
                                    {project.image && (
                                        <figure className="relative w-full h-48 overflow-hidden rounded-md border border-[var(--accents-2)]">
                                            <img
                                                src={project.image}
                                                alt={`${getLocalizedField(project.title)} - ${t('projects.screenshot', 'project screenshot')}`}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                                itemProp="image"
                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
                                            />
                                        </figure>
                                    )}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-primary transition-colors" itemProp="name">
                                                {getLocalizedField(project.title)}
                                            </h3>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accents-3)] group-hover:text-[var(--foreground)] transition-colors shrink-0" aria-hidden="true">
                                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-[var(--accents-5)] leading-relaxed font-medium line-clamp-3" itemProp="description">
                                            {getLocalizedField(project.description)}
                                        </p>
                                    </div>
                                </div>

                                <footer className="mt-8 pt-6 border-t border-[var(--accents-2)] flex items-center justify-between">
                                    <div className="flex gap-2 flex-wrap" aria-label="Technologies used">
                                        {project.technologies?.slice(0, 3).map(Tech => (
                                            <span
                                                key={Tech}
                                                className="px-2 py-0.5 bg-[var(--background)] border border-[var(--accents-2)] text-[10px] font-mono text-[var(--accents-5)] uppercase"
                                                itemProp="keywords"
                                            >
                                                {Tech}
                                            </span>
                                        ))}
                                    </div>
                                </footer>
                            </a>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
