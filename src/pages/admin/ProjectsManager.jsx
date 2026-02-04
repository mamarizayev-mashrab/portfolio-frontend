/**
 * Projects Manager Page
 * CRUD operations for portfolio projects
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { useToast } from '../../components/common/Toast';
import { ButtonSpinner } from '../../components/common/Loading';

const ProjectsManager = () => {
    const { toast } = useToast();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [saving, setSaving] = useState(false);

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
            const response = await api.get('/projects');
            setProjects(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const openModal = (project = null) => {
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

    const closeModal = () => {
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

    const addTechnology = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, techInput.trim()]
            }));
            setTechInput('');
        }
    };

    const removeTechnology = (tech) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, formData);
                toast.success('Project updated successfully');
            } else {
                await api.post('/projects', formData);
                toast.success('Project created successfully');
            }
            closeModal();
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save project');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            await api.delete(`/projects/${id}`);
            toast.success('Project deleted');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    return (
        <>
            <Helmet>
                <title>Projects | Admin</title>
            </Helmet>

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-100">Projects</h1>
                        <p className="text-dark-400">Manage your portfolio projects</p>
                    </div>
                    <button onClick={() => openModal()} className="btn-primary">
                        + Add Project
                    </button>
                </div>

                {/* Projects Table */}
                <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <ButtonSpinner size="lg" />
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="p-8 text-center text-dark-400">
                            <p>No projects yet. Create your first project!</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-dark-700">
                                    <th className="text-left p-4 text-dark-400 font-medium">Project</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Status</th>
                                    <th className="text-left p-4 text-dark-400 font-medium">Featured</th>
                                    <th className="text-right p-4 text-dark-400 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project._id} className="border-b border-dark-800 hover:bg-dark-800/30">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {project.image ? (
                                                    <img src={project.image} alt="" className="w-12 h-12 rounded object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded bg-dark-700 flex items-center justify-center text-dark-500">📁</div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-dark-100">{project.title?.en || project.title?.uz}</p>
                                                    <p className="text-sm text-dark-500">{(project.technologies || []).slice(0, 3).join(', ')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded ${project.status === 'published'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {project.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {project.featured && <span className="text-yellow-400">⭐</span>}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => openModal(project)}
                                                className="p-2 text-dark-400 hover:text-primary-400"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="p-2 text-dark-400 hover:text-red-400 ml-2"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
                    <div className="glass-dark rounded-xl border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-dark-700">
                            <h2 className="text-xl font-bold text-dark-100">
                                {editingProject ? 'Edit Project' : 'Add Project'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Titles */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-sm text-dark-400 mb-1">Title ({lang.toUpperCase()})</label>
                                        <input
                                            type="text"
                                            value={formData.title[lang]}
                                            onChange={(e) => handleChange('title', e.target.value, lang)}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Descriptions */}
                            <div className="grid grid-cols-3 gap-4">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang}>
                                        <label className="block text-sm text-dark-400 mb-1">Description ({lang.toUpperCase()})</label>
                                        <textarea
                                            value={formData.description[lang]}
                                            onChange={(e) => handleChange('description', e.target.value, lang)}
                                            className="input-field"
                                            rows={3}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Image & URLs */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => handleChange('image', e.target.value)}
                                        className="input-field"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">Live URL</label>
                                    <input
                                        type="url"
                                        value={formData.liveUrl}
                                        onChange={(e) => handleChange('liveUrl', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-dark-400 mb-1">GitHub URL</label>
                                    <input
                                        type="url"
                                        value={formData.githubUrl}
                                        onChange={(e) => handleChange('githubUrl', e.target.value)}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            {/* Technologies */}
                            <div>
                                <label className="block text-sm text-dark-400 mb-1">Technologies</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                        className="input-field flex-1"
                                        placeholder="Add technology..."
                                    />
                                    <button type="button" onClick={addTechnology} className="btn-secondary">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.technologies.map((tech) => (
                                        <span key={tech} className="px-3 py-1 rounded-full bg-dark-700 text-dark-300 flex items-center gap-2">
                                            {tech}
                                            <button type="button" onClick={() => removeTechnology(tech)} className="text-dark-500 hover:text-red-400">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.featured}
                                        onChange={(e) => handleChange('featured', e.target.checked)}
                                        className="w-4 h-4 rounded border-dark-600"
                                    />
                                    <span className="text-dark-300">Featured</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="input-field !py-2"
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </label>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-dark-700">
                                <button type="button" onClick={closeModal} className="btn-secondary">Cancel</button>
                                <button type="submit" disabled={saving} className="btn-primary">
                                    {saving ? <ButtonSpinner /> : (editingProject ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProjectsManager;
