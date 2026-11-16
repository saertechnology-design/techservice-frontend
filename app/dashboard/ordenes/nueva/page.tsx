'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

const categorias = [
  { key: 'alarma',        label: 'Alarma',       icon: '🚨', color: '#a855f7' },
  { key: 'camaras',       label: 'Cámaras',      icon: '📷', color: '#06b6d4' },
  { key: 'redes',         label: 'Redes',         icon: '🌐', color: '#f59e0b' },
  { key: 'mamposteria',   label: 'Mampostería',   icon: '🧱', color: '#f97316' },
  { key: 'instalaciones', label: 'Instalaciones', icon: '⚡', color: '#10b981' },
  { key: 'informatica',   label: 'Informática',   icon: '💻', color: '#6366f1' },
]

interface Material { desc: string; ref: string; qty: string; valor: string }

export default function NuevaOrdenPage() {
  const router = useRouter()
  const [clientes,     setClientes]     = useState<any[]>([])
  const [tecnicos,     setTecnicos]     = useState<any[]>([])
  const [categoria,    setCategoria]    = useState('')
  const [clienteId,    setClienteId]    = useState('')
  const [tecnicoId,    setTecnicoId]    = useState('')
  const [fecha,        setFecha]        = useState('')
  const [direccion,    setDireccion]    = useState('')
  const [descripcion,  setDescripcion]  = useState('')
  const [materiales,   setMateriales]   = useState<Material[]>([{ desc: '', ref: '', qty: '1', valor: '' }])
  const [guardando,    setGuardando]    = useState(false)
  const [errorMsg,     setErrorMsg]     = useState('')

  useEffect(() => {
    api.getClientes().then(setClientes).catch(() => {})
    api.getUsuarios().then(all => setTecnicos(all.filter((u: any) => u.rol === 'tecnico'))).catch(() => {})
  }, [])

  const addMat = () => setMateriales(m => [...m, { desc: '', ref: '', qty: '1', valor: '' }])
  const delMat = (i: number) => setMateriales(m => m.filter((_, idx) => idx !== i))
  const setMat = (i: number, field: keyof Material, val: string) =>
    setMateriales(m => { const n = [...m]; n[i] = { ...n[i], [field]: val }; return n })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    if (!clienteId)         return setErrorMsg('Selecciona un cliente')
    if (!categoria)         return setErrorMsg('Selecciona una categoría de servicio')
    if (!descripcion.trim())return setErrorMsg('Escribe la descripción del servicio')

    const payload = {
      cliente_id:        parseInt(clienteId),
      tecnico_id:        tecnicoId ? parseInt(tecnicoId) : null,
      categoria,
      descripcion,
      direccion_trabajo: direccion,
      fecha_programada:  fecha || null,
      materiales:        categoria === 'instalaciones'
        ? materiales
            .filter(m => m.desc.trim())
            .map(m => ({
              descripcion:    m.desc,
              referencia:     m.ref,
              cantidad:       parseFloat(m.qty)   || 1,
              unidad:         'unidad',
              valor_unitario: parseFloat(m.valor)  || 0,
            }))
        : [],
    }

    setGuardando(true)
    try {
      const result = await api.createOrden(payload)
      router.push(`/dashboard/ordenes/${result.id}`)
    } catch (e: any) {
      setErrorMsg(e.message || 'Error al guardar la orden. Verifica el servidor.')
      setGuardando(false)
    }
  }

  const iStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(99,102,241,0.2)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }
  const lStyle = { display: 'block' as const, fontSize: '11px', fontWeight: 700 as const, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: '7px' }
  const catActiva = categorias.find(c => c.key === categoria)

  return (
    <div style={{ maxWidth: '820px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <Link href="/dashboard/ordenes" style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.2)', color: '#475569', textDecoration: 'none', fontSize: '16px', background: 'rgba(255,255,255,0.03)' }}>←</Link>
        <div>
          <div style={{ fontSize: '11px', color: '#334155', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Crear Registro</div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#f1f5f9' }}>Nueva Orden de Servicio</h1>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', marginBottom: '16px', fontSize: '13px' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Info General */}
        <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(99,102,241,0.15)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#06b6d4' }}>◧</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Información General</span>
          </div>
          <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div>
              <label style={lStyle}>Cliente *</label>
              <select value={clienteId} onChange={e => setClienteId(e.target.value)} style={iStyle} required>
                <option value="">Seleccionar cliente...</option>
                {clientes.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.empresa || c.nombre}</option>
                ))}
              </select>
              {clientes.length === 0 && (
                <p style={{ fontSize: '11px', color: '#f59e0b', marginTop: '5px' }}>
                  Sin clientes. <Link href="/dashboard/clientes" style={{ color: '#06b6d4' }}>Crea uno →</Link>
                </p>
              )}
            </div>
            <div>
              <label style={lStyle}>Técnico Asignado</label>
              <select value={tecnicoId} onChange={e => setTecnicoId(e.target.value)} style={iStyle}>
                <option value="">Sin asignar</option>
                {tecnicos.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.nombre} {t.apellido ?? ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={lStyle}>Fecha Programada</label>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={iStyle} />
            </div>
            <div>
              <label style={lStyle}>Dirección del Trabajo</label>
              <input type="text" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Cra 15 #80-25, Bogotá" style={iStyle} />
            </div>
          </div>
        </div>

        {/* Categoría */}
        <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: `1px solid ${catActiva ? catActiva.color + '40' : 'rgba(99,102,241,0.15)'}`, overflow: 'hidden', backdropFilter: 'blur(10px)', transition: 'border-color 0.2s' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#a855f7' }}>◈</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Categoría del Servicio *</span>
          </div>
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '8px', marginBottom: '18px' }}>
              {categorias.map(c => (
                <button key={c.key} type="button" onClick={() => setCategoria(c.key)} style={{
                  padding: '14px 10px', borderRadius: '10px', cursor: 'pointer', textAlign: 'center' as const,
                  border: `1px solid ${categoria === c.key ? c.color : 'rgba(255,255,255,0.08)'}`,
                  background: categoria === c.key ? `${c.color}15` : 'rgba(255,255,255,0.03)',
                  color: categoria === c.key ? c.color : '#475569',
                  fontWeight: 700, fontSize: '12px',
                  boxShadow: categoria === c.key ? `0 0 12px ${c.color}30` : 'none',
                  transition: 'all 0.15s',
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{c.icon}</div>
                  {c.label}
                </button>
              ))}
            </div>
            <div>
              <label style={lStyle}>Descripción del Servicio *</label>
              <textarea rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)}
                placeholder="Descripción detallada del trabajo a realizar..."
                style={{ ...iStyle, resize: 'vertical' as const }} required />
            </div>
          </div>
        </div>

        {/* Materiales — solo instalaciones */}
        {categoria === 'instalaciones' && (
          <div style={{ borderRadius: '14px', background: 'rgba(15,22,41,0.85)', border: '1px solid rgba(16,185,129,0.3)', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10b981' }}>📦</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#e2e8f0' }}>Materiales Utilizados</span>
              <span style={{ marginLeft: 'auto', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '2px 10px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)' }}>INSTALACIONES</span>
            </div>
            <div style={{ padding: '20px' }}>
              {materiales.map((m, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 130px 40px', gap: '8px', alignItems: 'end', marginBottom: '8px' }}>
                  <div>
                    {i === 0 && <label style={{ ...lStyle, fontSize: '10px' }}>DESCRIPCIÓN</label>}
                    <input style={iStyle} value={m.desc} placeholder="Cable UTP Cat6..." onChange={e => setMat(i, 'desc', e.target.value)} />
                  </div>
                  <div>
                    {i === 0 && <label style={{ ...lStyle, fontSize: '10px' }}>REF.</label>}
                    <input style={iStyle} value={m.ref} placeholder="REF-001" onChange={e => setMat(i, 'ref', e.target.value)} />
                  </div>
                  <div>
                    {i === 0 && <label style={{ ...lStyle, fontSize: '10px' }}>CANT.</label>}
                    <input type="number" min="1" style={iStyle} value={m.qty} onChange={e => setMat(i, 'qty', e.target.value)} />
                  </div>
                  <div>
                    {i === 0 && <label style={{ ...lStyle, fontSize: '10px' }}>VALOR UNIT.</label>}
                    <input style={iStyle} value={m.valor} placeholder="$ 0" onChange={e => setMat(i, 'valor', e.target.value)} />
                  </div>
                  <div>
                    {i === 0 && <div style={{ height: '22px' }} />}
                    <button type="button" onClick={() => delMat(i)} style={{ width: '36px', height: '44px', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>×</button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addMat} style={{ marginTop: '4px', padding: '10px', border: '2px dashed rgba(16,185,129,0.3)', borderRadius: '10px', background: 'rgba(16,185,129,0.05)', color: '#10b981', fontWeight: 700, fontSize: '13px', cursor: 'pointer', width: '100%' }}>
                ＋ Agregar material
              </button>
            </div>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <Link href="/dashboard/ordenes" style={{ padding: '12px 24px', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#475569', fontWeight: 600, textDecoration: 'none', fontSize: '13px' }}>
            Cancelar
          </Link>
          <button type="submit" disabled={guardando} style={{
            padding: '12px 28px', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '14px',
            cursor: guardando ? 'wait' : 'pointer',
            background: guardando ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #06b6d4, #6366f1)',
            color: 'white', boxShadow: guardando ? 'none' : '0 4px 16px rgba(6,182,212,0.4)',
          }}>
            {guardando ? '◌ Guardando en base de datos...' : '⚡ Crear Orden'}
          </button>
        </div>
      </form>
    </div>
  )
}
