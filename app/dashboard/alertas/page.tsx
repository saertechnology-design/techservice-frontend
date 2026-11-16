'use client'

const alertas = [
  { id: 1, orden: 'OS-2024-0022', cliente: 'Clínica Santa María',    fecha: '2025-05-26', dias: 150, leida: false },
  { id: 2, orden: 'OS-2024-0015', cliente: 'Vigilancia Segura Ltda', fecha: '2025-04-12', dias: 106, leida: false },
  { id: 3, orden: 'OS-2024-0009', cliente: 'Hotel Dann Carlton',      fecha: '2025-03-20', dias:  83, leida: false },
  { id: 4, orden: 'OS-2023-0088', cliente: 'Banco del Progreso',      fecha: '2025-02-10', dias:  45, leida: true  },
  { id: 5, orden: 'OS-2023-0077', cliente: 'Centro Comercial Plaza',  fecha: '2025-01-28', dias:  32, leida: true  },
]

export default function AlertasPage() {
  const noLeidas = alertas.filter(a => !a.leida).length

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Alertas de Mantenimiento</h1>
          {noLeidas > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, padding: '2px 10px', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
              {noLeidas} nuevas
            </span>
          )}
        </div>
        <p style={{ color: '#334155', fontSize: '13px', marginTop: '4px' }}>
          Trigger automático PostgreSQL — programadas 5 meses después de cada instalación completada
        </p>
      </div>

      {/* Info trigger */}
      <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '24px', flexShrink: 0, filter: 'drop-shadow(0 0 8px #10b981)' }}>⚡</div>
        <div>
          <p style={{ fontWeight: 700, color: '#10b981', fontSize: '13px', marginBottom: '2px' }}>Automatización activa · PostgreSQL Trigger</p>
          <code style={{ fontSize: '12px', color: '#064e3b', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginTop: '4px', letterSpacing: '0.03em' }}>
            fecha_fin + INTERVAL &apos;5 months&apos; → alertas_mantenimiento
          </code>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {alertas.map(a => {
          const urgent = a.dias < 60
          const color = a.leida ? '#334155' : urgent ? '#ef4444' : '#f59e0b'
          const bg = a.leida ? 'rgba(255,255,255,0.02)' : urgent ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)'
          const border = a.leida ? 'rgba(255,255,255,0.06)' : urgent ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'

          return (
            <div key={a.id} style={{ borderRadius: '12px', padding: '16px 20px', background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '28px', filter: a.leida ? 'grayscale(1) opacity(0.3)' : `drop-shadow(0 0 8px ${color})`, flexShrink: 0 }}>🔔</div>
              <div style={{ flex: 1, minWidth: '180px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: a.leida ? '#475569' : '#e2e8f0', fontSize: '14px' }}>{a.cliente}</span>
                  {!a.leida && (
                    <span style={{ background: `${color}20`, color: color, padding: '1px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, border: `1px solid ${color}40` }}>
                      {urgent ? '⚠ URGENTE' : 'SIN LEER'}
                    </span>
                  )}
                </div>
                <p style={{ color: '#334155', fontSize: '12px' }}>
                  Mantenimiento preventivo · Orden{' '}
                  <span style={{ color: '#6366f1', fontFamily: 'monospace', fontWeight: 700 }}>{a.orden}</span>
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 800, color: a.leida ? '#475569' : '#e2e8f0', fontSize: '15px', fontFamily: 'monospace' }}>{a.fecha}</div>
                <div style={{ fontSize: '11px', color: color, fontWeight: 700, marginTop: '2px' }}>
                  En {a.dias} días
                </div>
              </div>
              {!a.leida && (
                <button style={{ padding: '7px 14px', border: 'none', borderRadius: '8px', background: `${color}`, color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer', flexShrink: 0, boxShadow: `0 2px 8px ${color}50` }}>
                  ✓ Leer
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
