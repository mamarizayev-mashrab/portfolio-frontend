import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const ExperienceManager = () => {
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
            toast.error('Failed to load experiences');
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
                toast.success('Experience updated');
            } else {
                await api.post('/experiences', data);
                toast.success('Experience created');
            }
            closeModal();
            fetchExperiences();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        console.log('Attempting to delete experience with ID:', id);
        if (!window.confirm('Delete this experience?')) return;
        try {
            const response = await api.delete(`/experiences/${id}`);
            console.log('Delete response:', response);
            toast.success('Experience deleted');
            await fetchExperiences();
        } catch (error) {
            console.error('Delete error:', error);
            const errMsg = error.response?.data?.message || 'Failed to delete';
            toast.error(errMsg);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const getLocalizedField = (field) => {
        if (typeof field === 'object') {
            return field.en || field.uz || field.ru || '';
        }
        return field || '';
    };

    return (
        <div className="p-6">
            <Helmet><title>Experience | Admin</title></Helmet>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tighter">Experience</h1>
                        <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">career_timeline</p>
                    </div>
                    <button onClick={() => openModal()} className="v-btn-primary h-10 px-4">+ Add Experience</button>
                </div>

                <div className="v-card p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-[var(--accents-5)]">Loading experiences...</div>
                    ) : experiences.length === 0 ? (
                        <div className="p-8 text-center text-[var(--accents-5)]">No experience entries yet</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--accents-2)]">
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Position</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Company</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Period</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Type</th>
                                    <th className="text-right p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experiences.map((exp) => (
                                    <tr key={exp._id} className="border-b border-[var(--accents-2)] hover:bg-[var(--accents-1)] transition-colors">
                                        <td className="p-4 font-bold">{getLocalizedField(exp.role) || getLocalizedField(exp.title)}</td>
                                        <td className="p-4 text-[var(--accents-5)]">{getLocalizedField(exp.company)}</td>
                                        <td className="p-4 text-[var(--accents-5)] text-sm font-mono">
                                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-mono rounded border ${exp.type === 'work' ? 'border-primary/30 text-primary bg-primary/5' :
                                                exp.type === 'education' ? 'border-cyan-500/30 text-cyan-500 bg-cyan-500/5' :
                                                    'border-[var(--accents-2)] text-[var(--accents-5)]'
                                                }`}>{exp.type}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => openModal(exp)} className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)] mr-4">Edit</button>
                                            <button onClick={() => handleDelete(exp._id)} className="text-sm text-[var(--accents-5)] hover:text-error-light">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="v-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold tracking-tight">{editingExp ? 'Edit Experience' : 'Add Experience'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Roles */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Role ({lang})</label>
                                        <input type="text" value={formData.role?.[lang] || ''} onChange={(e) => handleChange('role', e.target.value, lang)} className="v-input" required={lang === 'en'} />
                                    </div>
                                ))}
                            </div>

                            {/* Company */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Company ({lang})</label>
                                        <input type="text" value={formData.company?.[lang] || ''} onChange={(e) => handleChange('company', e.target.value, lang)} className="v-input" required={lang === 'en'} />
                                    </div>
                                ))}
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Description ({lang})</label>
                                        <textarea value={formData.description?.[lang] || ''} onChange={(e) => handleChange('description', e.target.value, lang)} className="v-input" rows={2} />
                                    </div>
                                ))}
                            </div>

                            {/* Type & Dates */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Type</label>
                                    <select value={formData.type} onChange={(e) => handleChange('type', e.target.value)} className="v-input">
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
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
                                        <span className="text-sm">Current</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--accents-2)]">
                                <button type="button" onClick={closeModal} className="v-btn-ghost h-10 px-4">Cancel</button>
                                <button type="submit" disabled={saving} className="v-btn-primary h-10 px-6">{saving ? 'Saving...' : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExperienceManager;
