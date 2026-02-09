import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const Login = () => {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const success = await login(email, password);
            if (success) {
                toast.success(t('admin.common.success'));
                navigate('/admin/dashboard');
            } else {
                toast.error(t('admin.common.error'));
            }
        } catch (error) {
            toast.error(error.message || t('admin.common.error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 v-grid-bg">
            <div className="w-full max-w-md space-y-8 animate-page-fade">
                {/* Header */}
                <div className="flex flex-col items-center gap-4 text-center">
                    <Link to="/" className="hover:opacity-80 transition-opacity">
                        <svg width="40" height="40" viewBox="0 0 76 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[var(--foreground)] fill-current">
                            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tighter">{t('login.title')}</h1>
                    <p className="text-sm text-[var(--accents-5)]">{t('login.subtitle')}</p>
                </div>

                {/* Card */}
                <div className="v-card border-[var(--accents-2)] shadow-magical">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('login.email')}</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)]"
                                placeholder="name@domain.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('login.password')}</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="v-input bg-[var(--accents-1)]/50 border-[var(--accents-2)]"
                                placeholder="••••••••"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-11 v-btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="w-4 h-4 border-2 border-[var(--background)] border-t-transparent animate-spin rounded-full" />
                                    <span>{t('login.loading')}</span>
                                </div>
                            ) : (
                                t('login.submit')
                            )}
                        </button>
                    </form>
                </div>

                <div className="pt-8 text-center border-t border-[var(--accents-2)]">
                    <Link to="/" className="text-xs font-medium text-[var(--accents-5)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        {t('login.back')}
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-[10px] font-mono text-[var(--accents-3)] uppercase tracking-widest font-bold">
                Mamarizayev.auth_system_v1.0
            </div>
        </div>
    );
};

export default Login;
