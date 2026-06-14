import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './componentes/AuthContext';
import { ToastProvider } from './componentes/ToastContext';
import { ProtectedRoute, AdminRoute } from './componentes/ProtectedRoute';
import Navbar from './componentes/Navbar';
import LandingPage from './componentes/LandingPage';
import LoginPage from './componentes/LoginPage';
import RegisterPage from './componentes/RegisterPage';
import CuentaPage from './componentes/CuentaPage';
import ReservasPage from './componentes/ReservasPage';
import AdminLayout from './componentes/admin/AdminLayout';
import AdminReservasPage from './componentes/admin/AdminReservasPage';
import AdminEspaciosPage from './componentes/admin/AdminEspaciosPage';
import AdminBloqueosPage from './componentes/admin/AdminBloqueosPage';
import AdminDisciplinasPage from './componentes/admin/AdminDisciplinasPage';
import AdminUsuariosPage from './componentes/admin/AdminUsuariosPage';
import './estilos/variables.css';
import './estilos/botones.css';
import './estilos/formularios.css';
import './estilos/badge-alert.css';
import './estilos/tabla-modal.css';
import './estilos/reveal.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/cuenta"
            element={<ProtectedRoute><CuentaPage /></ProtectedRoute>}
          />

          <Route
            path="/reservas"
            element={<ProtectedRoute><ReservasPage /></ProtectedRoute>}
          />

          {/* Redireciones de rutas antiguas */}
          <Route path="/dashboard"                element={<ProtectedRoute><Navigate to="/cuenta"   replace /></ProtectedRoute>} />
          <Route path="/dashboard/nueva-reserva"  element={<ProtectedRoute><Navigate to="/reservas" replace /></ProtectedRoute>} />
          <Route path="/dashboard/mis-reservas"   element={<ProtectedRoute><Navigate to="/reservas" replace /></ProtectedRoute>} />

          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<Navigate to="reservas" replace />} />
            <Route path="reservas"   element={<AdminReservasPage />} />
            <Route path="espacios"   element={<AdminEspaciosPage />} />
            <Route path="bloqueos"   element={<AdminBloqueosPage />} />
            <Route path="disciplinas" element={<AdminDisciplinasPage />} />
            <Route path="usuarios"   element={<AdminUsuariosPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
