/**
 * Experience Manager Page
 * CRUD operations for work experience/education
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { useToast } from '../../components/common/Toast';
import { ButtonSpinner } from '../../components/common/Loading';

const ExperienceManager = () => {
    const { toast } = useToast();
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [saving, setSaving] = useState(false);

    const types = ['work', 'education', 'freelance', 'other'];

    const emptyExp = {
        title: { uz: '', en: '', ru: '' },
        company: '',
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
        if (!confirm('Delete this experience?')) return;
        try {
            await api.delete(`/experiences/${id}`);
            toast.success('Experience deleted');
            fetchExperiences();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <>
            <Helmet><title>Experience | Admin</title></Helmet>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-100">Experience</h1>
                        <p className="text-dark-400">Manage your work history and education</p>
                    </div>
                    <button onClick={() => openModal()} className="btn-primary">+ Add Experience</button>
                </div>

                <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center"><ButtonSpinner size="lg" /></div>
                    ) : experiences.length === 0 ? (
                        <div className="p-8 text-center text-dark-400">No experience entries yet</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700">
                                    <th className="text-left p-4 text-dark-400 font-medium">Position</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Company</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Period</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Type</th>
                                    <th className="text-right p-4 text-dark-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experiences.map((exp) => (
                                    <tr key={exp._id} className="border-b border-dark-800 hover:bg-dark-800/30">
                                        <td className="p-4 font-medium text-dark-100">{exp.title?.en || exp.title?.uz}</td>
                                        <td className="p-4 text-dark-300">{exp.company}</td>
                                        <td className="p-4 text-dark-400 text-sm">
                                            {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded ${exp.type === 'work' ? 'bg-primary-500/20 text-primary-400' :
                                                    exp.type === 'education' ? 'bg-accent-500/20 text-accent-400' : 'bg-green-500/20 text-green-400'
                                                }`}>{exp.type}</span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => openModal(exp)} className="p-2 text-dark-400 hover:text-primary-400">Edit</button>
                                            <button onClick={() => handleDelete(exp._id)} className="p-2 text-dark-400 hover:text-red-400 ml-2">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
                    <div className="glass-dark rounded-xl border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold text-dark-100">{editingExp ? 'Edit Experience' : 'Add Experience'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Titles */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-sm text-dark-400 mb-1">Title ({lang.toUpperCase()})</label>
                                        <input type="text" value={formData.title[lang]} onChange={(e) => handleChange('title', e.target.value, lang)} className="input-field" required />
                                    </div>
                                ))}
                            </div>

                            {/* Company & Location */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">Company</label>
                                    <input type="text" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">Location</label>
                                    <input type="text" value={formData.location} onChange={(e) => handleChange('location', e.target.value)} className="input-field" />
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-sm text-dark-400 mb-1">Description ({lang.toUpperCase()})</label>
                                        <textarea value={formData.description[lang]} onChange={(e) => handleChange('description', e.target.value, lang)} className="input-field" rows={2} />
                                    </div>
                                ))}
                            </div>

                            {/* Type & Dates */}
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">Type</label>
                                    <select value={formData.type} onChange={(e) => handleChange('type', e.target.value)} className="input-field">
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">Start Date</label>
                                    <input type="date" value={formData.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className="input-field" required />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">End Date</label>
                                    <input type="date" value={formData.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className="input-field" disabled={formData.current} />
                                </div>
                                <div className="flex items-end pb-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={formData.current} onChange={(e) => handleChange('current', e.target.checked)} className="w-4 h-4" />
                                        <span className="text-dark-300">Current</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
                                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary">{saving ? <ButtonSpinner /> : 'Save'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ExperienceManager;
