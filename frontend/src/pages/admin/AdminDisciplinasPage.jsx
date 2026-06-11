import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminDisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.adminGetDisciplinas()
      .then(setDisciplinas)
      .catch(() => setError('Error al cargar'))
      .finally(() => setLoading(false));
  }, []);

  async function toggleHabilitada(id, habilitada) {
    try {
      await api.adminUpdateDisciplina(id, { habilitada: !habilitada });
      setDisciplinas((prev) =>
        prev.map((d) => (d.id_disciplina === id ? { ...d, habilitada: !habilitada } : d))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="page-heading">Gestión de Disciplinas</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>
        Habilitá o deshabilitá disciplinas para que aparezcan en el sistema de reservas.
      </p>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="disciplinas-admin-grid">
        {disciplinas.map((d) => (
          <div key={d.id_disciplina} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{d.nombre}</h3>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{d._count?.espacios ?? 0} espacios</p>
            </div>
            <label className="toggle" title={d.habilitada ? 'Deshabilitar' : 'Habilitar'}>
              <input
                type="checkbox"
                checked={d.habilitada}
                onChange={() => toggleHabilitada(d.id_disciplina, d.habilitada)}
              />
              <span className="toggle-slider" />
            </label>
          </div>
        ))}
      </div>

      <style>{`
        .disciplinas-admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
        .toggle { position: relative; display: inline-block; width: 44px; height: 24px; cursor: pointer; }
        .toggle input { opacity: 0; width: 0; height: 0; }
        .toggle-slider {
          position: absolute; inset: 0;
          background: #ccc; border-radius: 24px; transition: .2s;
        }
        .toggle-slider::before {
          content: ''; position: absolute;
          height: 18px; width: 18px; left: 3px; bottom: 3px;
          background: #fff; border-radius: 50%; transition: .2s;
        }
        .toggle input:checked + .toggle-slider { background: var(--color-primary); }
        .toggle input:checked + .toggle-slider::before { transform: translateX(20px); }
      `}</style>
    </div>
  );
}
