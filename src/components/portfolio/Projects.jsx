import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../utils/assetUtils';

const Projects = () => {
    const { t, getLocalizedField } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                const fetchedProjects = response.data.data || [];
                // Filter projects based on allowed statuses
                const allowedStatuses = ['published', 'completed', 'in_progress', 'approved'];
                setProjects(fetchedProjects.filter(p => allowedStatuses.includes(p.status || 'published')));
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
                    {projects.map((project) => {
                        const statusConfig = {
                            in_progress: { label: "Jarayonda", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
                            completed: { label: "Tugatildi", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                            published: { label: null, color: null }, // Don't show badge for published
                            approved: { label: "Qabul qilindi", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" }
                        };
                        const statusIdx = project.status || 'published';
                        const badge = statusConfig[statusIdx];

                        return (
                            <article
                                key={project._id}
                                className="v-card group flex flex-col justify-between min-h-[400px] hover:bg-[var(--accents-1)] transition-all relative overflow-hidden"
                                itemScope
                                itemType="https://schema.org/CreativeWork"
                                role="listitem"
                            >
                                {badge && badge.label && (
                                    <span className={`absolute top-4 right-4 z-10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded bg-[var(--background)]/80 backdrop-blur-sm ${badge.color}`}>
                                        {badge.label}
                                    </span>
                                )}

                                <div className="space-y-6 flex-1">
                                    {/* Project Image */}
                                    <figure className="relative w-full h-48 overflow-hidden rounded-md border border-[var(--accents-2)] bg-[var(--accents-1)]">
                                        {project.image ? (
                                            <img
                                                src={getImageUrl(project.image)}
                                                alt={`${getLocalizedField(project.title)}`}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                loading="lazy"
                                                decoding="async"
                                                itemProp="image"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/600x400?text=Project+Image';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--accents-3)]">
                                                <span className="font-mono text-xs">NO IMAGE</span>
                                            </div>
                                        )}

                                        {/* Overlay with Quick Links */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-white text-black rounded-full hover:scale-110 transition-transform"
                                                    title="Live Preview"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                </a>
                                            )}
                                            {project.githubUrl && (
                                                <a
                                                    href={project.githubUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-[var(--accents-8)] text-[var(--background)] rounded-full hover:scale-110 transition-transform"
                                                    title="Source Code"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                                </a>
                                            )}
                                        </div>
                                    </figure>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-xl font-bold tracking-tight text-[var(--foreground)]" itemProp="name">
                                                {getLocalizedField(project.title)}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-[var(--accents-5)] leading-relaxed line-clamp-3" itemProp="description">
                                            {getLocalizedField(project.description)}
                                        </p>
                                    </div>
                                </div>

                                <footer className="mt-6 pt-4 border-t border-[var(--accents-2)] space-y-4">
                                    {/* Technologies */}
                                    <div className="flex flex-wrap gap-2" aria-label="Technologies used">
                                        {project.technologies?.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-0.5 bg-[var(--accents-1)] border border-[var(--accents-2)] rounded text-[10px] font-mono text-[var(--accents-6)] uppercase"
                                                itemProp="keywords"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Links (Mobile/Fallback) */}
                                    <div className="flex gap-4 pt-2">
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                                Live Preview
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold flex items-center gap-1 hover:text-primary transition-colors">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                                                Source Code
                                            </a>
                                        )}
                                    </div>
                                </footer>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Projects;
