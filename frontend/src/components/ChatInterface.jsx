            } else {
    setMessages([{ role: 'agent', content: 'Hello! I am CareerPilot AI. How can I help you today?' }]);
}
        } catch (e) {
    console.error(e);
}
    };

const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(scrollToBottom, [messages]);

const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
        const response = await sendMessage(input);
        const agentMessage = {
            role: 'agent',
            content: response.response,
            agentName: response.agent,
            reasoning: response.reasoning
        };
        setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
        setMessages(prev => [...prev, { role: 'agent', content: 'Sorry, something went wrong. Please check your API key.' }]);
    } finally {
        setLoading(false);
    }
};

return (
    <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: window.innerWidth <= 768 ? 'calc(100vh - 140px)' : '85vh',
        overflow: 'hidden',
        margin: 'clamp(1rem, 2vw, 2rem)',
        padding: '0'
    }}>
        {/* Messages Container */}
        <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(1rem, 2vw, 1.5rem)'
        }}>
            {messages.map((msg, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                    }}
                >
                    <div style={{
                        padding: '1rem 1.5rem',
                        borderRadius: '1.5rem',
                        backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'var(--surface)',
                        color: msg.role === 'user' ? '#fff' : 'var(--text)',
                        borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1.5rem',
                        borderBottomLeftRadius: msg.role === 'agent' ? '0.25rem' : '1.5rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        border: msg.role === 'agent' ? '1px solid var(--border)' : 'none'
                    }}>
                        {msg.agentName && (
                            <div style={{
                                fontSize: '0.7rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                marginBottom: '0.5rem',
                                opacity: 0.7,
                                fontWeight: 'bold'
                            }}>
                                {msg.agentName}
                            </div>
                        )}

                        <div style={{ lineHeight: '1.6', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>

                    {msg.reasoning && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            style={{
                                marginTop: '0.5rem',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                paddingLeft: '1rem',
                                borderLeft: '2px solid var(--border)'
                            }}
                        >
                            <span style={{ fontStyle: 'italic' }}>💭 Thought Process: {msg.reasoning}</span>
                        </motion.div>
                    )}
                </motion.div>
            ))}

            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ alignSelf: 'flex-start', padding: '1rem', color: 'var(--text-muted)', display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                >
                    <div className="spinner" style={{ width: '12px', height: '12px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    <span>Agent is thinking...</span>
                </motion.div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
            padding: 'clamp(1rem, 2vw, 1.5rem)',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: 'clamp(0.5rem, 1vw, 0.75rem)',
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(10px)'
        }}>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Ask me anything about your career..."
                disabled={loading}
                style={{
                    flex: 1,
                    padding: 'clamp(0.75rem, 2vw, 1rem)',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--surface)',
                    color: 'var(--text)',
                    outline: 'none'
                }}
            />
            <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="ripple-effect"
                style={{
                    padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                    borderRadius: '12px',
                    border: 'none',
                    background: loading || !input.trim()
                        ? 'var(--border)'
                        : 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 100%)',
                    color: 'white',
                    cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    minWidth: '60px',
                    boxShadow: loading || !input.trim() ? 'none' : '0 4px 12px rgba(124, 58, 237, 0.3)'
                }}
            >
                {loading ? 'Sending...' : 'Send'}
            </button>
        </div>
        <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
    </div>
);
};

export default ChatInterface;
