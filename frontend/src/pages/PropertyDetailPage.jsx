import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPropertyWithRecs } from '../services/api';
import { TrendingUp, Clock, IndianRupee, ChevronLeft, CheckCircle } from 'lucide-react';

const priorityTag = { High: 'tag-danger', Medium: 'tag-warning', Low: 'tag-success' };

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPropertyWithRecs(id)
      .then(r => setData(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner-wrap" style={{ marginTop: 120 }}><div className="spinner"></div></div>;
  if (!data) return <div style={{ textAlign: 'center', marginTop: 120, color: 'var(--text-secondary)' }}>Property not found.</div>;

  const { property: p, recommendations: recs } = data;
  const highPriority = recs.filter(r => r.priority === 'High');
  const totalBudget = recs.reduce((sum, r) => sum + (r.estimated_cost_min || 0), 0);

  const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}K`;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <Link to="/dashboard" className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }}>
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="page-title">{p.title}</h1>
              <p className="page-subtitle">{p.city}{p.locality ? ` • ${p.locality}` : ''} • {p.property_type} • {p.bhk}</p>
            </div>
            <span className={`tag ${p.status === 'pending' ? 'tag-warning' : p.status === 'reviewed' ? 'tag-info' : 'tag-success'}`} style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              {p.status?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Property Details */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <div className="stat-value">{p.area_sqft ? p.area_sqft.toLocaleString() : '—'}</div>
            <div className="stat-label">Sq. Ft. Area</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{p.age_years}</div>
            <div className="stat-label">Years Old</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{p.current_condition}</div>
            <div className="stat-label">Current Condition</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--gold-light)', fontSize: '1.4rem' }}>
              {p.budget_for_improvement ? fmt(p.budget_for_improvement) : '—'}
            </div>
            <div className="stat-label">Improvement Budget</div>
          </div>
        </div>

        {p.goals && (
          <div className="card mb-24" style={{ background: 'rgba(255,107,53,0.06)', borderColor: 'rgba(255,107,53,0.2)' }}>
            <h4 style={{ marginBottom: 8, color: 'var(--primary)' }}>🎯 Your Goals</h4>
            <p style={{ color: 'var(--text-secondary)' }}>{p.goals}</p>
          </div>
        )}

        {/* Summary Banner */}
        <div className="card mb-32" style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.12), rgba(255,107,53,0.08))', borderColor: 'rgba(212,160,23,0.3)' }}>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{recs.length}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Total Recommendations</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--danger)' }}>{highPriority.length}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>High Priority</div>
            </div>
            <div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-light)' }}>{fmt(totalBudget)}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Min. Estimated Cost</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <h2 style={{ fontSize: '1.2rem', marginBottom: 24 }}>
          🎯 Your Personalised Improvement Plan ({recs.length})
        </h2>

        {recs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <div className="empty-state-title">Recommendations being prepared</div>
            <div className="empty-state-desc">Our experts are curating your personalized plan. Check back soon.</div>
          </div>
        ) : (
          <div className="grid-2">
            {recs.map(r => (
              <div key={r.id} className="rec-card">
                <div className="rec-card-header">
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span className="tag tag-primary">{r.category_name}</span>
                      <span className={`tag ${priorityTag[r.priority] || 'tag-muted'}`}>{r.priority} Priority</span>
                    </div>
                    <h3 className="rec-card-title">{r.title}</h3>
                  </div>
                  {r.is_completed && <CheckCircle size={20} style={{ color: 'var(--success)', flexShrink: 0 }} />}
                </div>
                <p className="rec-card-desc">{r.description}</p>
                {r.notes && (
                  <div style={{ background: 'rgba(59,130,246,0.08)', borderRadius: 8, padding: '8px 12px', marginBottom: 12, fontSize: '0.8rem', color: 'var(--info)' }}>
                    💬 {r.notes}
                  </div>
                )}
                <div className="rec-card-meta">
                  <div className="rec-cost" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IndianRupee size={13} />
                    {fmt(r.estimated_cost_min)} – {fmt(r.estimated_cost_max)}
                  </div>
                  <div className="rec-roi">
                    <TrendingUp size={13} />
                    {r.roi_percentage}% ROI
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <Clock size={12} /> {r.time_required}
                  </div>
                  <span className="tag" style={{ background: r.difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : r.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: r.difficulty === 'Easy' ? 'var(--success)' : r.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)' }}>
                    {r.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
