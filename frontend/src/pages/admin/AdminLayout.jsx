import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../DashboardLayout.css';

const links = [
  { to: '/admin/reservas', label: 'Reservas', icon: '📅' },
  { to: '/admin/espacios', label: 'Espacios', icon: '🏟️' },
  { to: '/admin/bloqueos', label: 'Bloqueos', icon: '🔒' },
  { to: '/admin/disciplinas', label: 'Disciplinas', icon: '⚽' },
  { to: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
];

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ background: '#c62828' }}>
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <div>
            <p className="sidebar-user-name">{user?.nombre} {user?.apellido}</p>
            <p className="sidebar-user-role">Administrador</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span>{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
