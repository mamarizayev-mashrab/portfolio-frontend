import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="py-12 bg-[var(--background)] border-t border-[var(--accents-2)]">
            <div className="v-container">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Brand */}
                    <div className="flex items-center gap-4">
                        <svg width="20" height="20" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)] fill-current">
                            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                        </svg>
                        <span className="text-[10px] font-mono font-bold text-[var(--accents-4)] tracking-widest uppercase">
                            Mamarizayev.system_v5.0
                        </span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col md:flex-row items-center gap-8 text-[10px] font-mono text-[var(--accents-3)] uppercase tracking-widest font-bold">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>All systems operational</span>
                        </div>
                        <span>&copy; {currentYear} Created by M. Mashrab</span>
                        <div className="flex gap-6">
                            <a href="#" className="hover:text-[var(--foreground)] transition-colors underline decoration-1 underline-offset-2">GitHub</a>
                            <a href="#" className="hover:text-[var(--foreground)] transition-colors underline decoration-1 underline-offset-2">X(Twitter)</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
