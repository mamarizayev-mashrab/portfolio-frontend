import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import ReactMarkdown from 'react-markdown';

const ArticlesManager = () => {
    const { t, getLocalizedField } = useLanguage();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingArticle, setEditingArticle] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('articles');
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [previewLang, setPreviewLang] = useState(null);

    const emptyArticle = {
        title: { uz: '', en: '', ru: '' },
        content: { uz: '', en: '', ru: '' },
        image: '',
        commentsEnabled: true,
        status: 'draft',
        order: 0,
        tags: []
    };
    const [formData, setFormData] = useState(emptyArticle);
    const [tagsInput, setTagsInput] = useState('');

    useEffect(() => { fetchArticles(); }, []);

    const fetchArticles = async () => {
        try {
            const response = await api.get('/articles/admin/all');
            setArticles(response.data.data || []);
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setLoading(false);
        }
    };

    const openModal = (article = null) => {
        setEditingArticle(article);
        if (article) {
            setFormData({
                title: article.title || { uz: '', en: '', ru: '' },
                content: article.content || { uz: '', en: '', ru: '' },
                image: article.image || '',
                commentsEnabled: article.commentsEnabled !== undefined ? article.commentsEnabled : true,
                status: article.status || 'draft',
                order: article.order || 0,
                tags: article.tags || []
            });
            setTagsInput((article.tags || []).join(', '));
        } else {
            setFormData(emptyArticle);
            setTagsInput('');
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingArticle(null);
        setFormData(emptyArticle);
        setTagsInput('');
        setPreviewLang(null);
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        setUploading(true);
        try {
            const res = await api.post('/upload', uploadFormData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            handleChange('image', res.data.data);
            toast.success(t('admin.common.success'));
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Process tags
        const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
        const dataToSubmit = { ...formData, tags };

        try {
            if (editingArticle) {
                await api.put(`/articles/${editingArticle._id}`, dataToSubmit);
            } else {
                await api.post('/articles', dataToSubmit);
            }
            const statusMsg = dataToSubmit.status === 'draft'
                ? t('admin.articles.draftSaved')
                : t('admin.articles.publishedMsg');
            toast.success(t('admin.common.success') + statusMsg);
            closeModal();
            fetchArticles();
        } catch (error) {
            toast.error(error.response?.data?.message || t('admin.common.error'));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.common.confirmDelete'))) return;
        try {
            await api.delete(`/articles/${id}`);
            toast.success(t('admin.common.success'));
            await fetchArticles();
        } catch (error) {
            toast.error(t('admin.common.error'));
        }
    };

    const toggleComments = async (article) => {
        try {
            await api.put(`/articles/${article._id}`, {
                commentsEnabled: !article.commentsEnabled
            });
            toast.success(t('admin.common.success'));
            fetchArticles();
        } catch (error) {
            toast.error(t('admin.common.error'));
        }
    };

    const toggleStatus = async (article) => {
        try {
            await api.put(`/articles/${article._id}`, {
                status: article.status === 'published' ? 'draft' : 'published'
            });
            toast.success(t('admin.common.success'));
            fetchArticles();
        } catch (error) {
            toast.error(t('admin.common.error'));
        }
    };

    // Comments management
    const openComments = async (article) => {
        setSelectedArticle(article);
        setActiveTab('comments');
        setLoadingComments(true);
        try {
            const res = await api.get(`/articles/${article._id}/comments/admin`);
            setComments(res.data.data || []);
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setLoadingComments(false);
        }
    };

    const approveComment = async (commentId) => {
        try {
            await api.patch(`/articles/comments/${commentId}/approve`);
            toast.success(t('admin.common.success'));
            if (selectedArticle) openComments(selectedArticle);
        } catch (error) {
            toast.error(t('admin.common.error'));
        }
    };

    const deleteComment = async (commentId) => {
        if (!window.confirm(t('admin.common.confirmDelete'))) return;
        try {
            await api.delete(`/articles/comments/${commentId}`);
            toast.success(t('admin.common.success'));
            if (selectedArticle) openComments(selectedArticle);
        } catch (error) {
            toast.error(t('admin.common.error'));
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const lang = localStorage.getItem('language') || 'uz';
        const locale = lang === 'uz' ? 'uz-UZ' : lang === 'ru' ? 'ru-RU' : 'en-US';
        return new Date(dateStr).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="p-4 md:p-6">
            <Helmet><title>{t('admin.articles.title')} | Admin</title></Helmet>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">{t('admin.articles.title')}</h1>
                        <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">
                            {t('admin.articles.management')}
                        </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        {activeTab === 'comments' && (
                            <button onClick={() => setActiveTab('articles')} className="v-btn-ghost h-10 px-4 text-sm">
                                ← {t('admin.articles.backToArticles')}
                            </button>
                        )}
                        {activeTab === 'articles' && (
                            <button onClick={() => openModal()} className="v-btn-primary h-10 px-4 w-full md:w-auto">
                                + {t('admin.articles.newArticle')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Articles Tab */}
                {activeTab === 'articles' && (
                    <div className="v-card p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            {loading ? (
                                <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.projects.table.loading')}</div>
                            ) : articles.length === 0 ? (
                                <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.common.noResults')}</div>
                            ) : (
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="border-b border-[var(--accents-2)]">
                                            <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.articles.articleTitle')}</th>
                                            <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.articles.status')}</th>
                                            <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.articles.stats')}</th>
                                            <th className="text-left p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.articles.commentsLabel')}</th>
                                            <th className="text-right p-4 text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.projects.table.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles.map((article) => (
                                            <tr key={article._id} className="border-b border-[var(--accents-2)] hover:bg-[var(--accents-1)] transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {article.image && <img src={article.image} className="w-10 h-10 rounded object-cover border border-[var(--accents-2)]" alt="" />}
                                                        <div>
                                                            <span className="font-bold">{getLocalizedField(article.title)}</span>
                                                            <p className="text-xs text-[var(--accents-4)] font-mono mt-1">{formatDate(article.createdAt)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <button
                                                        onClick={() => toggleStatus(article)}
                                                        className={`px-2 py-1 text-xs font-mono rounded border cursor-pointer transition-colors ${article.status === 'published'
                                                            ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20'
                                                            : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                                                            }`}
                                                    >
                                                        {article.status === 'published' ? t('admin.articles.published') : t('admin.articles.draft')}
                                                    </button>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3 text-xs font-mono text-[var(--accents-5)]">
                                                        <span className="flex items-center gap-1">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                            {article.views || 0}
                                                        </span>
                                                        <span className="flex items-center gap-1">♥ {article.likeCount || 0}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => toggleComments(article)}
                                                            className={`relative w-10 h-5 rounded-full transition-colors ${article.commentsEnabled ? 'bg-emerald-500' : 'bg-[var(--accents-3)]'
                                                                }`}
                                                        >
                                                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${article.commentsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                                                                }`} />
                                                        </button>
                                                        {article.commentCount > 0 && (
                                                            <button
                                                                onClick={() => openComments(article)}
                                                                className="text-xs text-primary hover:underline font-mono"
                                                            >
                                                                {article.commentCount} ({article.pendingComments || 0} ⏳)
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button onClick={() => openModal(article)} className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)] mr-4">{t('admin.common.edit')}</button>
                                                    <button onClick={() => handleDelete(article._id)} className="text-sm text-[var(--accents-5)] hover:text-error-light">{t('admin.common.delete')}</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && selectedArticle && (
                    <div className="v-card p-0 overflow-hidden">
                        <div className="p-4 border-b border-[var(--accents-2)] bg-[var(--accents-1)]">
                            <h3 className="font-bold text-sm">{t('admin.articles.commentsFor')}: {getLocalizedField(selectedArticle.title)}</h3>
                        </div>
                        {loadingComments ? (
                            <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.projects.table.loading')}</div>
                        ) : comments.length === 0 ? (
                            <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.common.noResults')}</div>
                        ) : (
                            <div className="divide-y divide-[var(--accents-2)]">
                                {comments.map((comment) => (
                                    <div key={comment._id} className={`p-4 ${!comment.approved ? 'bg-yellow-500/5' : ''}`}>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-sm">{comment.name}</span>
                                                    {comment.email && <span className="text-xs font-mono text-[var(--accents-4)]">{comment.email}</span>}
                                                    <span className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${comment.approved
                                                        ? 'bg-emerald-500/10 text-emerald-500'
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                        }`}>
                                                        {comment.approved ? '✓ ' + t('admin.articles.approved') : '⏳ ' + t('admin.articles.pending')}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--accents-5)] mb-2">{comment.content}</p>
                                                <span className="text-[10px] font-mono text-[var(--accents-4)]">{formatDate(comment.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => approveComment(comment._id)}
                                                    className={`text-xs px-2 py-1 rounded border transition-colors ${comment.approved
                                                        ? 'border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10'
                                                        : 'border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10'
                                                        }`}
                                                >
                                                    {comment.approved ? t('admin.articles.reject') : t('admin.articles.approve')}
                                                </button>
                                                <button
                                                    onClick={() => deleteComment(comment._id)}
                                                    className="text-xs px-2 py-1 rounded border border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                >
                                                    {t('admin.common.delete')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="v-card w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-page-fade p-0 border-none">
                        <div className="p-6 border-b border-[var(--accents-2)] flex items-center justify-between sticky top-0 bg-[var(--background)] z-10">
                            <h2 className="text-xl font-bold tracking-tight">
                                {editingArticle ? t('admin.common.edit') : t('admin.articles.newArticle')}
                            </h2>
                            <button onClick={closeModal} className="text-2xl opacity-50 hover:opacity-100 px-2">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Multilingual Titles */}
                            <div>
                                <h4 className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest mb-4">{t('admin.articles.articleTitle')}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['uz', 'en', 'ru'].map((lang) => (
                                        <div key={lang} className="space-y-1">
                                            <label className="text-[10px] font-mono font-bold text-[var(--accents-3)] uppercase">{lang}</label>
                                            <input
                                                type="text"
                                                value={formData.title[lang] || ''}
                                                onChange={(e) => handleChange('title', e.target.value, lang)}
                                                className="v-input font-bold"
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Multilingual Content with Markdown Preview */}
                            <div className="space-y-8">
                                {['uz', 'en', 'ru'].map((lang) => (
                                    <div key={lang} className="space-y-4 pt-4 border-t border-[var(--accents-2)/50]">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">
                                                {t('admin.articles.content')} ({lang})
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={() => setPreviewLang(previewLang === lang ? null : lang)}
                                                className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${previewLang === lang ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border-[var(--accents-2)] hover:bg-[var(--accents-1)]'}`}
                                            >
                                                {previewLang === lang ? 'EDITING...' : 'PREVIEW'}
                                            </button>
                                        </div>

                                        {previewLang === lang ? (
                                            <div className="v-card bg-[var(--accents-1)] prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4">
                                                <ReactMarkdown>{formData.content[lang] || ''}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <textarea
                                                value={formData.content[lang] || ''}
                                                onChange={(e) => handleChange('content', e.target.value, lang)}
                                                className="v-input font-mono text-sm leading-relaxed"
                                                rows={8}
                                                required
                                                placeholder="Write in Markdown..."
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Tags, Image, & Status */}
                            <div className="pt-8 border-t border-[var(--accents-2)] space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Image Upload */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.articles.imageUrl')}</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => handleChange('image', e.target.value)}
                                                className="v-input flex-1"
                                                placeholder="https://... or upload"
                                            />
                                            <label className={`v-btn-ghost h-10 px-3 flex items-center justify-center cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
                                                <input type="file" onChange={handleImageUpload} className="hidden" disabled={uploading} accept="image/*" />
                                                {uploading ? '...' : '↑'}
                                            </label>
                                        </div>
                                        {formData.image && <img src={formData.image} className="w-20 h-20 object-cover rounded border border-[var(--accents-2)]" alt="" />}
                                    </div>

                                    {/* Tags Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Tags (Hashtags)</label>
                                        <input
                                            type="text"
                                            value={tagsInput}
                                            onChange={(e) => setTagsInput(e.target.value)}
                                            className="v-input"
                                            placeholder="javascript, tutorial, news..."
                                        />
                                        <p className="text-[10px] text-[var(--accents-4)]">Separate tags with commas</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">{t('admin.articles.status')}</label>
                                        <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)} className="v-input">
                                            <option value="draft">DRAFT</option>
                                            <option value="published">PUBLISHED</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end pb-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={formData.commentsEnabled}
                                                onChange={(e) => handleChange('commentsEnabled', e.target.checked)}
                                                className="w-5 h-5 accent-[var(--foreground)]"
                                            />
                                            <span className="text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity">Enable Comments</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-8 border-t border-[var(--accents-2)] sticky bottom-0 bg-[var(--background)] pb-2 z-10 mt-8">
                                <button type="button" onClick={closeModal} className="v-btn-ghost h-11 px-6 font-bold">{t('admin.common.cancel')}</button>
                                <button type="submit" disabled={saving} className="v-btn-primary h-11 px-8 font-bold">
                                    {saving ? 'SAVING...' : 'SAVE ARTICLE'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticlesManager;
