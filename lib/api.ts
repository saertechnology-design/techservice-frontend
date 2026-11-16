const API = 'http://localhost:8000'

function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = getToken()
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  // ── Auth ─────────────────────────────────────────────
  login: (email: string, password: string) =>
    fetch(`${API}/api/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
    }).then(r => r.json()),

  registro: (data: { nombre: string; apellido: string; email: string; password: string; telefono?: string }) =>
    apiFetch('/api/auth/registro', { method: 'POST', body: JSON.stringify(data) }),

  me: () => apiFetch('/api/auth/me'),

  // ── Stats ─────────────────────────────────────────────
  getStats: () => apiFetch('/api/stats'),

  // ── Clientes ─────────────────────────────────────────
  getClientes: (buscar?: string) => {
    const q = buscar ? `?buscar=${encodeURIComponent(buscar)}` : ''
    return apiFetch(`/api/clientes${q}`)
  },
  createCliente: (data: any) =>
    apiFetch('/api/clientes', { method: 'POST', body: JSON.stringify(data) }),
  updateCliente: (id: number, data: any) =>
    apiFetch(`/api/clientes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getCliente: (id: number) => apiFetch(`/api/clientes/${id}`),

  // ── Usuarios / Técnicos ───────────────────────────────
  getUsuarios: () => apiFetch('/api/usuarios'),
  getTecnicos: async () => {
    const all = await apiFetch('/api/usuarios')
    return all.filter((u: any) => u.rol === 'tecnico')
  },

  // ── Órdenes ───────────────────────────────────────────
  getOrdenes: (params?: { estado?: string; buscar?: string }) => {
    const q = new URLSearchParams()
    if (params?.estado && params.estado !== 'todas') q.set('estado', params.estado)
    if (params?.buscar) q.set('buscar', params.buscar)
    const qs = q.toString()
    return apiFetch(`/api/ordenes${qs ? '?' + qs : ''}`)
  },
  createOrden: (data: any) =>
    apiFetch('/api/ordenes', { method: 'POST', body: JSON.stringify(data) }),
  getOrden: (id: number) => apiFetch(`/api/ordenes/${id}`),
  updateEstado: (id: number, estado: string, observaciones?: string) =>
    apiFetch(`/api/ordenes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify({ estado, observaciones_tecnico: observaciones || '' }),
    }),

  // ── Cuentas de cobro ──────────────────────────────────
  getCuentas: () => apiFetch('/api/cuentas'),
  createCuenta: (data: any) =>
    apiFetch('/api/cuentas', { method: 'POST', body: JSON.stringify(data) }),
  getCuenta: (id: number) => apiFetch(`/api/cuentas/${id}`),
  updateEstadoCuenta: (id: number, estado: string) =>
    apiFetch(`/api/cuentas/${id}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }),

  // ── Alertas ───────────────────────────────────────────
  getAlertas: () => apiFetch('/api/alertas'),
  marcarAlertaLeida: (id: number) =>
    apiFetch(`/api/alertas/${id}/leida`, { method: 'PATCH' }),

  // ── Configuración ─────────────────────────────────────
  getConfig: () => apiFetch('/api/config'),
  updateConfig: (data: any) =>
    apiFetch('/api/config', { method: 'PUT', body: JSON.stringify(data) }),
}
