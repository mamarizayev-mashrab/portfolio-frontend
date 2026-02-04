import { useLanguage } from '../../context/LanguageContext';

const Skills = () => {
    const { t } = useLanguage();

    const categories = [
        {
            id: 'frontend',
            name: 'Frontend Core',
            description: 'Building fast, responsive, and accessible user interfaces.'
        },
        {
            id: 'backend',
            name: 'Backend Infrastructure',
            description: 'Scalable APIs and distributed database architectures.'
        },
        {
            id: 'tools',
            name: 'Technical Stack',
            description: 'DevOps, CI/CD, and modern development tooling.'
        },
    ];

    const skills = [
        { name: 'React', category: 'frontend', level: 95 },
        { name: 'Next.js', category: 'frontend', level: 98 },
        { name: 'Tailwind CSS', category: 'frontend', level: 98 },
        { name: 'Node.js', category: 'backend', level: 85 },
        { name: 'MongoDB', category: 'backend', level: 80 },
        { name: 'Express', category: 'backend', level: 88 },
        { name: 'TypeScript', category: 'tools', level: 92 },
        { name: 'Git', category: 'tools', level: 95 },
        { name: 'Docker', category: 'tools', level: 75 },
    ];

    return (
        <section id="skills" className="py-24 bg-[var(--background)] border-y border-[var(--accents-2)]">
            <div className="v-container">
                <div className="mb-20">
                    <span className="text-xs font-mono font-bold text-primary uppercase tracking-widest block mb-4">// capabilities_map</span>
                    <h2 className="text-5xl font-bold tracking-tighter text-[var(--foreground)]">Technical Excellence</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => (
                        <div key={cat.id} className="v-card hover:bg-[var(--accents-1)] transition-colors group">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold tracking-tight">{cat.name}</h3>
                                    <p className="text-sm text-[var(--accents-5)] leading-relaxed">{cat.description}</p>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-[var(--accents-2)]">
                                    {skills.filter(s => s.category === cat.id).map((skill) => (
                                        <div key={skill.name} className="flex items-center justify-between group/item">
                                            <span className="text-sm font-mono text-[var(--accents-6)] group-hover/item:text-[var(--foreground)] transition-colors">{skill.name}</span>
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
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
