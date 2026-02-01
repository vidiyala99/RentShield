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
                    <strong style={{ color: 'var(--text-dim)', display: 'block', marginBottom: '0.5rem' }}>Empowering Tenant Voices - Informational Service Only</strong>
                    RentShield is designed to help tenants understand their rights and organize their communications. <strong>We are not a law firm</strong> and do not provide legal advice or representation. Our goal is to provide you with a voice and the tools to advocate for yourself. All information is for educational purposes only. For specific legal counsel, please consult an attorney or legal aid organization.
                </div>

                <div className="copyright">
                    © {new Date().getFullYear()} RentShield. Built for NC Tenants.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
