import { Link } from 'react-router-dom';
import { useAuth } from '../stores/authStore';
import { DashboardLayout } from '../components/DashboardLayout';

export const Dashboard = () => {
    const { user } = useAuth();

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>Welcome back, {user?.full_name?.split(' ')[0] || 'Tenant'}.</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Here is an overview of your rights and active matters.</p>
                </header>

                <div className="bento-grid" style={{ marginBottom: '3rem' }}>
                    {/* Primary Action Card */}
                    <div className="bento-card" style={{ gridColumn: 'span 2', background: 'linear-gradient(135deg, #C5A065 0%, #AA854B 100%)', border: 'none' }}>
                        <div style={{ position: 'relative', zIndex: 10 }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#1a1d24' }}>Start a New Case</h2>
                            <p style={{ marginBottom: '2rem', maxWidth: '400px', fontWeight: 500, color: 'rgba(26, 29, 36, 0.9)' }}>
                                Facing a rental issue? Initialize a secure case file to document evidence and generate legal letters.
                            </p>
                            <Link
                                to="/cases/new"
                                style={{
                                    display: 'inline-block',
                                    background: '#1a1d24',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                }}
                            >
                                + Initialize Case
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats or Tips */}
                    <div className="bento-card">
                        <div>
                            <div style={{ color: 'var(--accent-primary)', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Did you know?</div>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                Landlords in NC must return your security deposit within 30 days of lease termination or provide an interim accounting.
                            </p>
                        </div>
                        <Link to="/chat" style={{ color: 'white', fontSize: '0.9rem', fontWeight: 500, marginTop: '1rem', display: 'block', textDecoration: 'none' }}>
                            Ask AI Assistant about Deposits &rarr;
                        </Link>
                    </div>
                </div>

                <div className="bento-grid">
                    <Link to="/chat" className="bento-card">
                        <div style={{
                            width: '48px', height: '48px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1rem', color: '#60A5FA'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>🤖</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>AI Rights Assistant</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Have a quick question? Chat with our AI to understand your rights regarding repairs, eviction, and more.
                        </p>
                    </Link>

                    <Link to="/resources" className="bento-card">
                        <div style={{
                            width: '48px', height: '48px',
                            background: 'rgba(74, 222, 128, 0.1)',
                            borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '1rem', color: '#4ADE80'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>📚</span>
                        </div>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Resources Library</h3>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            Access a curated collection of North Carolina tenant law documents, guides, and contact numbers.
                        </p>
                    </Link>
                </div>

                <div style={{ marginTop: '4rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white', borderLeft: '4px solid var(--accent-primary)', paddingLeft: '1rem' }}>Common Issues</h2>
                    <div className="bento-grid">
                        <Link to="/cases/new" className="bento-card">
                            <div style={{ marginBottom: '1rem', color: '#FCD34D' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Repairs & Maintenance</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Mold, leaks, or broken appliances? Log evidence and request repairs.</p>
                        </Link>

                        <Link to="/cases/new" className="bento-card">
                            <div style={{ marginBottom: '1rem', color: '#34D399' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Security Deposit</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Ensure you get your full deposit back or contest unfair deductions.</p>
                        </Link>

                        <Link to="/cases/new" className="bento-card">
                            <div style={{ marginBottom: '1rem', color: '#EF4444' }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Eviction Defense</h3>
                            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Received a notice to quit? Understand your rights and delay unlawful removal.</p>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};
