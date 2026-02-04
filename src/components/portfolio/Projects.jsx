import { useLanguage } from '../../context/LanguageContext';

const Projects = () => {
    const { t } = useLanguage();

    const projects = [
        {
            title: "distributed_api_v5",
            description: "A high-performance distributed API system built for ultra-low latency and scalable deployments.",
            tech: ["Go", "Redis", "Docker"],
            link: "https://github.com",
            category: "Infrastructure"
        },
        {
            title: "geist_ui_system",
            description: "A design-agnostic UI library focusing on performance, accessibility, and minimalist aesthetics.",
            tech: ["React", "TypeScript", "Tailwind"],
            link: "https://github.com",
            category: "Tooling"
        },
        {
            title: "quantum_storage_cloud",
            description: "Secure cloud storage platform utilizing quantum-resistant encryption protocols.",
            tech: ["Next.js", "Rust", "Wasm"],
            link: "https://github.com",
            category: "Cloud"
        }
    ];

    return (
        <section id="projects" className="py-24 bg-[var(--background)]">
            <div className="v-container">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block font-bold">// deployment_registry</span>
                        <h2 className="text-5xl font-bold tracking-tighter">Selected Works</h2>
                    </div>
                    <p className="text-[var(--accents-5)] max-w-xs text-sm font-medium">
                        Focused on performance, reliability, and modern web architecture.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <a
                            key={project.title}
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="v-card group flex flex-col justify-between min-h-[320px] hover:bg-[var(--accents-1)] transition-all"
                        >
                            <div className="space-y-6">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-primary transition-colors">
                                        {project.title}
                                    </h3>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accents-3)] group-hover:text-[var(--foreground)] transition-colors">
                                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                                    </svg>
                                </div>
                                <p className="text-sm text-[var(--accents-5)] leading-relaxed font-medium">
                                    {project.description}
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[var(--accents-2)] flex items-center justify-between">
                                <div className="flex gap-2">
                                    {project.tech.map(t => (
                                        <span key={t} className="px-2 py-0.5 bg-[var(--background)] border border-[var(--accents-2)] text-[10px] font-mono text-[var(--accents-5)] uppercase">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase tracking-widest">
                                    {project.category}
                                </span>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <button className="v-btn-ghost group">
                        View All Projects
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 group-hover:translate-x-1 transition-transform">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Projects;
