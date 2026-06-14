import Reveal from './Reveal';
import useReveal from '../hooks/useReveal';
import '../estilos/footer.css';

const FAQS = [
  {
    q: '¿Con cuánta anticipación puedo reservar?',
    a: 'Podés reservar hasta 30 días de anticipación y hasta 1 hora antes del turno. Las cancelaciones se permiten con un mínimo de 1 hora previa.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Aceptamos efectivo en el predio, transferencia bancaria, Mercado Pago y todas las tarjetas de crédito/débito.',
  },
  {
    q: '¿Las canchas tienen iluminación nocturna?',
    a: 'Sí, todas nuestras canchas cuentan con iluminación LED profesional. El horario nocturno se extiende hasta las 00:00 hs.',
  },
  {
    q: '¿Qué pasa si llueve?',
    a: 'Las canchas de pádel y básquet 3x3 son cubiertas. Para fútbol y vóley, ofrecemos reprogramación sin costo si el clima impide jugar.',
  },
];

const SOCIALS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/ttcsport',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="3.5" />
        <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/ttcsport',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 21v-7h2.5l.5-3h-3V9c0-1 .3-1.7 1.7-1.7H17V4.5c-.4-.1-1.5-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.4V11H7v3h3v7h3.5z" />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/5493421234567',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21l1.65-4A8 8 0 1 1 8 19.35L3 21z" />
        <path d="M8.5 9.5c.3 1.7 2.3 3.7 4 4l1-1.2c.4-.4.9-.5 1.4-.3l1.6.7c.5.2.7.7.6 1.2l-.2 1c-.1.6-.6 1-1.2 1-3.6.1-7.6-3.9-7.5-7.5 0-.6.4-1.1 1-1.2l1-.2c.5-.1 1 .1 1.2.6l.7 1.6c.2.5.1 1-.3 1.4l-1.3 1z" />
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com/ttcsport',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.5 3h3l-7 8 8.2 10h-6.4l-5-6.3L4.5 21H1.5l7.5-8.5L1 3h6.5l4.5 5.8L17.5 3zm-1 16h1.7L7.5 4.8H5.7L16.5 19z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [socialsRef, socialsShown] = useReveal({ threshold: 0.2 });

  return (
    <footer className="site-footer">
      <div className="footer-wave" aria-hidden="true" />

      <div className="footer-inner container">
        {/* ── Columna 1: Brand + Redes ── */}
        <Reveal variant="up" className="footer-col footer-brand-col">
          <h3 className="footer-brand">
            <span className="brand-ttc">TTC</span>
            <span className="brand-sport"> Sport</span>
          </h3>
          <p className="footer-tagline">
            Reservá tu cancha favorita en segundos. Disponibilidad en tiempo real, canchas premium, comunidad activa.
          </p>

          <div
            ref={socialsRef}
            className={`footer-socials reveal-stagger${socialsShown ? ' is-visible' : ''}`}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="footer-social"
              >
                {s.svg}
              </a>
            ))}
          </div>

          <div className="footer-contact">
            <div className="footer-contact-item">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-7.5-7-12a7 7 0 0114 0c0 4.5-7 12-7 12z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
              <span>Av. Aristóbulo del Valle 1234, Santa Fe</span>
            </div>
            <div className="footer-contact-item">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
              </svg>
              <span>+54 9 342 123-4567</span>
            </div>
            <div className="footer-contact-item">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <span>hola@ttcsport.com.ar</span>
            </div>
          </div>
        </Reveal>

        {/* ── Columna 2: FAQ ── */}
        <Reveal variant="up" delay={100} className="footer-col">
          <h4 className="footer-title">Preguntas frecuentes</h4>
          <div className="footer-faq">
            {FAQS.map((f, i) => (
              <details key={i} className="faq-item">
                <summary className="faq-q">
                  <span>{f.q}</span>
                  <svg className="faq-chevron" viewBox="0 0 16 16" fill="none">
                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="faq-a">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>

        {/* ── Columna 3: Mapa + horarios ── */}
        <Reveal variant="up" delay={200} className="footer-col">
          <h4 className="footer-title">Encontranos</h4>
          <div className="footer-map">
            <iframe
              title="Ubicación TTC Sport"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-60.7305%2C-31.6373%2C-60.7050%2C-31.6213&layer=mapnik&marker=-31.6293%2C-60.7178"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="footer-map-link"
              href="https://www.openstreetmap.org/?mlat=-31.6293&mlon=-60.7178#map=16/-31.6293/-60.7178"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver mapa más grande →
            </a>
          </div>

          <div className="footer-hours">
            <p className="footer-hours-title">Horarios de atención</p>
            <p>Lun – Vie · 09:00 – 00:00</p>
            <p>Sáb – Dom · 10:00 – 02:00</p>
          </div>
        </Reveal>
      </div>

      {/* ── Línea inferior ── */}
      <Reveal variant="fade" className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p className="footer-copy">
            © {new Date().getFullYear()} TTC Sport. Todos los derechos reservados.
          </p>
          <div className="footer-bottom-links">
            <a href="#">Términos</a>
            <span className="footer-dot">·</span>
            <a href="#">Privacidad</a>
            <span className="footer-dot">·</span>
            <a href="#">Cookies</a>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
