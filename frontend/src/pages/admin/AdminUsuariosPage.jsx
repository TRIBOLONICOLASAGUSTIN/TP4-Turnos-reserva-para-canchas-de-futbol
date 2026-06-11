import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.adminGetUsuarios().then(setUsuarios).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="page-heading">Usuarios registrados</h1>
      <div className="table-wrapper" style={{ marginTop: 20 }}>
        <table>
          <thead>
            <tr><th>#</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Registro</th></tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id_usuario}>
                <td>{u.id_usuario}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`badge ${u.rol === 'ADMIN' ? 'badge-pendiente' : 'badge-activo'}`}>
                    {u.rol}
                  </span>
                </td>
                <td>{new Date(u.fecha_registro).toLocaleDateString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
