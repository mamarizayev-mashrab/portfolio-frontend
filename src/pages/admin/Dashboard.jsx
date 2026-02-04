/**
 * Admin Dashboard Page
 * Overview with statistics
 */

import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        messages: 0,
        unreadMessages: 0
    });
    const [recentMessages, setRecentMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [projectsRes, skillsRes, experiencesRes, messagesRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/skills'),
                    api.get('/experiences'),
                    api.get('/messages')
                ]);

                setStats({
                    projects: projectsRes.data.count || 0,
                    skills: skillsRes.data.count || 0,
                    experiences: experiencesRes.data.count || 0,
                    messages: messagesRes.data.count || 0,
                    unreadMessages: messagesRes.data.unreadCount || 0
                });

                setRecentMessages((messagesRes.data.data || []).slice(0, 5));
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            label: 'Projects',
            value: stats.projects,
            icon: '📁',
            link: '/admin/projects',
            color: 'from-primary-500/20 to-primary-600/20 border-primary-500/30'
        },
        {
            label: 'Skills',
            value: stats.skills,
            icon: '⚡',
            link: '/admin/skills',
            color: 'from-accent-500/20 to-accent-600/20 border-accent-500/30'
        },
        {
            label: 'Experience',
            value: stats.experiences,
            icon: '💼',
            link: '/admin/experience',
            color: 'from-green-500/20 to-green-600/20 border-green-500/30'
        },
        {
            label: 'Messages',
            value: stats.messages,
            icon: '📬',
            link: '/admin/messages',
            color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
            badge: stats.unreadMessages > 0 ? stats.unreadMessages : null
        }
    ];

    return (
        <>
            <Helmet>
                <title>Dashboard | Admin</title>
            </Helmet>

            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-dark-100">Dashboard</h1>
                    <p className="text-dark-400 mt-1">Welcome back! Here's an overview of your portfolio.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Link
                            key={stat.label}
                            to={stat.link}
                            className={`relative p-6 rounded-xl bg-gradient-to-br ${stat.color} border backdrop-blur-sm transition-all hover:scale-105`}
                        >
                            {stat.badge && (
                                <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                    {stat.badge}
                                </span>
                            )}
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-dark-400 text-sm mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-dark-100">
                                        {loading ? '—' : stat.value}
                                    </p>
                                </div>
                                <span className="text-3xl">{stat.icon}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Recent Messages */}
                <div className="glass-dark rounded-xl border border-dark-700 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-dark-100">Recent Messages</h2>
                        <Link to="/admin/messages" className="text-primary-400 hover:text-primary-300 text-sm">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="skeleton h-16 rounded-lg" />
                            ))}
                        </div>
                    ) : recentMessages.length > 0 ? (
                        <div className="space-y-3">
                            {recentMessages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`p-4 rounded-lg border ${msg.read
                                            ? 'bg-dark-800/30 border-dark-700'
                                            : 'bg-primary-500/5 border-primary-500/20'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-dark-100 truncate">{msg.name}</p>
                                                {!msg.read && (
                                                    <span className="px-2 py-0.5 text-xs rounded-full bg-primary-500/20 text-primary-400">New</span>
                                                )}
                                            </div>
                                            <p className="text-sm text-dark-500 truncate">{msg.email}</p>
                                        </div>
                                        <span className="text-xs text-dark-500 whitespace-nowrap ml-4">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-dark-400 text-sm mt-2 line-clamp-1">{msg.message}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-dark-500 py-8">No messages yet</p>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Link
                        to="/admin/projects"
                        className="p-4 rounded-lg glass-dark border border-dark-700 hover:border-primary-500/30 transition-colors flex items-center gap-3"
                    >
                        <div className="p-2 rounded-lg bg-primary-500/10">
                            <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <span className="text-dark-200">Add New Project</span>
                    </Link>
                    <Link
                        to="/admin/skills"
                        className="p-4 rounded-lg glass-dark border border-dark-700 hover:border-accent-500/30 transition-colors flex items-center gap-3"
                    >
                        <div className="p-2 rounded-lg bg-accent-500/10">
                            <svg className="w-5 h-5 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <span className="text-dark-200">Add New Skill</span>
                    </Link>
                    <Link
                        to="/admin/settings"
                        className="p-4 rounded-lg glass-dark border border-dark-700 hover:border-green-500/30 transition-colors flex items-center gap-3"
                    >
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-dark-200">Edit Settings</span>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
