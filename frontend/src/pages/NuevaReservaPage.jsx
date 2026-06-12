import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './NuevaReservaPage.css';

function formatFecha(isoStr) {
  return new Date(isoStr).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

function hoy() {
  return new Date().toISOString().split('T')[0];
}

export default function NuevaReservaPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaId, setDisciplinaId] = useState('');
  const [espacios, setEspacios] = useState([]);
  const [espacioId, setEspacioId] = useState('');
  const [fecha, setFecha] = useState(hoy());
  const [slots, setSlots] = useState([]);
  const [slotSeleccionado, setSlotSeleccionado] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getDisciplinas().then(setDisciplinas).catch(() => {});
  }, []);

  useEffect(() => {
    if (!disciplinaId) { setEspacios([]); setEspacioId(''); return; }
    const disc = disciplinas.find((d) => d.id_disciplina === parseInt(disciplinaId));
    setEspacios(disc?.espacios || []);
    setEspacioId('');
    setSlots([]);
    setSlotSeleccionado(null);
  }, [disciplinaId, disciplinas]);

  useEffect(() => {
    if (!espacioId || !fecha) return;
    setLoadingSlots(true);
    setSlotSeleccionado(null);
    api.getDisponibilidad(espacioId, fecha)
      .then((data) => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [espacioId, fecha]);

  async function handleReservar() {
    if (!slotSeleccionado) return;
    setError('');
    try {
      await api.crearReserva({
        id_espacio: parseInt(espacioId),
        fecha_hora_inicio: slotSeleccionado.hora_inicio,
        fecha_hora_fin: slotSeleccionado.hora_fin,
      });
      setExito('¡Reserva confirmada! Redirigiendo a tus reservas...');
      setTimeout(() => navigate('/dashboard/mis-reservas'), 1800);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="nueva-reserva">
      <h1 className="page-heading">Nueva Reserva</h1>
      <p className="page-sub">Seleccioná disciplina, cancha, fecha y horario.</p>

      {error && <div className="alert alert-error">{error}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <div className="reserva-form card">
        <div className="reserva-selects">
          <div className="form-group">
            <label>Disciplina</label>
            <select
              className="form-control"
              value={disciplinaId}
              onChange={(e) => setDisciplinaId(e.target.value)}
            >
              <option value="">-- Seleccioná una disciplina --</option>
              {disciplinas.map((d) => (
                <option key={d.id_disciplina} value={d.id_disciplina}>{d.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Espacio / Cancha</label>
            <select
              className="form-control"
              value={espacioId}
              onChange={(e) => setEspacioId(e.target.value)}
              disabled={!disciplinaId}
            >
              <option value="">-- Seleccioná una cancha --</option>
              {espacios.map((e) => (
                <option key={e.id_espacio} value={e.id_espacio}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              min={hoy()}
              onChange={(e) => setFecha(e.target.value)}
              disabled={!espacioId}
            />
          </div>
        </div>

        {espacioId && fecha && (
          <div className="slots-section">
            <div className="slots-header">
              <h3>Disponibilidad — {fecha}</h3>
              <div className="slots-legend">
                <span><span className="legend-dot green" />Libre</span>
                <span><span className="legend-dot red" />Ocupado</span>
                <span><span className="legend-dot amber" />Bloqueado</span>
              </div>
            </div>
            {loadingSlots ? (
              <p className="loading-text">Cargando horarios...</p>
            ) : (
              <div className="calendar-grid">
                {slots.map((slot) => {
                  const hora = formatFecha(slot.hora_inicio);
                  const horaFin = formatFecha(slot.hora_fin);
                  const isSelected = slotSeleccionado?.hora_inicio === slot.hora_inicio;

                  if (!slot.disponible) {
                    return (
                      <div
                        key={slot.hora_inicio}
                        className={`slot ${slot.motivo_bloqueo ? 'slot-blocked' : 'slot-occupied'}`}
                        title={slot.motivo_bloqueo || 'Ocupado'}
                      >
                        <span>{hora} – {horaFin}</span>
                        <small>{slot.motivo_bloqueo ? 'Bloqueado' : 'Ocupado'}</small>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={slot.hora_inicio}
                      className={`slot slot-available ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSlotSeleccionado(isSelected ? null : slot)}
                    >
                      <span>{hora} – {horaFin}</span>
                      <small>{isSelected ? '✓ Seleccionado' : 'Libre'}</small>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {slotSeleccionado && (
          <div className="reserva-confirm">
            <p>
              Reservar <strong>{espacios.find((e) => e.id_espacio === parseInt(espacioId))?.nombre}</strong> el{' '}
              <strong>{fecha}</strong> de <strong>{formatFecha(slotSeleccionado.hora_inicio)}</strong> a{' '}
              <strong>{formatFecha(slotSeleccionado.hora_fin)}</strong>
            </p>
            <button className="btn btn-primary btn-lg" onClick={handleReservar}>
              Confirmar reserva
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
