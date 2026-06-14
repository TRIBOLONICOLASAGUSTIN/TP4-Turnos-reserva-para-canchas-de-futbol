import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Footer from './Footer';
import Reveal from './Reveal';
import CanchaFutbolSVG from './CanchaFutbolSVG';
import useReveal from '../hooks/useReveal';
import '../estilos/landing.css';

const disciplinas = [
  { emoji: '⚽', nombre: 'Fútbol',      desc: '12 canchas disponibles', activa: true  },
  { emoji: '🏐', nombre: 'Vóley',       desc: '2 canchas disponibles',  activa: true  },
  { emoji: '🏓', nombre: 'Pádel',       desc: '2 canchas próximamente', activa: false },
  { emoji: '🏀', nombre: 'Básquet 3x3', desc: '1 cancha próximamente',  activa: false },
  { emoji: '🍖', nombre: 'Área Social', desc: 'Quincho con asador',     activa: true  },
];

const features = [
  { icon: '📅', title: 'Calendario en tiempo real',    desc: 'Visualizá disponibilidad por cancha y reservá al instante, sin llamadas ni papeles.' },
  { icon: '🔒', title: 'Control total para el admin',  desc: 'Bloqueá horarios por mantenimiento, gestioná reservas y supervisá el historial completo.' },
  { icon: '📱', title: 'Desde cualquier dispositivo', desc: 'Funciona en celular, tablet o computadora. Sin app que instalar — todo desde el navegador.' },
  { icon: '⚡', title: 'Modular y escalable',           desc: 'Nuevas disciplinas se activan dinámicamente desde el panel admin, sin tocar el código.' },
];

function StaggerGrid({ children, className = '', threshold = 0.12 }) {
  const [ref, shown] = useReveal({ threshold });
  return (
    <div ref={ref} className={`reveal-stagger${shown ? ' is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="landing">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="wave-bg" aria-hidden="true">
          <span /><span /><span />
        </div>
        <div className="hero-content container">
          <Reveal as="span" variant="up" className="hero-eyebrow">TTC Sport</Reveal>
          <Reveal as="h1" variant="up" delay={80} className="hero-title">
            Sistema de Reserva<br />
            <span className="hero-accent">de Turnos</span>
          </Reveal>
          <Reveal as="p" variant="up" delay={180} className="hero-subtitle">
            Digitaliza tu complejo polideportivo. Reservá canchas, gestioná
            horarios y controlá cada espacio — todo online, en tiempo real.
          </Reveal>
          <Reveal variant="up" delay={280} className="hero-actions">
            {user ? (
              <Link to="/reservas" className="btn btn-primary btn-lg">
                Reservar ahora →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Probar gratis</Link>
                <Link to="/login"    className="btn-outline-dark btn-lg">Ingresar</Link>
              </>
            )}
          </Reveal>

          <StaggerGrid className="hero-stats">
            <div><span className="hero-stat-number">12</span><span className="hero-stat-label">Canchas de fútbol</span></div>
            <div><span className="hero-stat-number">2</span><span className="hero-stat-label">Canchas de vóley</span></div>
            <div><span className="hero-stat-number">100%</span><span className="hero-stat-label">Online, sin papeles</span></div>
          </StaggerGrid>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features">
        <div className="container">
          <Reveal variant="up" className="section-header">
            <span className="section-eyebrow">Funcionalidades</span>
            <h2 className="section-title">Gestión <span className="text-green">100% online</span></h2>
            <p className="section-sub">Todo lo que necesitás para un polideportivo moderno, sin complicaciones.</p>
          </Reveal>
          <StaggerGrid className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon-wrap">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ── Disciplinas ── */}
      <section className="disciplines">
        <div className="container">
          <Reveal variant="up" className="section-header">
            <span className="section-eyebrow" style={{ color: 'var(--green-400)' }}>Espacios</span>
            <h2 className="section-title">Nuestras disciplinas</h2>
            <p className="section-sub">Reservá el espacio que necesitás. Las nuevas instalaciones se activarán automáticamente al estar listas.</p>
          </Reveal>
          <StaggerGrid className="disciplines-grid">
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
          </StaggerGrid>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta">
        <div className="cta-inner container cta-split">
          <div className="cta-text">
            <Reveal as="h2" variant="up">¿Listo para reservar tu cancha?</Reveal>
            <Reveal as="p" variant="up" delay={120}>
              Creá tu cuenta gratis y empezá a gestionar tus turnos hoy mismo.
            </Reveal>
            <StaggerGrid className="cta-actions">
              <Link to="/register" className="btn btn-white btn-lg">Registrarse gratis</Link>
              <Link to="/login"    className="btn-outline-dark btn-lg">Ya tengo cuenta</Link>
            </StaggerGrid>
          </div>

          <Reveal variant="right" delay={150} className="cta-art">
            <CanchaFutbolSVG />
          </Reveal>
        </div>
      </section>

      <Footer />

    </div>
  );
}
