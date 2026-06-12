import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../../estilos/admin.css';

export default function AdminDisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');

  useEffect(() => {
    api.adminGetDisciplinas()
      .then(setDisciplinas)
      .catch(() => setError('Error al cargar disciplinas'))
      .finally(() => setLoading(false));
  }, []);

  async function handleToggle(id, habilitada) {
    try {
      await api.adminUpdateDisciplina(id, { habilitada });
      setDisciplinas((prev) =>
        prev.map((d) => (d.id_disciplina === id ? { ...d, habilitada } : d))
      );
    } catch (err) { setError(err.message); }
  }

  if (loading) return <p className="loading-text">Cargando...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">Disciplinas</h1>
          <p className="page-sub">Habilitá o deshabilitá las disciplinas disponibles para reserva.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="disciplinas-grid">
        {disciplinas.map((d) => (
          <div key={d.id_disciplina} className="disciplina-item card">
            <div className="disciplina-info">
              <h3 className="disciplina-nombre">{d.nombre}</h3>
              <p className="disciplina-espacios">
                {d._count?.espacios ?? d.espacios?.length ?? 0} espacio(s)
              </p>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={d.habilitada}
                onChange={(e) => handleToggle(d.id_disciplina, e.target.checked)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
