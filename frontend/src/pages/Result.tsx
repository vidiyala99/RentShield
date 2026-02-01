import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';

interface EvaluationResponse {
    outcome_summary: string;
    rights_explanation: string;
    letter_text: string;
}

const Result: React.FC = () => {
    const location = useLocation();
    const result = location.state?.result as EvaluationResponse;

    if (!result) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container fade-in">
            <div className="card glass">
                <h2 className="gradient-text">{result.outcome_summary}</h2>

                <div style={{ margin: '1.5rem 0', padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', borderLeft: '4px solid #6366f1' }}>
                    <strong>Legal Insight:</strong>
                    <p style={{ marginTop: '0.5rem', color: '#e2e8f0' }}>{result.rights_explanation}</p>
                </div>

                <div className="letter-preview">
                    <h4>Generated Letter</h4>
                    <pre>{result.letter_text}</pre>
                </div>

                <div className="actions" style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                        Print Letter
                    </button>
                    <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText(result.letter_text)}>
                        Copy to Clipboard
                    </button>
                    <Link to="/" className="btn btn-secondary">Start Over</Link>
                </div>
            </div>
        </div>
    );
};

export default Result;
