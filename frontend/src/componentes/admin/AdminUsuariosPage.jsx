import { useState, useEffect } from 'react';
import { api } from '../services/api';
import '../../estilos/admin.css';
import '../../estilos/tabla-modal.css';

const BADGE = { ADMIN: 'badge-confirmada', CLIENTE: 'badge-pendiente' };

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    api.adminGetUsuarios()
      .then(setUsuarios)
      .catch(() => setError('Error al cargar usuarios'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-text">Cargando...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-heading">Usuarios</h1>
          <p className="page-sub">{usuarios.length} usuarios registrados en el sistema.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registro</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td style={{ fontWeight: 600 }}>{u.nombre} {u.apellido}</td>
                <td style={{ color: 'var(--slate-400)' }}>{u.email}</td>
                <td>
                  <span className={`badge ${BADGE[u.rol] ?? 'badge-pendiente'}`}>{u.rol}</span>
                </td>
                <td>
                  {new Date(u.fecha_registro).toLocaleDateString('es-AR', { dateStyle: 'medium' })}
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={5} className="table-empty">Sin usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
