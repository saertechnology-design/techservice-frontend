'use client'
import Link from 'next/link'

const stats = [
  { label: 'Órdenes Activas',      value: '24',  sub: '+3 hoy',   icon: '◧', color: '#06b6d4', glow: 'rgba(6,182,212,0.3)',   bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.2)'   },
  { label: 'Clientes',             value: '87',  sub: '+2 esta semana', icon: '◉', color: '#10b981', glow: 'rgba(16,185,129,0.3)',  bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)'  },
  { label: 'Cuentas Pendientes',   value: '5',   sub: '$14.1M COP', icon: '◈', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)'  },
  { label: 'Alertas Preventivas',  value: '3',   sub: 'Próx 30 días', icon: '◎', color: '#ef4444', glow: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.2)'   },
]

const ordenes = [
  { id: 'OS-2024-0024', cliente: 'Vigilancia Segura Ltda', categoria: 'Cámaras',      estado: 'en_proceso', tecnico: 'C. Mejía',    fecha: '28 Dic' },
  { id: 'OS-2024-0023', cliente: 'Banco del Progreso',     categoria: 'Alarma',        estado: 'pendiente',  tecnico: 'L. Rodríguez',fecha: '29 Dic' },
  { id: 'OS-2024-0022', cliente: 'Clínica Santa María',    categoria: 'Instalaciones', estado: 'finalizada', tecnico: 'C. Mejía',    fecha: '26 Dic' },
  { id: 'OS-2024-0021', cliente: 'C.C. Plaza',             categoria: 'Redes',         estado: 'finalizada', tecnico: 'A. Torres',   fecha: '25 Dic' },
  { id: 'OS-2024-0020', cliente: 'LogiTrans',              categoria: 'Informática',   estado: 'cancelada',  tecnico: 'L. Rodríguez',fecha: '24 Dic' },
]

const estadoCfg: Record<string, { color: string; bg: string; label: string; dot: string }> = {
  pendiente:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  label: 'Pendiente',  dot: '#f59e0b' },
  en_proceso: { color: '#06b6d4', bg: 'rgba(6,182,212,0.12)',   label: 'En Proceso', dot: '#06b6d4' },
  finalizada: { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  label: 'Finalizada', dot: '#10b981' },
  cancelada:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   label: 'Cancelada',  dot: '#ef4444' },
}

const categoriaCfg: Record<string, string> = {
  'Cámaras': '#06b6d4', 'Alarma': '#a855f7', 'Instalaciones': '#10b981',
  'Redes': '#f59e0b', 'Informática': '#6366f1', 'Mampostería': '#f97316',
}

const accesos = [
  { href: '/dashboard/ordenes/nueva', label: 'Nueva Orden',      icon: '＋', color: '#06b6d4' },
  { href: '/dashboard/clientes',      label: 'Nuevo Cliente',    icon: '＋', color: '#10b981' },
  { href: '/dashboard/cuentas/nueva', label: 'Nueva Cuenta',     icon: '＋', color: '#f59e0b' },
  { href: '/dashboard/configuracion', label: 'Configurar Marca', icon: '⚙', color: '#a855f7' },
]

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            Panel de Control
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            Bienvenido,{' '}
            <span style={{ background: 'linear-gradient(90deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Super Admin
            </span>
          </h1>
          <p style={{ color: '#334155', fontSize: '13px', marginTop: '2px' }}>Viernes 27 Dic · Sistema operando normalmente</p>
        </div>
        <Link href="/dashboard/ordenes/nueva" style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', textDecoration: 'none',
          background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', fontWeight: 700, fontSize: '13px',
          boxShadow: '0 4px 16px rgba(99,102,241,0.4)', letterSpacing: '0.02em',
        }}>
          <span style={{ fontSize: '16px' }}>＋</span> Nueva Orden
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {stats.map(s => (
          <div key={s.label} style={{ padding: '20px', borderRadius: '14px', background: s.bg, border: `1px solid ${s.border}`, position: 'relative', overflow: 'hidden' }}>
            {/* Glow circle */}
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${s.glow}, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', color: s.color, filter: `drop-shadow(0 0 8px ${s.color})` }}>{s.icon}</span>
              <span style={{ fontSize: '10px', color: s.color, fontWeight: 700, letterSpacing: '0.06em', background: `${s.glow}`, padding: '2px 8px', borderRadius: '9999px', border: `1px solid ${s.border}` }}>LIVE</span>
            </div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#f1f5f9', lineHeight: 1, marginBottom: '4px', fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{s.label}</div>
            <div style={{ fontSize: '11px', color: s.color, fontWeight: 600, marginTop: '4px' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Layout 2 columnas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }} className="dashboard-grid">

        {/* Órdenes recientes */}
        <div style={{ borderRadius: '16px', background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '18px 22px', borderBottom: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#06b6d4', display: 'inline-block', boxShadow: '0 0 8px #06b6d4' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Órdenes Recientes</span>
            </div>
            <Link href="/dashboard/ordenes" style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Ver todas <span>→</span>
            </Link>
          </div>
          <div>
            {ordenes.map((o, i) => {
              const est = estadoCfg[o.estado]
              const catColor = categoriaCfg[o.categoria] ?? '#6366f1'
              return (
                <div key={o.id} style={{ padding: '14px 22px', borderBottom: i < ordenes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: '14px', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  {/* Indicador de categoría */}
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${catColor}18`, border: `1px solid ${catColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '15px', color: catColor }}>◧</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#6366f1' }}>{o.id}</span>
                      <span style={{ fontSize: '10px', color: catColor, background: `${catColor}18`, padding: '1px 7px', borderRadius: '4px', fontWeight: 700 }}>{o.categoria}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.cliente}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '6px', background: est.bg, marginBottom: '4px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: est.dot, display: 'inline-block', marginRight: '5px', boxShadow: `0 0 4px ${est.dot}` }} />
                      <span style={{ fontSize: '11px', color: est.color, fontWeight: 700 }}>{est.label}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#334155' }}>{o.fecha}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Panel derecho */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '220px' }} className="right-panel">
          {/* Accesos rápidos */}
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Accesos Rápidos</span>
            </div>
            <div style={{ padding: '10px' }}>
              {accesos.map(a => (
                <Link key={a.href} href={a.href} style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 10px', borderRadius: '8px',
                  textDecoration: 'none', marginBottom: '4px', fontSize: '13px', fontWeight: 600,
                  color: a.color, background: `${a.color}08`, border: `1px solid ${a.color}20`,
                  transition: 'all 0.15s',
                }}>
                  <span style={{ fontSize: '16px', fontWeight: 900 }}>{a.icon}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sistema info */}
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.8)', border: '1px solid rgba(99,102,241,0.15)', padding: '16px', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Sistema</div>
            {[
              { label: 'Next.js',   value: '16.2',  color: '#6366f1' },
              { label: 'Supabase', value: 'v2',     color: '#10b981' },
              { label: 'DB Tables',value: '9',      color: '#06b6d4' },
              { label: 'RLS Rules', value: '24',    color: '#a855f7' },
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
