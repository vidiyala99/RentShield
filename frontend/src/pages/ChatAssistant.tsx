import React, { useState } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';

export const ChatAssistant = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
        { role: 'assistant', content: "Hello! I'm your Tenant Rights Assistant. How can I help you today? You can ask me about eviction laws, repairs, or your lease agreement." }
    ]);
    const [input, setInput] = useState('');

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user' as const, content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "I'm currently in demo mode. In the production version, I will be connected to a legal knowledge base to answer your specific questions!"
            }]);
        }, 1000);
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto', height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'var(--border-light) transparent'
                }}>
                    {messages.map((msg, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            <div style={{
                                maxWidth: '80%',
                                borderRadius: '16px',
                                borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                borderBottomLeftRadius: msg.role === 'assistant' ? '4px' : '16px',
                                padding: '1rem 1.5rem',
                                background: msg.role === 'user' ? 'linear-gradient(135deg, #C5A065 0%, #AA854B 100%)' : 'rgba(255,255,255,0.05)',
                                color: msg.role === 'user' ? '#1a1d24' : 'white',
                                border: msg.role === 'assistant' ? '1px solid var(--border-light)' : 'none',
                                lineHeight: '1.6',
                                fontWeight: msg.role === 'user' ? 600 : 400,
                                boxShadow: msg.role === 'user' ? '0 4px 12px rgba(197, 160, 101, 0.2)' : 'none'
                            }}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSend} style={{
                    padding: '0.75rem',
                    background: 'var(--bg-core)',
                    borderRadius: '50px',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    gap: '1rem',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your question about tenant rights..."
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            padding: '0.75rem 1.5rem',
                            fontFamily: 'inherit'
                        }}
                    />
                    <button type="submit" style={{
                        background: 'var(--accent-primary)',
                        border: 'none',
                        color: '#1a1d24',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: input.trim() ? 'pointer' : 'default',
                        opacity: input.trim() ? 1 : 0.5,
                        transition: 'all 0.2s'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};
