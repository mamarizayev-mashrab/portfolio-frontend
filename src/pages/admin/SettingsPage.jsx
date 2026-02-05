import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const SettingsPage = () => {
    const { changePassword } = useAuth();
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
            await api.put('/settings', settings);
            toast.success('Settings saved');
        } catch (error) {
            toast.error('Failed to save settings');
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

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setChangingPassword(true);
        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        if (result.success) {
            toast.success('Password changed successfully');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            toast.error(result.message);
        }
        setChangingPassword(false);
    };

    const tabs = [
        { id: 'password', label: 'Password' },
        { id: 'contact', label: 'Contact Info' },
        { id: 'social', label: 'Social Links' },
        { id: 'theme', label: 'Theme' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-[var(--foreground)] border-t-transparent animate-spin rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Helmet><title>Settings | Admin</title></Helmet>
            <div className="space-y-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Settings</h1>
                    <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">system_configuration</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-[var(--accents-2)]">
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
                <div className="v-card">
                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Change Password</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="v-input"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="v-input"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-[var(--accents-5)]">Minimum 8 characters</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="v-input"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={changingPassword} className="v-btn-primary h-10 px-6">
                                {changingPassword ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && settings && (
                        <div className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Social Links</h3>
                            {['github', 'linkedin', 'twitter', 'telegram', 'instagram'].map((social) => (
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
                            <button onClick={handleSaveSettings} disabled={saving} className="v-btn-primary h-10 px-6">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Contact Info Tab */}
                    {activeTab === 'contact' && settings && (
                        <div className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Contact Information</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    value={settings.contact?.email || ''}
                                    onChange={(e) => updateSetting('contact.email', e.target.value)}
                                    className="v-input"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Phone Number</label>
                                <input
                                    type="text"
                                    value={settings.contact?.phone || ''}
                                    onChange={(e) => updateSetting('contact.phone', e.target.value)}
                                    className="v-input"
                                    placeholder="+998 90 123 45 67"
                                />
                            </div>
                            <div className="space-y-4 pt-4 border-t border-[var(--accents-2)]">
                                <span className="text-sm font-bold">Location</span>
                                {['uz', 'en', 'ru'].map(lang => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Location ({lang.toUpperCase()})</label>
                                        <input
                                            type="text"
                                            value={settings.contact?.location?.[lang] || ''}
                                            onChange={(e) => updateSetting(`contact.location.${lang}`, e.target.value)}
                                            className="v-input"
                                            placeholder={`Tashkent, Uzbekistan`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleSaveSettings} disabled={saving} className="v-btn-primary h-10 px-6">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Theme Tab */}
                    {activeTab === 'theme' && settings && (
                        <div className="max-w-md space-y-6">
                            <h3 className="text-xl font-bold tracking-tight">Theme Settings</h3>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Default Theme</label>
                                <select
                                    value={settings.theme?.defaultMode || 'dark'}
                                    onChange={(e) => updateSetting('theme.defaultMode', e.target.value)}
                                    className="v-input"
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Primary Color</label>
                                <div className="flex gap-3">
                                    <input
                                        type="color"
                                        value={settings.theme?.primaryColor || '#a855f7'}
                                        onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer border border-[var(--accents-2)]"
                                    />
                                    <input
                                        type="text"
                                        value={settings.theme?.primaryColor || '#a855f7'}
                                        onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                                        className="v-input flex-1"
                                    />
                                </div>
                            </div>
                            <button onClick={handleSaveSettings} disabled={saving} className="v-btn-primary h-10 px-6">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
