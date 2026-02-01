import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-links">
                    <Link to="/resources" className="footer-link">Tenant Resources</Link>
                    <span className="footer-divider">•</span>
                    <a href="#" className="footer-link">Privacy Policy</a>
                    <span className="footer-divider">•</span>
                    <a href="#" className="footer-link">Terms of Service</a>
                </div>

                <div className="disclaimer-text">
                    <strong style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>Disclaimer</strong>
                    RentShield provides legal information, not legal advice. Use of this tool does not create an attorney-client relationship. Laws vary by jurisdiction and are subject to change. We recommend consulting with a qualified attorney or legal aid organization for advice on your specific situation.
                </div>

                <div className="copyright">
                    © {new Date().getFullYear()} RentShield. Built for NC Tenants.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
