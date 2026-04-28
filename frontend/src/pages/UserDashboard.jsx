import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitProperty, getMyProperties } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Home, ChevronRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const statusConfig = {
  pending: { label: 'Pending Review', color: 'var(--warning)', icon: <Clock size={14} />, tag: 'tag-warning' },
  reviewed: { label: 'Reviewed', color: 'var(--info)', icon: <AlertCircle size={14} />, tag: 'tag-info' },
  completed: { label: 'Completed', color: 'var(--success)', icon: <CheckCircle size={14} />, tag: 'tag-success' },
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', property_type: 'Apartment', bhk: '2BHK', area_sqft: '',
    city: '', locality: '', age_years: '', current_condition: 'Average',
    budget_for_improvement: '', goals: ''
  });

  const fetchProps = async () => {
    setLoading(true);
    try {
      const { data } = await getMyProperties();
      setProperties(data.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchProps(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.city || !form.property_type) { toast.error('Please fill required fields.'); return; }
    setSubmitting(true);
    try {
      await submitProperty(form);
      toast.success('Property submitted! We\'ve generated personalized recommendations. 🏠');
      setShowForm(false);
      setForm({ title: '', property_type: 'Apartment', bhk: '2BHK', area_sqft: '', city: '', locality: '', age_years: '', current_condition: 'Average', budget_for_improvement: '', goals: '' });
      fetchProps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed.');
    } finally { setSubmitting(false); }
  };

  const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Pune', 'Chennai', 'Kolkata', 'Surat', 'Jaipur', 'Nagpur', 'Lucknow', 'Indore', 'Other'];

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container flex-between">
          <div>
            <h1 className="page-title">Namaste, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 🙏</h1>
            <p className="page-subtitle">Manage your properties and view personalized improvement plans.</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Submit Property
          </button>
        </div>
      </div>

      <div className="container">
        {/* Quick stats */}
        <div className="grid-4" style={{ marginBottom: 40 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(255,107,53,0.15)', color: 'var(--primary)' }}>🏠</div>
            <div className="stat-value">{properties.length}</div>
            <div className="stat-label">Properties Submitted</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--warning)' }}>⏳</div>
            <div className="stat-value">{properties.filter(p => p.status === 'pending').length}</div>
            <div className="stat-label">Pending Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--info)' }}>📋</div>
            <div className="stat-value">{properties.filter(p => p.status === 'reviewed').length}</div>
            <div className="stat-label">Plans Ready</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)' }}>✅</div>
            <div className="stat-value">{properties.filter(p => p.status === 'completed').length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Properties List */}
        <div className="flex-between mb-16">
          <h2 style={{ fontSize: '1.2rem' }}>My Properties</h2>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(true)}><Plus size={14} /> Add New</button>
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Home size={48} /></div>
            <div className="empty-state-title">No properties yet</div>
            <div className="empty-state-desc">Submit your first property to get personalized improvement recommendations.</div>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}><Plus size={16} /> Submit My First Property</button>
          </div>
        ) : (
          <div className="grid-2">
            {properties.map(p => {
              const sc = statusConfig[p.status] || statusConfig.pending;
              return (
                <div key={p.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="flex-between">
                    <div>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: 4 }}>{p.title}</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{p.city}{p.locality ? ` • ${p.locality}` : ''}</div>
                    </div>
                    <span className={`tag ${sc.tag}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{sc.icon} {sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span className="tag tag-muted">{p.property_type}</span>
                    <span className="tag tag-muted">{p.bhk}</span>
                    {p.area_sqft && <span className="tag tag-muted">{p.area_sqft} sq.ft</span>}
                    <span className="tag tag-muted">{p.age_years} yrs old</span>
                    <span className="tag tag-muted">Budget: ₹{(p.budget_for_improvement/1000).toFixed(0)}K</span>
                  </div>
                  {p.goals && <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{p.goals.slice(0, 100)}...</p>}
                  <Link to={`/property/${p.id}`} className="btn btn-secondary btn-sm" style={{ alignSelf: 'flex-start' }}>
                    View Recommendations <ChevronRight size={14} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Submit Property Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="modal" style={{ maxWidth: 640 }}>
            <div className="modal-header">
              <h2 className="modal-title">🏠 Submit Your Property</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Property Name / Title *</label>
                <input className="form-control" placeholder="e.g. My Hinjewadi 2BHK" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select className="form-control" value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })}>
                    {['Apartment','Independent House','Villa','Row House','Flat'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">BHK Configuration</label>
                  <select className="form-control" value={form.bhk} onChange={e => setForm({ ...form, bhk: e.target.value })}>
                    {['1BHK','2BHK','3BHK','4BHK','5BHK+'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <select className="form-control" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required>
                    <option value="">Select city</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Locality / Area</label>
                  <input className="form-control" placeholder="e.g. Hinjewadi Phase 2" value={form.locality} onChange={e => setForm({ ...form, locality: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Area (sq.ft)</label>
                  <input type="number" className="form-control" placeholder="e.g. 950" value={form.area_sqft} onChange={e => setForm({ ...form, area_sqft: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Property Age (years)</label>
                  <input type="number" className="form-control" placeholder="e.g. 8" value={form.age_years} onChange={e => setForm({ ...form, age_years: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Current Condition</label>
                  <select className="form-control" value={form.current_condition} onChange={e => setForm({ ...form, current_condition: e.target.value })}>
                    {['Poor','Average','Good','Excellent'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Improvement Budget (₹)</label>
                  <input type="number" className="form-control" placeholder="e.g. 150000" value={form.budget_for_improvement} onChange={e => setForm({ ...form, budget_for_improvement: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Your Goals</label>
                <textarea className="form-control" rows={3} placeholder="e.g. Increase resale value, modernize kitchen and bathrooms, attract young buyers..." value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Submitting...' : '🚀 Submit & Get Recommendations'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
