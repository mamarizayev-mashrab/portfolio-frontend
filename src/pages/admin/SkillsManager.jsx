/**
 * Skills Manager Page
 * CRUD operations for skills
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { ButtonSpinner } from '../../components/common/Loading';

const SkillsManager = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [saving, setSaving] = useState(false);

    const categories = ['frontend', 'backend', 'database', 'devops', 'tools', 'other'];

    const emptySkill = { name: '', icon: '', category: 'frontend', proficiency: 80, order: 0 };
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
        if (!confirm('Delete this skill?')) return;
        try {
            await api.delete(`/skills/${id}`);
            toast.success('Skill deleted');
            fetchSkills();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    return (
        <>
            <Helmet><title>Skills | Admin</title></Helmet>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-100">Skills</h1>
                        <p className="text-dark-400">Manage your technical skills</p>
                    </div>
                    <button onClick={() => openModal()} className="btn-primary">+ Add Skill</button>
                </div>

                <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center"><ButtonSpinner size="lg" /></div>
                    ) : skills.length === 0 ? (
                        <div className="p-8 text-center text-dark-400">No skills yet</div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700">
                                    <th className="text-left p-4 text-dark-400 font-medium">Skill</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Category</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Proficiency</th>
                                    <th className="text-right p-4 text-dark-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill) => (
                                    <tr key={skill._id} className="border-b border-dark-800 hover:bg-dark-800/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{skill.icon || '💻'}</span>
                                                <span className="font-medium text-dark-100">{skill.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 text-xs rounded bg-dark-700 text-dark-300">{skill.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-dark-700 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${skill.proficiency}%` }} />
                                                </div>
                                                <span className="text-sm text-dark-400">{skill.proficiency}%</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button onClick={() => openModal(skill)} className="p-2 text-dark-400 hover:text-primary-400">Edit</button>
                                            <button onClick={() => handleDelete(skill._id)} className="p-2 text-dark-400 hover:text-red-400 ml-2">Delete</button>
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
                    <div className="glass-dark rounded-xl border border-dark-700 w-full max-w-md">
                        <div className="p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold text-dark-100">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Icon (emoji)</label>
                                <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="input-field" placeholder="💻" />
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Category</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="input-field">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Proficiency: {formData.proficiency}%</label>
                                <input type="range" min="0" max="100" value={formData.proficiency} onChange={(e) => setFormData({ ...formData, proficiency: parseInt(e.target.value) })} className="w-full" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
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

export default SkillsManager;
