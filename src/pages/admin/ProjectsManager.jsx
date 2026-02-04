import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ProjectsManager = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const emptyProject = {
        title: { uz: '', en: '', ru: '' },
        description: { uz: '', en: '', ru: '' },
        image: '',
        technologies: [],
        liveUrl: '',
        githubUrl: '',
        featured: false,
        status: 'published'
    };

    const [formData, setFormData] = useState(emptyProject);
    const [techInput, setTechInput] = useState('');

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await axios.get(`${API_URL}/projects`);
            setProjects(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title || { uz: '', en: '', ru: '' },
                description: project.description || { uz: '', en: '', ru: '' },
                image: project.image || '',
                technologies: project.technologies || [],
                liveUrl: project.liveUrl || '',
                githubUrl: project.githubUrl || '',
                featured: project.featured || false,
                status: project.status || 'published'
            });
        } else {
            setEditingProject(null);
            setFormData(emptyProject);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProject(null);
        setFormData(emptyProject);
        setTechInput('');
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({
                ...prev,
                [field]: { ...prev[field], [lang]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleAddTech = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    technologies: [...prev.technologies, techInput.trim()]
                }));
                setTechInput('');
            }
        }
    };

    const handleRemoveTech = (tech) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (editingProject) {
                await axios.put(`${API_URL}/projects/${editingProject._id}`, formData, { headers });
                toast.success('Project updated');
            } else {
                await axios.post(`${API_URL}/projects`, formData, { headers });
                toast.success('Project created');
            }
            handleCloseModal();
            fetchProjects();
        } catch (error) {
            toast.error('Operation failed');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Confirm deletion?')) return;
        const API_URL = import.meta.env.VITE_API_URL;
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        try {
            await axios.delete(`${API_URL}/projects/${id}`, { headers });
            toast.success('Project deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    return (
        <div className="p-12 space-y-12">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tighter">Projects</h2>
                    <p className="text-sm text-[var(--accents-5)] uppercase font-mono font-bold tracking-widest tracking-tightest">management_module</p>
                </div>
                <button onClick={() => handleOpenModal()} className="v-btn-primary h-10 px-4">
                    New Project
                </button>
            </div>

            <div className="v-card p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[var(--accents-1)] border-b border-[var(--accents-2)]">
                        <tr className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accents-4)]">
                            <th className="px-6 py-4">Title</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Featured</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--accents-2)]">
                        {loading ? (
                            <tr><td colSpan="4" className="p-8 text-center text-sm">Loading data...</td></tr>
                        ) : projects.map((p) => (
                            <tr key={p._id} className="hover:bg-[var(--accents-1)] transition-colors">
                                <td className="px-6 py-5 text-sm font-medium">{p.title?.en}</td>
                                <td className="px-6 py-5">
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${p.status === 'published' ? 'bg-success-light/10 text-success-light border-success-light/20' : 'bg-[var(--accents-2)] text-[var(--accents-5)]'}`}>{p.status}</span>
                                </td>
                                <td className="px-6 py-5 text-sm">{p.featured ? 'Yes' : 'No'}</td>
                                <td className="px-6 py-5 text-right space-x-4">
                                    <button onClick={() => handleOpenModal(p)} className="text-sm font-medium hover:underline text-primary">Edit</button>
                                    <button onClick={() => handleDelete(p._id)} className="text-sm font-medium hover:underline text-error-light">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[var(--background)]/80 backdrop-blur-sm">
                    <div className="v-card w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-8">
                        <div className="flex items-center justify-between border-b border-[var(--accents-2)] pb-6 mb-6">
                            <h3 className="text-xl font-bold tracking-tight">{editingProject ? 'Modify Project' : 'New Project'}</h3>
                            <button onClick={handleCloseModal} className="text-2xl grayscale opacity-50 hover:opacity-100">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['UZ', 'EN', 'RU'].map(l => (
                                    <div key={l} className="space-y-1">
                                        <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">Title ({l})</label>
                                        <input className="v-input" value={formData.title[l.toLowerCase()]} onChange={(e) => handleChange('title', e.target.value, l.toLowerCase())} required />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['UZ', 'EN', 'RU'].map(l => (
                                    <div key={l} className="space-y-1">
                                        <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">Description ({l})</label>
                                        <textarea className="v-input h-24" value={formData.description[l.toLowerCase()]} onChange={(e) => handleChange('description', e.target.value, l.toLowerCase())} required />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">Image RL</label>
                                    <input className="v-input" value={formData.image} onChange={(e) => handleChange('image', e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">Technologies (Press Enter to add)</label>
                                    <input className="v-input" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} placeholder="React, Node..." />
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formData.technologies.map(t => (
                                            <span key={t} className="px-2 py-0.5 bg-[var(--accents-1)] border border-[var(--accents-2)] rounded text-[10px] flex items-center gap-2">
                                                {t}
                                                <button type="button" onClick={() => handleRemoveTech(t)} className="text-error-light">×</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-[var(--accents-2)]">
                                <button type="button" onClick={handleCloseModal} className="v-btn-ghost h-10 px-4">Cancel</button>
                                <button type="submit" disabled={isSaving} className="v-btn-primary h-10 px-8">
                                    {isSaving ? 'Deploying...' : 'Save Configuration'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
