import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import '../estilos/dashboard.css';

const links = [
  { to: '/dashboard/nueva-reserva', label: '+ Nueva Reserva', icon: '📅' },
  { to: '/dashboard/mis-reservas',  label: 'Mis Reservas',    icon: '📋' },
];

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-layout${sidebarOpen ? ' sidebar-open' : ''}`}>
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />

      <aside className="sidebar">
        <div className="sidebar-user">
          <div className="sidebar-avatar" aria-hidden="true">
            {user?.nombre?.[0]}{user?.apellido?.[0]}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.nombre} {user?.apellido}</p>
            <p className="sidebar-user-role">Cliente</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <button
          className="sidebar-toggle"
          aria-label="Abrir menú"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <Outlet />
      </main>
    </div>
  );
}
