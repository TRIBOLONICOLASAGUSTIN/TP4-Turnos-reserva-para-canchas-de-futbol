import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../../estilos/admin.css';
import '../../estilos/tabla-modal.css';

export default function AdminBloqueosPage() {
  const [bloqueos,  setBloqueos]  = useState([]);
  const [espacios,  setEspacios]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [form, setForm] = useState({
    id_espacio: '', fecha_hora_inicio: '', fecha_hora_fin: '', motivo: '',
  });

  useEffect(() => {
    Promise.all([api.adminGetBloqueos(), api.adminGetEspacios()])
      .then(([bl, esp]) => {
        setBloqueos(bl);
        setEspacios(esp.filter((e) => e.estado === 'ACTIVO'));
      })
      .catch(() => setError('Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const nuevo = await api.adminCreateBloqueo({
        ...form, id_espacio: parseInt(form.id_espacio),
      });
      setBloqueos((prev) => [...prev, nuevo]);
      setShowForm(false);
      setForm({ id_espacio: '', fecha_hora_inicio: '', fecha_hora_fin: '', motivo: '' });
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este bloqueo?')) return;
    try {
      await api.adminDeleteBloqueo(id);
      setBloqueos((prev) => prev.filter((b) => b.id_bloqueo !== id));
    } catch (err) { setError(err.message); }
  }

  if (loading) return <p className="loading-text">Cargando...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">Bloqueos de Horario</h1>
          <p className="page-sub">Bloqueá franjas horarias por mantenimiento u otros motivos.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo bloqueo'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card admin-form-card" onSubmit={handleCreate}>
          <h3>Nuevo Bloqueo</h3>
          <div className="form-grid-4">
            <div className="form-group">
              <label>Espacio</label>
              <select className="form-control" value={form.id_espacio}
                onChange={(e) => setForm((p) => ({ ...p, id_espacio: e.target.value }))} required>
                <option value="">-- Seleccionar --</option>
                {espacios.map((e) => (
                  <option key={e.id_espacio} value={e.id_espacio}>{e.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Inicio</label>
              <input type="datetime-local" className="form-control" value={form.fecha_hora_inicio}
                onChange={(e) => setForm((p) => ({ ...p, fecha_hora_inicio: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Fin</label>
              <input type="datetime-local" className="form-control" value={form.fecha_hora_fin}
                onChange={(e) => setForm((p) => ({ ...p, fecha_hora_fin: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Motivo</label>
              <input className="form-control" value={form.motivo} placeholder="Ej: Mantenimiento de césped"
                onChange={(e) => setForm((p) => ({ ...p, motivo: e.target.value }))} required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Crear bloqueo</button>
        </form>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>#</th><th>Espacio</th><th>Inicio</th><th>Fin</th><th>Motivo</th><th>Admin</th><th></th></tr>
          </thead>
          <tbody>
            {bloqueos.map((b) => (
              <tr key={b.id_bloqueo}>
                <td>{b.id_bloqueo}</td>
                <td style={{ fontWeight: 600 }}>{b.espacio?.nombre}</td>
                <td>{new Date(b.fecha_hora_inicio).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{new Date(b.fecha_hora_fin).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                <td>{b.motivo}</td>
                <td>{b.admin?.nombre} {b.admin?.apellido}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id_bloqueo)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {bloqueos.length === 0 && (
              <tr><td colSpan={7} className="table-empty">Sin bloqueos activos</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
