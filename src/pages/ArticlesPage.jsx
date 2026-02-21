import { useState, useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import ReactMarkdown from 'react-markdown';
import { formatDate } from '../utils/dateUtils';
import { getImageUrl } from '../utils/assetUtils';

const ArticlesPage = () => {
    const { t, getLocalizedField } = useLanguage();
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Persistent likes
    const [likedArticles, setLikedArticles] = useState(() => {
        const saved = localStorage.getItem('v_liked_articles');
        return saved ? JSON.parse(saved) : {};
    });

    const [commentForms, setCommentForms] = useState({});
    const [submittingComment, setSubmittingComment] = useState({});
    const [activeCommentId, setActiveCommentId] = useState(null);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeTag, setActiveTag] = useState(null);
    const observer = useRef();

    useEffect(() => {
        localStorage.setItem('v_liked_articles', JSON.stringify(likedArticles));
    }, [likedArticles]);

    useEffect(() => {
        fetchArticles(1, activeTag, true);
    }, [activeTag]);

    const fetchArticles = async (pageNum, tag = null, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const params = {
                page: pageNum,
                limit: 10,
                tag: tag || undefined
            };
            const response = await api.get('/articles', { params });
            const { data, pagination } = response.data;

            if (isInitial) {
                setArticles(data);
            } else {
                setArticles(prev => [...prev, ...data]);
            }

            setHasMore(pageNum < pagination.totalPages);
            setPage(pageNum);

            const statusPromises = data.map(article =>
                api.get(`/articles/${article._id}/like-status`)
                    .then(res => ({ id: article._id, liked: res.data.liked }))
                    .catch(() => ({ id: article._id, liked: !!likedArticles[article._id] }))
            );

            const results = await Promise.all(statusPromises);
            const newLikedStatus = {};
            results.forEach(res => {
                newLikedStatus[res.id] = res.liked;
            });

            setLikedArticles(prev => ({ ...prev, ...newLikedStatus }));
        } catch (error) {
            toast.error(t('common.error'));
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const lastArticleElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchArticles(page + 1, activeTag);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore, page, activeTag]);

    const handleLike = async (articleId) => {
        try {
            const res = await api.patch(`/articles/${articleId}/like`);
            setLikedArticles(prev => ({ ...prev, [articleId]: res.data.liked }));
            setArticles(prev => prev.map(a =>
                a._id === articleId ? { ...a, likeCount: res.data.likeCount } : a
            ));
        } catch (error) {
            toast.error(t('common.error'));
        }
    };

    const handleCommentChange = (articleId, field, value) => {
        setCommentForms(prev => ({
            ...prev,
            [articleId]: { ...(prev[articleId] || {}), [field]: value }
        }));
    };

    const handleCommentSubmit = async (e, articleId) => {
        e.preventDefault();
        const form = commentForms[articleId];
        if (!form?.name?.trim() || !form?.content?.trim()) {
            toast.error(t('articles.commentRequired'));
            return;
        }

        setSubmittingComment(prev => ({ ...prev, [articleId]: true }));
        try {
            const postRes = await api.post(`/articles/${articleId}/comments`, form);
            const newComment = postRes.data.data;
            toast.success(t('articles.commentSent'));
            setCommentForms(prev => ({ ...prev, [articleId]: { name: '', email: '', content: '' } }));

            const res = await api.get(`/articles/${articleId}`);
            const updatedArticle = res.data.data;

            const allComments = [newComment, ...(updatedArticle.comments || []).filter(c => c._id !== newComment._id)];

            setArticles(prev => prev.map(a =>
                a._id === articleId ? { ...a, comments: allComments } : a
            ));
            setActiveCommentId(null);
        } catch (error) {
            const msg = error.response?.data?.message || t('common.error');
            toast.error(msg);
        } finally {
            setSubmittingComment(prev => ({ ...prev, [articleId]: false }));
        }
    };

    const calculateReadingTime = (text) => {
        if (!text) return 0;
        const wordsPerMinute = 200;
        const words = text.trim().split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    const handleShare = async (article) => {
        const url = `${window.location.origin}/articles`;
        const title = getLocalizedField(article.title);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Mashrab - ${title}`,
                    text: title,
                    url
                });
            } catch (error) {
                if (error.name !== 'AbortError') toast.error(t('common.error'));
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success(t('common.copied'));
            } catch (err) {
                toast.error(t('common.error'));
            }
        }
    };

    const toggleComments = async (articleId) => {
        try { api.patch(`/articles/${articleId}/view`); } catch (e) { /* silent */ }

        if (activeCommentId === articleId) {
            setActiveCommentId(null);
            return;
        }

        const article = articles.find(a => a._id === articleId);
        if (!article.comments) {
            try {
                const res = await api.get(`/articles/${articleId}`);
                setArticles(prev => prev.map(a =>
                    a._id === articleId ? { ...a, comments: res.data.data.comments } : a
                ));
            } catch (e) { /* silent */ }
        }

        setActiveCommentId(articleId);
    };

    if (loading && articles.length === 0) {
        return (
            <div className="min-h-screen pt-20 flex flex-col items-center max-w-[600px] mx-auto border-x border-[var(--accents-2)]">
                <div className="w-full px-4 py-3 border-b border-[var(--accents-2)]">
                    <div className="h-6 bg-[var(--accents-2)] rounded w-1/3 animate-pulse" />
                </div>
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-full p-4 border-b border-[var(--accents-2)] space-y-4 animate-pulse">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--accents-1)]" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[var(--accents-2)] rounded w-1/4" />
                                <div className="h-4 bg-[var(--accents-1)] rounded w-full" />
                                <div className="h-20 bg-[var(--accents-1)] rounded w-full" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Helmet>
                <title>{t('articles.title')} | Mashrab Mamarizayev</title>
                <meta name="description" content={t('articles.subtitle')} />
            </Helmet>

            <div className="max-w-[600px] mx-auto border-x border-[var(--accents-2)] min-h-screen pt-16">
                {/* X-style Sticky Header */}
                <div className="sticky top-0 z-40 bg-[var(--background)] bg-opacity-80 backdrop-blur-md border-b border-[var(--accents-2)]">
                    <div className="px-4 py-3">
                        <h1 className="text-xl font-bold tracking-tight">{t('articles.title')}</h1>
                        <p className="text-[13px] text-[var(--accents-4)]">{articles.length} posts</p>
                    </div>
                    {/* Tabs */}
                    <div className="flex w-full border-b border-[var(--accents-2)]">
                        <button
                            onClick={() => setActiveTag(null)}
                            className="flex-1 py-4 hover:bg-[var(--accents-1)] transition-colors relative"
                        >
                            <span className={`text-sm font-bold ${!activeTag ? 'text-[var(--foreground)]' : 'text-[var(--accents-4)]'}`}>
                                For you
                            </span>
                            {!activeTag && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full" />}
                        </button>
                        <button
                            onClick={() => setActiveTag('Following')}
                            className="flex-1 py-4 hover:bg-[var(--accents-1)] transition-colors relative"
                        >
                            <span className={`text-sm font-bold ${activeTag === 'Following' ? 'text-[var(--foreground)]' : 'text-[var(--accents-4)]'}`}>
                                Following
                            </span>
                            {activeTag === 'Following' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full" />}
                        </button>
                    </div>
                </div>

                {/* Articles Feed */}
                <div className="divide-y divide-[var(--accents-2)]">
                    {articles.map((article, index) => {
                        const isLast = articles.length === index + 1;
                        const content = getLocalizedField(article.content);
                        const readingTime = calculateReadingTime(content);

                        return (
                            <article
                                key={article._id}
                                ref={isLast ? lastArticleElementRef : null}
                                className="px-4 py-3 hover:bg-[var(--accents-1)] transition-colors duration-200 cursor-pointer"
                                onClick={() => toggleComments(article._id)}
                            >
                                <div className="flex gap-3">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                            M
                                        </div>
                                    </div>

                                    {/* Post Content Area */}
                                    <div className="flex-1 min-w-0">
                                        {/* Meta Header */}
                                        <div className="flex items-center gap-1 mb-1 flex-wrap">
                                            <span className="font-bold text-[15px] hover:underline">Mashrab Mamarizayev</span>
                                            <svg className="w-[18px] h-[18px] text-blue-500 fill-current" viewBox="0 0 24 24">
                                                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-3.99s-2.6-1.27-3.99-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.97-.2-3.99.81s-1.27 2.6-.81 3.99c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 3.99s2.6 1.27 3.99.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.33-2.19c1.4.46 2.97.2 3.99-.81s1.27-2.6.81-3.99c1.32-.67 2.2-1.91 2.2-3.34zm-11.71 4.2l-3.5-3.5 1.41-1.41 2.09 2.09 5.68-5.68 1.41 1.41-7.09 7.09z" />
                                            </svg>
                                            <span className="text-[15px] text-[var(--accents-4)]">@asqarovich</span>
                                            <span className="text-[15px] text-[var(--accents-4)]">·</span>
                                            <span className="text-[15px] text-[var(--accents-4)] hover:underline">{formatDate(article.createdAt)}</span>
                                        </div>

                                        {/* Title & Body */}
                                        <div className="text-[15px] font-bold mb-1">
                                            {getLocalizedField(article.title)}
                                        </div>
                                        <div className="text-[15px] text-[var(--foreground)] leading-normal markdown-article prose prose-sm dark:prose-invert max-w-none mb-3">
                                            <ReactMarkdown>{content}</ReactMarkdown>
                                        </div>

                                        {/* Tags */}
                                        {article.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                                                {article.tags.map(tag => (
                                                    <span key={tag} className="text-[15px] text-blue-500 hover:underline">#{tag}</span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Media */}
                                        {article.image && (
                                            <div className="mt-3 rounded-2xl overflow-hidden border border-[var(--accents-2)]">
                                                <img
                                                    src={getImageUrl(article.image)}
                                                    alt={getLocalizedField(article.title)}
                                                    className="w-full h-auto object-cover max-h-[512px]"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}

                                        {/* Action Bar */}
                                        <div className="flex items-center justify-between max-w-[425px] mt-3 -ml-2 text-[var(--accents-4)]">
                                            {/* Reply */}
                                            <button
                                                className="group flex items-center gap-2 hover:text-blue-500 transition-colors"
                                                onClick={(e) => { e.stopPropagation(); toggleComments(article._id); }}
                                            >
                                                <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                                                    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M1.751 10c0-4.42 3.584-8 8.001-8h4.248c4.417 0 8.001 3.58 8.001 8 0 4.42-3.584 8-8.001 8H11.21l-3.27 3.35c-.46.47-1.24.14-1.24-.51v-2.84c-2.93-.02-4.949-2.28-4.949-5zm8.001-6c-3.313 0-6.001 2.69-6.001 6 0 3.17 2.826 4.12 4.906 4.12.296 0 .544.24.544.54v2.32l2.365-2.42c.1-.1.241-.16.388-.16H14c3.313 0 6.001-2.69 6.001-6s-2.688-6-6.001-6H9.752z" /></svg>
                                                </div>
                                                <span className="text-[13px]">{article.comments?.length || 0}</span>
                                            </button>

                                            {/* Views */}
                                            <div className="group flex items-center gap-2 hover:text-blue-500 transition-colors">
                                                <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                                                    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M4.5 3.88l4.432 4.43-1.414 1.414L5.5 7.707V19h2v2H3.5V7.707L1.482 9.724.068 8.31 4.5 3.88zM19.5 20.12l-4.432-4.43 1.414-1.414L18.5 16.293V5h-2V3h4v13.293l2.018-2.017 1.414 1.414-4.432 4.43z" /></svg>
                                                </div>
                                                <span className="text-[13px]">{article.views || 0}</span>
                                            </div>

                                            {/* Like */}
                                            <button
                                                className={`group flex items-center gap-2 transition-colors ${likedArticles[article._id] ? 'text-pink-500' : 'hover:text-pink-500'}`}
                                                onClick={(e) => { e.stopPropagation(); handleLike(article._id); }}
                                            >
                                                <div className={`p-2 rounded-full ${likedArticles[article._id] ? '' : 'group-hover:bg-pink-500/10'}`}>
                                                    <svg className={`w-[18px] h-[18px] ${likedArticles[article._id] ? 'fill-current' : 'fill-none'} stroke-current`} strokeWidth="2" viewBox="0 0 24 24">
                                                        <path d="M20.884 13.19c-1.351 2.48-4.001 5.12-8.884 8.12-4.883-3-7.533-5.64-8.884-8.12-1.366-2.512-1.12-5.462.636-7.234 1.832-1.85 4.88-2.043 6.944-.339.117.097.234.2.35.311.117-.111.234-.214.35-.311 2.064-1.704 5.112-1.511 6.31 2.5 1.758 1.772 2 4.722.638 7.234z" />
                                                    </svg>
                                                </div>
                                                <span className="text-[13px] font-medium">{article.likeCount || 0}</span>
                                            </button>

                                            {/* Share */}
                                            <button
                                                className="group flex items-center gap-2 hover:text-blue-500 transition-colors"
                                                onClick={(e) => { e.stopPropagation(); handleShare(article); }}
                                            >
                                                <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                                                    <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24"><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.29 3.3-1.42-1.42L12 2.59zM21 15v4c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-4h2v4h14v-4h2z" /></svg>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Threaded Comments */}
                                        {activeCommentId === article._id && (
                                            <div className="mt-4 pt-4 border-t border-[var(--accents-2)] animate-in slide-in-from-top-2 duration-300" onClick={(e) => e.stopPropagation()}>
                                                <div className="space-y-4 mb-6">
                                                    {article.comments?.map(comment => (
                                                        <div key={comment._id} className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[var(--accents-2)] flex items-center justify-center text-[10px] font-bold">
                                                                {comment.name.charAt(0)}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="font-bold text-sm">{comment.name}</span>
                                                                    <span className="text-xs text-[var(--accents-4)]">· {formatDate(comment.createdAt)}</span>
                                                                </div>
                                                                <p className="text-sm text-[var(--foreground)] mt-0.5">{comment.content}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                <form onSubmit={(e) => handleCommentSubmit(e, article._id)} className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[var(--accents-2)] flex-shrink-0" />
                                                    <div className="flex-1 space-y-3">
                                                        <textarea
                                                            value={commentForms[article._id]?.content || ''}
                                                            onChange={(e) => handleCommentChange(article._id, 'content', e.target.value)}
                                                            className="w-full bg-transparent text-sm outline-none border-b border-[var(--accents-2)] focus:border-blue-500 py-1 transition-all resize-none"
                                                            placeholder="Post your reply"
                                                            required
                                                        />
                                                        <div className="flex justify-between items-center">
                                                            <input
                                                                type="text"
                                                                value={commentForms[article._id]?.name || ''}
                                                                onChange={(e) => handleCommentChange(article._id, 'name', e.target.value)}
                                                                className="text-xs bg-transparent outline-none border-none text-blue-500"
                                                                placeholder="Your name"
                                                                required
                                                            />
                                                            <button
                                                                disabled={submittingComment[article._id]}
                                                                className="bg-blue-500 text-white rounded-full px-4 py-1.5 text-sm font-bold hover:bg-blue-600 disabled:opacity-50 transition-all"
                                                            >
                                                                Reply
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Loading / Footer */}
                {loadingMore && (
                    <div className="p-10 flex justify-center border-t border-[var(--accents-2)]">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!hasMore && articles.length > 0 && (
                    <div className="p-12 text-center text-[var(--accents-4)] text-[15px] border-t border-[var(--accents-2)]">
                        That's all for now.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlesPage;
