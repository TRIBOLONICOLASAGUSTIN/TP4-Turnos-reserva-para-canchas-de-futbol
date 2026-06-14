import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from './services/api';
import '../estilos/cuenta.css';

export default function CuentaPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMisReservas()
      .then(setReservas)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const proximas = reservas.filter(
    (r) => r.estado !== 'CANCELADA' && new Date(r.fecha_hora_inicio) >= new Date()
  );

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="cuenta-page container">
      <div className="cuenta-card">
        <div className="cuenta-avatar">
          {user?.nombre?.[0]}{user?.apellido?.[0]}
        </div>

        <h1 className="cuenta-name">{user?.nombre} {user?.apellido}</h1>
        <p className="cuenta-email">{user?.email}</p>
        <span className="cuenta-role">
          {user?.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}
        </span>

        {!loading && (
          <div className="cuenta-stats">
            <div className="cuenta-stat">
              <span className="cuenta-stat-value">{proximas.length}</span>
              <span className="cuenta-stat-label">Próximas</span>
            </div>
            <div className="cuenta-stat-sep" />
            <div className="cuenta-stat">
              <span className="cuenta-stat-value">{reservas.length}</span>
              <span className="cuenta-stat-label">Totales</span>
            </div>
          </div>
        )}

        <div className="cuenta-actions">
          <Link to="/reservas" className="btn btn-primary">
            Ver mis reservas
          </Link>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
