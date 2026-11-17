'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function ClientesPage() {
  const [clientes,  setClientes]  = useState<any[]>([])
  const [busqueda,  setBusqueda]  = useState('')
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState('')
  const [modal,     setModal]     = useState(false)
  const [editando,  setEditando]  = useState<any>(null)
  const [saving,    setSaving]    = useState(false)
  const [form,      setForm]      = useState({ nombre: '', apellido: '', empresa: '', nit_cedula: '', email: '', telefono: '', ciudad: '', direccion: '', notas: '' })
  const router = useRouter()

  const cargar = useCallback(async (q?: string) => {
    setLoading(true)
    setError('')
    try {
      const data = await api.getClientes(q)
      setClientes(data)
    } catch (e: any) {
      if (e.message?.includes('401')) router.push('/login')
      else setError('No se pudieron cargar los clientes.')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { cargar() }, [cargar])

  const colores = ['#06b6d4','#a855f7','#10b981','#f59e0b','#6366f1','#f97316','#ef4444','#8b5cf6']
  const colorPorId = (id: number) => colores[id % colores.length]

  function abrirNuevo() {
    setEditando(null)
    setForm({ nombre: '', apellido: '', empresa: '', nit_cedula: '', email: '', telefono: '', ciudad: '', direccion: '', notas: '' })
    setModal(true)
  }

  function abrirEditar(c: any) {
    setEditando(c)
    setForm({ nombre: c.nombre || '', apellido: c.apellido || '', empresa: c.empresa || '', nit_cedula: c.nit_cedula || '', email: c.email || '', telefono: c.telefono || '', ciudad: c.ciudad || '', direccion: c.direccion || '', notas: c.notas || '' })
    setModal(true)
  }

  async function guardar() {
    if (!form.nombre.trim()) { setError('El nombre es obligatorio.'); return }
    setSaving(true)
    setError('')
    try {
      if (editando) {
        await api.updateCliente(editando.id, form)
      } else {
        await api.createCliente(form)
      }
      setModal(false)
      await cargar(busqueda)
    } catch (e: any) {
      setError(e.message || 'Error al guardar cliente.')
    } finally {
      setSaving(false)
    }
  }

  const iStyle = { width: '100%', padding: '10px 13px', borderRadius: '9px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(99,102,241,0.25)', color: '#e2e8f0', fontSize: '13px', outline: 'none' }
  const lStyle: React.CSSProperties = { display: 'block', fontSize: '11px', fontWeight: 700, color: '#475569', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '5px' }

  const filtrados = clientes.filter(c =>
    c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.empresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>Módulo</div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#f1f5f9' }}>Clientes</h1>
          <p style={{ color: '#334155', fontSize: '13px', marginTop: '2px' }}>{loading ? 'Cargando...' : `${filtrados.length} clientes`}</p>
        </div>
        <button onClick={abrirNuevo} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '11px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', fontWeight: 700, fontSize: '13px', boxShadow: '0 4px 16px rgba(16,185,129,0.4)' }}>
          ＋ Nuevo Cliente
        </button>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '340px' }}>
        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#334155' }}>⌕</span>
        <input value={busqueda} onChange={e => { setBusqueda(e.target.value); cargar(e.target.value) }} placeholder="Buscar cliente..."
          style={{ width: '100%', padding: '11px 14px 11px 36px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0', fontSize: '13px', outline: 'none' }} />
      </div>

      {error && !modal && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '16px', fontSize: '13px' }}>⚠️ {error}</div>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
          {[1,2,3].map(i => <div key={i} style={{ borderRadius: '14px', height: '180px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.08)' }} />)}
        </div>
      ) : filtrados.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>👥</div>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>No hay clientes</p>
          <button onClick={abrirNuevo} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>＋ Crear primer cliente</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '12px' }}>
          {filtrados.map(c => {
            const color = colorPorId(c.id)
            return (
              <div key={c.id} style={{ borderRadius: '14px', padding: '20px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.12)', backdropFilter: 'blur(10px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🏢</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 800, color: '#f1f5f9', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.empresa || `${c.nombre} ${c.apellido || ''}`}</p>
                    <p style={{ color: '#475569', fontSize: '12px' }}>{c.nombre} {c.apellido}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '12px', color: '#475569', marginBottom: '14px' }}>
                  {c.email    && <span>✉ {c.email}</span>}
                  {c.telefono && <span>☎ {c.telefono}</span>}
                  {c.ciudad   && <span>◎ {c.ciudad}{c.nit_cedula ? ` · NIT: ${c.nit_cedula}` : ''}</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <button onClick={() => abrirEditar(c)} style={{ flex: 1, padding: '7px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '7px', background: 'transparent', fontSize: '12px', cursor: 'pointer', color: '#94a3b8', fontWeight: 600 }}>✏ Editar</button>
                  <button onClick={() => router.push(`/dashboard/ordenes?cliente=${c.id}`)} style={{ flex: 1, padding: '7px', border: 'none', borderRadius: '7px', background: color, color: 'white', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}>Órdenes</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f1f5f9' }}>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', color: '#475569', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            {error && <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', fontSize: '13px', marginBottom: '16px' }}>⚠️ {error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div><label style={lStyle}>Nombre *</label><input style={iStyle} value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} /></div>
              <div><label style={lStyle}>Apellido</label><input style={iStyle} value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lStyle}>Empresa</label><input style={iStyle} value={form.empresa} onChange={e => setForm({...form, empresa: e.target.value})} /></div>
              <div><label style={lStyle}>NIT / Cédula</label><input style={iStyle} value={form.nit_cedula} onChange={e => setForm({...form, nit_cedula: e.target.value})} /></div>
              <div><label style={lStyle}>Email</label><input style={iStyle} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label style={lStyle}>Teléfono</label><input style={iStyle} value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} /></div>
              <div><label style={lStyle}>Ciudad</label><input style={iStyle} value={form.ciudad} onChange={e => setForm({...form, ciudad: e.target.value})} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lStyle}>Dirección</label><input style={iStyle} value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} /></div>
              <div style={{ gridColumn: '1/-1' }}><label style={lStyle}>Notas</label><textarea rows={2} style={{ ...iStyle, resize: 'vertical' }} value={form.notas} onChange={e => setForm({...form, notas: e.target.value})} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setModal(false)} style={{ padding: '10px 20px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9px', background: 'transparent', color: '#475569', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
              <button onClick={guardar} disabled={saving} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #10b981, #06b6d4)', border: 'none', borderRadius: '9px', color: 'white', fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Guardando...' : editando ? 'Actualizar' : 'Crear Cliente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
