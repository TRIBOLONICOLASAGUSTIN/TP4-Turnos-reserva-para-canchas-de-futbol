import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from './services/api';
import '../estilos/auth.css';

export default function LoginPage() {
  const [email,     setEmail]     = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { usuario, token } = await api.login({ email, contrasena });
      login(usuario, token);
      navigate(usuario.rol === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <div className="auth-logo">
            <span className="brand-ttc">TTC</span>
            <span style={{ color: 'var(--color-text)' }}> Sport</span>
          </div>
          <p>Ingresá a tu cuenta</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar →'}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tenés cuenta? <Link to="/register">Registrarse gratis</Link>
        </p>

        <div className="auth-demo">
          <strong>Cuentas de prueba</strong>
          Admin: admin@ttcsport.com / admin123<br />
          Cliente: cliente@ttcsport.com / cliente123
        </div>
      </div>
    </div>
  );
}
