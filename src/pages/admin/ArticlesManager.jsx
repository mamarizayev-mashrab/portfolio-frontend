import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '../../utils/dateUtils';

import { getImageUrl } from '../../utils/assetUtils';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [tagInput, setTagInput] = useState('');

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
        } else {
            setFormData(emptyArticle);
        }
        setTagInput('');
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving || uploading) return;
        setShowModal(false);
        setEditingArticle(null);
        setFormData(emptyArticle);
        setTagInput('');
        setPreviewLang(null);
    };

    const handleChange = (field, value, lang = null) => {
        if (lang) {
            setFormData(prev => ({ ...prev, [field]: { ...prev[field], [lang]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Tag Management
    const handleAddTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const tag = tagInput.trim();
            if (tag && !formData.tags.includes(tag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    // Markdown Toolbar Helper
    const insertMarkdown = (lang, syntax, placeholder = '') => {
        const textarea = document.getElementById(`content-${lang}`);
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content[lang];
        const before = text.substring(0, start);
        const after = text.substring(end);
        const selection = text.substring(start, end);

        let newText = '';
        let newCursorPos = 0;

        if (syntax === 'link') {
            newText = before + `[${selection || placeholder}](url)` + after;
            newCursorPos = start + (selection || placeholder).length + 3; // Position inside (url)
        } else if (syntax === 'image') {
            newText = before + `![${selection || placeholder}](url)` + after;
            newCursorPos = start + (selection || placeholder).length + 4;
        } else if (syntax === 'code') {
            newText = before + "```\n" + (selection || placeholder) + "\n```" + after;
            newCursorPos = start + 4;
        } else if (syntax === 'list') {
            newText = before + "\n- " + (selection || placeholder) + after;
            newCursorPos = start + 3;
        } else {
            // Bold, Italic, etc.
            newText = before + syntax + (selection || placeholder) + syntax + after;
            newCursorPos = end + syntax.length * 2;
        }

        handleChange('content', newText, lang);

        // Restore focus and cursor (need timeout for React state update)
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Tags are already in formData.tags array
        try {
            if (editingArticle) {
                await api.put(`/articles/${editingArticle._id}`, formData);
            } else {
                await api.post('/articles', formData);
            }
            const statusMsg = formData.status === 'draft'
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

    const [deleteConfirmation, setDeleteConfirmation] = useState(null);

    const handleDelete = (id) => {
        setDeleteConfirmation({ id, type: 'article' });
    };

    const confirmDeleteComment = (commentId) => {
        setDeleteConfirmation({ id: commentId, type: 'comment' });
    };

    const proceedWithDelete = async () => {
        if (!deleteConfirmation) return;

        const { id, type } = deleteConfirmation;
        console.log(`User confirmed delete for ${type}:`, id);

        try {
            if (type === 'article') {
                await api.delete(`/articles/${id}`);
                await fetchArticles();
            } else if (type === 'comment') {
                await api.delete(`/articles/comments/${id}`);
                if (selectedArticle) openComments(selectedArticle);
            }
            toast.success(t('admin.common.success'));
            setDeleteConfirmation(null);
        } catch (error) {
            console.error('API delete error:', error);
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





    const filteredArticles = articles.filter(article => {
        const matchesSearch = getLocalizedField(article.title).toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || article.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

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
                    <div className="space-y-4">
                        {/* Search & Filter */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--accents-4)]">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="v-input pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="v-input md:w-48"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div className="v-card p-0 overflow-hidden">
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="p-8 text-center text-[var(--accents-5)]">{t('admin.projects.table.loading')}</div>
                                ) : filteredArticles.length === 0 ? (
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
                                            {filteredArticles.map((article) => (
                                                <tr key={article._id} className="border-b border-[var(--accents-2)] hover:bg-[var(--accents-1)] transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {article.image && <img src={getImageUrl(article.image)} className="w-10 h-10 rounded object-cover border border-[var(--accents-2)]" alt="" />}
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
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => toggleComments(article)}
                                                                title={article.commentsEnabled ? "Disable comments" : "Enable comments"}
                                                                className={`relative shrink-0 w-9 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accents-3)] ${article.commentsEnabled ? 'bg-emerald-500' : 'bg-[var(--accents-3)]'
                                                                    }`}
                                                            >
                                                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${article.commentsEnabled ? 'translate-x-4.5' : 'translate-x-0.5'
                                                                    }`} />
                                                            </button>

                                                            {(article.commentCount > 0 || article.pendingComments > 0) && (
                                                                <button
                                                                    onClick={() => openComments(article)}
                                                                    className="flex items-center gap-2 group focus:outline-none"
                                                                    title="Manage comments"
                                                                >
                                                                    {/* Total Comments Badge */}
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--accents-1)] border border-[var(--accents-2)] text-[var(--accents-6)] text-xs font-mono font-medium group-hover:border-[var(--accents-4)] group-hover:text-[var(--foreground)] transition-all">
                                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                                                        <span>{article.commentCount || 0}</span>
                                                                    </div>

                                                                    {/* Pending Comments Badge - Highlighted if exists */}
                                                                    {article.pendingComments > 0 && (
                                                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-mono font-bold animate-pulse group-hover:bg-amber-500/20 transition-all">
                                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                                            <span>{article.pendingComments}</span>
                                                                        </div>
                                                                    )}
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
                                                    onClick={() => confirmDeleteComment(comment._id)}
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
                    <div className="v-card w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-page-fade p-0 border-none no-scrollbar">
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
                                            <div className="flex gap-2">
                                                {previewLang !== lang && (
                                                    <div className="flex bg-[var(--accents-1)] rounded border border-[var(--accents-2)] overflow-hidden">
                                                        <button type="button" onClick={() => insertMarkdown(lang, '**')} className="p-1.5 hover:bg-[var(--accents-2)]" title="Bold"><b>B</b></button>
                                                        <button type="button" onClick={() => insertMarkdown(lang, '*')} className="p-1.5 hover:bg-[var(--accents-2)]" title="Italic"><i>I</i></button>
                                                        <button type="button" onClick={() => insertMarkdown(lang, 'list', 'Item')} className="p-1.5 hover:bg-[var(--accents-2)]" title="List">•</button>
                                                        <button type="button" onClick={() => insertMarkdown(lang, 'link', 'Link')} className="p-1.5 hover:bg-[var(--accents-2)]" title="Link">🔗</button>
                                                        <button type="button" onClick={() => insertMarkdown(lang, 'image', 'Image')} className="p-1.5 hover:bg-[var(--accents-2)]" title="Image">🖼️</button>
                                                        <button type="button" onClick={() => insertMarkdown(lang, 'code', 'Code')} className="p-1.5 hover:bg-[var(--accents-2)]" title="Code">{'<>'}</button>
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewLang(previewLang === lang ? null : lang)}
                                                    className={`text-[10px] font-mono px-2 py-1 rounded border transition-colors ${previewLang === lang ? 'bg-[var(--foreground)] text-[var(--background)]' : 'border-[var(--accents-2)] hover:bg-[var(--accents-1)]'}`}
                                                >
                                                    {previewLang === lang ? 'EDITING...' : 'PREVIEW'}
                                                </button>
                                            </div>
                                        </div>

                                        {previewLang === lang ? (
                                            <div className="v-card bg-[var(--accents-1)] prose prose-sm dark:prose-invert max-w-none min-h-[200px] p-4">
                                                <ReactMarkdown>{formData.content[lang] || ''}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <textarea
                                                id={`content-${lang}`}
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
                                        {formData.image && <img src={getImageUrl(formData.image)} className="w-20 h-20 object-cover rounded border border-[var(--accents-2)]" alt="" />}
                                    </div>

                                    {/* Tags Input (Chips) */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">Tags (Hashtags)</label>
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            className="v-input"
                                            placeholder="Type tag and press Enter..."
                                        />
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {formData.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-[var(--accents-1)] border border-[var(--accents-2)] rounded text-[10px] flex items-center gap-2 font-mono">
                                                    #{tag}
                                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-error-light hover:text-red-500">×</button>
                                                </span>
                                            ))}
                                        </div>
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

            {deleteConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="v-card w-full max-w-sm animate-page-fade">
                        <h3 className="text-xl font-bold mb-4 tracking-tight">{t('admin.common.confirmDelete')}</h3>
                        {deleteConfirmation.type === 'comment' && <p className="text-xs text-[var(--accents-5)] mb-4 font-mono">Deleting a comment cannot be undone.</p>}
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

export default ArticlesManager;
