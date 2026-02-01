import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/authStore';

const caseTypes = [
    {
        id: 'repairs',
        title: 'Repairs & Maintenance',
        description: 'Mold, pests, plumbing, heating, or other habitability issues.',
        icon: '🔧'
    },
    {
        id: 'deposit',
        title: 'Security Deposit',
        description: 'Disputes regarding deposit return, deductions, or timeline.',
        icon: '💰'
    },
    {
        id: 'eviction',
        title: 'Eviction Defense',
        description: 'Response to Notice to Quit or Summary Ejectment filing.',
        icon: '🛡️'
    },
    {
        id: 'lease',
        title: 'Lease Review',
        description: 'Analyze your lease agreement for illegal clauses.',
        icon: '📝'
    }
];

export const CreateCase = () => {
    const { accessToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleCreate = async (caseType: string) => {
        setLoading(caseType);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/cases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    case_type: caseType
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Failed to create case');
            }

            const newCase = await response.json();
            navigate(`/cases/${newCase.id}`);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setLoading(null);
        }
    };

    return (
        <div className="app-container fade-in">
            <div className="max-w-4xl mx-auto pt-10">
                <button onClick={() => navigate('/dashboard')} className="action-btn-secondary mb-6" style={{ background: 'transparent', border: 'none', color: 'var(--text-sub)', paddingLeft: 0 }}>
                    &larr; Back to Dashboard
                </button>

                <h1 className="gradient-text text-3xl mb-2">Initialize New Case</h1>
                <p className="text-dim mb-4">Select the category that best describes your legal issue.</p>

                <div className="mb-8 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg text-sm text-yellow-200/80">
                    <strong>Important:</strong> RentShield is an information service, not a law firm. We help you organize your facts and generate templates, but we cannot provide legal advice or representation in court.
                </div>

                {error && (
                    <div className="error-banner mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {caseTypes.map((type) => (
                        <div
                            key={type.id}
                            onClick={() => !loading && handleCreate(type.id)}
                            className={`card glass hover-card cursor-pointer p-6 transition-all ${loading === type.id ? 'opacity-70' : ''}`}
                            style={{ border: '1px solid var(--border-light)' }}
                        >
                            <div className="text-4xl mb-4">{type.icon}</div>
                            <h3 className="text-xl text-white font-semibold mb-2">{type.title}</h3>
                            <p className="text-dim text-sm">{type.description}</p>

                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-gold text-sm font-medium">Initialize File &rarr;</span>
                                {loading === type.id && <span className="text-white text-xs">Creating...</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
