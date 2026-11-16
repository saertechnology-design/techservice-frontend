'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const estadoCfg: Record<string, { color: string; bg: string; label: string }> = {
  pendiente:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Pendiente'  },
  en_proceso: { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   label: 'En Proceso' },
  finalizada: { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Finalizada' },
  cancelada:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Cancelada'  },
}
const catColor: Record<string, string> = {
  camaras: '#06b6d4', alarma: '#a855f7', instalaciones: '#10b981',
  redes: '#f59e0b', informatica: '#6366f1', mamposteria: '#f97316',
}
const catLabel: Record<string, string> = {
  camaras: 'Cámaras', alarma: 'Alarma', instalaciones: 'Instalaciones',
  redes: 'Redes', informatica: 'Informática', mamposteria: 'Mampostería',
}

export default function OrdenesPage() {
  const [ordenes,  setOrdenes]  = useState<any[]>([])
  const [filtro,   setFiltro]   = useState('todas')
  const [buscar,   setBuscar]   = useState('')
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const router = useRouter()

  const cargar = useCallback(async (estado: string, busqueda: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getOrdenes({
        estado:  estado !== 'todas' ? estado : undefined,
        buscar:  busqueda || undefined,
      })
      setOrdenes(data)
    } catch (e: any) {
      if (e.message?.includes('401')) router.push('/login')
      else setError('No se pudieron cargar las órdenes. Verifica que el backend esté activo en localhost:8000')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { cargar('todas', '') }, [cargar])

  const filtros = [
    { key: 'todas',      label: 'Todas',      color: '#6366f1' },
    { key: 'pendiente',  label: 'Pendiente',  color: '#f59e0b' },
    { key: 'en_proceso', label: 'En Proceso', color: '#06b6d4' },
    { key: 'finalizada', label: 'Finalizada', color: '#10b981' },
    { key: 'cancelada',  label: 'Cancelada',  color: '#ef4444' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Órdenes de Servicio</h1>
          <p style={{ color: '#334155', fontSize: '13px', marginTop: '2px' }}>
            {loading ? 'Cargando...' : `${ordenes.length} registros en la base de datos`}
          </p>
        </div>
        <Link href="/dashboard/ordenes/nueva" style={{
          display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', borderRadius: '10px', textDecoration: 'none',
          background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: 'white', fontWeight: 700, fontSize: '13px',
          boxShadow: '0 4px 16px rgba(6,182,212,0.4)',
        }}>
          ＋ Nueva Orden
        </Link>
      </div>

      {/* Barra herramientas */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '300px' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155', fontSize: '14px' }}>⌕</span>
          <input value={buscar}
            onChange={e => { setBuscar(e.target.value); cargar(filtro, e.target.value) }}
            placeholder="Buscar orden o cliente..."
            style={{ width: '100%', padding: '10px 14px 10px 34px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0', fontSize: '13px', outline: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {filtros.map(f => (
            <button key={f.key} onClick={() => { setFiltro(f.key); cargar(f.key, buscar) }} style={{
              padding: '8px 14px', borderRadius: '8px', cursor: 'pointer',
              border: `1px solid ${filtro === f.key ? f.color : 'rgba(255,255,255,0.08)'}`,
              background: filtro === f.key ? `${f.color}18` : 'rgba(255,255,255,0.03)',
              color: filtro === f.key ? f.color : '#475569', fontSize: '12px', fontWeight: 700,
              boxShadow: filtro === f.key ? `0 0 10px ${f.color}30` : 'none',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span>⚠️</span> {error}
          <button onClick={() => cargar(filtro, buscar)} style={{ marginLeft: 'auto', padding: '5px 12px', background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '6px', color: '#fca5a5', cursor: 'pointer', fontSize: '12px' }}>
            Reintentar
          </button>
        </div>
      )}

      {/* Skeletons cargando */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ borderRadius: '14px', height: '180px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.08)' }} />
          ))}
        </div>
      ) : ordenes.length === 0 ? (
        /* Estado vacío */
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px', opacity: 0.3 }}>📋</div>
          <p style={{ fontSize: '18px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>No hay órdenes</p>
          <p style={{ fontSize: '14px', color: '#334155', marginBottom: '24px' }}>
            {filtro !== 'todas' ? `No hay órdenes con estado "${filtros.find(f=>f.key===filtro)?.label}"` : 'Crea la primera orden de servicio'}
          </p>
          <Link href="/dashboard/ordenes/nueva" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #06b6d4, #6366f1)', color: 'white', fontWeight: 700, textDecoration: 'none',
          }}>
            ＋ Crear primera orden
          </Link>
        </div>
      ) : (
        /* Grid de cards */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
          {ordenes.map(o => {
            const est = estadoCfg[o.estado] ?? estadoCfg.pendiente
            const cc  = catColor[o.categoria] ?? '#6366f1'
            return (
              <div key={o.id}
                onClick={() => router.push(`/dashboard/ordenes/${o.id}`)}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${cc}40`; el.style.boxShadow = `0 4px 20px ${cc}18` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = '1px solid rgba(99,102,241,0.12)'; el.style.boxShadow = 'none' }}
                style={{ borderRadius: '14px', padding: '18px', cursor: 'pointer', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.12)', backdropFilter: 'blur(10px)', transition: 'all 0.15s', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${cc}, transparent)` }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 800, color: '#6366f1' }}>{o.numero_orden}</span>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '6px', background: est.bg }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: est.color, display: 'inline-block', boxShadow: `0 0 5px ${est.color}` }} />
                    <span style={{ fontSize: '11px', color: est.color, fontWeight: 700 }}>{est.label}</span>
                  </div>
                </div>

                <p style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', marginBottom: '4px' }}>
                  {o.cliente_empresa || o.cliente_nombre}
                </p>
                {o.direccion_trabajo && (
                  <p style={{ color: '#475569', fontSize: '12px', marginBottom: '12px' }}>📍 {o.direccion_trabajo}</p>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', background: `${cc}10`, border: `1px solid ${cc}20` }}>
                    <div style={{ fontSize: '9px', color: '#334155', fontWeight: 700, marginBottom: '2px' }}>CATEGORÍA</div>
                    <div style={{ fontSize: '12px', color: cc, fontWeight: 700 }}>{catLabel[o.categoria] ?? o.categoria}</div>
                  </div>
                  <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '9px', color: '#334155', fontWeight: 700, marginBottom: '2px' }}>TÉCNICO</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.tecnico_nombre ?? 'Sin asignar'}
                    </div>
                  </div>
                  {o.fecha_programada && (
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', gridColumn: '1/-1' }}>
                      <div style={{ fontSize: '9px', color: '#334155', fontWeight: 700, marginBottom: '2px' }}>FECHA PROGRAMADA</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>📅 {o.fecha_programada}</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
