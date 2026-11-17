'use client'
import { useState, useEffect } from 'react'
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

export default function DashboardPage() {
  const [stats,   setStats]   = useState<any>(null)
  const [ordenes, setOrdenes] = useState<any[]>([])
  const [nombre,  setNombre]  = useState('TechService Pro')
  const router = useRouter()

  useEffect(() => {
    const n = localStorage.getItem('user_nombre')
    if (n) setNombre(n)

    api.getStats().catch(() => {})
      .then(d => d && setStats(d))

    api.getOrdenes({ estado: undefined }).then(d => setOrdenes(d.slice(0,5))).catch(() => {})
  }, [])

  const accesos = [
    { href: '/dashboard/ordenes/nueva', label: 'Nueva Orden',      icon: '＋', color: '#06b6d4' },
    { href: '/dashboard/clientes',      label: 'Nuevo Cliente',    icon: '＋', color: '#10b981' },
    { href: '/dashboard/cuentas/nueva', label: 'Nueva Cuenta',     icon: '＋', color: '#f59e0b' },
    { href: '/dashboard/configuracion', label: 'Configurar Marca', icon: '⚙', color: '#a855f7' },
  ]

  const kpis = [
    { label: 'Órdenes Activas',    value: stats?.ordenes_activas ?? '—', color: '#06b6d4', icon: '◧' },
    { label: 'Clientes',           value: stats?.clientes        ?? '—', color: '#10b981', icon: '◉' },
    { label: 'Cuentas Pendientes', value: stats?.cuentas_pendientes ?? '—', color: '#f59e0b', icon: '◈' },
    { label: 'Alertas',            value: stats?.alertas         ?? '—', color: '#ef4444', icon: '◎' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Panel de Control</div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#f1f5f9' }}>
            Bienvenido,{' '}
            <span style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {nombre}
            </span>
          </h1>
        </div>
        <Link href="/dashboard/ordenes/nueva" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }}>
          <span>＋</span> Nueva Orden
        </Link>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {kpis.map(s => (
          <div key={s.label} style={{ padding: '20px', borderRadius: '14px', background: `${s.color}08`, border: `1px solid ${s.color}20`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${s.color}30, transparent 70%)` }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', color: s.color }}>{s.icon}</span>
              <span style={{ fontSize: '10px', color: s.color, fontWeight: 700, padding: '2px 8px', borderRadius: '9999px', background: `${s.color}18`, border: `1px solid ${s.color}30` }}>LIVE</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#f1f5f9', lineHeight: 1, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }} className="dashboard-grid">
        {/* Órdenes recientes */}
        <div style={{ borderRadius: '16px', background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block', boxShadow: '0 0 8px #06b6d4' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Órdenes Recientes</span>
            </div>
            <Link href="/dashboard/ordenes" style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          {ordenes.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>No hay órdenes aún</div>
          ) : ordenes.map((o, i) => {
            const est = estadoCfg[o.estado] ?? estadoCfg.pendiente
            const cc  = catColor[o.categoria] ?? '#6366f1'
            return (
              <div key={o.id} onClick={() => router.push(`/dashboard/ordenes/${o.id}`)} style={{ padding: '14px 22px', borderBottom: i < ordenes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${cc}18`, border: `1px solid ${cc}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '15px', color: cc }}>◧</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#6366f1' }}>{o.numero_orden}</span>
                    <span style={{ fontSize: '10px', color: cc, background: `${cc}18`, padding: '1px 7px', borderRadius: '4px', fontWeight: 700 }}>{catLabel[o.categoria] ?? o.categoria}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.cliente_empresa || o.cliente_nombre}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '6px', background: est.bg, marginBottom: '4px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: est.color, display: 'inline-block', marginRight: '5px' }} />
                    <span style={{ fontSize: '11px', color: est.color, fontWeight: 700 }}>{est.label}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Panel derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '220px' }} className="right-panel">
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accesos Rápidos</span>
            </div>
            <div style={{ padding: '10px' }}>
              {accesos.map(a => (
                <Link key={a.href} href={a.href} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', textDecoration: 'none', marginBottom: '4px', fontSize: '13px', fontWeight: 600, color: a.color, background: `${a.color}08`, border: `1px solid ${a.color}20` }}>
                  <span style={{ fontSize: '16px', fontWeight: 900 }}>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.15)', padding: '16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Sistema</div>
            {[
              { label: 'Next.js',  value: '16.2',    color: '#6366f1' },
              { label: 'FastAPI',  value: 'v0.100',  color: '#10b981' },
              { label: 'SQLite',   value: 'v3',      color: '#06b6d4' },
              { label: 'Cloudflare', value: 'Tunnel', color: '#f59e0b' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#475569' }}>{r.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: r.color, fontFamily: 'monospace', background: `${r.color}12`, padding: '1px 8px', borderRadius: '5px' }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .right-panel { width: 100% !important; display: grid !important; grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .right-panel { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
