import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, getCategories } from '../services/api';
import { TrendingUp, Clock, IndianRupee, Search, Filter } from 'lucide-react';

const difficultyColor = (d) => d === 'Easy' ? 'var(--success)' : d === 'Medium' ? 'var(--warning)' : 'var(--danger)';

export default function RecommendationsPage() {
  const [recs, setRecs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category_id: '', difficulty: '' });

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.data));
    fetchRecs();
  }, []);

  const fetchRecs = async (f = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (f.search) params.search = f.search;
      if (f.category_id) params.category_id = f.category_id;
      if (f.difficulty) params.difficulty = f.difficulty;
      const { data } = await getRecommendations(params);
      setRecs(data.data);
    } catch { } finally { setLoading(false); }
  };

  const handleFilter = () => fetchRecs(filters);

  const formatCost = (min, max) => {
    const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`;
    return `${fmt(min)} – ${fmt(max)}`;
  };

  return (
    <div className="page-wrapper">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 12 }}>💡 Expert Curated</div>
          <h1 className="page-title serif">Property Improvement <span className="gradient-text">Recommendations</span></h1>
          <p className="page-subtitle">Browse {recs.length}+ expert-curated ideas to boost your home's value and appeal.</p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 2, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text" placeholder="Search ideas... (e.g. modular kitchen, solar)"
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && handleFilter()}
              style={{ paddingLeft: 36 }}
            />
          </div>
          <select value={filters.category_id} onChange={e => setFilters({ ...filters, category_id: e.target.value })}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filters.difficulty} onChange={e => setFilters({ ...filters, difficulty: e.target.value })}>
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button className="btn btn-primary" onClick={handleFilter}>
            <Filter size={15} /> Filter
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner"></div></div>
        ) : recs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <div className="empty-state-title">No recommendations found</div>
            <div className="empty-state-desc">Try different search terms or filters</div>
          </div>
        ) : (
          <div className="grid-3">
            {recs.map(rec => (
              <div key={rec.id} className="rec-card">
                <div className="rec-card-header">
                  <div>
                    <span className="tag tag-primary" style={{ marginBottom: 8, display: 'inline-flex' }}>{rec.category_name}</span>
                    <h3 className="rec-card-title">{rec.title}</h3>
                  </div>
                  <span className="tag" style={{ background: `${difficultyColor(rec.difficulty)}20`, color: difficultyColor(rec.difficulty), whiteSpace: 'nowrap' }}>
                    {rec.difficulty}
                  </span>
                </div>
                <p className="rec-card-desc">{rec.description}</p>
                <div className="rec-card-meta">
                  <div className="rec-cost" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IndianRupee size={13} />
                    {formatCost(rec.estimated_cost_min, rec.estimated_cost_max)}
                  </div>
                  <div className="rec-roi">
                    <TrendingUp size={13} />
                    {rec.roi_percentage}% ROI
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Clock size={12} /> {rec.time_required}
                  </div>
                </div>
                {rec.tags && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {rec.tags.split(',').slice(0, 3).map((t, i) => (
                      <span key={i} className="tag tag-muted">{t.trim()}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="card text-center mt-24" style={{ padding: '48px 24px', background: 'linear-gradient(135deg, rgba(255,107,53,0.1), rgba(212,160,23,0.08))' }}>
          <h3 style={{ fontSize: '1.4rem', marginBottom: 10 }}>Want personalized recommendations for <em>your</em> home?</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Submit your property details and get a curated enhancement plan that fits your budget and goals.</p>
          <Link to="/register" className="btn btn-primary">Get My Personalized Plan</Link>
        </div>
      </div>
    </div>
  );
}
