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
            // Using Promise.all to fetch status in parallel and avoid setLikedArticles in a loop
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



    // Suggestion 4: Reading Time
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
            // Fallback to copy link
            try {
                await navigator.clipboard.writeText(url);
                toast.success(t('common.copied'));
            } catch (err) {
                toast.error(t('common.error'));
            }
        }
    };

    const toggleComments = async (articleId) => {
        // Increment view when user interacts to see comments
        try { api.patch(`/articles/${articleId}/view`); } catch (e) { /* silent */ }

        if (activeCommentId === articleId) {
            setActiveCommentId(null);
            return;
        }

        // Fetch comments before opening if they are not already loaded
        const article = articles.find(a => a._id === articleId);
        if (!article.comments) {
            try {
                const res = await api.get(`/articles/${articleId}`);
                setArticles(prev => prev.map(a =>
                    a._id === articleId ? { ...a, comments: res.data.data.comments } : a
                ));
            } catch (e) {
                // silent
            }
        }

        setActiveCommentId(articleId);
    };

    if (loading && articles.length === 0) {
        return (
            <div className="min-h-screen pt-20 px-0 flex flex-col items-center max-w-[600px] mx-auto border-x border-[var(--accents-2)]">
                <div className="w-full px-4 py-3 border-b border-[var(--accents-2)]">
                    <div className="h-6 bg-[var(--accents-2)] rounded w-1/3 animate-pulse" />
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="w-full space-y-4 animate-pulse">
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--accents-2)]" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[var(--accents-2)] rounded w-1/4" />
                                <div className="h-4 bg-[var(--accents-2)] rounded w-full" />
                                <div className="h-48 bg-[var(--accents-2)] rounded-2xl w-full" />
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

            <div className="v-container max-w-[600px] px-0 border-x border-[var(--accents-2)] min-h-screen pt-20">
                {/* Header with Navigation/Tags */}
                <div className="sticky top-16 z-30 bg-[var(--background)] bg-opacity-80 backdrop-blur-md border-b border-[var(--accents-2)]">
                    <div className="px-4 py-3">
                        <h1 className="text-xl font-bold tracking-tight">{t('articles.title')}</h1>
                    </div>
                    {/* Tags Navigation */}
                    <div className="flex px-4 pb-2 gap-4 overflow-x-auto scrollbar-hide no-scrollbar">
                        <button
                            onClick={() => setActiveTag(null)}
                            className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${!activeTag ? 'border-blue-500 text-[var(--foreground)]' : 'border-transparent text-[var(--accents-4)]'}`}
                        >
                            {t('articles.forYou')}
                        </button>
                        {/* Static categories for now, can be dynamic from articles */}
                        {['JavaScript', 'Career', 'Tutorial', 'Personal'].map(tag => (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTag === tag ? 'border-blue-500 text-[var(--foreground)]' : 'border-transparent text-[var(--accents-4)]'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {articles.length === 0 && !loading ? (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                        <div className="text-5xl mb-6 animate-bounce">📭</div>
                        <h3 className="text-xl font-bold mb-2">{t('articles.noArticlesTitle')}</h3>
                        <p className="text-[var(--accents-5)] text-sm mb-6 max-w-[300px]">
                            {activeTag
                                ? `"${activeTag}" tegi bo'yicha hech qanday maqola topilmadi.`
                                : t('articles.noArticlesDescription')}
                        </p>
                        {activeTag && (
                            <button
                                onClick={() => setActiveTag(null)}
                                className="v-btn-primary px-6 h-10 text-sm"
                            >
                                {t('admin.articles.backToArticles')}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--accents-2)]">
                        {articles.map((article, index) => {
                            const isLast = articles.length === index + 1;
                            const content = getLocalizedField(article.content);
                            const readingTime = calculateReadingTime(content);

                            return (
                                <div
                                    key={article._id}
                                    ref={isLast ? lastArticleElementRef : null}
                                    className="hover:bg-[var(--accents-1)] transition-colors duration-200"
                                >
                                    <div className="flex p-4 gap-3">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 rounded-full bg-[var(--accents-8)] text-[var(--background)] flex items-center justify-center font-bold text-sm">
                                                M
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className="font-bold text-[15px] hover:underline cursor-pointer">Mashrab Mamarizayev</span>
                                                <span className="text-[var(--accents-4)] text-[15px]">@mamarizayev</span>
                                                <span className="text-[var(--accents-4)] text-[15px]">·</span>
                                                <span className="text-[var(--accents-4)] text-[15px] hover:underline cursor-pointer">{formatDate(article.createdAt)}</span>
                                                <span className="text-[var(--accents-4)] text-[15px]">·</span>
                                                <span className="text-[var(--accents-3)] text-xs font-mono">{readingTime} {t('articles.minRead')}</span>
                                            </div>

                                            <div className="text-[15px] font-bold leading-normal">
                                                {getLocalizedField(article.title)}
                                            </div>

                                            <div className="text-[15px] text-[var(--foreground)] leading-normal markdown-article prose prose-sm dark:prose-invert max-w-none">
                                                {/* Suggestion 1: Markdown Support */}
                                                <ReactMarkdown>{content}</ReactMarkdown>
                                            </div>

                                            {/* Tags Suggestion */}
                                            {article.tags && article.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {article.tags.map(tag => (
                                                        <button
                                                            key={tag}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setActiveTag(tag);
                                                            }}
                                                            className="text-blue-500 hover:underline cursor-pointer text-[14px]"
                                                        >
                                                            #{tag}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

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

                                            <div className="flex items-center justify-between max-w-md pt-2 -ml-2">
                                                {/* Comments */}
                                                <button
                                                    onClick={() => toggleComments(article._id)}
                                                    className={`group flex items-center gap-2 transition-colors ${activeCommentId === article._id ? 'text-blue-500' : 'text-[var(--accents-4)] hover:text-blue-500'}`}
                                                >
                                                    <div className={`p-2 rounded-full transition-all ${activeCommentId === article._id ? 'bg-blue-500/10' : 'group-hover:bg-blue-500/10'}`}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 5.5Z" /></svg>
                                                    </div>
                                                    <span className="text-xs">{article.comments?.length || 0}</span>
                                                </button>

                                                {/* Like */}
                                                <button
                                                    onClick={() => handleLike(article._id)}
                                                    className={`group flex items-center gap-2 transition-colors ${likedArticles[article._id] ? 'text-pink-600' : 'text-[var(--accents-4)] hover:text-pink-500'}`}
                                                >
                                                    <div className={`p-2 rounded-full transition-all ${likedArticles[article._id] ? '' : 'group-hover:bg-pink-500/10'}`}>
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill={likedArticles[article._id] ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-xs">{article.likeCount || 0}</span>
                                                </button>

                                                {/* Views */}
                                                <div className="group flex items-center gap-2 text-[var(--accents-4)] transition-colors hover:text-blue-500">
                                                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-all">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    </div>
                                                    <span className="text-xs">{article.views || 0}</span>
                                                </div>

                                                {/* Share */}
                                                <button
                                                    onClick={() => handleShare(article)}
                                                    className="group text-[var(--accents-4)] transition-colors hover:text-blue-500"
                                                >
                                                    <div className="p-2 rounded-full group-hover:bg-blue-500/10 transition-all">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>
                                                    </div>
                                                </button>
                                            </div>

                                            {activeCommentId === article._id && (
                                                <div className="pt-4 divide-y divide-[var(--accents-2)] animate-in fade-in slide-in-from-top-2 duration-300">
                                                    {/* Existing Comments */}
                                                    {article.comments && article.comments.length > 0 && (
                                                        <div className="pb-4 space-y-4">
                                                            {article.comments.map(comment => (
                                                                <div key={comment._id} className="flex gap-3 px-1">
                                                                    <div className="w-8 h-8 rounded-full bg-[var(--accents-2)] flex items-center justify-center font-bold text-[10px]">
                                                                        {comment.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-bold text-sm">{comment.name}</span>
                                                                            <span className="text-[var(--accents-4)] text-[11px]">· {formatDate(comment.createdAt)}</span>
                                                                            {comment.approved === false && (
                                                                                <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                                                    {t('articles.pending')}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-[14px] text-[var(--foreground)] mt-0.5">{comment.content}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Comment Form */}
                                                    <form onSubmit={(e) => handleCommentSubmit(e, article._id)} className="py-4 space-y-3">
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-[var(--accents-2)] flex items-center justify-center">
                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                                            </div>
                                                            <div className="flex-1 space-y-3">
                                                                <textarea
                                                                    value={commentForms[article._id]?.content || ''}
                                                                    onChange={(e) => handleCommentChange(article._id, 'content', e.target.value)}
                                                                    className="w-full bg-transparent text-[15px] outline-none border-b border-[var(--accents-2)] focus:border-blue-500 py-1 transition-colors resize-none"
                                                                    placeholder={t('articles.commentPlaceholder')}
                                                                    rows={2}
                                                                    required
                                                                />
                                                                <div className="flex flex-wrap gap-2">
                                                                    <input
                                                                        type="text"
                                                                        value={commentForms[article._id]?.name || ''}
                                                                        onChange={(e) => handleCommentChange(article._id, 'name', e.target.value)}
                                                                        className="text-xs bg-[var(--accents-1)] px-3 py-1.5 rounded-full outline-none border border-[var(--accents-2)] focus:border-blue-500 flex-1 min-w-[150px]"
                                                                        placeholder={t('articles.commentName')}
                                                                        required
                                                                    />
                                                                    <button
                                                                        type="submit"
                                                                        disabled={submittingComment[article._id]}
                                                                        className="bg-blue-500 text-white rounded-full px-5 py-1.5 text-xs font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
                                                                    >
                                                                        {submittingComment[article._id] ? t('articles.sending') : t('articles.submitComment')}
                                                                    </button>
                                                                </div>
                                                                <p className="text-[10px] text-[var(--accents-4)] italic">
                                                                    {t('articles.commentModeration')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {loadingMore && (
                            <div className="p-4 flex justify-center">
                                <div className="v-loader w-6 h-6 border-2 border-[var(--accents-2)] border-t-blue-500 rounded-full animate-spin" />
                            </div>
                        )}

                        {!hasMore && articles.length > 0 && (
                            <div className="p-8 text-center text-[var(--accents-4)] text-sm">
                                {t('articles.endOfFeed')}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticlesPage;
