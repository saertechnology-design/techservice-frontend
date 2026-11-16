'use client'
import { useState } from 'react'

export default function ConfiguracionPage() {
  const [colorP, setColorP] = useState('#6366f1')
  const [colorS, setColorS] = useState('#06b6d4')
  const [nombre, setNombre] = useState('TechService Pro')
  const [saved,  setSaved]  = useState(false)

  const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }
  const labelStyle = { display: 'block' as const, fontSize: '11px', fontWeight: 700 as const, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '7px' }

  function handleSave() {
    document.documentElement.style.setProperty('--color-primario', colorP)
    document.documentElement.style.setProperty('--color-secundario', colorS)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Panel</div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Configuración de Marca</h1>
        <p style={{ color: '#334155', fontSize: '13px', marginTop: '2px' }}>White-label · Personaliza la identidad visual y datos fiscales</p>
      </div>

      {saved && (
        <div style={{ padding: '12px 18px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', color: '#10b981', fontSize: '13px', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ filter: 'drop-shadow(0 0 6px #10b981)' }}>✓</span> Configuración guardada · CSS variables aplicadas en toda la plataforma
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Identidad Visual */}
        <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#a855f7', filter: 'drop-shadow(0 0 6px #a855f7)' }}>🎨</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Identidad Visual</span>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Nombre de la Plataforma</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Logo Corporativo</label>
              <div style={{ border: '2px dashed rgba(99,102,241,0.3)', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(99,102,241,0.05)' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>📁</div>
                <div style={{ fontSize: '11px', color: '#334155' }}>PNG o SVG · Máx 2MB</div>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Color Primario</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="color" value={colorP} onChange={e => setColorP(e.target.value)}
                  style={{ width: '52px', height: '44px', borderRadius: '10px', border: `1px solid ${colorP}50`, cursor: 'pointer', padding: '3px', background: 'rgba(255,255,255,0.04)' }} />
                <input value={colorP} onChange={e => setColorP(e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.05em' }} />
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: colorP, flexShrink: 0, boxShadow: `0 0 14px ${colorP}60` }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Color Secundario</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input type="color" value={colorS} onChange={e => setColorS(e.target.value)}
                  style={{ width: '52px', height: '44px', borderRadius: '10px', border: `1px solid ${colorS}50`, cursor: 'pointer', padding: '3px', background: 'rgba(255,255,255,0.04)' }} />
                <input value={colorS} onChange={e => setColorS(e.target.value)} style={{ ...inputStyle, fontFamily: 'monospace', letterSpacing: '0.05em' }} />
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: colorS, flexShrink: 0, boxShadow: `0 0 14px ${colorS}60` }} />
              </div>
            </div>
          </div>
          {/* Live Preview */}
          <div style={{ margin: '0 20px 20px', padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '10px', color: '#334155', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>Preview en tiempo real</div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button style={{ padding: '9px 20px', background: `linear-gradient(135deg, ${colorP}, ${colorS})`, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '13px', cursor: 'default', boxShadow: `0 4px 14px ${colorP}50` }}>Botón Primario</button>
              <div style={{ padding: '5px 14px', background: `${colorP}18`, color: colorP, borderRadius: '7px', fontSize: '12px', fontWeight: 700, border: `1px solid ${colorP}30` }}>Badge activo</div>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colorS, boxShadow: `0 0 10px ${colorS}` }} />
              <span style={{ background: `linear-gradient(90deg, ${colorP}, ${colorS})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontWeight: 900, fontSize: '18px' }}>{nombre}</span>
            </div>
          </div>
        </div>

        {/* Datos Fiscales */}
        <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#06b6d4', filter: 'drop-shadow(0 0 6px #06b6d4)' }}>🏢</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Datos Fiscales</span>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            {[
              { label: 'NIT',         placeholder: '900.123.456-7',                        defaultValue: '900.123.456-7' },
              { label: 'Teléfono',    placeholder: '(601) 555 0100',                        defaultValue: '(601) 555 0100' },
            ].map(f => (
              <div key={f.label}>
                <label style={labelStyle}>{f.label}</label>
                <input style={inputStyle} defaultValue={f.defaultValue} placeholder={f.placeholder} />
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Dirección General</label>
              <input style={inputStyle} defaultValue="Cra 7 #32-16, Bogotá D.C., Colombia" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Texto Legal / Cláusula</label>
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} defaultValue="Los servicios prestados están sujetos a los términos y condiciones. Garantía de 6 meses en instalaciones." />
            </div>
          </div>
        </div>

        {/* Formato PDF */}
        <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 6px #f59e0b)' }}>📄</span>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0' }}>Formato PDF</span>
          </div>
          <div style={{ padding: '20px', display: 'grid', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Campos visibles en el reporte</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Cliente', 'Técnico', 'Categoría', 'Descripción', 'Materiales', 'Firma Técnico', 'Firma Cliente', 'Fotos'].map(campo => (
                  <label key={campo} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#94a3b8', fontWeight: 600, background: 'rgba(99,102,241,0.05)' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: colorP }} />
                    {campo}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Membrete PDF</label>
              <input style={inputStyle} defaultValue="Servicios de Seguridad Electrónica e Infraestructura" />
            </div>
            <div>
              <label style={labelStyle}>Pie de Página PDF</label>
              <input style={inputStyle} defaultValue="TechService Pro · NIT 900.123.456-7 · info@techservice.com" />
            </div>
          </div>
        </div>

        {/* Guardar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <button onClick={handleSave} style={{ padding: '13px 36px', background: `linear-gradient(135deg, ${colorP}, ${colorS})`, color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', boxShadow: `0 6px 24px ${colorP}50`, letterSpacing: '0.03em' }}>
            ✦ Guardar Configuración
          </button>
        </div>
      </div>
    </div>
  )
}
