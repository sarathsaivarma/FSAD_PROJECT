import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="navbar-brand" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <div className="logo-icon" style={{ width: 36, height: 36, background: 'var(--gradient-primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🏠</div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>PropEnhance</span>
            </div>
            <p>Helping Indian middle-class families unlock the true potential of their homes through smart renovation and design strategies.</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link to="/recommendations">Improvement Ideas</Link>
            <Link to="/listings">Property Listings</Link>
            <Link to="/dashboard">My Dashboard</Link>
            <Link to="/register">Get Started</Link>
          </div>
          <div className="footer-col">
            <h4>Categories</h4>
            <a href="#">Kitchen Renovation</a>
            <a href="#">Smart Home Tech</a>
            <a href="#">Energy Efficiency</a>
            <a href="#">Vastu & Design</a>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <a href="#">About Us</a>
            <a href="#">Contact</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 PropEnhance. Built for Indian homeowners 🇮🇳</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>FSAD-PS22 Project</p>
        </div>
      </div>
    </footer>
  );
}
