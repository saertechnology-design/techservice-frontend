'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

const estadoCfg: Record<string, { color: string; bg: string; label: string }> = {
  pendiente:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Pendiente'  },
  en_proceso: { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   label: 'En Proceso' },
  finalizada: { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Finalizada' },
  cancelada:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Cancelada'  },
}
const catLabel: Record<string, string> = {
  camaras: 'Cámaras', alarma: 'Alarma', instalaciones: 'Instalaciones',
  redes: 'Redes', informatica: 'Informática', mamposteria: 'Mampostería',
}
const catColor: Record<string, string> = {
  camaras: '#06b6d4', alarma: '#a855f7', instalaciones: '#10b981',
  redes: '#f59e0b', informatica: '#6366f1', mamposteria: '#f97316',
}
const transiciones: Record<string, string[]> = {
  pendiente:  ['en_proceso', 'cancelada'],
  en_proceso: ['finalizada', 'cancelada'],
  finalizada: [],
  cancelada:  [],
}

const fmt = (v: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

export default function OrdenDetalle() {
  const params  = useParams()
  const router  = useRouter()
  const id      = Number(params.id)

  const [orden,           setOrden]           = useState<any>(null)
  const [loading,         setLoading]         = useState(true)
  const [error,           setError]           = useState('')
  const [cambiandoEstado, setCambiandoEstado] = useState(false)
  const [obsTexto,        setObsTexto]        = useState('')
  const [exitoMsg,        setExitoMsg]        = useState('')

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getOrden(id)
      setOrden(data)
      setObsTexto(data.observaciones_tecnico || '')
    } catch (e: any) {
      if (e.message?.includes('401')) router.push('/login')
      else setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => { if (id) cargar() }, [id, cargar])

  async function cambiarEstado(nuevoEstado: string) {
    setCambiandoEstado(true)
    setError('')
    try {
      await api.updateEstado(id, nuevoEstado, obsTexto)
      setExitoMsg(`Estado actualizado a "${estadoCfg[nuevoEstado]?.label}"`)
      await cargar()
      setTimeout(() => setExitoMsg(''), 3000)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCambiandoEstado(false)
    }
  }

  const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0', fontSize: '13px', outline: 'none' }
  const field  = (label: string, value: string, color = '#94a3b8') => (
    <div key={label}>
      <div style={{ fontSize: '10px', color: '#334155', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '13px', color, fontWeight: 600 }}>{value || '—'}</div>
    </div>
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#475569', gap: '12px' }}>
      <span style={{ fontSize: '24px' }}>◌</span> Cargando orden...
    </div>
  )
  if (error && !orden) return (
    <div style={{ padding: '24px', background: 'rgba(239,68,68,0.08)', borderRadius: '12px', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.3)' }}>
      ⚠️ {error} — <button onClick={cargar} style={{ background: 'none', border: 'none', color: '#06b6d4', cursor: 'pointer' }}>Reintentar</button>
    </div>
  )
  if (!orden) return null

  const est = estadoCfg[orden.estado] ?? estadoCfg.pendiente
  const cc  = catColor[orden.categoria]  ?? '#6366f1'
  const siguientes = transiciones[orden.estado] ?? []
  const totalMateriales = (orden.materiales || []).reduce(
    (a: number, m: any) => a + m.cantidad * m.valor_unitario, 0
  )

  return (
    <div style={{ maxWidth: '820px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link href="/dashboard/ordenes" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)', color: '#475569', textDecoration: 'none', fontSize: '16px', background: 'rgba(255,255,255,0.03)', flexShrink: 0 }}>←</Link>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6366f1', fontSize: '16px' }}>{orden.numero_orden}</span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 12px', borderRadius: '8px', background: est.bg }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: est.color, display: 'inline-block', boxShadow: `0 0 6px ${est.color}` }} />
              <span style={{ fontSize: '12px', color: est.color, fontWeight: 700 }}>{est.label}</span>
            </div>
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 900, color: '#f1f5f9' }}>
            {orden.cliente_empresa || orden.cliente_nombre}
          </h1>
          {orden.direccion_trabajo && (
            <p style={{ color: '#475569', fontSize: '13px', marginTop: '2px' }}>📍 {orden.direccion_trabajo}</p>
          )}
        </div>
      </div>

      {/* Mensajes */}
      {exitoMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {exitoMsg}
        </div>
      )}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '16px', fontSize: '13px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'grid', gap: '14px' }}>
        {/* Detalles */}
        <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: `1px solid ${cc}25`, overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${cc}15`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: cc }}>◧</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Detalles de la Orden</span>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            {field('Categoría',    catLabel[orden.categoria] ?? orden.categoria, cc)}
            {field('Técnico',      orden.tecnico_nombre ?? 'Sin asignar')}
            {field('Programada',   orden.fecha_programada ?? 'No definida')}
            {field('Inicio',       orden.fecha_inicio?.slice(0,10) ?? '—')}
            {field('Finalización', orden.fecha_fin?.slice(0,10)    ?? '—')}
            {field('Creada',       orden.created_at?.slice(0,10)   ?? '—')}
          </div>
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ fontSize: '10px', color: '#334155', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '6px' }}>DESCRIPCIÓN</div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
              {orden.descripcion}
            </div>
          </div>
        </div>

        {/* Materiales */}
        {orden.materiales && orden.materiales.length > 0 && (
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(16,185,129,0.25)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>📦</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Materiales ({orden.materiales.length})</span>
            </div>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                {['DESCRIPCIÓN','CANT.','VALOR UNIT.','SUBTOTAL'].map(h => (
                  <div key={h} style={{ fontSize: '10px', color: '#334155', fontWeight: 700, letterSpacing: '0.06em' }}>{h}</div>
                ))}
              </div>
              {orden.materiales.map((m: any) => (
                <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8px', padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ fontSize: '13px', color: '#e2e8f0' }}>{m.descripcion}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{m.cantidad} {m.unidad}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>{fmt(m.valor_unitario)}</div>
                  <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>{fmt(m.cantidad * m.valor_unitario)}</div>
                </div>
              ))}
              <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#10b981', fontWeight: 700 }}>TOTAL MATERIALES</span>
                <span style={{ fontSize: '17px', color: '#10b981', fontWeight: 900 }}>{fmt(totalMateriales)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cambiar estado */}
        {siguientes.length > 0 && (
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#6366f1' }}>⚡</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Actualizar Estado</span>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '7px' }}>
                  Observaciones
                </label>
                <textarea rows={2} value={obsTexto} onChange={e => setObsTexto(e.target.value)}
                  placeholder="Novedades, materiales adicionales, problemas encontrados..."
                  style={{ ...iStyle, resize: 'vertical' as const }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {siguientes.map(s => {
                  const cfg = estadoCfg[s]
                  const labels: Record<string, string> = {
                    en_proceso: '▶ Iniciar trabajo',
                    finalizada: '✓ Marcar finalizada',
                    cancelada:  '✕ Cancelar orden',
                  }
                  return (
                    <button key={s} onClick={() => cambiarEstado(s)} disabled={cambiandoEstado} style={{
                      padding: '10px 20px', borderRadius: '10px', cursor: cambiandoEstado ? 'wait' : 'pointer',
                      border: `1px solid ${cfg.color}40`, background: `${cfg.color}15`,
                      color: cfg.color, fontWeight: 700, fontSize: '13px',
                      boxShadow: `0 0 10px ${cfg.color}20`,
                      opacity: cambiandoEstado ? 0.6 : 1,
                    }}>
                      {cambiandoEstado ? '◌ Guardando...' : labels[s] ?? cfg.label}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Observaciones guardadas */}
        {orden.observaciones_tecnico && (
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.12)', padding: '20px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>Observaciones del técnico</div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6 }}>{orden.observaciones_tecnico}</p>
          </div>
        )}

        {/* Acciones adicionales */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingBottom: '40px', flexWrap: 'wrap' }}>
          <Link href="/dashboard/ordenes" style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#475569', fontWeight: 600, textDecoration: 'none', fontSize: '13px' }}>
            ← Volver al listado
          </Link>
          {orden.estado === 'finalizada' && (
            <Link href={`/dashboard/cuentas/nueva?orden=${orden.id}`} style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', fontWeight: 700, fontSize: '13px', textDecoration: 'none', boxShadow: '0 4px 14px rgba(245,158,11,0.4)' }}>
              💰 Crear cuenta de cobro
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
