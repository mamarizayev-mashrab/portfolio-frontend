import { useLanguage } from '../../context/LanguageContext';

const Experience = () => {
    const { t } = useLanguage();

    const experiences = [
        {
            company: "SYSTEM_LEVEL_AI",
            role: "Senior Full-Stack Engineer",
            period: "2023 - PRESENT",
            points: ["Architecting scalable microservices", "Optimizing UI performance"]
        },
        {
            company: "CORE_TEK_SOLUTIONS",
            role: "Middle Web Developer",
            period: "2021 - 2023",
            points: ["Built production-ready React apps", "Integrated complex APIs"]
        },
        {
            company: "STARTUP_LABS",
            role: "Junior Developer",
            period: "2020 - 2021",
            points: ["Frontend component development", "Bug fixing and optimization"]
        }
    ];

    return (
        <section id="experience" className="py-24 bg-background relative border-t border-dark-800">
            <div className="v-container">
                <div className="mb-20 text-center space-y-4">
                    <span className="v-text-mono text-primary">// professional_trajectory</span>
                    <h2 className="v-heading text-white">Chronicle of <br /><span className="text-dark-500 italic">Evolution.</span></h2>
                </div>

                <div className="max-w-4xl mx-auto">
                    {experiences.map((exp, index) => (
                        <div key={exp.company} className="relative pl-12 pb-16 last:pb-0 group">
                            {/* Vertical Line */}
                            {index !== experiences.length - 1 && (
                                <div className="absolute left-[7px] top-4 bottom-0 w-[1px] bg-dark-800 group-hover:bg-primary/30 transition-colors" />
                            )}

                            {/* Marker */}
                            <div className="absolute left-0 top-1 w-4 h-4 border border-dark-700 bg-background group-hover:border-primary transition-all">
                                <div className="absolute inset-1 bg-dark-800 group-hover:bg-primary transition-colors" />
                            </div>

                            <div className="space-y-4 animate-reveal">
                                <span className="v-text-mono text-dark-500 font-bold">{exp.period}</span>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h3 className="text-2xl font-bold tracking-tighter text-white group-hover:text-primary transition-colors">
                                        {exp.role}
                                    </h3>
                                    <span className="text-sm font-mono text-dark-500 bg-dark-900 border border-dark-800 px-4 py-1">
                                        @{exp.company}
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {exp.points.map(point => (
                                        <li key={point} className="flex items-start gap-3 text-dark-400 text-sm">
                                            <span className="text-primary mt-1.5 min-w-[6px] h-[6px] rounded-full border border-primary/20" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
