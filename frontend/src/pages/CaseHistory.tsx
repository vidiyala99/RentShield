import { useEffect, useState } from 'react';
import { useAuth } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/DashboardLayout';

interface Case {
    id: number;
    title: string;
    description: string;
    status: string;
    slug: string;
    case_type: string;
}

export const CaseHistory = () => {
    const { accessToken } = useAuth();
    const [cases, setCases] = useState<Case[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'white' }}>Case History</h1>
                    <p style={{ color: 'var(--text-dim)' }}>Archive of your ongoing and past legal matters.</p>
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
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'white' }}>No Cases Found</h3>
                        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                            You haven't initialized any cases yet. Start a new case from the Overview to see it here.
                        </p>
                        <Link to="/dashboard" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                            Go to Overview &rarr;
                        </Link>
                    </div>
                ) : (
                    <div className="bento-grid">
                        {cases.map((c) => (
                            <Link key={c.id} to={`/cases/${c.id}`} className="bento-card">
                                <span className="status-badge">
                                    {c.status || 'Active'}
                                </span>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>{c.title}</h3>
                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                    {c.description}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-sub)', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginTop: 'auto' }}>
                                    <span>ID: {c.slug.toUpperCase().substring(0, 8)}...</span>
                                    <span style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>View Details &rarr;</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};
