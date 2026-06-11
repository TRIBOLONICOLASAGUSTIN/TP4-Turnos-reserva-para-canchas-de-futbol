import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ESTADOS = ['ACTIVO', 'EN_CONSTRUCCION', 'MANTENIMIENTO'];
const ESTADO_BADGE = {
  ACTIVO: 'badge-activo',
  EN_CONSTRUCCION: 'badge-construccion',
  MANTENIMIENTO: 'badge-mantenimiento',
};

export default function AdminEspaciosPage() {
  const [espacios, setEspacios] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre: '', id_disciplina: '', estado: 'ACTIVO', capacidad: '' });

  useEffect(() => {
    Promise.all([api.adminGetEspacios(), api.adminGetDisciplinas()])
      .then(([esp, disc]) => { setEspacios(esp); setDisciplinas(disc); })
      .catch(() => setError('Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const nuevo = await api.adminCreateEspacio({
        ...form,
        id_disciplina: parseInt(form.id_disciplina),
        capacidad: parseInt(form.capacidad),
      });
      setEspacios((prev) => [...prev, nuevo]);
      setShowForm(false);
      setForm({ nombre: '', id_disciplina: '', estado: 'ACTIVO', capacidad: '' });
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleEstado(id, estado) {
    try {
      await api.adminUpdateEspacio(id, { estado });
      setEspacios((prev) => prev.map((e) => (e.id_espacio === id ? { ...e, estado } : e)));
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 className="page-heading">Gestión de Espacios</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nuevo espacio'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <form className="card" style={{ marginBottom: 20 }} onSubmit={handleCreate}>
          <h3 style={{ marginBottom: 16 }}>Nuevo Espacio</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0 16px' }}>
            <div className="form-group">
              <label>Nombre</label>
              <input className="form-control" value={form.nombre} onChange={(e) => setForm((p) => ({ ...p, nombre: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label>Disciplina</label>
              <select className="form-control" value={form.id_disciplina} onChange={(e) => setForm((p) => ({ ...p, id_disciplina: e.target.value }))} required>
                <option value="">-- Seleccionar --</option>
                {disciplinas.map((d) => <option key={d.id_disciplina} value={d.id_disciplina}>{d.nombre}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select className="form-control" value={form.estado} onChange={(e) => setForm((p) => ({ ...p, estado: e.target.value }))}>
                {ESTADOS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Capacidad</label>
              <input type="number" className="form-control" value={form.capacidad} onChange={(e) => setForm((p) => ({ ...p, capacidad: e.target.value }))} required min={1} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Crear espacio</button>
        </form>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Nombre</th><th>Disciplina</th><th>Capacidad</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {espacios.map((e) => (
              <tr key={e.id_espacio}>
                <td>{e.id_espacio}</td>
                <td>{e.nombre}</td>
                <td>{e.disciplina?.nombre}</td>
                <td>{e.capacidad}</td>
                <td><span className={`badge ${ESTADO_BADGE[e.estado]}`}>{e.estado}</span></td>
                <td>
                  <select
                    className="form-control"
                    style={{ width: 'auto', padding: '4px 8px', fontSize: 13 }}
                    value={e.estado}
                    onChange={(ev) => handleEstado(e.id_espacio, ev.target.value)}
                  >
                    {ESTADOS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
