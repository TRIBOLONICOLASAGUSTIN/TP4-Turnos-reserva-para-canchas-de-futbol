import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './componentes/AuthContext';
import { ProtectedRoute, AdminRoute } from './componentes/ProtectedRoute';
import Navbar from './componentes/Navbar';
import LandingPage from './componentes/LandingPage';
import LoginPage from './componentes/LoginPage';
import RegisterPage from './componentes/RegisterPage';
import DashboardLayout from './componentes/DashboardLayout';
import NuevaReservaPage from './componentes/NuevaReservaPage';
import MisReservasPage from './componentes/MisReservasPage';
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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="nueva-reserva" replace />} />
            <Route path="nueva-reserva" element={<NuevaReservaPage />} />
            <Route path="mis-reservas" element={<MisReservasPage />} />
          </Route>

          <Route
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
          >
            <Route index element={<Navigate to="reservas" replace />} />
            <Route path="reservas" element={<AdminReservasPage />} />
            <Route path="espacios" element={<AdminEspaciosPage />} />
            <Route path="bloqueos" element={<AdminBloqueosPage />} />
            <Route path="disciplinas" element={<AdminDisciplinasPage />} />
            <Route path="usuarios" element={<AdminUsuariosPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
