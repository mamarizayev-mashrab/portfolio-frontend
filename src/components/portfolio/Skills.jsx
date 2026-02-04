import { useLanguage } from '../../context/LanguageContext';

const Skills = () => {
    const { t } = useLanguage();

    const categories = [
        {
            id: 'frontend',
            name: 'Frontend',
            icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#007AFF] drop-shadow-glow-cyan">
                    <path d="M4 6h16c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2zm0 2v8h16V8H4zm2 2h4v4H6v-4z" />
                </svg>
            )
        },
        {
            id: 'backend',
            name: 'Backend',
            icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#5856D6] drop-shadow-glow-purple">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                </svg>
            )
        },
        {
            id: 'tools',
            name: 'Tools',
            icon: (
                <svg viewBox="0 0 24 24" className="w-10 h-10 fill-[#FF9500]">
                    <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.5 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
                </svg>
            )
        },
    ];

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
        <section id="skills" className="py-24 bg-background relative">
            <div className="v-container">
                <div className="mb-20 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-primary rounded-full" />
                        <span className="v-text-mono text-primary">// industrial_capabilities</span>
                    </div>
                    <h2 className="v-heading text-white">System Architecture & <br /><span className="text-dark-500 italic font-medium">Expertise Pods.</span></h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {categories.map((cat) => (
                        <div key={cat.id} className="manga-panel p-10 space-y-12 group hover:bg-dark-900 border-dark-800 transition-all duration-500 rounded-[24px]">
                            <div className="flex flex-col gap-6">
                                <div className="w-16 h-16 bg-dark-800 rounded-[18px] flex items-center justify-center shadow-vercel group-hover:scale-110 transition-transform duration-500 border border-white/5">
                                    {cat.icon}
                                </div>
                                <span className="text-3xl font-bold tracking-tight text-white">{cat.name}</span>
                            </div>

                            <div className="space-y-6">
                                {skills.filter(s => s.category === cat.id).map((skill) => (
                                    <div key={skill.name} className="space-y-2">
                                        <div className="flex justify-between text-[11px] font-mono tracking-widest">
                                            <span className="text-dark-300 uppercase font-black">{skill.name}</span>
                                            <span className="text-dark-500">{skill.level}%</span>
                                        </div>
                                        <div className="h-[4px] w-full bg-dark-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 ease-out rounded-full"
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

            <div className="absolute inset-0 bg-v-grid opacity-10 pointer-events-none" />
        </section>
    );
};

export default Skills;
