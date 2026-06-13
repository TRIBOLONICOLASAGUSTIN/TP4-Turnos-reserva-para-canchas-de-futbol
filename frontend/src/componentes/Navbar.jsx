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
        <Link to="/" className="navbar-brand" onClick={close}>
          <span className="brand-ttc">TTC</span>
          <span className="brand-sport"> Sport</span>
        </Link>

        {/* Panel mobile unificado */}
        <div className="nav-mobile-panel">
          <NavLink to="/" className="nav-link" end onClick={close}>Inicio</NavLink>
          {user && <NavLink to="/dashboard" className="nav-link" onClick={close}>Mi cuenta</NavLink>}
          {isAdmin && <NavLink to="/admin" className="nav-link" onClick={close}>Admin</NavLink>}

          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', marginTop: 8, paddingTop: 12 }}>
            {!user ? (
              <>
                <Link to="/login"    className="nav-link" onClick={close}>Ingresar</Link>
                <Link to="/register" className="nav-link" style={{ color: 'var(--green-400)' }} onClick={close}>Registrarse</Link>
              </>
            ) : (
              <button className="nav-link" style={{ textAlign: 'left', width: '100%', color: 'var(--red-400)' }} onClick={handleLogout}>
                Cerrar sesión
              </button>
            )}
          </div>
        </div>

        {/* Desktop links */}
        <div className="navbar-links">
          <NavLink to="/" className="nav-link" end>Inicio</NavLink>
          {user && <NavLink to="/dashboard" className="nav-link">Mi cuenta</NavLink>}
          {isAdmin && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
        </div>

        {/* Desktop actions */}
        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm" style={{ color: 'var(--slate-300)' }}>Ingresar</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-chip">
                <div className="user-avatar-sm" aria-hidden="true">
                  {user.nombre?.[0]}{user.apellido?.[0]}
                </div>
                <span className="user-name">{user.nombre}</span>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--slate-400)' }} onClick={handleLogout}>
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
