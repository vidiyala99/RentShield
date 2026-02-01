import React from 'react';
import { Link } from 'react-router-dom';

const Resources: React.FC = () => {
    return (
        <div className="container fade-in">
            <div className="card glass">
                <h2 className="gradient-text">Tenant Resources</h2>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
                    If you need further legal assistance or emergency housing support, please contact these organizations.
                </p>

                <div className="resource-group">
                    <h3>Legal Help</h3>
                    <ul className="resource-list">
                        <li>
                            <strong>Legal Aid of North Carolina</strong>
                            <br />
                            Free legal services for low-income clients.
                            <br />
                            <a href="https://www.legalaidnc.org" target="_blank" rel="noopener noreferrer">www.legalaidnc.org</a> | 1-866-219-5262
                        </li>
                        <li>
                            <strong>NC Bar Association Lawyer Referral Service</strong>
                            <br />
                            Find a private attorney (initial consultation often $50).
                            <br />
                            <a href="https://www.ncbar.org/public/lrs/" target="_blank" rel="noopener noreferrer">Find a Lawyer</a>
                        </li>
                    </ul>
                </div>

                <div className="resource-group" style={{ marginTop: '2rem' }}>
                    <h3>Housing Mediation</h3>
                    <ul className="resource-list">
                        <li>
                            <strong>NC 211</strong>
                            <br />
                            Connects specific housing crisis resources in your local county.
                            <br />
                            <a href="https://nc211.org" target="_blank" rel="noopener noreferrer">nc211.org</a> | Dial 2-1-1
                        </li>
                    </ul>
                </div>

                <div className="actions" style={{ marginTop: '2rem' }}>
                    <Link to="/" className="btn btn-secondary">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Resources;
