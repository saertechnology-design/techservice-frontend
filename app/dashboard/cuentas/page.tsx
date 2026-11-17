'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const estadoCfg: Record<string, { color: string; bg: string; border: string }> = {
  pendiente: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  pagada:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)'  },
  vencida:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  anulada:   { color: '#475569', bg: 'rgba(71,85,105,0.1)',   border: 'rgba(71,85,105,0.2)'   },
}
const fmt = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

export default function CuentasPage() {
  const [cuentas,  setCuentas]  = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const router = useRouter()

  const cargar = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getCuentas()
      setCuentas(data)
    } catch (e: any) {
      if (e.message?.includes('401')) router.push('/login')
      else setError('No se pudieron cargar las cuentas.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  async function cambiarEstado(id: number, estado: string) {
    try {
      await api.updateEstadoCuenta(id, estado)
      await cargar()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const totalPendiente = cuentas.filter(c => c.estado === 'pendiente').reduce((a, c) => a + (c.total_neto ?? c.subtotal ?? 0), 0)
  const totalPagado    = cuentas.filter(c => c.estado === 'pagada').reduce((a, c) => a + (c.total_neto ?? c.subtotal ?? 0), 0)
  const totalVencido   = cuentas.filter(c => c.estado === 'vencida').reduce((a, c) => a + (c.total_neto ?? c.subtotal ?? 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9' }}>Cuentas de Cobro</h1>
          <p style={{ color: '#334155', fontSize: '13px', marginTop: '2px' }}>{loading ? 'Cargando...' : `${cuentas.length} cuentas`}</p>
        </div>
        <Link href="/dashboard/cuentas/nueva" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', borderRadius: '10px', textDecoration: 'none', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
          ＋ Nueva Cuenta
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Por Cobrar', value: fmt(totalPendiente), color: '#f59e0b' },
          { label: 'Cobrado',    value: fmt(totalPagado),    color: '#10b981' },
          { label: 'Vencido',    value: fmt(totalVencido),   color: '#ef4444' },
          { label: 'Total',      value: `${cuentas.length} cuentas`, color: '#6366f1' },
        ].map(k => (
          <div key={k.label} style={{ padding: '16px', borderRadius: '12px', background: `${k.color}08`, border: `1px solid ${k.color}25` }}>
            <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {error && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '16px', fontSize: '13px' }}>⚠️ {error}</div>}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1,2,3].map(i => <div key={i} style={{ borderRadius: '12px', height: '80px', background: 'rgba(255,255,255,0.03)' }} />)}
        </div>
      ) : cuentas.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>💰</div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>No hay cuentas de cobro</p>
          <Link href="/dashboard/cuentas/nueva" style={{ display: 'inline-flex', padding: '10px 24px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', borderRadius: '10px', fontWeight: 700, textDecoration: 'none' }}>＋ Crear primera cuenta</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cuentas.map(c => {
            const est = estadoCfg[c.estado] ?? estadoCfg.pendiente
            const monto = c.total_neto ?? c.subtotal ?? 0
            return (
              <div key={c.id} style={{ borderRadius: '12px', padding: '16px 20px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.12)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: est.color }} />
                <div style={{ flex: 1, minWidth: '180px', paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6366f1', fontSize: '12px' }}>{c.numero_cuenta}</span>
                    <span style={{ background: est.bg, color: est.color, padding: '2px 9px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, border: `1px solid ${est.border}` }}>{c.estado?.toUpperCase()}</span>
                  </div>
                  <p style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', marginBottom: '1px' }}>{c.cliente_nombre || c.cliente_empresa || `Cliente #${c.cliente_id}`}</p>
                  <p style={{ color: '#475569', fontSize: '12px' }}>{c.concepto}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#f1f5f9' }}>{fmt(monto)}</div>
                  {c.fecha_vencimiento && <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>Vence: {c.fecha_vencimiento}</div>}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
                  {c.estado === 'pendiente' && (
                    <button onClick={() => cambiarEstado(c.id, 'pagada')} style={{ padding: '7px 12px', border: 'none', borderRadius: '8px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '11px', cursor: 'pointer', fontWeight: 700 }}>✓ Pagada</button>
                  )}
                  {c.estado === 'pendiente' && (
                    <button onClick={() => cambiarEstado(c.id, 'anulada')} style={{ padding: '7px 12px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', background: 'transparent', color: '#ef4444', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>Anular</button>
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
