import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const disciplinas = [
  { emoji: '⚽', nombre: 'Fútbol',      desc: '12 canchas disponibles', activa: true  },
  { emoji: '🏐', nombre: 'Vóley',       desc: '2 canchas disponibles',  activa: true  },
  { emoji: '🏓', nombre: 'Pádel',       desc: '2 canchas próximamente', activa: false },
  { emoji: '🏀', nombre: 'Básquet 3x3', desc: '1 cancha próximamente',  activa: false },
  { emoji: '🍖', nombre: 'Área Social', desc: 'Quincho con asador',     activa: true  },
];

const features = [
  { icon: '📅', title: 'Calendario en tiempo real',    desc: 'Visualizá la disponibilidad de cada cancha y reservá al instante sin llamadas ni papeles.' },
  { icon: '🔒', title: 'Control total para el admin',  desc: 'Bloqueá horarios por mantenimiento, gestioná reservas manualmente y supervisá el historial.' },
  { icon: '📱', title: 'Desde cualquier dispositivo', desc: 'Accedé desde tu celular, tablet o computadora. Sin app que instalar, todo desde el navegador.' },
  { icon: '⚡', title: 'Escalable y modular',          desc: 'Habilitá nuevas disciplinas cuando estén listas, sin modificar una línea de código.' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content container">
          <span className="hero-eyebrow">TTC Sport</span>
          <h1 className="hero-title">
            Sistema de Reserva<br />
            <span className="hero-accent">de Turnos</span>
          </h1>
          <p className="hero-subtitle">
            Digitaliza tu complejo polideportivo. Reservá canchas, gestioná horarios
            y controlá el uso de cada espacio — todo desde cualquier dispositivo.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/dashboard/nueva-reserva" className="btn btn-primary btn-lg">
                Hacer una reserva →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Probar gratis</Link>
                <Link to="/login" className="btn-outline-white">Ingresar</Link>
              </>
            )}
          </div>

          <div className="hero-stats">
            <div>
              <span className="hero-stat-number">12</span>
              <span className="hero-stat-label">Canchas de fútbol</span>
            </div>
            <div>
              <span className="hero-stat-number">2</span>
              <span className="hero-stat-label">Canchas de vóley</span>
            </div>
            <div>
              <span className="hero-stat-number">100%</span>
              <span className="hero-stat-label">Online, sin papeles</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Funcionalidades</span>
            <h2 className="section-title">Gestiona tu complejo <span className="text-green">100% online</span></h2>
            <p className="section-sub">Todo lo que necesitás para administrar un polideportivo moderno, sin complicaciones.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disciplinas ── */}
      <section className="disciplines">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow" style={{ color: 'var(--green-400)' }}>Espacios</span>
            <h2 className="section-title">Nuestras disciplinas</h2>
            <p className="section-sub">Reservá el espacio que necesitás. Las próximas instalaciones se activarán automáticamente.</p>
          </div>
          <div className="disciplines-grid">
            {disciplinas.map((d) => (
              <div key={d.nombre} className={`discipline-card ${!d.activa ? 'coming-soon' : ''}`}>
                <span className="discipline-emoji">{d.emoji}</span>
                <h3>{d.nombre}</h3>
                <p>{d.desc}</p>
                {d.activa
                  ? <span className="badge badge-activo">Disponible</span>
                  : <span className="badge badge-construccion">Próximamente</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="cta-inner container">
          <h2>¿Listo para reservar tu cancha?</h2>
          <p>Creá tu cuenta gratis y empezá a gestionar tus turnos hoy mismo.</p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-white btn-lg">Registrarse gratis</Link>
            <Link to="/login" className="btn-outline-white">Ya tengo cuenta</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <span className="brand-ttc">TTC</span>
                <span style={{ color: '#fff' }}> Sport</span>
              </div>
              <p className="footer-desc">
                Complejo polideportivo · 12 canchas de fútbol · 2 de vóley · Quincho con asador
              </p>
            </div>
            <div className="footer-col">
              <h4>Integrantes</h4>
              <ul>
                <li>Bruno Candelero</li>
                <li>Nicolás Tribolo</li>
                <li>Juan Trogolo</li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Accesos</h4>
              <ul>
                <li><Link to="/login">Ingresar</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
                {user && <li><Link to="/dashboard">Mi cuenta</Link></li>}
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2025 TTC Sport · TP4 Desarrollo Web</span>
            <div className="footer-badges">
              <span className="footer-badge">React</span>
              <span className="footer-badge">Node.js</span>
              <span className="footer-badge">Prisma</span>
              <span className="footer-badge">Vercel</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
