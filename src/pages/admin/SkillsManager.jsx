import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const SkillsManager = () => {
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
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (skill = null) => {
        setEditingSkill(skill);
        setFormData(skill ? { ...skill } : emptySkill);
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
                toast.success('Skill updated');
            } else {
                await api.post('/skills', formData);
                toast.success('Skill created');
            }
            closeModal();
            fetchSkills();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        try {
            await api.delete(`/skills/${id}`);
            toast.success('Skill deleted');
            fetchSkills();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const getSkillName = (skill) => {
        if (typeof skill.name === 'object') {
            return skill.name.en || skill.name.uz || skill.name.ru || 'Unnamed';
        }
        return skill.name || 'Unnamed';
    };

    return (
        <div className="p-6">
            <Helmet><title>Skills | Admin</title></Helmet>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tighter">Skills</h1>
                        <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">technical_capabilities</p>
                    </div>
                    <button onClick={() => openModal()} className="v-btn-primary h-10 px-4">+ Add Skill</button>
                </div>

                <div className="v-card p-0 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-[var(--accents-5)]">Loading skills...</div>
                    ) : skills.length === 0 ? (
                        <div className="p-8 text-center text-[var(--accents-5)]">No skills yet</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--accents-2)]">
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Skill</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Category</th>
                                    <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Level</th>
                                    <th className="text-right p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Actions</th>
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
                                            <span className="px-2 py-1 text-xs font-mono rounded bg-[var(--accents-1)] border border-[var(--accents-2)] text-[var(--accents-5)]">{skill.category}</span>
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
                                            <button onClick={() => openModal(skill)} className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)] mr-4">Edit</button>
                                            <button onClick={() => handleDelete(skill._id)} className="text-sm text-[var(--accents-5)] hover:text-error-light">Delete</button>
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
                    <div className="v-card w-full max-w-lg">
                        <div className="mb-6">
                            <h2 className="text-xl font-bold tracking-tight">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Name ({lang})</label>
                                        <input
                                            type="text"
                                            value={typeof formData.name === 'object' ? formData.name[lang] || '' : formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: { ...(typeof formData.name === 'object' ? formData.name : {}), [lang]: e.target.value } })}
                                            className="v-input"
                                            required={lang === 'en'}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Icon (emoji)</label>
                                    <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="v-input" placeholder="💻" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Category</label>
                                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="v-input">
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase">Level: {formData.level || formData.proficiency || 0}%</label>
                                <input type="range" min="0" max="100" value={formData.level || formData.proficiency || 0} onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })} className="w-full accent-[var(--foreground)]" />
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

export default SkillsManager;
