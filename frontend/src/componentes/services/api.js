const BASE_URL = import.meta.env.VITE_API_URL || '';

function getToken() {
  return localStorage.getItem('ttc_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
}

export const api = {
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => request('/api/auth/login',    { method: 'POST', body: JSON.stringify(body) }),

  getDisciplinas:   ()           => request('/api/disciplinas'),
  getEspacios:      ()           => request('/api/espacios'),
  getDisponibilidad:(id, fecha)  => request(`/api/espacios/${id}/disponibilidad?fecha=${fecha}`),

  getMisReservas:  ()     => request('/api/reservas/mis-reservas'),
  crearReserva:    (body) => request('/api/reservas', { method: 'POST', body: JSON.stringify(body) }),
  cancelarReserva: (id)   => request(`/api/reservas/${id}/cancelar`, { method: 'PATCH' }),

  adminGetReservas:     (qs = '')  => request(`/api/admin/reservas${qs}`),
  adminCreateReserva:   (body)     => request('/api/admin/reservas',     { method: 'POST',  body: JSON.stringify(body) }),
  adminUpdateReserva:   (id, body) => request(`/api/admin/reservas/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  adminGetEspacios:     ()         => request('/api/admin/espacios'),
  adminCreateEspacio:   (body)     => request('/api/admin/espacios',     { method: 'POST',   body: JSON.stringify(body) }),
  adminUpdateEspacio:   (id, body) => request(`/api/admin/espacios/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  adminGetBloqueos:     ()         => request('/api/admin/bloqueos'),
  adminCreateBloqueo:   (body)     => request('/api/admin/bloqueos',     { method: 'POST',   body: JSON.stringify(body) }),
  adminDeleteBloqueo:   (id)       => request(`/api/admin/bloqueos/${id}`, { method: 'DELETE' }),

  adminGetDisciplinas:  ()         => request('/api/admin/disciplinas'),
  adminUpdateDisciplina:(id, body) => request(`/api/admin/disciplinas/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  adminGetUsuarios:     ()         => request('/api/admin/usuarios'),
};
