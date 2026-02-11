import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const SkillsManager = () => {
    const { t, getLocalizedField } = useLanguage();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [saving, setSaving] = useState(false);

    const categories = ['Frontend', 'Backend', 'Mobile', 'Database', 'DevOps', 'Tools', 'Other'];

    const emptySkill = {
        name: { uz: '', en: '', ru: '' },
        icon: '',
        category: 'Frontend',
        level: 80,
        order: 0
    };
    const [formData, setFormData] = useState(emptySkill);

    useEffect(() => { fetchSkills(); }, []);

    const fetchSkills = async () => {
        try {
            const response = await api.get('/skills');
            setSkills(response.data.data || []);
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setLoading(false);
        }
    };

    const openModal = (skill = null) => {
        setEditingSkill(skill);
        if (skill) {
            // Handle case where name might be string or object
            const nameObj = typeof skill.name === 'object' ? skill.name : { uz: skill.name, en: skill.name, ru: skill.name };
            setFormData({ ...skill, name: nameObj });
        } else {
            setFormData(emptySkill);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSkill(null);
        setFormData(emptySkill);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingSkill) {
                await api.put(`/skills/${editingSkill._id}`, formData);
                toast.success(t('admin.common.success'));
            } else {
                await api.post('/skills', formData);
                toast.success(t('admin.common.success'));
            }
            closeModal();
            fetchSkills();
        } catch (error) {
            toast.error(error.response?.data?.message || t('admin.common.error'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('Delete clicked for skill id:', id);
        if (!window.confirm(t('admin.common.confirmDelete'))) {
            console.log('Delete cancelled by user');
            return;
        }
        console.log('User confirmed delete. Sending API request...');
        try {
            await api.delete(`/skills/${id}`);
            console.log('API delete success');
            toast.success(t('admin.common.success'));
            await fetchSkills();
        } catch (error) {
            console.error('API delete error:', error);
            const errMsg = error.response?.data?.message || t('admin.common.error');
            toast.error(errMsg);
        }
    };

    const getSkillName = (skill) => {
        return getLocalizedField(skill.name);
    };

    return (
        <div className="p-4 md:p-6">
            <Helmet><title>{t('admin.skills.title')} | Admin</title></Helmet>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">{t('admin.skills.title')}</h1>
                        <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">{t('admin.skills.management')}</p>
                    </div>
                    <button onClick={() => openModal()} className="v-btn-primary h-10 px-4 w-full md:w-auto">+ {t('admin.skills.newSkill')}</button>
                </div>

                <div className="v-card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.projects.table.loading')}</div>
                        ) : skills.length === 0 ? (
                            <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.common.noResults')}</div>
                        ) : (
                            <table className="w-full min-w-[600px]">
                                <thead>
                                    <tr className="border-b border-[var(--accents-2)]">
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.skills.name')}</th>
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.skills.category')}</th>
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.skills.proficiency')}</th>
                                        <th className="text-right p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.projects.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {skills.map((skill) => (
                                        <tr key={skill._id} className="border-b border-[var(--accents-2)] hover:bg-[var(--accents-1)] transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{skill.icon || '💻'}</span>
                                                    <span className="font-bold">{getSkillName(skill)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 text-xs font-mono rounded bg-[var(--accents-1)] border border-[var(--accents-2)] text-[var(--accents-5)]">
                                                    {t(`admin.skills.categories.${skill.category?.toLowerCase()}`, skill.category)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-24 h-1.5 bg-[var(--accents-2)] rounded-full overflow-hidden">
                                                        <div className="h-full bg-[var(--foreground)]" style={{ width: `${skill.level || skill.proficiency || 0}%` }} />
                                                    </div>
                                                    <span className="text-sm text-[var(--accents-5)] font-mono">{skill.level || skill.proficiency || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openModal(skill)} className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)] mr-4">{t('admin.common.edit')}</button>
                                                <button onClick={() => handleDelete(skill._id)} className="text-sm text-[var(--accents-5)] hover:text-error-light">{t('admin.common.delete')}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="v-card w-full max-w-lg animate-page-fade">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold tracking-tight">{editingSkill ? t('admin.common.edit') : t('admin.skills.newSkill')}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Fields Multi-lang */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.skills.name')} ({lang})</label>
                                        <input
                                            type="text"
                                            value={formData.name[lang] || ''}
                                            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, [lang]: e.target.value } })}
                                            className="v-input"
                                            required={lang === 'en'}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.skills.icon')}</label>
                                    <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="v-input" placeholder="💻" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.skills.category')}</label>
                                    <select value={formData.category?.toLowerCase()} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="v-input">
                                        {Object.keys(t('admin.skills.categories', {})).map(catKey => (
                                            <option key={catKey} value={catKey}>
                                                {t(`admin.skills.categories.${catKey}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.skills.proficiency')}: {formData.level || formData.proficiency || 0}%</label>
                                <input type="range" min="0" max="100" value={formData.level || formData.proficiency || 0} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className="w-full accent-[var(--foreground)]" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--accents-2)]">
                                <button type="button" onClick={closeModal} className="v-btn-ghost h-10 px-4">{t('admin.common.cancel')}</button>
                                <button type="submit" disabled={saving} className="v-btn-primary h-10 px-6">{saving ? t('admin.common.save') + '...' : t('admin.common.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillsManager;
