/**
 * Messages Viewer Page
 * View and manage contact form messages
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../../api/axios';
import { toast } from 'react-hot-toast';
import { ButtonSpinner } from '../../components/common/Loading';

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
        if (!confirm('Delete this message?')) return;
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
        if (!confirm('Delete all read messages?')) return;
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
        <>
            <Helmet><title>Messages | Admin</title></Helmet>
            <div className="h-[calc(100vh-120px)] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-dark-100">Messages</h1>
                        <p className="text-dark-400">{unreadCount} unread messages</p>
                    </div>
                    {messages.some(m => m.read) && (
                        <button onClick={deleteAllRead} className="text-dark-400 hover:text-red-400 text-sm">Delete all read</button>
                    )}
                </div>

                <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">
                    {/* Messages List */}
                    <div className="glass-dark rounded-xl border border-dark-700 overflow-hidden flex flex-col">
                        {loading ? (
                            <div className="flex-1 flex items-center justify-center"><ButtonSpinner size="lg" /></div>
                        ) : messages.length === 0 ? (
                            <div className="flex-1 flex items-center justify-center text-dark-400">No messages yet</div>
                        ) : (
                            <div className="flex-1 overflow-y-auto">
                                {messages.map((msg) => (
                                    <button
                                        key={msg._id}
                                        onClick={() => openMessage(msg)}
                                        className={`w-full text-left p-4 border-b border-dark-800 hover:bg-dark-800/50 transition-colors ${selectedMessage?._id === msg._id ? 'bg-primary-500/10' : ''
                                            } ${!msg.read ? 'bg-dark-800/30' : ''}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    {!msg.read && <span className="w-2 h-2 rounded-full bg-primary-500" />}
                                                    <span className={`font-medium truncate ${!msg.read ? 'text-dark-100' : 'text-dark-300'}`}>{msg.name}</span>
                                                </div>
                                                <p className="text-sm text-dark-500 truncate">{msg.email}</p>
                                            </div>
                                            <span className="text-xs text-dark-500 whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-dark-400 truncate mt-1">{msg.subject || msg.message}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Message Detail */}
                    <div className="glass-dark rounded-xl border border-dark-700 flex flex-col">
                        {selectedMessage ? (
                            <>
                                <div className="p-4 border-b border-dark-700 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-dark-100">{selectedMessage.name}</h3>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-sm text-primary-400 hover:underline">{selectedMessage.email}</a>
                                    </div>
                                    <button onClick={() => handleDelete(selectedMessage._id)} className="p-2 text-dark-400 hover:text-red-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                {selectedMessage.subject && (
                                    <div className="px-4 py-2 border-b border-dark-800">
                                        <span className="text-sm text-dark-400">Subject: </span>
                                        <span className="text-dark-200">{selectedMessage.subject}</span>
                                    </div>
                                )}
                                <div className="flex-1 p-4 overflow-y-auto">
                                    <p className="text-dark-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>
                                <div className="p-4 border-t border-dark-700">
                                    <p className="text-xs text-dark-500">Received: {formatDate(selectedMessage.createdAt)}</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-dark-500">
                                Select a message to view
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MessagesViewer;
