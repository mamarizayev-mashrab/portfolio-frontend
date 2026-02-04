import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';

const MessagesViewer = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);

    useEffect(() => { fetchMessages(); }, []);

    const fetchMessages = async () => {
        try {
            const response = await api.get('/messages');
            setMessages(response.data.data || []);
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setIsLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.patch(`/messages/${id}/read`);
            setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const openMessage = (msg) => {
        setSelectedMessage(msg);
        if (!msg.read) markAsRead(msg._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/messages/${id}`);
            toast.success('Message deleted');
            setMessages(prev => prev.filter(m => m._id !== id));
            if (selectedMessage?._id === id) setSelectedMessage(null);
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const deleteAllRead = async () => {
        if (!window.confirm('Delete all read messages?')) return;
        try {
            await api.delete('/messages/read');
            toast.success('Read messages deleted');
            fetchMessages();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col p-6">
            <Helmet><title>Messages | Admin</title></Helmet>

            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tighter">Messages</h1>
                    <p className="text-[var(--accents-5)] text-sm font-mono font-bold uppercase tracking-widest">
                        {unreadCount} unread_transmissions
                    </p>
                </div>
                {messages.some(m => m.read) && (
                    <button onClick={deleteAllRead} className="v-btn-ghost h-8 px-3 text-xs text-error-light hover:text-error-dark">
                        Flush Archived
                    </button>
                )}
            </div>

            <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
                {/* Messages List */}
                <div className="v-card p-0 flex flex-col overflow-hidden">
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-sm text-[var(--accents-5)]">Connecting to message stream...</div>
                    ) : messages.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-sm text-[var(--accents-5)]">No signals detected.</div>
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
                <div className="v-card p-0 flex flex-col overflow-hidden">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-[var(--accents-2)] flex items-start justify-between">
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight mb-1">{selectedMessage.name}</h3>
                                    <a href={`mailto:${selectedMessage.email}`} className="text-sm text-primary hover:underline font-mono">{selectedMessage.email}</a>
                                </div>
                                <button onClick={() => handleDelete(selectedMessage._id)} className="p-2 text-[var(--accents-3)] hover:text-error-light transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedMessage.message}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-[var(--accents-1)] border-t border-[var(--accents-2)]">
                                <span className="text-[10px] font-mono font-bold text-[var(--accents-4)] uppercase tracking-widest">
                                    Timestamp: {formatDate(selectedMessage.createdAt)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-[var(--accents-4)] p-8">
                            <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <p className="text-sm">Select a transmission to decypher.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessagesViewer;
