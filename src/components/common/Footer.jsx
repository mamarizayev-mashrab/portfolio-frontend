import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 bg-background border-t border-dark-800">
            <div className="v-container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-mono font-bold tracking-tighter text-white">&lt;/&gt;</span>
                        <span className="text-xs font-mono text-dark-500 tracking-widest uppercase">
                            MAMARIZAYEV_PRTFL_V5.0
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-mono text-dark-500 uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <span>system_all_stable</span>
                        </div>
                        <span>&copy; {currentYear} ALL_RIGHTS_RESERVED</span>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-white transition-colors">Twitter (X)</a>
                            <a href="#" className="hover:text-white transition-colors">Github</a>
                            <a href="#" className="hover:text-white transition-colors">Linkedin</a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Subtle bottom glow */}
            <div className="absolute inset-x-0 bottom-0 h-[100px] bg-primary/5 blur-[100px] pointer-events-none" />
        </footer>
    );
};

export default Footer;
