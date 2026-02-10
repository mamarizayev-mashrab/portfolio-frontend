import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin/dashboard', label: t('admin.nav.dashboard'), icon: '⌘', end: true },
        { to: '/admin/projects', label: t('admin.nav.projects'), icon: '📁' },
        { to: '/admin/skills', label: t('admin.nav.skills'), icon: '✦' },
        { to: '/admin/experience', label: t('admin.nav.experience'), icon: '⧉' },
        { to: '/admin/articles', label: t('admin.nav.articles'), icon: '✎' },
        { to: '/admin/messages', label: t('admin.nav.messages'), icon: '✉' },
        { to: '/admin/settings', label: t('admin.nav.settings'), icon: '⚙' }
    ];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-0 h-full w-64 bg-[var(--background)] border-r border-[var(--accents-2)] flex flex-col z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-[var(--accents-2)]">
                    <Link to="/" className="flex items-center gap-2">
                        <svg width="24" height="24" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)] fill-current">
                            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                        </svg>
                        <span className="font-bold tracking-tighter text-sm uppercase">Admin_Portal</span>
                    </Link>
                    {/* Close button for mobile */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 text-[var(--accents-5)] hover:text-[var(--foreground)]"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            onClick={onClose}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-[var(--foreground)] text-[var(--background)]'
                                    : 'text-[var(--accents-5)] hover:bg-[var(--accents-1)] hover:text-[var(--foreground)]'
                                }
                            `}
                        >
                            <span className="text-base grayscale">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[var(--accents-2)]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-error-light hover:bg-error-light/10 transition-colors"
                    >
                        <span className="text-base">⎋</span>
                        <span>{t('admin.signOut')}</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
