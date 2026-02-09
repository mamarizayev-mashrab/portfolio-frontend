import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const SettingsPage = () => {
    const { t } = useLanguage();
    const { changePassword } = useAuth();
    const { theme, setTheme, setPrimaryColor } = useTheme();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('password');

    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings(response.data.data);
        } catch (error) {
            console.log('Settings not configured yet');
            setSettings({});
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const cleanSettings = { ...settings };
            if (!cleanSettings.theme) cleanSettings.theme = {};
            cleanSettings.theme.defaultMode = theme;

            await api.put('/settings', cleanSettings);
            toast.success(t('admin.common.success'));
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (path, value) => {
        setSettings(prev => {
            const newSettings = { ...prev };
            const keys = path.split('.');
            let current = newSettings;
            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newSettings;
        });
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        updateSetting('theme.defaultMode', newTheme);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error(t('admin.settings.password.mismatch'));
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error(t('admin.settings.password.rules'));
            return;
        }

        setChangingPassword(true);
        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        if (result.success) {
            toast.success(t('admin.settings.password.success'));
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            console.error(result.message);
            toast.error(result.message || t('admin.common.error'));
        }
        setChangingPassword(false);
    };

    const tabs = [
        { id: 'password', label: t('admin.settings.tabs.password') },
        { id: 'contact', label: t('admin.settings.tabs.contact') },
        { id: 'social', label: t('admin.settings.tabs.social') },
        { id: 'theme', label: t('admin.settings.tabs.theme') }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-[var(--foreground)] border-t-transparent animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <Helmet><title>{t('admin.settings.title')} | Admin</title></Helmet>
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">{t('admin.settings.title')}</h1>
                    <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">{t('admin.settings.management')}</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-[var(--accents-2)] overflow-x-auto whitespace-nowrap pb-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 text-sm font-bold transition-colors ${activeTab === tab.id
                                ? 'text-[var(--foreground)] border-b-2 border-[var(--foreground)] -mb-px'
                                : 'text-[var(--accents-4)] hover:text-[var(--foreground)]'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="v-card animate-page-fade">
                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">{t('admin.settings.password.title')}</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.password.current')}</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="v-input"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.password.new')}</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="v-input"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-[var(--accents-5)]">{t('admin.settings.password.rules')}</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.password.confirm')}</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="v-input"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={changingPassword} className="v-btn-primary h-10 px-6 w-full md:w-auto">
                                {changingPassword ? t('admin.settings.password.updating') : t('admin.settings.password.submit')}
                            </button>
                        </form>
                    )}

                    {/* Contact Info Tab */}
                    {activeTab === 'contact' && settings && (
                        <div className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">{t('admin.settings.contact.title')}</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.contact.email')}</label>
                                <input
                                    type="email"
                                    value={settings.contact?.email || ''}
                                    onChange={(e) => updateSetting('contact.email', e.target.value)}
                                    className="v-input"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-[var(--accents-2)]">
                                <span className="text-sm font-bold">{t('admin.settings.contact.location')}</span>
                                {['UZ', 'EN', 'RU'].map(lang => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.contact.location')} ({lang})</label>
                                        <input
                                            type="text"
                                            value={settings.contact?.location?.[lang.toLowerCase()] || ''}
                                            onChange={(e) => updateSetting(`contact.location.${lang.toLowerCase()}`, e.target.value)}
                                            className="v-input"
                                            placeholder={`Tashkent, Uzbekistan`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSaveSettings} disabled={saving} className="v-btn-primary h-10 px-6 w-full md:w-auto">
                                {saving ? t('admin.common.save') + '...' : t('admin.common.save')}
                            </button>
                        </div>
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && settings && (
                        <div className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">{t('admin.settings.social.title')}</h3>
                            {['github', 'linkedin', 'twitter'].map((social) => (
                                <div key={social} className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{social}</label>
                                    <input
                                        type="url"
                                        value={settings.social?.[social] || ''}
                                        onChange={(e) => updateSetting(`social.${social}`, e.target.value)}
                                        className="v-input"
                                        placeholder={`https://${social}.com/...`}
                                    />
                                </div>
                            ))}
                            <button onClick={handleSaveSettings} disabled={saving} className="v-btn-primary h-10 px-6 w-full md:w-auto">
                                {saving ? t('admin.common.save') + '...' : t('admin.common.save')}
                            </button>
                        </div>
                    )}

                    {/* Theme Tab */}
                    {activeTab === 'theme' && settings && (
                        <div className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">{t('admin.settings.theme.title')}</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.theme.mode')}</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleThemeChange('light')}
                                        className={`flex-1 p-3 rounded-md border-2 font-bold transition-all ${theme === 'light' ? 'border-[var(--foreground)] bg-[var(--accents-1)] text-[var(--foreground)]' : 'border-[var(--accents-2)] text-[var(--accents-5)]'}`}
                                    >
                                        {t('admin.settings.theme.light')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleThemeChange('dark')}
                                        className={`flex-1 p-3 rounded-md border-2 font-bold transition-all ${theme === 'dark' ? 'border-[var(--foreground)] bg-[var(--accents-1)] text-[var(--foreground)]' : 'border-[var(--accents-2)] text-[var(--accents-5)]'}`}
                                    >
                                        {t('admin.settings.theme.dark')}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.settings.theme.primaryColor')}</label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={settings.theme?.primaryColor || '#a855f7'}
                                        onChange={(e) => {
                                            const color = e.target.value;
                                            updateSetting('theme.primaryColor', color);
                                            setPrimaryColor(color);
                                        }}
                                        className="w-12 h-10 rounded cursor-pointer border border-[var(--accents-2)]"
                                    />
                                    <input
                                        type="text"
                                        value={settings.theme?.primaryColor || '#a855f7'}
                                        onChange={(e) => {
                                            const color = e.target.value;
                                            updateSetting('theme.primaryColor', color);
                                            setPrimaryColor(color);
                                        }}
                                        className="v-input flex-1"
                                    />
                                </div>
                            </div>
                            <button onClick={handleSaveSettings} disabled={saving} className="v-btn-primary h-10 px-6 w-full md:w-auto">
                                {saving ? t('admin.common.save') + '...' : t('admin.common.save')}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
