import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../estilos/navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  function close() { setMenuOpen(false); }

  return (
    <nav className={`navbar${menuOpen ? ' nav-open' : ''}`}>
      <div className="navbar-inner container">

        {/* Logo → home */}
        <Link to="/" className="navbar-brand" onClick={close}>
          <span className="brand-ttc">TTC</span>
          <span className="brand-sport"> Sport</span>
        </Link>

        {/* Panel mobile */}
        <div className="nav-mobile-panel">
          {user && <NavLink to="/reservas" className="nav-link" onClick={close}>Reservas</NavLink>}
          {user && <NavLink to="/cuenta"   className="nav-link" onClick={close}>Mi cuenta</NavLink>}
          {isAdmin && <NavLink to="/admin" className="nav-link" onClick={close}>Admin</NavLink>}

          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 8, paddingTop: 12 }}>
            {!user ? (
              <>
                <Link to="/login"    className="nav-link" onClick={close}>Ingresar</Link>
                <Link to="/register" className="nav-link" style={{ color: 'var(--green-400)' }} onClick={close}>Registrarse</Link>
              </>
            ) : (
              <button
                className="nav-link"
                style={{ textAlign: 'left', width: '100%', color: 'var(--red-400)' }}
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        {/* Desktop: links centrales — solo Admin si aplica */}
        <div className="navbar-links">
          {isAdmin && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
        </div>

        {/* Desktop: acciones derechas */}
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm" style={{ color: 'var(--slate-300)' }}>Ingresar</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          ) : (
            <div className="user-menu">
              <Link to="/cuenta" className="nav-account-btn" title="Mi cuenta">
                <div className="user-avatar-sm" aria-hidden="true">
                  {user.nombre?.[0]}{user.apellido?.[0]}
                </div>
                <span className="user-name">{user.nombre}</span>
                {/* SVG cuenta */}
                <svg className="account-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 17c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </Link>
              <button
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--slate-400)' }}
                onClick={handleLogout}
              >
                Salir
              </button>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="nav-toggle"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
