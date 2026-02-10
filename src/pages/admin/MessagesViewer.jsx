import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { useLanguage } from '../../context/LanguageContext';

const MessagesViewer = () => {
    const { t } = useLanguage();
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages');
            setMessages(response.data.data || []);
        } catch (error) {
            toast.error(t('admin.common.error'));
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/messages/${id}/read`);
            setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
        } catch (error) {
            // silent fail
        }
    };

    const openMessage = (msg) => {
        setSelectedMessage(msg);
        setShowDetail(true);
        if (!msg.read) markAsRead(msg._id);
    };

    const handleBack = () => {
        setShowDetail(false);
        // Don't clear selectedMessage so it stays highlighted if we go back to desktop/list?
        // Actually, clearing it is fine or keeping it. Keeping it is better.
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.common.confirmDelete'))) return;
        try {
            await api.delete(`/messages/${id}`);
            toast.success(t('admin.common.success'));
            setMessages(prev => prev.filter(m => m._id !== id));
            if (selectedMessage?._id === id) {
                setSelectedMessage(null);
                setShowDetail(false);
            }
        } catch (error) {
            toast.error(t('admin.common.error'));
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const currentLang = localStorage.getItem('language') || 'uz';
        const locale = currentLang === 'uz' ? 'uz-UZ' : currentLang === 'ru' ? 'ru-RU' : 'en-US';
        const date = new Date(dateString);
        return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] flex flex-col p-4 md:p-6">
            <Helmet><title>{t('admin.messages.title')} | Admin</title></Helmet>

            <div className={`flex items-center justify-between mb-4 md:mb-8 ${showDetail ? 'hidden md:flex' : 'flex'}`}>
                <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">{t('admin.messages.title')}</h1>
                    <p className="text-[var(--accents-5)] text-xs md:text-sm font-mono font-bold uppercase tracking-widest">
                        {unreadCount} {t('admin.messages.management')}
                    </p>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 relative">
                {/* Messages List */}
                <div className={`v-card p-0 flex flex-col overflow-hidden ${showDetail ? 'hidden lg:flex' : 'flex'} h-full`}>
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-sm text-[var(--accents-5)]">{t('admin.projects.table.loading')}</div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-sm text-[var(--accents-5)]">{t('admin.common.noResults')}</div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            {messages.map((msg) => (
                                <button
                                    key={msg._id}
                                    onClick={() => openMessage(msg)}
                                    className={`w-full text-left p-4 border-b border-[var(--accents-2)] hover:bg-[var(--accents-1)] transition-all ${selectedMessage?._id === msg._id ? 'bg-[var(--accents-1)] border-l-2 border-l-[var(--foreground)]' : 'border-l-2 border-l-transparent'
                                        } ${!msg.read ? 'bg-[var(--accents-1)]/50' : ''}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {!msg.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                                <span className={`text-sm font-bold truncate ${!msg.read ? 'text-[var(--foreground)]' : 'text-[var(--accents-5)]'}`}>{msg.name}</span>
                                            </div>
                                            <p className="text-xs text-[var(--accents-4)] truncate font-mono">{msg.email}</p>
                                        </div>
                                        <span className="text-[10px] text-[var(--accents-3)] whitespace-nowrap font-mono">{formatDate(msg.createdAt)}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Detail */}
                <div className={`v-card p-0 flex flex-col overflow-hidden ${showDetail ? 'flex absolute inset-0 z-10 lg:static lg:z-auto' : 'hidden lg:flex'} h-full bg-[var(--background)]`}>
                    {selectedMessage ? (
                        <>
                            <div className="p-4 md:p-6 border-b border-[var(--accents-2)] flex items-start justify-between bg-[var(--background)]">
                                <div className="flex items-center gap-3">
                                    <button onClick={handleBack} className="lg:hidden p-2 -ml-2 text-[var(--accents-5)]">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                                    </button>
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold tracking-tight mb-1">{selectedMessage.name}</h3>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-xs md:text-sm text-primary hover:underline font-mono">{selectedMessage.email}</a>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(selectedMessage._id)} className="p-2 text-[var(--accents-3)] hover:text-error-light transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[var(--background)]">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[var(--accents-1)] border-t border-[var(--accents-2)]">
                                <span className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">
                                    {t('admin.messages.date')}: {formatDate(selectedMessage.createdAt)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--accents-4)] p-8">
                            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <p className="text-sm">{t('admin.messages.view')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesViewer;
