import { useState, useEffect } from 'react';
import { api } from './services/api';
import { useToast } from './ToastContext';
import CustomSelect from './CustomSelect';
import DisciplinaIcon from './DisciplinaIcon';
import '../estilos/reservas.css';
import '../estilos/disciplinas-cards.css';

function fmt(isoStr) {
  return new Date(isoStr).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}
function hoy() {
  return new Date().toISOString().split('T')[0];
}
function precioMin(disc) {
  const precios = (disc.espacios || []).map((e) => e.precio_por_hora || 0).filter((p) => p > 0);
  return precios.length ? Math.min(...precios) : 0;
}

const CheckIcon = () => (
  <svg viewBox="0 0 20 20" fill="none">
    <path d="M4 10.5l4 4L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 18s-6-6-6-10a6 6 0 0112 0c0 4-6 10-6 10z" />
    <circle cx="10" cy="8" r="2" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="10" cy="10" r="7.5" />
    <path d="M10 6v4l2.5 2" />
  </svg>
);

const BackArrow = () => (
  <svg viewBox="0 0 16 16" fill="none">
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NuevaReservaPage() {
  const toast = useToast();

  const [disciplinas, setDisciplinas] = useState([]);

  // Estado de selección persistente
  const [activeDiscId, setActiveDiscId] = useState('');
  const [espacioId,    setEspacioId]    = useState('');
  const [fecha,        setFecha]        = useState(hoy());
  const [slot,         setSlot]         = useState(null);

  // Drafts (mientras está en modo selección)
  const [draftEspacio, setDraftEspacio] = useState('');
  const [draftFecha,   setDraftFecha]   = useState(hoy());
  const [draftSlot,    setDraftSlot]    = useState(null);

  // Modo: grid | cancha | horario
  const [mode, setMode] = useState('grid');

  // Slots disponibles para draftFecha (en modo horario)
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [confirming, setConfirming] = useState(false);

  useEffect(() => { api.getDisciplinas().then(setDisciplinas).catch(() => {}); }, []);

  // Cargar slots cuando entra a modo horario o cambia draftFecha
  useEffect(() => {
    if (mode !== 'horario' || !espacioId || !draftFecha) return;
    setLoadingSlots(true);
    setDraftSlot(null);
    api.getDisponibilidad(espacioId, draftFecha)
      .then((data) => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [mode, espacioId, draftFecha]);

  const discActiva = disciplinas.find((d) => String(d.id_disciplina) === String(activeDiscId));
  const espacioActivo = discActiva?.espacios?.find((e) => String(e.id_espacio) === String(espacioId));

  function openCancha(discId) {
    setActiveDiscId(String(discId));
    setDraftEspacio(String(activeDiscId) === String(discId) ? espacioId : '');
    setMode('cancha');
  }

  function confirmCancha() {
    if (!draftEspacio) return;
    setEspacioId(draftEspacio);
    setSlot(null);          // si cambia la cancha, se invalida el horario anterior
    setMode('grid');
    toast.success('Cancha seleccionada. Ahora elegí el horario.');
  }

  function openHorario() {
    setDraftFecha(fecha || hoy());
    setDraftSlot(slot);
    setMode('horario');
  }

  function confirmHorario() {
    if (!draftSlot) return;
    setFecha(draftFecha);
    setSlot(draftSlot);
    setMode('grid');
    toast.success('Horario seleccionado. Confirmá tu reserva.');
  }

  function cancelMode() {
    setMode('grid');
  }

  async function confirmarReserva() {
    if (!slot || !espacioId) return;
    setConfirming(true);
    try {
      await api.crearReserva({
        id_espacio:        parseInt(espacioId),
        fecha_hora_inicio: slot.hora_inicio,
        fecha_hora_fin:    slot.hora_fin,
      });
      toast.success('¡Reserva confirmada con éxito!');
      setActiveDiscId('');
      setEspacioId('');
      setSlot(null);
    } catch (err) {
      toast.error(err.message || 'No se pudo confirmar la reserva');
    } finally {
      setConfirming(false);
    }
  }

  // ════════════════════════════════════════════
  // MODO SELECCIÓN — 2 columnas (cancha o horario)
  // ════════════════════════════════════════════
  if ((mode === 'cancha' || mode === 'horario') && discActiva) {
    return (
      <div className="nueva-reserva">
        <h1 className="page-heading">Nueva Reserva</h1>
        <p className="page-sub">
          {mode === 'cancha' ? 'Elegí la cancha para tu turno' : 'Elegí el día y horario'}
        </p>

        <div className="disc-select-mode">
          {/* ── Columna izquierda: card de disciplina ── */}
          <DisciplinaCard
            d={discActiva}
            isActive={true}
            isSelected={true}
            espacioSeleccionado={espacioId ? espacioActivo : null}
            slot={slot}
            fecha={fecha}
            disableInteraction
          />

          {/* ── Columna derecha: panel ── */}
          <div className="select-panel">
            <button className="select-panel-back" onClick={cancelMode}>
              <BackArrow /> Volver
            </button>

            {mode === 'cancha' ? (
              <CanchaPanel
                disc={discActiva}
                value={draftEspacio}
                onChange={setDraftEspacio}
                onCancel={cancelMode}
                onConfirm={confirmCancha}
              />
            ) : (
              <HorarioPanel
                fecha={draftFecha}
                onFechaChange={setDraftFecha}
                slots={slots}
                loading={loadingSlots}
                slotSeleccionado={draftSlot}
                onSlotChange={setDraftSlot}
                onCancel={cancelMode}
                onConfirm={confirmHorario}
                espacio={espacioActivo}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════
  // MODO GRID
  // ════════════════════════════════════════════
  return (
    <div className="nueva-reserva">
      <h1 className="page-heading">Nueva Reserva</h1>
      <p className="page-sub">Elegí una disciplina y la cancha que prefieras.</p>

      <div className="disc-scroll">
        <div className="disc-grid">
          {disciplinas.map((d, idx) => {
            const middleIdx     = Math.floor(disciplinas.length / 2);
            const isSelected    = String(d.id_disciplina) === String(activeDiscId) && espacioId;
            const isMiddleHero  = !activeDiscId && idx === middleIdx;
            const isActive      = isSelected || isMiddleHero;
            const espacioSel    = isSelected ? espacioActivo : null;
            const slotSel       = isSelected ? slot : null;

            return (
              <DisciplinaCard
                key={d.id_disciplina}
                d={d}
                isActive={isActive}
                isSelected={isSelected}
                espacioSeleccionado={espacioSel}
                slot={slotSel}
                fecha={isSelected ? fecha : null}
                onSelectCancha={() => openCancha(d.id_disciplina)}
                onSelectHorario={openHorario}
                onConfirmar={confirmarReserva}
                confirming={confirming}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// CARD DE DISCIPLINA
// ════════════════════════════════════════════
function DisciplinaCard({
  d,
  isActive,
  isSelected,
  espacioSeleccionado,
  slot,
  fecha,
  onSelectCancha,
  onSelectHorario,
  onConfirmar,
  confirming,
  disableInteraction = false,
}) {
  const precio   = precioMin(d);
  const canchas  = d.espacios?.length || 0;
  const capMax   = canchas ? Math.max(...d.espacios.map((e) => e.capacidad || 0)) : 0;
  const tieneSlot = isSelected && slot;

  return (
    <div className={`disc-card${isActive ? ' disc-card--active' : ''}`}>
      <div className="disc-icon"><DisciplinaIcon nombre={d.nombre} /></div>
      <span className="disc-badge">{d.nombre}</span>

      <div>
        {precio > 0 && <span className="disc-price-from">Desde</span>}
        <div className="disc-price">
          {precio > 0 ? `$${precio.toLocaleString('es-AR')}` : 'Consultar'}
          {precio > 0 && <span className="disc-price-unit">/ hora</span>}
        </div>
      </div>

      <p className="disc-desc">
        Reservá tu turno y disfrutá de canchas premium con todos los servicios incluidos.
      </p>

      <ul className="disc-features">
        <li className="disc-feature">
          <span className="disc-feature-check"><CheckIcon /></span>
          {canchas} {canchas === 1 ? 'cancha disponible' : 'canchas disponibles'}
        </li>
        {capMax > 0 && (
          <li className="disc-feature">
            <span className="disc-feature-check"><CheckIcon /></span>
            Capacidad hasta {capMax} jugadores
          </li>
        )}
        <li className="disc-feature">
          <span className="disc-feature-check"><CheckIcon /></span>
          Cancelación gratis hasta 1h antes
        </li>
      </ul>

      <div className="disc-actions">
        {/* Si hay cancha y/o horario seleccionados → chip de resumen */}
        {isSelected && espacioSeleccionado && (
          <div className="disc-selection">
            <div className="disc-selection-row">
              <PinIcon />
              <span><strong>{espacioSeleccionado.nombre}</strong>{espacioSeleccionado.precio_por_hora ? ` · $${espacioSeleccionado.precio_por_hora.toLocaleString('es-AR')}/h` : ''}</span>
            </div>
            {tieneSlot && (
              <div className="disc-selection-row">
                <ClockIcon />
                <span>{fecha} · <strong>{fmt(slot.hora_inicio)} – {fmt(slot.hora_fin)}</strong></span>
              </div>
            )}
          </div>
        )}

        {/* Botones según estado */}
        {!disableInteraction && (
          <>
            {!isSelected && (
              <button
                className="disc-btn disc-btn--primary"
                onClick={onSelectCancha}
                disabled={!canchas}
              >
                Seleccionar cancha
              </button>
            )}

            {isSelected && !tieneSlot && (
              <>
                <button className="disc-btn disc-btn--primary" onClick={onSelectHorario}>
                  Seleccionar horario
                </button>
                <button className="disc-btn disc-btn--ghost" onClick={onSelectCancha}>
                  Cambiar cancha
                </button>
              </>
            )}

            {isSelected && tieneSlot && (
              <>
                <button
                  className="disc-btn disc-btn--primary"
                  onClick={onConfirmar}
                  disabled={confirming}
                >
                  {confirming ? 'Confirmando...' : 'Confirmar reserva'}
                </button>
                <button className="disc-btn disc-btn--ghost" onClick={onSelectHorario}>
                  Cambiar horario
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
// PANEL DERECHO: ELEGIR CANCHA
// ════════════════════════════════════════════
function CanchaPanel({ disc, value, onChange, onCancel, onConfirm }) {
  const opts = (disc.espacios || []).map((esp) => ({
    value: String(esp.id_espacio),
    label: esp.nombre,
  }));

  return (
    <>
      <h2 className="select-panel-title">Elegí tu cancha</h2>
      <p className="select-panel-sub">
        Estas son las canchas disponibles para <strong>{disc.nombre}</strong>.
      </p>

      <div className="select-panel-field">
        <label>Cancha</label>
        <CustomSelect
          options={opts}
          value={value}
          onChange={onChange}
          placeholder="Seleccionar una cancha"
        />
      </div>

      <div className="select-panel-actions">
        <button className="disc-btn disc-btn--outline" onClick={onCancel}>Cancelar</button>
        <button
          className="disc-btn disc-btn--primary"
          onClick={onConfirm}
          disabled={!value}
        >
          Confirmar cancha
        </button>
      </div>
    </>
  );
}

// ════════════════════════════════════════════
// PANEL DERECHO: ELEGIR HORARIO
// ════════════════════════════════════════════
const HORAS_MIN_ANTICIPACION = 1;

function HorarioPanel({
  fecha, onFechaChange, slots, loading,
  slotSeleccionado, onSlotChange, onCancel, onConfirm, espacio,
}) {
  // Filtra slots con menos de HORAS_MIN_ANTICIPACION de antelación
  const limite = Date.now() + HORAS_MIN_ANTICIPACION * 60 * 60 * 1000;
  const slotsVisibles = slots.filter((s) => new Date(s.hora_inicio).getTime() >= limite);
  const todosPasados = !loading && slots.length > 0 && slotsVisibles.length === 0;

  return (
    <>
      <h2 className="select-panel-title">Elegí día y horario</h2>
      <p className="select-panel-sub">
        Disponibilidad para <strong>{espacio?.nombre}</strong>.
      </p>

      <div className="select-panel-field">
        <label>Fecha</label>
        <input
          type="date"
          className="form-control"
          value={fecha}
          min={hoy()}
          onChange={(e) => onFechaChange(e.target.value)}
        />
      </div>

      <div className="slots-section">
        <div className="slots-header">
          <h3>Horarios — {fecha}</h3>
          <div className="slots-legend">
            <span><span className="legend-dot green" />Libre</span>
            <span><span className="legend-dot red" />Ocupado</span>
            <span><span className="legend-dot amber" />Bloqueado</span>
          </div>
        </div>

        {loading ? (
          <p className="loading-text">Cargando horarios...</p>
        ) : todosPasados ? (
          <p className="loading-text">
            Ya no quedan horarios disponibles para hoy. Probá con otro día.
          </p>
        ) : (
          <div className="calendar-grid">
            {slotsVisibles.map((s) => {
              const isSel = slotSeleccionado?.hora_inicio === s.hora_inicio;
              if (!s.disponible) {
                return (
                  <div
                    key={s.hora_inicio}
                    className={`slot ${s.motivo_bloqueo ? 'slot-blocked' : 'slot-occupied'}`}
                    title={s.motivo_bloqueo || 'Ocupado'}
                  >
                    <span>{fmt(s.hora_inicio)} – {fmt(s.hora_fin)}</span>
                    <small>{s.motivo_bloqueo ? 'Bloqueado' : 'Ocupado'}</small>
                  </div>
                );
              }
              return (
                <div
                  key={s.hora_inicio}
                  className={`slot slot-available${isSel ? ' selected' : ''}`}
                  onClick={() => onSlotChange(isSel ? null : s)}
                >
                  <span>{fmt(s.hora_inicio)} – {fmt(s.hora_fin)}</span>
                  <small>{isSel ? '✓ Seleccionado' : 'Libre'}</small>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="select-panel-actions">
        <button className="disc-btn disc-btn--outline" onClick={onCancel}>Cancelar</button>
        <button
          className="disc-btn disc-btn--primary"
          onClick={onConfirm}
          disabled={!slotSeleccionado}
        >
          Confirmar horario
        </button>
      </div>
    </>
  );
}
