import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';

const Footer = () => {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();
    const [socials, setSocials] = useState({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${API_URL}/settings`);
                if (response.data.data && response.data.data.social) {
                    setSocials(response.data.data.social);
                }
            } catch (error) {
                console.error('Failed to fetch footer settings:', error);
            }
        };
        fetchSettings();
    }, []);

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
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="text-[10px] font-mono text-[var(--accents-3)] uppercase tracking-widest font-bold flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            <span>All systems operational</span>
                        </div>

                        <span className="text-[10px] font-mono text-[var(--accents-3)] uppercase tracking-widest font-bold">
                            &copy; {currentYear} Created by M. Mashrab
                        </span>

                        <div className="flex items-center gap-6">
                            {socials.github && (
                                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-[var(--accents-4)] hover:text-[var(--foreground)] transition-colors group">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-2 transition-all">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                </a>
                            )}
                            {socials.twitter && (
                                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--accents-4)] hover:text-[var(--foreground)] transition-colors group">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-2 transition-all">
                                        <path d="M4 4l11.733 16h8.044l-13.715-16h-6.062z"></path>
                                        <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772"></path>
                                    </svg>
                                </a>
                            )}
                            {socials.linkedin && (
                                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--accents-4)] hover:text-[var(--foreground)] transition-colors group">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-2 transition-all">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                        <rect x="2" y="9" width="4" height="12"></rect>
                                        <circle cx="4" cy="4" r="2"></circle>
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
