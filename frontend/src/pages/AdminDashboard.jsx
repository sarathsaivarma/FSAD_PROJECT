import { useState, useEffect } from 'react';
import {
  getDashboardStats, getAllProperties, getRecommendations, getCategories,
  createRecommendation, updateRecommendation, deleteRecommendation,
  getListings, createListing, updateListing, deleteListing,
  updatePropertyStatus
} from '../services/api';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Users, Home, BookOpen, Building2, Clock } from 'lucide-react';

const TABS = ['Overview', 'Recommendations', 'Properties', 'Listings'];

export default function AdminDashboard() {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState(null);
  const [recs, setRecs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { type: 'rec'|'listing', data: null|{...} }
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, r, c, p, l] = await Promise.all([
        getDashboardStats(), getRecommendations({}), getCategories(), getAllProperties(), getListings({})
      ]);
      setStats(s.data.data);
      setRecs(r.data.data);
      setCategories(c.data.data);
      setProperties(p.data.data);
      setListings(l.data.data);
    } catch (e) { toast.error('Failed to load data'); }
    setLoading(false);
  };

  // ---- RECOMMENDATION CRUD ----
  const openRecModal = (rec = null) => {
    setForm(rec ? { ...rec } : { category_id: '', title: '', description: '', estimated_cost_min: 0, estimated_cost_max: 0, roi_percentage: 0, difficulty: 'Medium', time_required: '', tags: '', is_active: true });
    setModal({ type: 'rec', data: rec });
  };

  const saveRec = async (e) => {
    e.preventDefault();
    if (!form.category_id || !form.title || !form.description) { toast.error('Fill required fields.'); return; }
    setSaving(true);
    try {
      if (modal.data) { await updateRecommendation(modal.data.id, form); toast.success('Recommendation updated!'); }
      else { await createRecommendation(form); toast.success('Recommendation created!'); }
      setModal(null);
      const { data } = await getRecommendations({});
      setRecs(data.data);
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const deleteRec = async (id) => {
    if (!confirm('Delete this recommendation?')) return;
    await deleteRecommendation(id);
    toast.success('Deleted.');
    setRecs(recs.filter(r => r.id !== id));
  };

  // ---- LISTING CRUD ----
  const openListingModal = (listing = null) => {
    setForm(listing ? { ...listing } : { title: '', property_type: 'Apartment', bhk: '2BHK', city: '', locality: '', area_sqft: '', price_lakh: '', description: '', features: '', is_featured: false, is_active: true });
    setModal({ type: 'listing', data: listing });
  };

  const saveListing = async (e) => {
    e.preventDefault();
    if (!form.title || !form.city || !form.property_type) { toast.error('Fill required fields.'); return; }
    setSaving(true);
    try {
      if (modal.data) { await updateListing(modal.data.id, form); toast.success('Listing updated!'); }
      else { await createListing(form); toast.success('Listing created!'); }
      setModal(null);
      const { data } = await getListings({});
      setListings(data.data);
    } catch { toast.error('Save failed.'); }
    setSaving(false);
  };

  const deleteLis = async (id) => {
    if (!confirm('Delete this listing?')) return;
    await deleteListing(id);
    toast.success('Deleted.');
    setListings(listings.filter(l => l.id !== id));
  };

  const updateStatus = async (propId, status) => {
    await updatePropertyStatus(propId, status);
    setProperties(properties.map(p => p.id === propId ? { ...p, status } : p));
    toast.success('Status updated!');
  };

  if (loading) return <div className="spinner-wrap" style={{ marginTop: 120 }}><div className="spinner"></div></div>;

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 12 }}>👑 Admin Control</div>
          <h1 className="page-title">Admin <span className="gradient-text">Dashboard</span></h1>
          <p className="page-subtitle">Manage recommendations, listings, and review property submissions.</p>
        </div>
      </div>

      <div className="container">
        {/* Stats */}
        {stats && (
          <div className="grid-4" style={{ marginBottom: 40 }}>
            {[
              { label: 'Total Users', value: stats.userCount, icon: <Users size={22} />, color: '#3b82f6' },
              { label: 'Property Submissions', value: stats.propCount, icon: <Home size={22} />, color: '#FF6B35' },
              { label: 'Active Recommendations', value: stats.recCount, icon: <BookOpen size={22} />, color: '#22c55e' },
              { label: 'Pending Reviews', value: stats.pendingCount, icon: <Clock size={22} />, color: '#f59e0b' },
            ].map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div className="tab-bar">
          {TABS.map((t, i) => (
            <button key={i} className={`tab-btn ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === 0 && (
          <div className="grid-2">
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Recent Property Submissions</h3>
              {properties.slice(0, 5).map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{p.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.user_name} • {p.city}</div>
                  </div>
                  <span className={`tag ${p.status === 'pending' ? 'tag-warning' : p.status === 'reviewed' ? 'tag-info' : 'tag-success'}`}>{p.status}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 style={{ marginBottom: 16, fontSize: '1rem' }}>Top Recommendations by ROI</h3>
              {[...recs].sort((a, b) => b.roi_percentage - a.roi_percentage).slice(0, 5).map(r => (
                <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{r.title}</div>
                  <span className="tag tag-success">{r.roi_percentage}% ROI</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {tab === 1 && (
          <>
            <div className="flex-between mb-16">
              <h2 style={{ fontSize: '1.1rem' }}>Recommendations ({recs.length})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => openRecModal()}>
                <Plus size={14} /> Add New
              </button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Title</th><th>Category</th><th>Difficulty</th><th>Cost Range</th><th>ROI</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {recs.map(r => (
                    <tr key={r.id}>
                      <td style={{ fontWeight: 500, maxWidth: 200 }}>{r.title}</td>
                      <td><span className="tag tag-primary">{r.category_name}</span></td>
                      <td><span className="tag" style={{ background: r.difficulty === 'Easy' ? 'rgba(34,197,94,0.15)' : r.difficulty === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: r.difficulty === 'Easy' ? 'var(--success)' : r.difficulty === 'Medium' ? 'var(--warning)' : 'var(--danger)' }}>{r.difficulty}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gold-light)' }}>₹{(r.estimated_cost_min/1000).toFixed(0)}K – ₹{(r.estimated_cost_max/1000).toFixed(0)}K</td>
                      <td><span className="tag tag-success">{r.roi_percentage}%</span></td>
                      <td><span className={`tag ${r.is_active ? 'tag-success' : 'tag-muted'}`}>{r.is_active ? 'Active' : 'Hidden'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openRecModal(r)}><Edit2 size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteRec(r.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Properties Tab */}
        {tab === 2 && (
          <>
            <div className="flex-between mb-16">
              <h2 style={{ fontSize: '1.1rem' }}>Property Submissions ({properties.length})</h2>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Property</th><th>Owner</th><th>Location</th><th>Type</th><th>Budget</th><th>Status</th><th>Update Status</th></tr></thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 600 }}>{p.title}</td>
                      <td>
                        <div style={{ fontSize: '0.875rem' }}>{p.user_name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{p.user_email}</div>
                      </td>
                      <td>{p.city}</td>
                      <td><span className="tag tag-muted">{p.bhk} {p.property_type}</span></td>
                      <td style={{ color: 'var(--gold-light)', fontSize: '0.82rem' }}>₹{(p.budget_for_improvement/1000).toFixed(0)}K</td>
                      <td><span className={`tag ${p.status === 'pending' ? 'tag-warning' : p.status === 'reviewed' ? 'tag-info' : 'tag-success'}`}>{p.status}</span></td>
                      <td>
                        <select
                          value={p.status}
                          onChange={e => updateStatus(p.id, e.target.value)}
                          style={{ padding: '5px 10px', background: 'var(--bg-dark)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Listings Tab */}
        {tab === 3 && (
          <>
            <div className="flex-between mb-16">
              <h2 style={{ fontSize: '1.1rem' }}>Property Listings ({listings.length})</h2>
              <button className="btn btn-primary btn-sm" onClick={() => openListingModal()}>
                <Plus size={14} /> Add Listing
              </button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Title</th><th>Type</th><th>Location</th><th>Price</th><th>Featured</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {listings.map(l => (
                    <tr key={l.id}>
                      <td style={{ fontWeight: 600 }}>{l.title}</td>
                      <td><span className="tag tag-muted">{l.bhk} {l.property_type}</span></td>
                      <td>{l.city}</td>
                      <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{l.price_lakh}L</td>
                      <td>{l.is_featured ? <span className="tag tag-gold">⭐ Yes</span> : <span className="tag tag-muted">No</span>}</td>
                      <td><span className={`tag ${l.is_active ? 'tag-success' : 'tag-muted'}`}>{l.is_active ? 'Active' : 'Hidden'}</span></td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => openListingModal(l)}><Edit2 size={13} /></button>
                          <button className="btn btn-danger btn-sm" onClick={() => deleteLis(l.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Recommendation Modal */}
      {modal?.type === 'rec' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal.data ? 'Edit' : 'Add'} Recommendation</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={saveRec}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select className="form-control" value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-control" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea className="form-control" rows={3} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Min Cost (₹)</label>
                  <input type="number" className="form-control" value={form.estimated_cost_min || 0} onChange={e => setForm({ ...form, estimated_cost_min: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Cost (₹)</label>
                  <input type="number" className="form-control" value={form.estimated_cost_max || 0} onChange={e => setForm({ ...form, estimated_cost_max: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">ROI %</label>
                  <input type="number" step="0.1" className="form-control" value={form.roi_percentage || 0} onChange={e => setForm({ ...form, roi_percentage: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-control" value={form.difficulty || 'Medium'} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Time Required</label>
                  <input className="form-control" placeholder="e.g. 5-10 days" value={form.time_required || ''} onChange={e => setForm({ ...form, time_required: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input className="form-control" placeholder="kitchen,modular,renovation" value={form.tags || ''} onChange={e => setForm({ ...form, tags: e.target.value })} />
                </div>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="rec-active" checked={form.is_active !== false} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                <label htmlFor="rec-active" style={{ margin: 0, cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.875rem', fontWeight: 500 }}>Active (visible to users)</label>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Recommendation'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Listing Modal */}
      {modal?.type === 'listing' && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal.data ? 'Edit' : 'Add'} Listing</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={saveListing}>
              <div className="form-group">
                <label className="form-label">Listing Title *</label>
                <input className="form-control" placeholder="e.g. Premium 3BHK in Hinjewadi" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Property Type *</label>
                  <select className="form-control" value={form.property_type || 'Apartment'} onChange={e => setForm({ ...form, property_type: e.target.value })}>
                    {['Apartment','Independent House','Villa','Row House','Flat'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">BHK</label>
                  <select className="form-control" value={form.bhk || '2BHK'} onChange={e => setForm({ ...form, bhk: e.target.value })}>
                    {['1BHK','2BHK','3BHK','4BHK','5BHK+'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">City *</label>
                  <input className="form-control" placeholder="e.g. Pune" value={form.city || ''} onChange={e => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Locality</label>
                  <input className="form-control" placeholder="e.g. Hinjewadi Phase 2" value={form.locality || ''} onChange={e => setForm({ ...form, locality: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Area (sq.ft)</label>
                  <input type="number" className="form-control" value={form.area_sqft || ''} onChange={e => setForm({ ...form, area_sqft: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹ Lakh)</label>
                  <input type="number" step="0.01" className="form-control" value={form.price_lakh || ''} onChange={e => setForm({ ...form, price_lakh: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={2} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Features (comma separated)</label>
                <input className="form-control" placeholder="Modular Kitchen, Solar Panels, Smart Lighting" value={form.features || ''} onChange={e => setForm({ ...form, features: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  <input type="checkbox" checked={form.is_featured || false} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                  ⭐ Featured Listing
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}>
                  <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  Active
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Listing'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
