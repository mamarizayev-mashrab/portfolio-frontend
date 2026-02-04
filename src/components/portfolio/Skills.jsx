import { useLanguage } from '../../context/LanguageContext';

const Skills = () => {
    const { t } = useLanguage();

    const categories = [
        { id: 'frontend', name: 'Frontend', icon: '◈' },
        { id: 'backend', name: 'Backend', icon: '◇' },
        { id: 'tools', name: 'Tools', icon: '▣' },
    ];

    // Simulating skills data if not provided by context
    const skills = [
        { name: 'React', category: 'frontend', level: 95 },
        { name: 'Next.js', category: 'frontend', level: 90 },
        { name: 'Tailwind CSS', category: 'frontend', level: 98 },
        { name: 'Node.js', category: 'backend', level: 85 },
        { name: 'MongoDB', category: 'backend', level: 80 },
        { name: 'Express', category: 'backend', level: 88 },
        { name: 'TypeScript', category: 'tools', level: 85 },
        { name: 'Git', category: 'tools', level: 92 },
        { name: 'Docker', category: 'tools', level: 75 },
    ];

    return (
        <section id="skills" className="py-24 bg-background relative border-y border-dark-800">
            <div className="v-container">
                <div className="mb-20 space-y-4">
                    <span className="v-text-mono text-primary">// expertise_stack</span>
                    <h2 className="v-heading text-white">Advanced Professional <br /><span className="text-dark-500 italic">Capabilities.</span></h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-dark-700 bg-dark-700">
                    {categories.map((cat) => (
                        <div key={cat.id} className="bg-background p-10 space-y-10 group hover:bg-dark-900 transition-all duration-500 border-b lg:border-b-0 lg:border-r last:border-0 border-dark-700">
                            <div className="flex items-center justify-between">
                                <span className="text-2xl font-bold tracking-tighter text-white">{cat.name}</span>
                                <span className="text-2xl text-primary opacity-50 group-hover:opacity-100 group-hover:scale-125 transition-all">{cat.icon}</span>
                            </div>

                            <div className="space-y-6">
                                {skills.filter(s => s.category === cat.id).map((skill) => (
                                    <div key={skill.name} className="space-y-2">
                                        <div className="flex justify-between text-[13px] font-mono">
                                            <span className="text-dark-200 uppercase tracking-tighter">{skill.name}</span>
                                            <span className="text-dark-500 font-bold">{skill.level}%</span>
                                        </div>
                                        <div className="h-[2px] w-full bg-dark-800 relative overflow-hidden">
                                            <div
                                                className="absolute top-0 left-0 h-full bg-primary group-hover:bg-accent transition-all duration-1000"
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background Narrative Grid */}
            <div className="absolute inset-0 bg-v-grid opacity-20 pointer-events-none" />
        </section>
    );
};

export default Skills;
