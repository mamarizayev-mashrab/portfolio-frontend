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
    // Persistent likes using localStorage
    const [likedArticles, setLikedArticles] = useState(() => {
        const saved = localStorage.getItem('v_liked_articles');
        return saved ? JSON.parse(saved) : {};
    });

    const [commentForms, setCommentForms] = useState({});
    const [submittingComment, setSubmittingComment] = useState({});
    const [activeCommentId, setActiveCommentId] = useState(null);

    // Suggestion 3: Tags/Hashtags & 5: Infinite Scroll
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeTag, setActiveTag] = useState(null);
    const observer = useRef();

    // Sync likes to localStorage
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
                limit: 5,
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

            // Verify likes for new articles with server (based on IP)
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

            // Merge newly created (unapproved) comment with approved ones
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
                    title: `Mashrab's Portfolio - ${title}`,
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
            <div className="min-h-screen pt-32 v-container max-w-4xl space-y-12">
                {[1, 2, 3].map(i => (
                    <div key={i} className="v-card animate-pulse border-none bg-[var(--accents-1)] rounded-3xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-[var(--accents-2)]" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[var(--accents-2)] rounded w-1/4" />
                                <div className="h-3 bg-[var(--accents-2)] rounded w-1/6" />
                            </div>
                        </div>
                        <div className="h-8 bg-[var(--accents-2)] rounded w-3/4 mb-4" />
                        <div className="h-24 bg-[var(--accents-2)] rounded w-full" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] selection:bg-blue-500/30">
            <Helmet>
                <title>{t('articles.title')} | Mashrab Mamarizayev</title>
                <meta name="description" content={t('articles.subtitle')} />
            </Helmet>

            <div className="v-container max-w-4xl pt-32 pb-20 px-6">
                {/* Modern Floating Header */}
                <div className="flex flex-col mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[var(--foreground)] via-[var(--accents-6)] to-[var(--accents-4)] tracking-tight">
                        {t('articles.title')}
                    </h1>
                    <p className="text-[var(--accents-5)] text-xl max-w-2xl leading-relaxed">
                        {t('articles.subtitle') || "Dasturlash, dizayn va hayotiy tajribalarim haqida qiziqarli maqolalar."}
                    </p>
                </div>

                {/* Modern Tag Navigation */}
                <div className="flex gap-3 overflow-x-auto pb-6 mb-12 no-scrollbar touch-pan-x border-b border-[var(--accents-2)]">
                    <button
                        onClick={() => setActiveTag(null)}
                        className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${!activeTag ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-xl shadow-blue-500/10' : 'bg-[var(--accents-1)] text-[var(--accents-5)] border-transparent hover:border-[var(--accents-3)]'}`}
                    >
                        {t('articles.forYou')}
                    </button>
                    {['JavaScript', 'Career', 'Tutorial', 'Personal'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveTag(tag)}
                            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border ${activeTag === tag ? 'bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)] shadow-xl shadow-blue-500/10' : 'bg-[var(--accents-1)] text-[var(--accents-5)] border-transparent hover:border-[var(--accents-3)]'}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                {articles.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center bg-gradient-to-b from-[var(--accents-1)] to-transparent rounded-[3rem] border border-dashed border-[var(--accents-2)]">
                        <div className="text-7xl mb-8 grayscale hover:grayscale-0 transition-all duration-500">🏜️</div>
                        <h3 className="text-2xl font-bold mb-4">{t('articles.noArticlesTitle')}</h3>
                        <p className="text-[var(--accents-5)] max-w-md mx-auto mb-10 text-lg">
                            {activeTag ? `"${activeTag}" tegi bo'yicha hozircha maqolalar yuklanmagan.` : t('articles.noArticlesDescription')}
                        </p>
                        {activeTag && (
                            <button onClick={() => setActiveTag(null)} className="v-btn-primary px-10 h-12 rounded-full font-bold shadow-2xl shadow-blue-500/20">
                                {t('admin.articles.backToArticles')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-12">
                        {articles.map((article, index) => {
                            const isLast = articles.length === index + 1;
                            const content = getLocalizedField(article.content);
                            const readingTime = calculateReadingTime(content);

                            return (
                                <article
                                    key={article._id}
                                    ref={isLast ? lastArticleElementRef : null}
                                    className="group relative bg-[var(--background)] rounded-[2.5rem] p-4 md:p-1 transition-all duration-700 hover:-translate-y-2"
                                >
                                    <div className="flex flex-col md:flex-row gap-10 p-4 md:p-8 rounded-[2rem] border border-[var(--accents-2)] transition-all duration-500 group-hover:border-blue-500/20 group-hover:bg-gradient-to-br group-hover:from-[var(--background)] group-hover:to-[var(--accents-1)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_40px_80px_-20px_rgba(0,112,243,0.05)]">

                                        <div className="flex-1 space-y-6">
                                            {/* Meta Info */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20">
                                                        M
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-sm text-[var(--foreground)]">Mashrab Mamarizayev</div>
                                                        <div className="text-[10px] text-[var(--accents-4)] font-medium uppercase tracking-widest">{formatDate(article.createdAt)}</div>
                                                    </div>
                                                </div>
                                                <div className="bg-blue-500/5 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/10 backdrop-blur-sm">
                                                    {readingTime} MIN READ
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight group-hover:text-blue-500 transition-colors duration-300 leading-[1.1]">
                                                {getLocalizedField(article.title)}
                                            </h2>

                                            {/* Content Area */}
                                            <div className="relative">
                                                <div className="text-[var(--accents-6)] leading-relaxed markdown-article prose prose-lg dark:prose-invert max-w-none line-clamp-4 text-lg">
                                                    <ReactMarkdown>{content}</ReactMarkdown>
                                                </div>
                                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--background)] group-hover:from-transparent transition-all" />
                                            </div>

                                            {/* Tags Suggestion */}
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {article.tags.map(tag => (
                                                        <span key={tag} className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors cursor-default">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Advanced Action Bar */}
                                            <div className="flex items-center justify-between pt-8 mt-4 border-t border-[var(--accents-2)]">
                                                <div className="flex items-center gap-2 md:gap-8">
                                                    <button
                                                        onClick={() => handleLike(article._id)}
                                                        className={`flex items-center gap-2.5 transition-all duration-300 p-2 rounded-xl group/btn ${likedArticles[article._id] ? 'text-pink-500' : 'text-[var(--accents-4)] hover:text-pink-500 hover:bg-pink-500/5'}`}
                                                    >
                                                        <div className={`p-2 rounded-lg transition-transform ${likedArticles[article._id] ? 'bg-pink-500/10' : 'group-hover/btn:scale-110'}`}>
                                                            <svg className={`w-5 h-5 ${likedArticles[article._id] ? 'fill-current' : 'fill-none'}`} stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm font-bold">{article.likeCount || 0}</span>
                                                    </button>

                                                    <button
                                                        onClick={() => toggleComments(article._id)}
                                                        className={`flex items-center gap-2.5 transition-all duration-300 p-2 rounded-xl group/btn ${activeCommentId === article._id ? 'text-blue-500' : 'text-[var(--accents-4)] hover:text-blue-500 hover:bg-blue-500/5'}`}
                                                    >
                                                        <div className={`p-2 rounded-lg transition-transform ${activeCommentId === article._id ? 'bg-blue-500/10' : 'group-hover/btn:scale-110'}`}>
                                                            <svg className="w-5 h-5 fill-none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 5.5Z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm font-bold">{article.comments?.length || 0}</span>
                                                    </button>

                                                    <div className="flex items-center gap-2.5 text-[var(--accents-4)] p-2">
                                                        <div className="p-2">
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-sm font-bold">{article.views || 0}</span>
                                                    </div>
                                                </div>

                                                <button onClick={() => handleShare(article)} className="p-3 rounded-2xl bg-[var(--accents-1)] hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                        <path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Dynamic Comments Component */}
                                            {activeCommentId === article._id && (
                                                <div className="mt-10 space-y-8 animate-in zoom-in-95 fade-in duration-500 pt-8 border-t border-[var(--accents-2)]">
                                                    {article.comments && article.comments.length > 0 && (
                                                        <div className="space-y-4">
                                                            {article.comments.map(comment => (
                                                                <div key={comment._id} className="flex gap-4 p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-[var(--accents-2)] shadow-sm">
                                                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--accents-1)] to-[var(--accents-2)] flex items-center justify-center font-bold text-xs">
                                                                        {comment.name.charAt(0)}
                                                                    </div>
                                                                    <div className="flex-1 space-y-1">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="font-bold text-sm">{comment.name}</span>
                                                                            <span className="text-[10px] text-[var(--accents-4)] font-mono">{formatDate(comment.createdAt)}</span>
                                                                        </div>
                                                                        <p className="text-sm text-[var(--accents-6)] leading-relaxed">{comment.content}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <form onSubmit={(e) => handleCommentSubmit(e, article._id)} className="relative group/form">
                                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2rem] opacity-0 group-focus-within/form:opacity-10 blur-xl transition-opacity duration-500" />
                                                        <div className="relative space-y-4 p-6 rounded-[2rem] bg-[var(--accents-1)] border border-[var(--accents-2)]">
                                                            <textarea
                                                                value={commentForms[article._id]?.content || ''}
                                                                onChange={(e) => handleCommentChange(article._id, 'content', e.target.value)}
                                                                className="w-full bg-transparent text-base outline-none transition-all min-h-[120px] resize-none placeholder:text-[var(--accents-4)]"
                                                                placeholder={t('articles.commentPlaceholder')}
                                                                required
                                                            />
                                                            <div className="flex flex-col sm:flex-row gap-4">
                                                                <input
                                                                    type="text"
                                                                    value={commentForms[article._id]?.name || ''}
                                                                    onChange={(e) => handleCommentChange(article._id, 'name', e.target.value)}
                                                                    className="flex-1 bg-white dark:bg-black border border-[var(--accents-2)] rounded-2xl px-6 py-3 text-sm focus:border-blue-500 transition-colors shadow-sm"
                                                                    placeholder={t('articles.commentName')}
                                                                    required
                                                                />
                                                                <button
                                                                    type="submit"
                                                                    disabled={submittingComment[article._id]}
                                                                    className="bg-[var(--foreground)] text-[var(--background)] rounded-2xl px-10 py-3 text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl"
                                                                >
                                                                    {submittingComment[article._id] ? t('articles.sending') : t('articles.submitComment')}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>

                                        {/* Premium Image Presentation */}
                                        {article.image && (
                                            <div className="w-full md:w-[320px] h-[240px] md:h-auto rounded-[2rem] overflow-hidden border border-[var(--accents-2)] shadow-2xl transition-all duration-700 group-hover:shadow-blue-500/10 group-hover:border-blue-500/30">
                                                <img
                                                    src={getImageUrl(article.image)}
                                                    alt={getLocalizedField(article.title)}
                                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </article>
                            );
                        })}

                        {loadingMore && (
                            <div className="py-20 flex justify-center">
                                <div className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        )}

                        {!hasMore && articles.length > 0 && (
                            <div className="py-24 text-center">
                                <span className="px-8 py-3 rounded-full bg-[var(--accents-1)] text-[var(--accents-4)] text-sm font-bold tracking-widest uppercase">
                                    {t('articles.endOfFeed')}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlesPage;
