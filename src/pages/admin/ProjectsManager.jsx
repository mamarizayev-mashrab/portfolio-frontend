import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import { getImageUrl } from '../../utils/assetUtils';

const ProjectsManager = () => {
    const { t, getLocalizedField } = useLanguage();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

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
            toast.error(t('admin.common.error'));
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error(t('admin.common.error') + ': Only images allowed');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('admin.common.error') + ': File too large (max 5MB)');
            return;
        }

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        setUploading(true);
        try {
            const res = await api.post('/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleChange('image', res.data.relativePath);
            toast.success(t('admin.common.success'));
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleAddTech = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTags = techInput.split(',')
                .map(t => t.trim())
                .filter(t => t && !formData.technologies.includes(t));

            if (newTags.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    technologies: [...prev.technologies, ...newTags]
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

        // Auto-add pending tech input if exists
        let finalTechnologies = [...formData.technologies];
        if (techInput.trim()) {
            const pendingTags = techInput.split(',')
                .map(t => t.trim())
                .filter(t => t && !finalTechnologies.includes(t));
            finalTechnologies = [...finalTechnologies, ...pendingTags];
        }

        const dataToSubmit = { ...formData, technologies: finalTechnologies };

        try {
            if (editingProject) {
                await api.put(`/projects/${editingProject._id}`, dataToSubmit);
                toast.success(t('admin.common.success'));
            } else {
                await api.post('/projects', dataToSubmit);
                toast.success(t('admin.common.success'));
            }
            handleCloseModal();
            fetchProjects();
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setIsSaving(false);
        }
    };

    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const handleDelete = (id) => {
        setDeleteConfirmation(id);
    };

    const proceedWithDelete = async () => {
        if (!deleteConfirmation) return;

        try {
            await api.delete(`/projects/${deleteConfirmation}`);
            toast.success(t('admin.common.success'));
            handleCloseModal(); // In case it was triggered from a modal (though here it is from list)
            setDeleteConfirmation(null);
            await fetchProjects();
        } catch (error) {
            const errMsg = error.response?.data?.message || t('admin.common.error');
            toast.error(errMsg);
        }
    };

    return (
        <div className="p-4 md:p-12 space-y-8 md:space-y-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">{t('admin.projects.title')}</h2>
                    <p className="text-sm text-[var(--accents-5)] uppercase font-mono font-bold tracking-widest tracking-tightest">{t('admin.projects.management')}</p>
                </div>
                <button onClick={() => handleOpenModal()} className="v-btn-primary h-10 px-4 w-full md:w-auto">
                    {t('admin.projects.newProject')}
                </button>
            </div>

            <div className="v-card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-[var(--accents-1)] border-b border-[var(--accents-2)]">
                            <tr className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accents-4)]">
                                <th className="px-6 py-4">{t('admin.projects.table.title')}</th>
                                <th className="px-6 py-4">{t('admin.projects.table.status')}</th>
                                <th className="px-6 py-4">{t('admin.projects.table.featured')}</th>
                                <th className="px-6 py-4 text-right">{t('admin.projects.table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--accents-2)]">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-sm">{t('admin.projects.table.loading')}</td></tr>
                            ) : projects.map((p) => {
                                const statusColors = {
                                    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                                    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                                    rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
                                    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                                    completed: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                                    published: 'bg-white/10 text-white border-white/20'
                                };

                                return (
                                    <tr key={p._id} className="hover:bg-[var(--accents-1)] transition-colors">
                                        <td className="px-6 py-5 text-sm font-medium">{getLocalizedField(p.title)}</td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${statusColors[p.status] || 'bg-[var(--accents-2)] text-[var(--accents-5)]'}`}>
                                                {t(`admin.projects.modal.statusTypes.${p.status}`, p.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm">{p.featured ? t('admin.projects.table.yes') : t('admin.projects.table.no')}</td>
                                        <td className="px-6 py-5 text-right space-x-4">
                                            <button onClick={() => handleOpenModal(p)} className="text-sm font-medium hover:underline text-primary">{t('admin.common.edit')}</button>
                                            <button onClick={() => handleDelete(p._id)} className="text-sm font-medium hover:underline text-error-light">{t('admin.common.delete')}</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[var(--background)]/80 backdrop-blur-sm">
                    <div className="v-card w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-8 animate-page-fade">
                        <div className="flex items-center justify-between border-b border-[var(--accents-2)] pb-6 mb-6">
                            <h3 className="text-xl font-bold tracking-tight">{editingProject ? t('admin.projects.modal.modify') : t('admin.projects.modal.create')}</h3>
                            <button onClick={handleCloseModal} className="text-2xl grayscale opacity-50 hover:opacity-100">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="space-y-1 md:col-span-3">
                                    <h4 className="text-sm font-bold border-b border-[var(--accents-2)] pb-2 mb-4">Project Titles</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {['UZ', 'EN', 'RU'].map(l => (
                                            <div key={l} className="space-y-1">
                                                <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">{l}</label>
                                                <input className="v-input" value={formData.title[l.toLowerCase()]} onChange={(e) => handleChange('title', e.target.value, l.toLowerCase())} required />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold border-b border-[var(--accents-2)] pb-2 mb-4">Status</h4>
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">Current Status</label>
                                    <select
                                        className="v-input bg-[var(--accents-1)]"
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                    >
                                        {Object.keys(t('admin.projects.modal.statusTypes', {})).map(statusKey => (
                                            <option key={statusKey} value={statusKey}>
                                                {t(`admin.projects.modal.statusTypes.${statusKey}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <h4 className="text-sm font-bold border-b border-[var(--accents-2)] pb-2">Descriptions</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {['UZ', 'EN', 'RU'].map(l => (
                                    <div key={l} className="space-y-1">
                                        <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">{l}</label>
                                        <textarea className="v-input h-24" value={formData.description[l.toLowerCase()]} onChange={(e) => handleChange('description', e.target.value, l.toLowerCase())} required />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.projects.modal.image')}</label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-2">
                                            <input type="url" className="v-input flex-1" value={formData.image} onChange={(e) => handleChange('image', e.target.value)} placeholder="https://..." />
                                            <div className="relative">
                                                <input type="file" id="proj-img" className="hidden" onChange={handleImageUpload} accept="image/*" disabled={uploading} />
                                                <label htmlFor="proj-img" className={`v-btn-ghost h-10 px-3 flex items-center justify-center cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                                                    {uploading ? '...' : '📁'}
                                                </label>
                                            </div>
                                        </div>
                                        {formData.image && (
                                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-[var(--accents-2)] bg-[var(--accents-1)]">
                                                <img src={getImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => handleChange('image', '')} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors text-xs">×</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.projects.modal.liveUrl')}</label>
                                    <input type="url" className="v-input" value={formData.liveUrl} onChange={(e) => handleChange('liveUrl', e.target.value)} placeholder="https://..." />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.projects.modal.githubUrl')}</label>
                                    <input type="url" className="v-input" value={formData.githubUrl} onChange={(e) => handleChange('githubUrl', e.target.value)} placeholder="https://github.com/..." />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase">{t('admin.projects.modal.technologies')}</label>
                                <input className="v-input" value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={handleAddTech} placeholder="React, Node.js, MongoDB..." />
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {formData.technologies.map(t => (
                                        <span key={t} className="px-2 py-0.5 bg-[var(--accents-1)] border border-[var(--accents-2)] rounded text-[10px] flex items-center gap-2">
                                            {t}
                                            <button type="button" onClick={() => handleRemoveTech(t)} className="text-error-light">×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-[var(--accents-2)]">
                                <button type="button" onClick={handleCloseModal} className="v-btn-ghost h-10 px-4">{t('admin.projects.modal.cancel')}</button>
                                <button type="submit" disabled={isSaving} className="v-btn-primary h-10 px-8">
                                    {isSaving ? t('admin.projects.modal.deploying') : t('admin.projects.modal.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {deleteConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="v-card w-full max-w-sm animate-page-fade">
                        <h3 className="text-xl font-bold mb-4 tracking-tight">{t('admin.common.confirmDelete')}</h3>
                        <div className="flex justify-end gap-3 pt-4 border-t border-[var(--accents-2)]">
                            <button onClick={() => setDeleteConfirmation(null)} className="v-btn-ghost h-10 px-4">{t('admin.common.cancel')}</button>
                            <button onClick={proceedWithDelete} className="v-btn-primary h-10 px-6 bg-red-600 hover:bg-red-700 text-white border-none">{t('admin.common.delete')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsManager;
