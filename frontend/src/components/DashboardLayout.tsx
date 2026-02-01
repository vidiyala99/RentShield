import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../stores/authStore';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="app-container">
            {/* Top Navigation Bar */}
            <nav className="dash-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link to="/dashboard" className="brand-logo" style={{ textDecoration: 'none' }}>RentShield</Link>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link
                            to="/dashboard"
                            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                        >
                            Overview
                        </Link>
                        <Link
                            to="/cases/history"
                            className={`nav-item ${isActive('/cases/history') ? 'active' : ''}`}
                        >
                            Case History
                        </Link>
                        <Link
                            to="/chat"
                            className={`nav-item ${isActive('/chat') ? 'active' : ''}`}
                        >
                            AI Assistant
                        </Link>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="desktop-only" style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'white' }}>{user?.full_name || 'Tenant'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Basic Plan</div>
                    </div>
                    <button
                        onClick={logout}
                        style={{
                            background: 'transparent',
                            border: '1px solid var(--border-light)',
                            color: 'var(--text-dim)',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <div className="dash-content">
                {children}
            </div>
        </div>
    );
};
