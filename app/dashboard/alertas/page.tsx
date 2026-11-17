'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function AlertasPage() {
  const [alertas,  setAlertas]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const router = useRouter()

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getAlertas()
      setAlertas(data)
    } catch (e: any) {
      if (e.message?.includes('401')) router.push('/login')
      else setError('No se pudieron cargar las alertas.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  async function marcarLeida(id: number) {
    try {
      await api.marcarAlertaLeida(id)
      setAlertas(prev => prev.map(a => a.id === id ? { ...a, leida: 1 } : a))
    } catch (e: any) {
      setError(e.message)
    }
  }

  const noLeidas = alertas.filter(a => !a.leida).length

  return (
    <div>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9' }}>Alertas de Mantenimiento</h1>
          {noLeidas > 0 && (
            <span style={{ background: '#ef4444', color: 'white', borderRadius: '9999px', fontSize: '11px', fontWeight: 800, padding: '2px 10px', boxShadow: '0 0 10px rgba(239,68,68,0.5)' }}>
              {noLeidas} nuevas
            </span>
          )}
        </div>
        <p style={{ color: '#334155', fontSize: '13px', marginTop: '4px' }}>
          Programadas automáticamente 5 meses después de cada instalación completada
        </p>
      </div>

      <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '24px', flexShrink: 0 }}>⚡</div>
        <div>
          <p style={{ fontWeight: 700, color: '#10b981', fontSize: '13px', marginBottom: '2px' }}>Automatización activa · SQLite Trigger</p>
          <code style={{ fontSize: '12px', color: '#064e3b', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', marginTop: '4px' }}>
            fecha_fin + 5 meses → alertas_mantenimiento
          </code>
        </div>
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '16px', fontSize: '13px' }}>⚠️ {error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[1,2,3].map(i => <div key={i} style={{ borderRadius: '12px', height: '80px', background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
      ) : alertas.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🔔</div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#475569' }}>No hay alertas pendientes</p>
          <p style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>Las alertas aparecen automáticamente cuando se finalizan órdenes de instalación.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {alertas.map(a => {
            const leida = !!a.leida
            const fechaAlerta = new Date(a.fecha_alerta)
            const hoy = new Date()
            const dias = Math.ceil((fechaAlerta.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
            const urgent = dias < 60 && dias >= 0
            const vencida = dias < 0
            const color = leida ? '#334155' : vencida ? '#ef4444' : urgent ? '#f59e0b' : '#10b981'
            const bg    = leida ? 'rgba(255,255,255,0.02)' : vencida ? 'rgba(239,68,68,0.06)' : urgent ? 'rgba(245,158,11,0.06)' : 'rgba(16,185,129,0.06)'
            const border= leida ? 'rgba(255,255,255,0.06)' : vencida ? 'rgba(239,68,68,0.3)' : urgent ? 'rgba(245,158,11,0.3)' : 'rgba(16,185,129,0.3)'

            return (
              <div key={a.id} style={{ borderRadius: '12px', padding: '16px 20px', background: bg, border: `1px solid ${border}`, borderLeft: `3px solid ${color}`, display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ fontSize: '28px', filter: leida ? 'grayscale(1) opacity(0.3)' : `drop-shadow(0 0 8px ${color})`, flexShrink: 0 }}>🔔</div>
                <div style={{ flex: 1, minWidth: '180px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: leida ? '#475569' : '#e2e8f0', fontSize: '14px' }}>
                      {a.cliente_nombre || a.cliente_empresa || `Cliente #${a.cliente_id}`}
                    </span>
                    {!leida && (
                      <span style={{ background: `${color}20`, color, padding: '1px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, border: `1px solid ${color}40` }}>
                        {vencida ? '⚠ VENCIDA' : urgent ? '⚠ PRÓXIMA' : 'SIN LEER'}
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#334155', fontSize: '12px' }}>
                    {a.mensaje || 'Mantenimiento preventivo'} · Orden{' '}
                    <span style={{ color: '#6366f1', fontFamily: 'monospace', fontWeight: 700 }}>{a.orden_numero || `#${a.orden_id}`}</span>
                  </p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, color: leida ? '#475569' : '#e2e8f0', fontSize: '14px', fontFamily: 'monospace' }}>{a.fecha_alerta?.slice(0,10)}</div>
                  <div style={{ fontSize: '11px', color, fontWeight: 700, marginTop: '2px' }}>
                    {vencida ? `Venció hace ${Math.abs(dias)} días` : dias === 0 ? 'Hoy' : `En ${dias} días`}
                  </div>
                </div>
                {!leida && (
                  <button onClick={() => marcarLeida(a.id)} style={{ padding: '7px 14px', border: 'none', borderRadius: '8px', background: color, color: 'white', fontSize: '11px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                    ✓ Marcar leída
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
