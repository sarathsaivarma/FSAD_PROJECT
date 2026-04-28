import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Building2, LayoutDashboard, Shield, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div className="logo-icon">🏠</div>
        <span>PropEnhance<span style={{ color: 'var(--primary)' }}>.</span></span>
      </Link>

      <div className="navbar-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
        <NavLink to="/recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><BookOpen size={14} /> Ideas</span>
        </NavLink>
        <NavLink to="/listings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building2 size={14} /> Listings</span>
        </NavLink>
        {user && (
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><LayoutDashboard size={14} /> Dashboard</span>
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Shield size={14} /> Admin</span>
          </NavLink>
        )}
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-chip">
              <span>👤</span>
              <span>{user.name.split(' ')[0]}</span>
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                {isAdmin ? 'Admin' : 'User'}
              </span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={15} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm"><LogIn size={15} /> Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
