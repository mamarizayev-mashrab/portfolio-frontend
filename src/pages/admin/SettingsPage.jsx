/**
 * Settings Page
 * Manage site settings and i18n content
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios'; // Changed from '../../api/axios' to 'axios'
import { toast } from 'react-hot-toast'; // Replaced useToast with react-hot-toast
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext'; // Added useLanguage import
import { ButtonSpinner } from '../../components/common/Loading';

const SettingsPage = () => {
    // const { toast } = useToast(); // Removed custom hook usage
    const { changePassword } = useAuth();
    const { updateDynamicTranslations } = useLanguage(); // Added useLanguage hook usage
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('profile'); // Changed initial activeTab to 'profile'
    const [isLoading, setIsLoading] = useState(false); // Added isLoading state

    // Password change state
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [changingPassword, setChangingPassword] = useState(false);

    useEffect(() => { fetchSettings(); }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings');
            setSettings(response.data.data);
        } catch (error) {
            toast.error('Failed to load settings');
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
        { id: 'social', label: 'Social Links' },
        { id: 'theme', label: 'Theme' }
    ];

    if (loading) {
        return <div className="flex items-center justify-center h-64"><ButtonSpinner size="lg" /></div>;
    }

    return (
        <>
            <Helmet><title>Settings | Admin</title></Helmet>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark-100">Settings</h1>
                    <p className="text-dark-400">Manage your account and site settings</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 border-b border-dark-700">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                                ? 'text-primary-400 border-b-2 border-primary-400 -mb-px'
                                : 'text-dark-400 hover:text-dark-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="glass-dark rounded-xl border border-dark-700 p-6">
                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                            <h3 className="text-lg font-bold text-dark-100 mb-4">Change Password</h3>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="input-field"
                                    required
                                    minLength={8}
                                />
                                <p className="text-xs text-dark-500 mt-1">Minimum 8 characters with uppercase, lowercase, and number</p>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>
                            <button type="submit" disabled={changingPassword} className="btn-primary">
                                {changingPassword ? <ButtonSpinner /> : 'Change Password'}
                            </button>
                        </form>
                    )}

                    {/* Social Links Tab */}
                    {activeTab === 'social' && settings && (
                        <div className="max-w-md space-y-4">
                            <h3 className="text-lg font-bold text-dark-100 mb-4">Social Links</h3>
                            {['github', 'linkedin', 'twitter', 'telegram', 'instagram'].map((social) => (
                                <div key={social}>
                                    <label className="block text-sm text-dark-400 mb-1 capitalize">{social}</label>
                                    <input
                                        type="url"
                                        value={settings.social?.[social] || ''}
                                        onChange={(e) => updateSetting(`social.${social}`, e.target.value)}
                                        className="input-field"
                                        placeholder={`https://${social}.com/...`}
                                    />
                                </div>
                            ))}
                            <button onClick={handleSaveSettings} disabled={saving} className="btn-primary mt-4">
                                {saving ? <ButtonSpinner /> : 'Save Changes'}
                            </button>
                        </div>
                    )}

                    {/* Theme Tab */}
                    {activeTab === 'theme' && settings && (
                        <div className="max-w-md space-y-4">
                            <h3 className="text-lg font-bold text-dark-100 mb-4">Theme Settings</h3>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Default Theme</label>
                                <select
                                    value={settings.theme?.defaultMode || 'dark'}
                                    onChange={(e) => updateSetting('theme.defaultMode', e.target.value)}
                                    className="input-field"
                                >
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Primary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={settings.theme?.primaryColor || '#a855f7'}
                                        onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.theme?.primaryColor || '#a855f7'}
                                        onChange={(e) => updateSetting('theme.primaryColor', e.target.value)}
                                        className="input-field flex-1"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Accent Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={settings.theme?.accentColor || '#06b6d4'}
                                        onChange={(e) => updateSetting('theme.accentColor', e.target.value)}
                                        className="w-12 h-10 rounded cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.theme?.accentColor || '#06b6d4'}
                                        onChange={(e) => updateSetting('theme.accentColor', e.target.value)}
                                        className="input-field flex-1"
                                    />
                                </div>
                            </div>
                            <button onClick={handleSaveSettings} disabled={saving} className="btn-primary mt-4">
                                {saving ? <ButtonSpinner /> : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SettingsPage;
