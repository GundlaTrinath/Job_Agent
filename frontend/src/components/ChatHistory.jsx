import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, Clock } from 'lucide-react';

const ChatHistory = ({ onSessionSwitch, currentSessionId }) => {
    const [sessions, setSessions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/chat/sessions');
            setSessions(res.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)));
        } catch (e) {
            console.error(e);
        }
    };

    const createNewSession = async () => {
        try {
            const res = await axios.post('http://localhost:8000/api/chat/sessions');
            setSessions(prev => [res.data, ...prev]);
            onSessionSwitch(res.data.id);
            setIsOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const switchSession = async (sessionId) => {
        try {
            await axios.put(`http://localhost:8000/api/chat/sessions/${sessionId}/activate`);
            onSessionSwitch(sessionId);
            setIsOpen(false);
        } catch (e) {
            console.error(e);
        }
    };

    const deleteSession = async (sessionId, e) => {
        e.stopPropagation();
        if (sessions.length <= 1) {
            alert("Cannot delete the last session!");
            return;
        }
        try {
            await axios.delete(`http://localhost:8000/api/chat/sessions/${sessionId}`);
            fetchSessions();
            if (sessionId === currentSessionId) {
                onSessionSwitch(sessions.find(s => s.id !== sessionId)?.id);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div style={{ position: 'relative' }}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: isOpen ? 'rgba(124, 58, 237, 0.1)' : 'var(--background)',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    marginBottom: '0.5rem'
                }}
            >
                <MessageSquare size={18} />
                Chat History
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="glass-panel"
                        style={{
                            position: 'absolute',
                            top: '4rem',
                            left: 0,
                            right: 0,
                            maxHeight: '400px',
                            overflowY: 'auto',
                            zIndex: 50,
                            padding: '0.75rem',
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow-lg)'
                        }}
                    >
                        {/* New Chat Button */}
                        <button
                            onClick={createNewSession}
                            style={{
                                width: '100%',
                                padding: '0.875rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                                color: 'white',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                marginBottom: '0.75rem',
                                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                            }}
                        >
                            <Plus size={18} />
                            New Chat
                        </button>

                        {/* Session List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {sessions.map((session) => (
                                <motion.div
                                    key={session.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        padding: '0.75rem',
                                        borderRadius: '8px',
                                        background: session.id === currentSessionId
                                            ? 'rgba(124, 58, 237, 0.1)'
                                            : 'var(--background)',
                                        border: session.id === currentSessionId
                                            ? '1px solid var(--primary)'
                                            : '1px solid var(--border)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => switchSession(session.id)}
                                    onMouseEnter={(e) => {
                                        if (session.id !== currentSessionId) {
                                            e.currentTarget.style.background = 'rgba(124, 58, 237, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (session.id !== currentSessionId) {
                                            e.currentTarget.style.background = 'var(--background)';
                                        }
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            fontWeight: '600',
                                            color: 'var(--text)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            marginBottom: '0.25rem'
                                        }}>
                                            {session.title}
                                        </div>
                                        <div style={{
                                            fontSize: '0.75rem',
                                            color: 'var(--text-muted)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}>
                                            <Clock size={12} />
                                            {formatDate(session.updated_at)}
                                        </div>
                                    </div>

                                    {sessions.length > 1 && (
                                        <button
                                            onClick={(e) => deleteSession(session.id, e)}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: 'transparent',
                                                color: 'var(--text-muted)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#fee2e2';
                                                e.currentTarget.style.color = '#dc2626';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                            }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatHistory;
