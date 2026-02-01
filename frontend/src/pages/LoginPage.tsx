import { useState } from 'react';
import { useAuth } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const login = useAuth((state) => state.login);
    const register = useAuth((state) => state.register);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(email, password, fullName);
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <div className="login-wrapper">
                <div className="login-card">
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>RentShield</h1>
                        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                            {isLogin ? "Secure Tenant Portal" : "Client Registration"}
                        </p>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#FCA5A5',
                            padding: '0.75rem',
                            borderRadius: '6px',
                            marginBottom: '1.5rem',
                            fontSize: '0.85rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="field-group">
                                <label className="field-label">Full Legal Name</label>
                                <input
                                    type="text"
                                    className="field-input"
                                    placeholder="e.g. Jonathan Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required={!isLogin}
                                />
                            </div>
                        )}

                        <div className="field-group">
                            <label className="field-label">Email Address</label>
                            <input
                                type="email"
                                className="field-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="field-group" style={{ marginBottom: '2rem' }}>
                            <label className="field-label">Password</label>
                            <input
                                type="password"
                                className="field-input"
                                placeholder="••••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="action-btn" disabled={loading}>
                            {loading ? 'Processing...' : (isLogin ? 'Access Portal' : 'Create Account')}
                        </button>
                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem' }}>
                        <p style={{ color: 'var(--text-sub)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                            {isLogin ? "No account yet?" : "Already registered?"}
                        </p>
                        <button
                            type="button"
                            className="text-btn"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                            }}
                            style={{ fontWeight: 600, color: 'var(--accent-primary)' }}
                        >
                            {isLogin ? "Initialize New Case File" : "Return to Login"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer pinned to bottom of flow, not fixed */}
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-sub)', fontSize: '0.75rem' }}>
                <p style={{ marginBottom: '0.5rem' }}>RentShield © 2026. Designed for North Carolina Tenants.</p>
                <p style={{ opacity: 0.6 }}>Non-Attorney Legal Information Service.</p>
            </div>
        </div>
    );
};
