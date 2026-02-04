```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const { logout } = useAuth();
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        messages: 0
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projects, skills, experiences, messages] = await Promise.all([
                    api.get('/projects'),
                    api.get('/skills'),
                    api.get('/experiences'),
                    api.get('/messages')
                ]);

                setStats({
                    projects: projects.data.count || projects.data.data?.length || 0,
                    skills: skills.data.count || skills.data.data?.length || 0,
                    experiences: experiences.data.count || experiences.data.data?.length || 0,
                    messages: messages.data.count || messages.data.data?.length || 0
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                if (error.response?.status === 401) {
                    logout();
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, [logout]);

    const navItems = [
        { name: 'Projects', path: '/admin/projects', icon: '⌘' },
        { name: 'Skills', path: '/admin/skills', icon: '✦' },
        { name: 'Experience', path: '/admin/experience', icon: '⧉' },
        { name: 'Messages', path: '/admin/messages', icon: '✉' },
        { name: 'Settings', path: '/admin/settings', icon: '⚙' },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header */}
            <header className="border-b border-[var(--accents-2)] bg-[var(--background)] sticky top-0 z-40">
                <div className="v-container flex items-center justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)] fill-current">
                                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                            </svg>
                        </Link>
                        <div className="h-6 w-px bg-[var(--accents-2)]" />
                        <h1 className="text-sm font-bold tracking-tight uppercase">Dashboard</h1>
                    </div>

                    <button
                        onClick={logout}
                        className="v-btn-ghost h-8 px-3 text-xs"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="v-container py-12 space-y-12 animate-page-fade">
                {/* Greeting */}
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tighter">Overview</h2>
                    <p className="text-[var(--accents-5)] text-sm">System status: Distributed_Infrastructure_OK</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className="v-card hover:bg-[var(--accents-1)]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{key}</span>
                                <span className="text-3xl font-bold tracking-tighter">
                                    {isLoading ? '...' : value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Navigation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-12 border-t border-[var(--accents-2)]">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="v-card group hover:border-[var(--foreground)] transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-xl text-[var(--accents-3)] group-hover:text-[var(--foreground)] transition-colors">{item.icon}</span>
                                <span className="font-bold tracking-tight">{item.name}</span>
                            </div>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--accents-2)] group-hover:text-[var(--foreground)] transition-colors group-hover:translate-x-1 transition-transform">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    ))}
                </div>
            </main>

            <footer className="v-container py-12 border-t border-[var(--accents-2)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[var(--accents-4)] uppercase tracking-[0.2em] font-bold">
                    <span>Admin_Engine_v5.0.0</span>
                    <div className="flex gap-4">
                        <span className="text-success-dark">● Operational</span>
                        <span>API_V1</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
