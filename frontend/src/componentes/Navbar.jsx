import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../estilos/navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-brand">
          <span className="brand-ttc">TTC</span>
          <span className="brand-sport"> Sport</span>
        </Link>

        <div className="navbar-links">
          <NavLink to="/"           className="nav-link" end>Inicio</NavLink>
          {user && <NavLink to="/dashboard" className="nav-link">Mi cuenta</NavLink>}
          {isAdmin && <NavLink to="/admin"  className="nav-link">Admin</NavLink>}
        </div>

        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm" style={{ color: 'var(--slate-300)' }}>Ingresar</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          ) : (
            <div className="user-menu">
              <div className="user-chip">
                <div className="user-avatar-sm">
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
      </div>
    </nav>
  );
}
