import '../estilos/cancha-svg.css';

/**
 * Cancha de fútbol cenital minimalista.
 * Líneas blancas semi-transparentes sobre fondo verde del CTA,
 * balón con animación flotante + rotatoria, jugadores con pulso sutil.
 */
export default function CanchaFutbolSVG() {
  return (
    <svg
      className="cancha-svg"
      viewBox="0 0 800 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cancha de fútbol vista desde arriba"
    >
      {/* ── Brillo decorativo de fondo (sutil) ── */}
      <defs>
        <radialGradient id="canchaGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#ffffff" stopOpacity=".1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="800" height="520" fill="url(#canchaGlow)" rx="20" />

      {/* ── Bandas claras alternadas (efecto césped) ── */}
      <g className="cancha-bandas" opacity=".07">
        <rect x="40"  y="40" width="80"  height="440" fill="#fff" />
        <rect x="200" y="40" width="80"  height="440" fill="#fff" />
        <rect x="360" y="40" width="80"  height="440" fill="#fff" />
        <rect x="520" y="40" width="80"  height="440" fill="#fff" />
        <rect x="680" y="40" width="80"  height="440" fill="#fff" />
      </g>

      {/* ────────────────────────────────────────
          LÍNEAS DE LA CANCHA (todas en blanco)
      ──────────────────────────────────────── */}
      <g
        fill="none"
        stroke="rgba(255,255,255,.85)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Perímetro */}
        <rect x="40" y="40" width="720" height="440" rx="2" />

        {/* Línea de medio campo */}
        <line x1="400" y1="40" x2="400" y2="480" />

        {/* Círculo central */}
        <circle cx="400" cy="260" r="62" />
        <circle cx="400" cy="260" r="3" fill="rgba(255,255,255,.85)" stroke="none" className="cancha-center-dot" />

        {/* Área grande izquierda */}
        <rect x="40" y="135" width="118" height="250" />
        {/* Área chica izquierda */}
        <rect x="40" y="200" width="42" height="120" />
        {/* Punto penal izquierda */}
        <circle cx="120" cy="260" r="2.5" fill="rgba(255,255,255,.85)" stroke="none" />
        {/* Semicírculo penal izquierda (arco del área) */}
        <path d="M 158 218 A 50 50 0 0 1 158 302" />

        {/* Área grande derecha */}
        <rect x="642" y="135" width="118" height="250" />
        {/* Área chica derecha */}
        <rect x="718" y="200" width="42" height="120" />
        {/* Punto penal derecha */}
        <circle cx="680" cy="260" r="2.5" fill="rgba(255,255,255,.85)" stroke="none" />
        {/* Semicírculo penal derecha */}
        <path d="M 642 218 A 50 50 0 0 0 642 302" />

        {/* Arco esquinero (top-left, top-right, bot-left, bot-right) */}
        <path d="M 40 50  A 10 10 0 0 1 50  40"  />
        <path d="M 760 50 A 10 10 0 0 0 750 40"  />
        <path d="M 40 470 A 10 10 0 0 0 50  480" />
        <path d="M 760 470 A 10 10 0 0 1 750 480" />

        {/* Arcos (porterías) — fuera del rectángulo principal */}
        <rect x="25" y="225" width="15" height="70" rx="1.5" />
        <rect x="760" y="225" width="15" height="70" rx="1.5" />
      </g>

      {/* ────────────────────────────────────────
          JUGADORES (formación 1-2-2-1 espejada)
          Equipo verde claro (izq) vs Equipo blanco (der)
      ──────────────────────────────────────── */}
      <g className="cancha-jugadores">

        {/* Equipo izquierdo (verde-100 / claro) */}
        <Jugador cx="70"  cy="260" team="A" delay="0s"   />
        <Jugador cx="180" cy="180" team="A" delay=".15s" />
        <Jugador cx="180" cy="340" team="A" delay=".30s" />
        <Jugador cx="290" cy="260" team="A" delay=".45s" />

        {/* Equipo derecho (blanco) */}
        <Jugador cx="730" cy="260" team="B" delay=".10s" />
        <Jugador cx="620" cy="180" team="B" delay=".25s" />
        <Jugador cx="620" cy="340" team="B" delay=".40s" />
        <Jugador cx="510" cy="260" team="B" delay=".55s" />
      </g>

      {/* ────────────────────────────────────────
          BALÓN — centro, con animación flotante
      ──────────────────────────────────────── */}
      <g className="cancha-balon">
        <circle cx="400" cy="260" r="11" fill="#ffffff" />
        {/* Pentágonos del balón (estilizados con líneas) */}
        <g stroke="#0a3d1c" strokeWidth="1.2" fill="none" strokeLinejoin="round">
          <polygon points="400,253 405,257 403,263 397,263 395,257" fill="#0a3d1c" />
          <line x1="400" y1="249" x2="400" y2="253" />
          <line x1="409" y1="258" x2="405" y2="257" />
          <line x1="406" y1="269" x2="403" y2="263" />
          <line x1="394" y1="269" x2="397" y2="263" />
          <line x1="391" y1="258" x2="395" y2="257" />
        </g>
      </g>
    </svg>
  );
}

function Jugador({ cx, cy, team, delay }) {
  const isA = team === 'A';
  const fill = isA ? '#bbf7d0' : '#ffffff';
  const stroke = isA ? '#15803d' : '#15803d';
  return (
    <g className="cancha-jugador" style={{ '--player-delay': delay }}>
      <circle
        cx={cx}
        cy={cy}
        r="8"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
      {/* Halo / pulso */}
      <circle
        cx={cx}
        cy={cy}
        r="8"
        fill="none"
        stroke={fill}
        strokeWidth="1"
        opacity=".6"
        className="cancha-jugador-halo"
      />
    </g>
  );
}
