import { useState, useEffect } from 'react';
import { api } from './services/api';
import '../estilos/reservas.css';

const ESTADO_MAP = {
  CONFIRMADA: { label: 'Confirmada', cls: 'badge-confirmada' },
  PENDIENTE:  { label: 'Pendiente',  cls: 'badge-pendiente'  },
  CANCELADA:  { label: 'Cancelada',  cls: 'badge-cancelada'  },
};

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
  const pasadas = reservas.filter(
    (r) => r.estado === 'CANCELADA' || new Date(r.fecha_hora_inicio) < new Date()
  );

  if (loading) return <p className="loading-text">Cargando reservas...</p>;

  return (
    <div className="mis-reservas">
      <h1 className="page-heading">Mis Reservas</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {proximas.length === 0 && pasadas.length === 0 && (
        <div className="empty-state card">
          <p>No tenés reservas todavía. ¡Reservá una cancha!</p>
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

      {pasadas.length > 0 && (
        <>
          <h2 className="reservas-section-title">Historial</h2>
          <div className="reservas-grid">
            {pasadas.map((r) => (
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
  const puedeCancel    = onCancelar && reserva.estado !== 'CANCELADA';

  return (
    <div className="reserva-card card">
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
          <span>{new Date(reserva.fecha_hora_inicio).toLocaleDateString('es-AR', { dateStyle: 'full' })}</span>
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

      {puedeCancel && (
        <button className="btn btn-danger btn-sm"
          onClick={() => onCancelar(reserva.id_reserva)}
          disabled={cancelando === reserva.id_reserva}>
          {cancelando === reserva.id_reserva ? 'Cancelando...' : 'Cancelar reserva'}
        </button>
      )}
    </div>
  );
}
