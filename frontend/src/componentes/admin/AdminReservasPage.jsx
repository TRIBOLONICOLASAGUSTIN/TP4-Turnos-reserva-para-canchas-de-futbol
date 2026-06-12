import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../../estilos/admin.css';
import '../../estilos/tabla-modal.css';

const ESTADOS = ['', 'CONFIRMADA', 'PENDIENTE', 'CANCELADA'];
const BADGE = { CONFIRMADA: 'badge-confirmada', PENDIENTE: 'badge-pendiente', CANCELADA: 'badge-cancelada' };

export default function AdminReservasPage() {
  const [reservas,     setReservas]     = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFecha,  setFiltroFecha]  = useState('');
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');

  useEffect(() => { cargar(); }, [filtroEstado, filtroFecha]);

  async function cargar() {
    setLoading(true);
    const p = new URLSearchParams();
    if (filtroEstado) p.set('estado', filtroEstado);
    if (filtroFecha)  p.set('fecha',  filtroFecha);
    const qs = p.toString() ? `?${p}` : '';
    try { setReservas(await api.adminGetReservas(qs)); }
    catch { setError('Error al cargar reservas'); }
    finally { setLoading(false); }
  }

  async function handleEstado(id, estado) {
    try {
      await api.adminUpdateReserva(id, { estado });
      setReservas((prev) => prev.map((r) => (r.id_reserva === id ? { ...r, estado } : r)));
    } catch (err) { setError(err.message); }
  }

  return (
    <div>
      <h1 className="page-heading">Gestión de Reservas</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-filters">
        <div className="form-group">
          <label>Filtrar por estado</label>
          <select className="form-control" value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}>
            {ESTADOS.map((e) => <option key={e} value={e}>{e || 'Todos'}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Filtrar por fecha</label>
          <input type="date" className="form-control" value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)} />
        </div>
      </div>

      {loading ? <p className="loading-text">Cargando...</p> : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Cliente</th><th>Espacio</th>
                <th>Inicio</th><th>Fin</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((r) => (
                <tr key={r.id_reserva}>
                  <td>{r.id_reserva}</td>
                  <td>{r.usuario?.nombre} {r.usuario?.apellido}</td>
                  <td>{r.espacio?.disciplina?.nombre} — {r.espacio?.nombre}</td>
                  <td>{new Date(r.fecha_hora_inicio).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>{new Date(r.fecha_hora_fin).toLocaleTimeString('es-AR', { timeStyle: 'short' })}</td>
                  <td><span className={`badge ${BADGE[r.estado]}`}>{r.estado}</span></td>
                  <td>
                    <div className="td-actions">
                      {r.estado !== 'CONFIRMADA' && (
                        <button className="btn btn-sm btn-primary"
                          onClick={() => handleEstado(r.id_reserva, 'CONFIRMADA')}>Confirmar</button>
                      )}
                      {r.estado !== 'CANCELADA' && (
                        <button className="btn btn-sm btn-danger"
                          onClick={() => handleEstado(r.id_reserva, 'CANCELADA')}>Cancelar</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {reservas.length === 0 && (
                <tr><td colSpan={7} className="table-empty">Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
