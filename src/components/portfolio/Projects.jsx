import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

const Projects = () => {
    const { t } = useLanguage();

    // Default project data for ultra-premium preview
    const projectList = [
        {
            title: "NEON_GENESIS_API",
            description: "High-performance distributed API system with Manga-inspired dashboard UI.",
            tech: ["React", "Go", "Docker"],
            link: "#",
            img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800",
            category: "System"
        },
        {
            title: "CYBER_VAULT_OS",
            description: "Minimalist cloud storage with quantum-safe encryption and Vercel-style UX.",
            tech: ["TypeScript", "Next.js", "Redis"],
            link: "#",
            img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
            category: "Cloud"
        },
        {
            title: "MANGA_ENGINE_X",
            description: "GPU-accelerated rendering engine for web-based manga storytelling.",
            tech: ["WebGPU", "C++", "Wasm"],
            link: "#",
            img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800",
            category: "Graphic"
        }
    ];

    return (
        <section id="projects" className="py-24 bg-background relative overflow-hidden">
            <div className="v-container">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                    <div className="space-y-4">
                        <span className="v-text-mono text-primary">// selected_works</span>
                        <h2 className="v-heading text-white">Engineering <br /><span className="text-dark-500 italic">Distinction.</span></h2>
                    </div>
                    <div className="text-right">
                        <p className="v-text-mono text-dark-500 max-w-xs ml-auto">
                            A curated collection of systems designed for maximum stability and visual impact.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {projectList.map((project, index) => (
                        <div
                            key={project.title}
                            className="group relative manga-panel bg-dark-900 border border-dark-800 hover:border-primary/50 transition-all duration-500"
                        >
                            {/* Project Header */}
                            <div className="p-8 space-y-4">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-mono text-dark-500 tracking-tighter uppercase font-bold">
                                        [{project.category}]
                                    </span>
                                    <span className="text-primary font-mono text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                        0{index + 1}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-dark-400 text-sm leading-relaxed mb-6 font-medium">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {project.tech.map(t => (
                                        <span key={t} className="px-3 py-1 bg-dark-800 border border-dark-700 text-[10px] font-mono text-dark-300 uppercase">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Minimal Image / Frame Area */}
                            <div className="p-1 px-8 pb-8">
                                <div className="aspect-video relative grayscale group-hover:grayscale-0 transition-all duration-700 border border-dark-700 overflow-hidden">
                                    <img
                                        src={project.img}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent" />

                                    {/* Hover CTA */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="v-btn-primary scale-90 group-hover:scale-100 transition-transform px-6 py-2 text-xs">
                                            VIEW_REPO
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Manga Frame Accents */}
                            <div className="absolute top-0 right-0 w-2 h-2 bg-dark-800 border-r border-t border-dark-700" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 bg-dark-800 border-l border-b border-dark-700" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
