import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';
import NuevaReservaPage from './pages/NuevaReservaPage';
import MisReservasPage from './pages/MisReservasPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminReservasPage from './pages/admin/AdminReservasPage';
import AdminEspaciosPage from './pages/admin/AdminEspaciosPage';
import AdminBloqueosPage from './pages/admin/AdminBloqueosPage';
import AdminDisciplinasPage from './pages/admin/AdminDisciplinasPage';
import AdminUsuariosPage from './pages/admin/AdminUsuariosPage';
import './styles/global.css';

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
