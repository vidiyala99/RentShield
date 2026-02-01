import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer-container">
            <div className="container">
                <p className="disclaimer-text">
                    <strong>Disclaimer:</strong> RentShield provides legal information, not legal advice.
                    Use of this tool does not create an attorney-client relationship.
                    Laws vary by jurisdiction and are subject to change.
                    We recommend consulting with a qualified attorney or legal aid organization for advice on your specific situation.
                </p>
                <p className="copyright">© {new Date().getFullYear()} RentShield. Built for NC Tenants.</p>
                <p style={{ fontSize: '0.7rem', textAlign: 'center', opacity: 0.4, marginTop: '0.5rem' }}>
                    Privacy: We collect anonymous usage statistics to improve this tool. No personal data (names, addresses) is stored.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
