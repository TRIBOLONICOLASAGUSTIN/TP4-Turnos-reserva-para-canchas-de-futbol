import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const disciplinas = [
  { emoji: '⚽', nombre: 'Fútbol', desc: '12 canchas disponibles', activa: true },
  { emoji: '🏐', nombre: 'Vóley', desc: '2 canchas disponibles', activa: true },
  { emoji: '🏓', nombre: 'Pádel', desc: '2 canchas próximamente', activa: false },
  { emoji: '🏀', nombre: 'Básquet 3x3', desc: '1 cancha próximamente', activa: false },
  { emoji: '🍖', nombre: 'Área Social', desc: 'Quincho con asador', activa: true },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content container">
          <p className="hero-eyebrow">Bienvenido a TTC Sport</p>
          <h1 className="hero-title">
            Sistema de<br />
            <span className="hero-accent">Reserva de Turnos</span>
          </h1>
          <p className="hero-subtitle">
            Digitaliza tu complejo polideportivo. Reservá tus canchas de fútbol, vóley,
            pádel y más desde cualquier dispositivo, en tiempo real.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard/nueva-reserva" className="btn btn-primary btn-lg">
                Reservar ahora
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Probar gratis</Link>
                <Link to="/login" className="btn btn-outline btn-lg" style={{ borderColor: '#fff', color: '#fff' }}>
                  Ingresar
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-bg" />
      </section>

      {/* Features */}
      <section className="features container">
        <h2 className="section-title">Gestiona tu complejo <span className="text-green">100% online</span></h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Calendario en tiempo real</h3>
            <p>Visualizá la disponibilidad de cada cancha y reservá tu turno al instante sin llamadas ni papeles.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Control total para el admin</h3>
            <p>Bloqueá horarios por mantenimiento, gestioná reservas manualmente y supervisá el historial.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Desde cualquier dispositivo</h3>
            <p>Accedé desde tu celular, tablet o computadora. Sin app que instalar, todo desde el navegador.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Escalable y modular</h3>
            <p>Habilitá nuevas disciplinas como pádel y básquet 3x3 cuando estén listas, sin cambios en el código.</p>
          </div>
        </div>
      </section>

      {/* Disciplinas */}
      <section className="disciplines">
        <div className="container">
          <h2 className="section-title">Nuestras disciplinas</h2>
          <div className="disciplines-grid">
            {disciplinas.map((d) => (
              <div key={d.nombre} className={`discipline-card ${!d.activa ? 'coming-soon' : ''}`}>
                <span className="discipline-emoji">{d.emoji}</span>
                <h3>{d.nombre}</h3>
                <p>{d.desc}</p>
                {!d.activa && <span className="badge badge-construccion">Próximamente</span>}
                {d.activa && <span className="badge badge-activo">Disponible</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div className="container">
          <h2>¿Listo para reservar tu cancha?</h2>
          <p>Creá tu cuenta gratis y empezá a gestionar tus turnos hoy mismo.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">Registrarse gratis</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Ya tengo cuenta</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <span className="brand-ttc">TTC</span><span style={{ color: '#fff' }}> Sport</span>
              </div>
              <p>Complejo polideportivo<br />12 canchas de fútbol · 2 de vóley · Quincho</p>
            </div>
            <div>
              <strong>Integrantes</strong>
              <ul>
                <li>Bruno Candelero</li>
                <li>Nicolas Agustín Tribolo</li>
                <li>Juan Trogolo</li>
              </ul>
            </div>
            <div>
              <strong>Accesos rápidos</strong>
              <ul>
                <li><Link to="/login">Ingresar</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
                {user && <li><Link to="/dashboard">Mi cuenta</Link></li>}
              </ul>
            </div>
          </div>
          <p className="footer-copy">© 2025 TTC Sport · TP4 Desarrollo Web</p>
        </div>
      </footer>
    </div>
  );
}
