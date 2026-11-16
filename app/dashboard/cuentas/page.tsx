'use client'
import Link from 'next/link'

const cuentas = [
  { id: 'CC-2024-0008', cliente: 'Vigilancia Segura Ltda', concepto: 'Instalación sistema CCTV 16 cámaras', monto: 4850000, estado: 'pendiente', emision: '20 Dic', vence: '20 Ene' },
  { id: 'CC-2024-0007', cliente: 'Banco del Progreso',     concepto: 'Mantenimiento central de alarmas',    monto: 1200000, estado: 'pagada',   emision: '10 Dic', vence: '10 Ene' },
  { id: 'CC-2024-0006', cliente: 'Clínica Santa María',    concepto: 'Instalación red estructurada Cat6',   monto: 7300000, estado: 'vencida',  emision: '15 Nov', vence: '15 Dic' },
  { id: 'CC-2024-0005', cliente: 'C.C. Plaza',             concepto: 'Revisión y certificación de redes',   monto: 950000,  estado: 'pagada',   emision: '1 Nov',  vence: '1 Dic'  },
  { id: 'CC-2024-0004', cliente: 'LogiTrans',              concepto: 'Cableado eléctrico oficinas',         monto: 2100000, estado: 'anulada',  emision: '20 Oct', vence: '20 Nov' },
]

const estadoCfg: Record<string, { color: string; bg: string; border: string }> = {
  pendiente: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)'  },
  pagada:    { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)'  },
  vencida:   { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)'   },
  anulada:   { color: '#475569', bg: 'rgba(71,85,105,0.1)',   border: 'rgba(71,85,105,0.2)'   },
}

const fmt = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

export default function CuentasPage() {
  const totalPendiente = cuentas.filter(c => c.estado === 'pendiente').reduce((a, c) => a + c.monto, 0)
  const totalPagado    = cuentas.filter(c => c.estado === 'pagada').reduce((a, c) => a + c.monto, 0)
  const totalVencido   = cuentas.filter(c => c.estado === 'vencida').reduce((a, c) => a + c.monto, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Cuentas de Cobro</h1>
        </div>
        <Link href="/dashboard/cuentas/nueva" style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', borderRadius: '10px', textDecoration: 'none', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 16px rgba(245,158,11,0.4)' }}>
          ＋ Nueva Cuenta
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Por Cobrar', value: fmt(totalPendiente), color: '#f59e0b', icon: '◎' },
          { label: 'Cobrado',    value: fmt(totalPagado),    color: '#10b981', icon: '◉' },
          { label: 'Vencido',    value: fmt(totalVencido),   color: '#ef4444', icon: '◈' },
          { label: 'Total',      value: `${cuentas.length} cuentas`, color: '#6366f1', icon: '◧' },
        ].map(k => (
          <div key={k.label} style={{ padding: '16px', borderRadius: '12px', background: `${k.color}08`, border: `1px solid ${k.color}25` }}>
            <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: k.color, filter: `drop-shadow(0 0 4px ${k.color})` }}>{k.icon}</span> {k.label}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Lista */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {cuentas.map(c => {
          const est = estadoCfg[c.estado]
          return (
            <div key={c.id} style={{ borderRadius: '12px', padding: '16px 20px', background: 'rgba(15,22,41,0.85)', border: `1px solid rgba(99,102,241,0.12)`, backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', transition: 'all 0.15s', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${est.color}40` }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = '1px solid rgba(99,102,241,0.12)' }}
            >
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: est.color, boxShadow: `2px 0 8px ${est.color}50` }} />
              <div style={{ flex: 1, minWidth: '180px', paddingLeft: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#6366f1', fontSize: '12px' }}>{c.id}</span>
                  <span style={{ background: est.bg, color: est.color, padding: '2px 9px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, border: `1px solid ${est.border}` }}>{c.estado.toUpperCase()}</span>
                </div>
                <p style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '14px', marginBottom: '1px' }}>{c.cliente}</p>
                <p style={{ color: '#475569', fontSize: '12px' }}>{c.concepto}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>{fmt(c.monto)}</div>
                <div style={{ fontSize: '11px', color: '#334155', marginTop: '2px' }}>Vence: {c.vence}</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button style={{ padding: '7px 14px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', background: 'transparent', fontSize: '11px', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>Ver</button>
                <button style={{ padding: '7px 14px', border: 'none', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: 'white', fontSize: '11px', cursor: 'pointer', fontWeight: 700, boxShadow: '0 2px 8px rgba(245,158,11,0.4)' }}>📄 PDF</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
