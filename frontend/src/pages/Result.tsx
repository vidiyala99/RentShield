import React, { useState } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

interface EvaluationResponse {
    outcome_summary: string;
    rights_explanation: string;
    letter_text: string;
    advocate_report?: string;
}

const Result: React.FC = () => {
    const location = useLocation();
    const result = location.state?.result as EvaluationResponse;
    const [viewMode, setViewMode] = useState<'letter' | 'advocate'>('letter');

    if (!result) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container fade-in">
            <div className="card glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="gradient-text" style={{ margin: 0 }}>{result.outcome_summary}</h2>

                    <div className="toggle-container" style={{ background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '20px', display: 'flex' }}>
                        <button
                            onClick={() => setViewMode('letter')}
                            className={`btn-sm`}
                            style={{
                                background: viewMode === 'letter' ? '#6366f1' : 'transparent',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '16px',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 600
                            }}
                        >
                            Letter
                        </button>
                        <button
                            onClick={() => setViewMode('advocate')}
                            className={`btn-sm`}
                            style={{
                                background: viewMode === 'advocate' ? '#6366f1' : 'transparent',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '16px',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                fontWeight: 600
                            }}
                        >
                            Advocate View
                        </button>
                    </div>
                </div>

                <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                    <strong>Legal Insight:</strong>
                    <p style={{ marginTop: '0.5rem', color: '#e2e8f0' }}>{result.rights_explanation}</p>
                </div>

                {viewMode === 'letter' ? (
                    <div className="letter-preview">
                        <h4>Generated Letter</h4>
                        <pre>{result.letter_text}</pre>
                    </div>
                ) : (
                    <div className="advocate-view">
                        <h4>Case Facts Summary</h4>
                        <pre style={{ border: '1px solid #c084fc', background: 'rgba(192, 132, 252, 0.05)' }}>
                            {result.advocate_report || "No summary available."}
                        </pre>
                        <p style={{ fontSize: '0.9rem', opacity: 0.7, marginTop: '1rem', fontStyle: 'italic' }}>
                            * This summary is intended for legal aid intake.
                        </p>
                    </div>
                )}

                <div className="actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        Print {viewMode === 'letter' ? 'Letter' : 'Summary'}
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(viewMode === 'letter' ? result.letter_text : (result.advocate_report || ""))}>
                        Copy Text
                    </button>
                    <Link to="/" className="btn btn-secondary">Start Over</Link>
                </div>
            </div>
        </div>
    );
};

export default Result;
