import { Link } from 'react-router-dom';
import { TrendingUp, Home, Zap, Star, ChevronRight, ArrowRight, Building2, Sparkles } from 'lucide-react';

const features = [
  { icon: <Sparkles size={22} />, title: 'Personalized Recommendations', desc: 'AI-matched improvement ideas based on your home\'s age, condition, budget, and location in India.', color: '#FF6B35' },
  { icon: <TrendingUp size={22} />, title: 'ROI-Focused Upgrades', desc: 'Every recommendation shows estimated cost and expected return on investment to help you decide wisely.', color: '#d4a017' },
  { icon: <Zap size={22} />, title: 'Energy & Smart Home', desc: 'Solar panels, UPVC windows, smart automation — reduce your bills and attract modern buyers.', color: '#3b82f6' },
  { icon: <Home size={22} />, title: 'Vastu Compliant Ideas', desc: 'Vastu Shastra aligned recommendations that appeal to traditional Indian homebuyers and investors.', color: '#22c55e' },
  { icon: <Building2 size={22} />, title: 'Curated Property Listings', desc: 'Browse enhanced properties from across India as inspiration or to find your next investment.', color: '#a855f7' },
  { icon: <Star size={22} />, title: 'Expert Admin Curation', desc: 'All content is professionally curated and regularly updated by real estate experts.', color: '#f43f5e' },
];

const categories = [
  { emoji: '🍳', name: 'Kitchen Renovation', count: '3 Ideas' },
  { emoji: '🛁', name: 'Bathroom Upgrade', count: '3 Ideas' },
  { emoji: '🏘️', name: 'Exterior & Facade', count: '3 Ideas' },
  { emoji: '🛋️', name: 'Interior Design', count: '3 Ideas' },
  { emoji: '💡', name: 'Smart Home Tech', count: '3 Ideas' },
  { emoji: '☀️', name: 'Energy Efficiency', count: '2 Ideas' },
  { emoji: '🌿', name: 'Garden & Landscaping', count: '2 Ideas' },
  { emoji: '🔒', name: 'Security Upgrades', count: '2 Ideas' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div className="hero-content">
              <div className="hero-eyebrow">
                🏠 India's #1 Property Value Platform
              </div>
              <h1 className="serif">
                Transform Your Home,<br />
                <span className="gradient-text">Multiply Its Value</span>
              </h1>
              <p>
                Smart, budget-friendly improvement ideas curated for Indian middle-class homeowners. Get personalized recommendations that can increase your property's value by up to <strong style={{ color: 'var(--primary)' }}>35-45%</strong>.
              </p>
              <div className="hero-btns">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start for Free <ArrowRight size={18} />
                </Link>
                <Link to="/recommendations" className="btn btn-secondary btn-lg">
                  Browse Ideas <ChevronRight size={18} />
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hero-stat-val gradient-text">500+</div>
                  <div className="hero-stat-label">Improvement Ideas</div>
                </div>
                <div>
                  <div className="hero-stat-val gradient-text">35%</div>
                  <div className="hero-stat-label">Avg. Value Increase</div>
                </div>
                <div>
                  <div className="hero-stat-val gradient-text">10k+</div>
                  <div className="hero-stat-label">Homeowners Helped</div>
                </div>
              </div>
            </div>
            {/* Visual */}
            <div className="hero-visual" style={{ position: 'relative', height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 340, height: 340, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)', position: 'absolute' }}></div>
              <div style={{ background: 'var(--gradient-card)', border: '1px solid var(--border)', borderRadius: 24, padding: '32px 36px', textAlign: 'center', zIndex: 2 }}>
                <div style={{ fontSize: '4rem', marginBottom: 12 }}>🏡</div>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', marginBottom: 4 }}>Your Dream Home</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enhanced & Valued</div>
                <div style={{ marginTop: 20, display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <span className="tag tag-success">+35% ROI</span>
                  <span className="tag tag-gold">Top-Rated</span>
                </div>
              </div>
              <div className="floating-card" style={{ top: 40, right: -20, fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>⚡</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Smart Lighting</div>
                    <div style={{ color: 'var(--success)', fontSize: '0.75rem' }}>+22% Value</div>
                  </div>
                </div>
              </div>
              <div className="floating-card" style={{ bottom: 60, left: -20, fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '1.2rem' }}>☀️</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Solar Panels</div>
                    <div style={{ color: 'var(--gold-light)', fontSize: '0.75rem' }}>Save ₹2000/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-header">
            <div className="hero-eyebrow" style={{ display: 'inline-flex', margin: '0 auto 16px' }}>✨ Why PropEnhance?</div>
            <h2 className="serif">Everything You Need to <span className="gradient-text">Add Value</span></h2>
            <p>A complete platform to research, plan, and execute home improvement strategies tailored to Indian residential properties.</p>
          </div>
          <div className="grid-3">
            {features.map((f, i) => (
              <div key={i} className="card card-hover">
                <div style={{ width: 48, height: 48, borderRadius: 12, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color, marginBottom: 16 }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="serif">Browse by <span className="gradient-text">Category</span></h2>
            <p>From kitchen makeovers to solar installations — explore curated ideas across all home improvement areas.</p>
          </div>
          <div className="grid-4">
            {categories.map((cat, i) => (
              <Link key={i} to="/recommendations" className="card card-hover" style={{ textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{cat.emoji}</div>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: '0.95rem' }}>{cat.name}</div>
                <div style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600 }}>{cat.count}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-24">
            <Link to="/recommendations" className="btn btn-primary">View All Recommendations <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'var(--gradient-primary)', padding: '72px 0' }}>
        <div className="container text-center">
          <h2 className="serif" style={{ color: 'white', fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', marginBottom: 16 }}>
            Ready to Unlock Your Home's Potential?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', marginBottom: 32, fontSize: '1.05rem', maxWidth: 500, margin: '0 auto 32px' }}>
            Submit your property details and get personalized enhancement recommendations in minutes.
          </p>
          <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
            Get Personalized Plan Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
