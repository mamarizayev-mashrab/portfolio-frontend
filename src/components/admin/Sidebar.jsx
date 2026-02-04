import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: '⌘', end: true },
        { to: '/admin/projects', label: 'Projects', icon: '📁' },
        { to: '/admin/skills', label: 'Skills', icon: '✦' },
        { to: '/admin/experience', label: 'Experience', icon: '⧉' },
        { to: '/admin/messages', label: 'Messages', icon: '✉' },
        { to: '/admin/settings', label: 'Settings', icon: '⚙' }
    ];

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-[var(--background)] border-r border-[var(--accents-2)] flex flex-col z-40">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-[var(--accents-2)]">
                <Link to="/" className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)] fill-current">
                        <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                    </svg>
                    <span className="font-bold tracking-tighter text-sm uppercase">Admin_Portal</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
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
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
