'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/dashboard',               label: 'Dashboard',        icon: '◈', color: '#6366f1' },
  { href: '/dashboard/ordenes',       label: 'Órdenes',          icon: '◧', color: '#06b6d4', badge: 24 },
  { href: '/dashboard/clientes',      label: 'Clientes',         icon: '◉', color: '#10b981' },
  { href: '/dashboard/cuentas',       label: 'Cuentas de Cobro', icon: '◈', color: '#f59e0b' },
  { href: '/dashboard/alertas',       label: 'Alertas',          icon: '◎', color: '#ef4444', badge: 3  },
  { href: '/dashboard/configuracion', label: 'Configuración',    icon: '◌', color: '#a855f7' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
      {navItems.map(item => {
        const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
        return (
          <Link key={item.href} href={item.href} onClick={onClick}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
              textDecoration: 'none', fontSize: '13.5px', fontWeight: active ? 700 : 400,
              color: active ? item.color : '#475569',
              background: active ? `${item.color}15` : 'transparent',
              border: active ? `1px solid ${item.color}25` : '1px solid transparent',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '17px', color: active ? item.color : '#334155', filter: active ? `drop-shadow(0 0 6px ${item.color})` : 'none', transition: 'filter 0.15s' }}>
              {item.icon}
            </span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge && (
              <span style={{ background: item.color, color: 'white', borderRadius: '9999px', fontSize: '10px', fontWeight: 800, padding: '1px 7px', boxShadow: `0 0 8px ${item.color}60` }}>
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )

  const SidebarContent = ({ onClick }: { onClick?: () => void }) => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0, boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
            ⚡
          </div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 800, fontSize: '14px', letterSpacing: '-0.01em' }}>TechService</div>
            <div style={{ color: '#334155', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Pro ERP v1.0</div>
          </div>
        </div>
        {/* Status line */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 10px', borderRadius: '6px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700, letterSpacing: '0.06em' }}>SUPABASE CONECTADO</span>
        </div>
      </div>

      {/* Nav items */}
      <NavLinks onClick={onClick} />

      {/* Usuario */}
      <div style={{ padding: '12px', borderTop: '1px solid rgba(99,102,241,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800, flexShrink: 0 }}>SA</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#e2e8f0', fontSize: '12px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Super Admin</div>
            <div style={{ color: '#334155', fontSize: '10px' }}>superadmin@demo.com</div>
          </div>
        </div>
        <Link href="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '8px', padding: '8px', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.2)', color: '#475569', fontSize: '11px', fontWeight: 600, textDecoration: 'none', background: 'rgba(239,68,68,0.04)', letterSpacing: '0.04em' }}>
          ⏻ Cerrar sesión
        </Link>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0f1e' }}>
      {/* Grid bg global */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar desktop */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: '232px', zIndex: 40,
        background: 'rgba(10,15,30,0.95)', backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99,102,241,0.15)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column',
      }} className="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Overlay móvil */}
      {open && <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 45, backdropFilter: 'blur(4px)' }} />}

      {/* Sidebar móvil drawer */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: '232px', zIndex: 50,
        background: 'rgba(10,15,30,0.98)', backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(99,102,241,0.2)',
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
      }} className="sidebar-mobile">
        <SidebarContent onClick={() => setOpen(false)} />
      </aside>

      {/* Contenido principal */}
      <main style={{ flex: 1, zIndex: 1, minWidth: 0, overflowY: 'auto', minHeight: '100vh' }} className="main-area">
        {/* Top bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 30,
          padding: '0 24px', height: '58px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Hamburguesa (solo móvil) */}
            <button onClick={() => setOpen(true)} className="hamburger-btn-top"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', fontSize: '20px', lineHeight: 1, padding: '4px', display: 'none' }}>
              ☰
            </button>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155' }}>
              <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '14px' }}>⚡</span>
              <span>/</span>
              <span style={{ color: '#94a3b8' }}>{navItems.find(n => n.href === pathname || (n.href !== '/dashboard' && pathname.startsWith(n.href)))?.label ?? 'Dashboard'}</span>
            </div>
          </div>
          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>EN LÍNEA</span>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>SA</div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '28px 24px' }}>
          {children}
        </div>
      </main>

      {/* FAB hamburguesa flotante móvil */}
      <button onClick={() => setOpen(true)} className="fab-menu"
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 50, width: '52px', height: '52px', borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', fontSize: '20px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(99,102,241,0.5)', display: 'none' }}>
        ☰
      </button>

      <style>{`
        @media (min-width: 1025px) {
          .sidebar-desktop { display: flex !important; }
          .sidebar-mobile  { display: none !important; }
          .main-area        { margin-left: 232px; }
          .fab-menu         { display: none !important; }
          .hamburger-btn-top { display: none !important; }
        }
        @media (max-width: 1024px) {
          .sidebar-desktop { display: none !important; }
          .sidebar-mobile  { display: flex !important; }
          .main-area        { margin-left: 0 !important; }
          .fab-menu         { display: flex !important; align-items: center; justify-content: center; }
          .hamburger-btn-top { display: block !important; }
        }
      `}</style>
    </div>
  )
}
