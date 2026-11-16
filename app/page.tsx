import Link from 'next/link'

const modules = [
  { icon: '📋', label: 'Órdenes de Servicio', desc: 'Gestión en campo' },
  { icon: '👥', label: 'Clientes',            desc: 'CRM integrado' },
  { icon: '💰', label: 'Cuentas de Cobro',    desc: 'Facturación PDF' },
  { icon: '🔔', label: 'Alertas 5 Meses',     desc: 'Trigger automático' },
  { icon: '📸', label: 'Evidencias',          desc: 'Fotos antes/después' },
  { icon: '✍️', label: 'Firmas Digitales',    desc: 'Canvas táctil' },
  { icon: '🎨', label: 'White-Label',         desc: 'Marca personalizada' },
  { icon: '🔒', label: 'RLS Supabase',        desc: 'Seguridad por rol' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', position: 'relative', overflow: 'hidden' }}>

      {/* Grid pattern */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      {/* Orbes de luz */}
      <div style={{ position: 'absolute', top: '-200px', left: '-200px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-200px', right: '-200px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '40px 20px', textAlign: 'center' }}>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.1)', marginBottom: '24px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', display: 'inline-block' }} />
          <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em' }}>SISTEMA ACTIVO · v1.0.0</span>
        </div>

        {/* Logo + Título */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '56px', marginBottom: '8px', filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.6))' }}>⚡</div>
          <h1 style={{
            fontSize: 'clamp(32px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '4px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 50%, #a855f7 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            TechService Pro
          </h1>
          <p style={{ fontSize: '16px', color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
            ERP · Seguridad Electrónica · Infraestructura
          </p>
        </div>

        <p style={{ maxWidth: '480px', color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px' }}>
          Plataforma inteligente para la gestión de órdenes de servicio técnico, clientes y facturación con arquitectura cloud-native.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '60px' }}>
          <Link href="/login" style={{
            padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', color: 'white',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            boxShadow: '0 6px 24px rgba(99,102,241,0.5)',
          }}>
            → Iniciar Sesión
          </Link>
          <Link href="/dashboard" style={{
            padding: '14px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '15px',
            color: '#94a3b8', border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)',
          }}>
            Ver Demo
          </Link>
        </div>

        {/* Grid de módulos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '10px', maxWidth: '720px', width: '100%' }}>
          {modules.map(m => (
            <div key={m.label} style={{
              padding: '16px 12px', borderRadius: '12px', textAlign: 'center',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.15)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '6px' }}>{m.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginBottom: '2px' }}>{m.label}</div>
              <div style={{ fontSize: '11px', color: '#475569' }}>{m.desc}</div>
            </div>
          ))}
        </div>

        {/* Footer tech */}
        <div style={{ marginTop: '48px', display: 'flex', gap: '24px', fontSize: '12px', color: '#334155' }}>
          <span>Supabase · Next.js 14 · TypeScript</span>
          <span>·</span>
          <span>Tailwind CSS · RLS Security</span>
        </div>
      </div>
    </div>
  )
}
