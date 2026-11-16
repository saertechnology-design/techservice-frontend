'use client'
import { useState } from 'react'

const clientes = [
  { id: 1, nombre: 'Vigilancia Segura Ltda',  contacto: 'Juan Pérez',     email: 'juan@vigilancia.com', tel: '310 555 0001', ciudad: 'Bogotá',       ordenes: 8,  nit: '900.123.456-1', color: '#06b6d4' },
  { id: 2, nombre: 'Banco del Progreso',       contacto: 'María López',    email: 'mlopez@bancop.com',   tel: '311 555 0002', ciudad: 'Medellín',     ordenes: 5,  nit: '800.987.654-2', color: '#a855f7' },
  { id: 3, nombre: 'Clínica Santa María',      contacto: 'Dr. Andrés Gil', email: 'agil@clinica.com',    tel: '312 555 0003', ciudad: 'Cali',         ordenes: 12, nit: '900.456.789-3', color: '#10b981' },
  { id: 4, nombre: 'Centro Comercial Plaza',   contacto: 'Rosa Martínez',  email: 'rosa@ccplaza.com',    tel: '313 555 0004', ciudad: 'Bogotá',       ordenes: 3,  nit: '700.321.654-4', color: '#f59e0b' },
  { id: 5, nombre: 'Empresa LogiTrans',        contacto: 'Pedro Suárez',   email: 'pedro@logitrans.com', tel: '314 555 0005', ciudad: 'Barranquilla', ordenes: 2,  nit: '900.111.222-5', color: '#6366f1' },
  { id: 6, nombre: 'Hotel Dann Carlton',       contacto: 'Lucía Herrera',  email: 'lucia@dann.com',      tel: '315 555 0006', ciudad: 'Bogotá',       ordenes: 7,  nit: '800.555.333-6', color: '#f97316' },
]

export default function ClientesPage() {
  const [busqueda, setBusqueda] = useState('')
  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.contacto.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em' }}>Clientes</h1>
          <p style={{ color: '#334155', fontSize: '13px', marginTop: '2px' }}>{filtrados.length} clientes en el sistema</p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}>
          ＋ Nuevo Cliente
        </button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '340px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155', fontSize: '15px' }}>⌕</span>
        <input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar cliente..."
          style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0', fontSize: '13px', outline: 'none' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
        {filtrados.map(c => (
          <div key={c.id} style={{
            borderRadius: '14px', padding: '20px', cursor: 'pointer',
            background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.12)',
            backdropFilter: 'blur(10px)', transition: 'all 0.15s', position: 'relative', overflow: 'hidden',
          }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.border = `1px solid ${c.color}40`; el.style.boxShadow = `0 4px 20px ${c.color}18` }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.border = '1px solid rgba(99,102,241,0.12)'; el.style.boxShadow = 'none' }}
          >
            {/* Top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${c.color}, transparent)` }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${c.color}18`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏢</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.nombre}</p>
                <p style={{ color: '#475569', fontSize: '12px' }}>{c.contacto}</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#475569', marginBottom: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: c.color }}>✉</span> {c.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: c.color }}>☎</span> {c.tel}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ color: c.color }}>◎</span> {c.ciudad} · NIT: {c.nit}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ background: `${c.color}18`, color: c.color, padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: `1px solid ${c.color}30` }}>
                {c.ordenes} órdenes
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ padding: '6px 12px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', background: 'transparent', fontSize: '11px', cursor: 'pointer', color: '#475569', fontWeight: 600 }}>Editar</button>
                <button style={{ padding: '6px 12px', border: 'none', borderRadius: '7px', background: `${c.color}`, color: 'white', fontSize: '11px', cursor: 'pointer', fontWeight: 700, boxShadow: `0 2px 8px ${c.color}40` }}>Historial</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
