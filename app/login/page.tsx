'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

const DEMO_USERS = [
  { email: 'admin@techservice.com', password: 'admin1234', rol: 'Super Admin',   icon: '👑', color: '#a855f7', glow: 'rgba(168,85,247,0.4)' },
  { email: 'admin@demo.com',        password: 'demo1234',  rol: 'Administrador', icon: '🛠', color: '#6366f1', glow: 'rgba(99,102,241,0.4)'  },
  { email: 'tecnico@demo.com',      password: 'demo1234',  rol: 'Técnico',       icon: '🔧', color: '#06b6d4', glow: 'rgba(6,182,212,0.4)'   },
]

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  async function doLogin(emailVal: string, passVal: string) {
    setLoading(true)
    setError('')
    try {
      const data = await api.login(emailVal, passVal)
      if (data.access_token) {
        localStorage.setItem('token',        data.access_token)
        localStorage.setItem('user_rol',     data.rol)
        localStorage.setItem('user_nombre',  data.nombre)
        localStorage.setItem('user_id',      String(data.user_id))
        router.push('/dashboard')
      } else {
        setError(data.detail || 'Credenciales incorrectas.')
        setLoading(false)
      }
    } catch {
      setError('No se pudo conectar con el servidor. Verifica que el backend esté activo.')
      setLoading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    doLogin(email, password)
  }

  function loginRapido(user: typeof DEMO_USERS[0]) {
    doLogin(user.email, user.password)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Grid bg */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', top: '-150px', right: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-150px', left: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Panel izquierdo — solo desktop */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', zIndex: 1 }} className="left-panel">
        <div style={{ fontSize: '48px', marginBottom: '16px', filter: 'drop-shadow(0 0 16px rgba(99,102,241,0.7))' }}>⚡</div>
        <h1 style={{ fontSize: '42px', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          TechService<br/>Pro ERP
        </h1>
        <p style={{ color: '#64748b', fontSize: '15px', lineHeight: 1.7, maxWidth: '340px', marginBottom: '32px' }}>
          Plataforma cloud-native para gestión de servicios técnicos en seguridad electrónica.
        </p>
        {[
          { icon: '🔒', text: 'Seguridad con roles y JWT' },
          { icon: '📋', text: 'Órdenes de servicio en tiempo real' },
          { icon: '📄', text: 'PDF corporativo con marca blanca' },
          { icon: '📱', text: 'Optimizado para campo y móvil' },
        ].map(f => (
          <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', flexShrink: 0 }}>
              {f.icon}
            </div>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Panel derecho — Formulario */}
      <div style={{ width: '100%', maxWidth: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', borderRadius: '20px', padding: '36px', background: 'rgba(15,22,41,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(99,102,241,0.25)', boxShadow: '0 0 60px rgba(99,102,241,0.12)' }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '9999px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '16px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, letterSpacing: '0.06em' }}>SISTEMA EN LÍNEA</span>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>Iniciar Sesión</h2>
            <p style={{ color: '#475569', fontSize: '14px' }}>Accede a tu panel de control</p>
          </div>

          {/* Accesos rápidos */}
          <div style={{ marginBottom: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '10px' }}>
              Acceso rápido (demo)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DEMO_USERS.map(u => (
                <button key={u.email} onClick={() => loginRapido(u)} disabled={loading} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '10px',
                  cursor: loading ? 'wait' : 'pointer', background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${u.color}30`, textAlign: 'left', width: '100%',
                }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: `${u.color}20`, border: `1px solid ${u.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', flexShrink: 0 }}>
                    {u.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: u.color }}>{u.rol}</div>
                    <div style={{ fontSize: '11px', color: '#475569', fontFamily: 'monospace' }}>{u.email}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={u.color} strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: '11px', color: '#334155', fontWeight: 600 }}>O INGRESA MANUALMENTE</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>Correo electrónico</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder="admin@techservice.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#e2e8f0', background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? '#ef4444' : 'rgba(99,102,241,0.25)'}` }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '7px' }}>Contraseña</label>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', fontSize: '14px', outline: 'none', color: '#e2e8f0', background: 'rgba(255,255,255,0.04)', border: `1px solid ${error ? '#ef4444' : 'rgba(99,102,241,0.25)'}` }} />
            </div>
            {error && (
              <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px' }}>
                ⚠️ {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', borderRadius: '10px', border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              background: loading ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
              color: 'white', fontWeight: 700, fontSize: '14px',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.4)',
            }}>
              {loading ? '◌  Autenticando...' : '→  Acceder al sistema'}
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <span style={{ fontSize: '12px', color: '#475569' }}>Contraseña demo: </span>
            <code style={{ fontSize: '12px', color: '#6366f1', fontWeight: 700 }}>admin1234</code>
            <span style={{ fontSize: '12px', color: '#475569' }}> · Super Admin: </span>
            <code style={{ fontSize: '11px', color: '#a855f7' }}>admin@techservice.com</code>
          </div>

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <Link href="/" style={{ color: '#334155', fontSize: '12px', textDecoration: 'none' }}>← Volver al inicio</Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .left-panel { display: none !important; } }
        @media (min-width: 769px) { .left-panel { display: flex !important; } }
      `}</style>
    </div>
  )
}
