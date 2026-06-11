import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

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
          <Link to="/" className="nav-link">Inicio</Link>
          <Link to="/disciplinas" className="nav-link">Disciplinas</Link>
          {user && <Link to="/dashboard" className="nav-link">Mi cuenta</Link>}
          {isAdmin && <Link to="/admin" className="nav-link">Admin</Link>}
        </div>

        <div className="navbar-actions">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">Ingresar</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          ) : (
            <div className="user-menu">
              <span className="user-name">{user.nombre}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Salir</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
