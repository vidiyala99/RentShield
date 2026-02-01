import { useEffect, useState } from 'react';
import { useAuth } from '../stores/authStore';
import { Link, useNavigate } from 'react-router-dom';

interface Case {
    id: number;
    title: string;
    description: string;
    status: string;
    slug: string;
    case_type: string;
}

export const Dashboard = () => {
    const { user, logout, accessToken } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyCases();
    }, []);

    const fetchMyCases = async () => {
        try {
            const response = await fetch('http://localhost:8000/cases/my-cases', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCases(data);
            }
        } catch (error) {
            console.error("Failed to fetch cases", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="app-container">
            <nav className="dash-nav">
                <div className="brand-logo">RentShield</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right', display: 'none', sm: 'block' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'white' }}>{user?.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Client Account</div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-dim)',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </nav>

            <div className="dash-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>My Cases</h1>
                        <p style={{ color: 'var(--text-dim)' }}>Manage and track your ongoing legal matters.</p>
                    </div>
                    <Link to="/cases/new" className="action-btn" style={{ width: 'auto', padding: '0.75rem 1.5rem', textDecoration: 'none', display: 'inline-block' }}>
                        + New Case
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-sub)' }}>
                        Retrieving case files...
                    </div>
                ) : cases.length === 0 ? (
                    <div style={{
                        background: 'var(--bg-surface)',
                        border: '1px dashed var(--border-light)',
                        borderRadius: '12px',
                        padding: '4rem',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(197, 160, 101, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem auto',
                            color: 'var(--accent-primary)'
                        }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <path d="M14 2v6h6"></path>
                                <path d="M12 18v-6"></path>
                                <path d="M9 15h6"></path>
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>No Active Cases</h3>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                            Your portfolio is empty. Initialize a new case to generate legal protection documents.
                        </p>
                        <Link to="/cases/new" className="text-btn" style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                            Initialize First Case &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="bento-grid">
                        {cases.map((c) => (
                            <Link key={c.id} to={`/cases/${c.id}`} className="bento-card">
                                <span className="status-badge">{c.status || 'Active'}</span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>{c.title}</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', flex: 1 }}>
                                    {c.description}
                                </p>
                                <div style={{
                                    borderTop: '1px solid var(--border-light)',
                                    paddingTop: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.85rem',
                                    color: 'var(--text-sub)'
                                }}>
                                    <span>ID: {c.slug.toUpperCase()}-{c.id}</span>
                                    <span style={{ color: 'var(--accent-primary)' }}>Open File &rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
