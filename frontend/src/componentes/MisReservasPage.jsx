import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from './services/api';
import '../estilos/reservas.css';

const HORAS_MIN_CANCELACION = 1;

const ESTADO_MAP = {
  CONFIRMADA: { label: 'Confirmada', cls: 'badge-confirmada' },
  PENDIENTE:  { label: 'Pendiente',  cls: 'badge-pendiente'  },
  CANCELADA:  { label: 'Cancelada',  cls: 'badge-cancelada'  },
};

function horasHasta(fechaISO) {
  return (new Date(fechaISO) - Date.now()) / (1000 * 60 * 60);
}

function formatCountdown(horas) {
  if (horas <= 0) return 'Turno en curso o pasado';
  const h = Math.floor(horas);
  const m = Math.floor((horas - h) * 60);
  if (h === 0) return `en ${m} min`;
  if (m === 0) return `en ${h}h`;
  return `en ${h}h ${m}m`;
}

export default function MisReservasPage() {
  const [reservas,   setReservas]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [cancelando, setCancelando] = useState(null);
  const [error,      setError]      = useState('');

  useEffect(() => {
    api.getMisReservas()
      .then(setReservas)
      .catch(() => setError('Error al cargar reservas'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCancelar(id) {
    setCancelando(id);
    setError('');
    try {
      await api.cancelarReserva(id);
      setReservas((prev) =>
        prev.map((r) => (r.id_reserva === id ? { ...r, estado: 'CANCELADA' } : r))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelando(null);
    }
  }

  const proximas = reservas.filter(
    (r) => r.estado !== 'CANCELADA' && new Date(r.fecha_hora_inicio) >= new Date()
  );
  const historial = reservas.filter(
    (r) => r.estado === 'CANCELADA' || new Date(r.fecha_hora_inicio) < new Date()
  );

  if (loading) return <p className="loading-text">Cargando reservas...</p>;

  return (
    <div className="mis-reservas">
      <h1 className="page-heading">Mis Reservas</h1>
      <p className="page-sub">Gestioná tus turnos activos e historial.</p>

      {error && <div className="alert alert-error">{error}</div>}

      {proximas.length === 0 && historial.length === 0 && (
        <div className="empty-state">
          <p>No tenés reservas todavía.</p>
          <Link to="/dashboard/nueva-reserva" className="btn btn-primary">
            Reservar una cancha →
          </Link>
        </div>
      )}

      {proximas.length > 0 && (
        <>
          <h2 className="reservas-section-title">Próximas</h2>
          <div className="reservas-grid">
            {proximas.map((r) => (
              <ReservaCard key={r.id_reserva} reserva={r}
                onCancelar={handleCancelar} cancelando={cancelando} />
            ))}
          </div>
        </>
      )}

      {historial.length > 0 && (
        <>
          <h2 className="reservas-section-title">Historial</h2>
          <div className="reservas-grid">
            {historial.map((r) => (
              <ReservaCard key={r.id_reserva} reserva={r}
                onCancelar={null} cancelando={null} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ReservaCard({ reserva, onCancelar, cancelando }) {
  const { label, cls } = ESTADO_MAP[reserva.estado] || {};
  const horas          = horasHasta(reserva.fecha_hora_inicio);
  const esCancelable   = onCancelar && reserva.estado !== 'CANCELADA';
  const dentroDeVentana = horas < HORAS_MIN_CANCELACION;

  return (
    <div className={`reserva-card card${reserva.estado === 'CANCELADA' ? ' cancelada' : ''}`}>
      <div className="reserva-card-stripe" />

      <div className="reserva-card-inner">
        <div className="reserva-card-header">
          <div>
            <p className="reserva-disciplina">{reserva.espacio?.disciplina?.nombre}</p>
            <h3 className="reserva-espacio">{reserva.espacio?.nombre}</h3>
          </div>
          <span className={`badge ${cls}`}>{label}</span>
        </div>

        <div className="reserva-card-body">
          <div className="reserva-info">
            <span>📅</span>
            <span>
              {new Date(reserva.fecha_hora_inicio).toLocaleDateString('es-AR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>
          <div className="reserva-info">
            <span>⏰</span>
            <span>
              {new Date(reserva.fecha_hora_inicio).toLocaleTimeString('es-AR', { timeStyle: 'short' })}
              {' – '}
              {new Date(reserva.fecha_hora_fin).toLocaleTimeString('es-AR', { timeStyle: 'short' })}
            </span>
          </div>
        </div>
      </div>

      {esCancelable && (
        <div className="reserva-card-footer">
          {dentroDeVentana ? (
            <>
              <button className="cancel-blocked" disabled>
                🔒 No cancelable
              </button>
              <span className="cancel-blocked-time">
                Turno {formatCountdown(horas)} · Solo cancelable con +{HORAS_MIN_CANCELACION}h de anticipación
              </span>
            </>
          ) : (
            <button
              className="btn btn-danger btn-sm btn-full"
              onClick={() => onCancelar(reserva.id_reserva)}
              disabled={cancelando === reserva.id_reserva}
            >
              {cancelando === reserva.id_reserva ? 'Cancelando...' : 'Cancelar reserva'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
