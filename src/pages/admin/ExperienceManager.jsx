import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const ExperienceManager = () => {
    const { t, getLocalizedField } = useLanguage();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [saving, setSaving] = useState(false);

    const types = ['work', 'education', 'freelance', 'other'];

    const emptyExp = {
        role: { uz: '', en: '', ru: '' },
        company: { uz: '', en: '', ru: '' },
        description: { uz: '', en: '', ru: '' },
        type: 'work',
        location: '',
        startDate: '',
        endDate: '',
        current: false
    };

    const [formData, setFormData] = useState(emptyExp);

    useEffect(() => { fetchExperiences(); }, []);

    const fetchExperiences = async () => {
        try {
            const response = await api.get('/experiences');
            setExperiences(response.data.data || []);
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setLoading(false);
        }
    };

    const openModal = (exp = null) => {
        if (exp) {
            setEditingExp(exp);
            setFormData({
                ...exp,
                startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
                endDate: exp.endDate ? exp.endDate.split('T')[0] : ''
            });
        } else {
            setEditingExp(null);
            setFormData(emptyExp);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingExp(null);
        setFormData(emptyExp);
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = { ...formData };
            if (data.current) data.endDate = null;

            if (editingExp) {
                await api.put(`/experiences/${editingExp._id}`, data);
                toast.success(t('admin.common.success'));
            } else {
                await api.post('/experiences', data);
                toast.success(t('admin.common.success'));
            }
            closeModal();
            fetchExperiences();
        } catch (error) {
            toast.error(error.response?.data?.message || t('admin.common.error'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.common.confirmDelete'))) return;
        try {
            await api.delete(`/experiences/${id}`);
            toast.success(t('admin.common.success'));
            await fetchExperiences();
        } catch (error) {
            const errMsg = error.response?.data?.message || t('admin.common.error');
            toast.error(errMsg);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const currentLang = localStorage.getItem('language') || 'uz';
        const locale = currentLang === 'uz' ? 'uz-UZ' : currentLang === 'ru' ? 'ru-RU' : 'en-US';
        return new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'short' });
    };

    return (
        <div className="p-4 md:p-6">
            <Helmet><title>{t('admin.experience.title')} | Admin</title></Helmet>
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">{t('admin.experience.title')}</h1>
                        <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">{t('admin.experience.management')}</p>
                    </div>
                    <button onClick={() => openModal()} className="v-btn-primary h-10 px-4 w-full md:w-auto">+ {t('admin.experience.newExperience')}</button>
                </div>

                <div className="v-card p-0 overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.projects.table.loading')}</div>
                        ) : experiences.length === 0 ? (
                            <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.common.noResults')}</div>
                        ) : (
                            <table className="w-full min-w-[800px]">
                                <thead>
                                    <tr className="border-b border-[var(--accents-2)]">
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.experience.position')}</th>
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.experience.company')}</th>
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.experience.period')}</th>
                                        <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.experience.type')}</th>
                                        <th className="text-right p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.projects.table.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {experiences.map((exp) => (
                                        <tr key={exp._id} className="border-b border-[var(--accents-2)] hover:bg-[var(--accents-1)] transition-colors">
                                            <td className="p-4 font-bold">{getLocalizedField(exp.role) || getLocalizedField(exp.title)}</td>
                                            <td className="p-4 text-[var(--accents-5)]">{getLocalizedField(exp.company)}</td>
                                            <td className="p-4 text-[var(--accents-5)] text-sm font-mono">
                                                {formatDate(exp.startDate)} — {exp.current ? t('experience.present') : formatDate(exp.endDate)}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-mono rounded border ${exp.type === 'work' ? 'border-primary/30 text-primary bg-primary/5' :
                                                    exp.type === 'education' ? 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5' :
                                                        'border-[var(--accents-2)] text-[var(--accents-5)]'
                                                    }`}>
                                                    {t(`admin.experience.types.${exp.type?.toLowerCase()}`, exp.type)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => openModal(exp)} className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)] mr-4">{t('admin.common.edit')}</button>
                                                <button onClick={() => handleDelete(exp._id)} className="text-sm text-[var(--accents-5)] hover:text-error-light">{t('admin.common.delete')}</button>
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
                    <div className="v-card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-page-fade">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold tracking-tight">{editingExp ? t('admin.common.edit') : t('admin.experience.newExperience')}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Roles */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.experience.position')} ({lang})</label>
                                        <input type="text" value={formData.role?.[lang] || ''} onChange={(e) => handleChange('role', e.target.value, lang)} className="v-input" required={lang === 'en'} />
                                    </div>
                                ))}
                            </div>

                            {/* Company */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.experience.company')} ({lang})</label>
                                        <input type="text" value={formData.company?.[lang] || ''} onChange={(e) => handleChange('company', e.target.value, lang)} className="v-input" required={lang === 'en'} />
                                    </div>
                                ))}
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Description ({lang})</label>
                                        <textarea value={formData.description?.[lang] || ''} onChange={(e) => handleChange('description', e.target.value, lang)} className="v-input" rows={2} />
                                    </div>
                                ))}
                            </div>

                            {/* Type & Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.experience.type')}</label>
                                    <select value={formData.type?.toLowerCase()} onChange={(e) => handleChange('type', e.target.value)} className="v-input">
                                        {Object.keys(t('admin.experience.types', {})).map(typeKey => (
                                            <option key={typeKey} value={typeKey}>
                                                {t(`admin.experience.types.${typeKey}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Start Date</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="v-input" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">End Date</label>
                                    <input type="date" value={formData.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className="v-input" disabled={formData.current} />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.current} onChange={(e) => handleChange('current', e.target.checked)} className="w-4 h-4 accent-[var(--foreground)]" />
                                        <span className="text-sm">{t('experience.present')}</span>
                                    </label>
                                </div>
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

export default ExperienceManager;
