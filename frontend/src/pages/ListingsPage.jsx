import { useState, useEffect } from 'react';
import { getListings } from '../services/api';
import { MapPin, Home, Maximize, IndianRupee, Star } from 'lucide-react';

const propertyEmojis = { Apartment: '🏢', 'Independent House': '🏡', Villa: '🏰', 'Row House': '🏘️', Flat: '🏠' };

export default function ListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ city: '', property_type: '', bhk: '' });

  const fetchListings = async (f = filters) => {
    setLoading(true);
    try {
      const params = {};
      if (f.city) params.city = f.city;
      if (f.property_type) params.property_type = f.property_type;
      if (f.bhk) params.bhk = f.bhk;
      const { data } = await getListings(params);
      setListings(data.data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchListings(); }, []);

  const featured = listings.filter(l => l.is_featured);
  const regular = listings.filter(l => !l.is_featured);

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <div className="container">
          <div className="hero-eyebrow" style={{ display: 'inline-flex', marginBottom: 12 }}>🏡 Enhanced Properties</div>
          <h1 className="page-title serif">Property <span className="gradient-text">Listings</span></h1>
          <p className="page-subtitle">Explore properties enhanced with our recommendations — your next investment or inspiration.</p>
        </div>
      </div>

      <div className="container">
        {/* Filters */}
        <div className="filter-bar">
          <input
            placeholder="Search by city... (e.g. Mumbai, Pune)"
            value={filters.city}
            onChange={e => setFilters({ ...filters, city: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && fetchListings(filters)}
          />
          <select value={filters.property_type} onChange={e => setFilters({ ...filters, property_type: e.target.value })}>
            <option value="">All Types</option>
            {['Apartment','Independent House','Villa','Row House','Flat'].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filters.bhk} onChange={e => setFilters({ ...filters, bhk: e.target.value })}>
            <option value="">Any BHK</option>
            {['1BHK','2BHK','3BHK','4BHK','5BHK+'].map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => fetchListings(filters)}>Search</button>
          <button className="btn btn-ghost" onClick={() => { setFilters({ city: '', property_type: '', bhk: '' }); fetchListings({ city: '', property_type: '', bhk: '' }); }}>Clear</button>
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner"></div></div> : (
          <>
            {/* Featured */}
            {featured.length > 0 && (
              <div style={{ marginBottom: 48 }}>
                <div className="flex-between mb-16">
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.2rem' }}><Star size={18} style={{ color: 'var(--gold-light)' }} /> Featured Properties</h2>
                </div>
                <div className="grid-3">
                  {featured.map(l => <ListingCard key={l.id} listing={l} featured />)}
                </div>
              </div>
            )}

            {/* All */}
            {regular.length > 0 && (
              <>
                <h2 style={{ fontSize: '1.2rem', marginBottom: 20 }}>All Listings ({regular.length})</h2>
                <div className="grid-3">
                  {regular.map(l => <ListingCard key={l.id} listing={l} />)}
                </div>
              </>
            )}

            {listings.length === 0 && (
              <div className="empty-state">
                <div className="empty-state-icon">🏚️</div>
                <div className="empty-state-title">No listings found</div>
                <div className="empty-state-desc">Try different search criteria</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ListingCard({ listing: l, featured }) {
  const emoji = propertyEmojis[l.property_type] || '🏠';
  const feats = l.features ? l.features.split(',').slice(0, 4) : [];

  return (
    <div className="listing-card">
      <div className="listing-card-img">
        <span>{emoji}</span>
        {featured && <span className="listing-badge">⭐ Featured</span>}
      </div>
      <div className="listing-card-body">
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <h3 className="listing-title">{l.title}</h3>
          <span className="tag tag-primary" style={{ whiteSpace: 'nowrap' }}>{l.bhk}</span>
        </div>
        <div className="listing-location">
          <MapPin size={13} /> {l.locality ? `${l.locality}, ` : ''}{l.city}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="listing-price">
            ₹{l.price_lakh >= 100 ? `${(l.price_lakh/100).toFixed(2)} Cr` : `${l.price_lakh} L`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <Maximize size={12} /> {l.area_sqft?.toLocaleString()} sq.ft
          </div>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: 12 }}>{l.description?.slice(0, 100)}...</p>
        {feats.length > 0 && (
          <div className="listing-features">
            {feats.map((f, i) => <span key={i} className="tag tag-success" style={{ fontSize: '0.72rem' }}>{f.trim()}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
