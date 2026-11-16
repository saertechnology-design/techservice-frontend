'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function NuevaCuentaPage() {
  const [detalles, setDetalles] = useState([{ desc: '', qty: '1', valor: '' }])
  const [retencion, setRetencion] = useState('0')
  const [descuento, setDescuento] = useState('0')
  const [importarOrden, setImportarOrden] = useState(false)

  const addDetalle = () => setDetalles(d => [...d, { desc: '', qty: '1', valor: '' }])
  const remove = (i: number) => setDetalles(d => d.filter((_, idx) => idx !== i))

  const subtotal = detalles.reduce((acc, d) => acc + (parseFloat(d.qty)||0) * (parseFloat(d.valor)||0), 0)
  const valorRet = subtotal * (parseFloat(retencion)||0) / 100
  const total = subtotal - valorRet - (parseFloat(descuento)||0)
  const fmt = (v: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v)

  const labelStyle = { display: 'block' as const, fontSize: '13px', fontWeight: 600 as const, color: '#374151', marginBottom: '6px' }
  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '15px', color: '#0f172a', background: 'white', outline: 'none' }

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <Link href="/dashboard/cuentas" style={{ color: '#64748b', fontSize: '20px', textDecoration: 'none' }}>←</Link>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a' }}>Nueva Cuenta de Cobro</h1>
          <p style={{ color: '#64748b', fontSize: '13px' }}>Consecutivo automático: CC-2024-0009</p>
        </div>
      </div>

      {/* Importar desde orden */}
      <div style={{ background: '#f0f9ff', border: '2px solid #bae6fd', borderRadius: '12px', padding: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <p style={{ fontWeight: 600, color: '#0369a1', fontSize: '14px' }}>¿Importar desde una Orden de Servicio?</p>
          <p style={{ color: '#0ea5e9', fontSize: '13px' }}>Pre-rellena cliente, servicios y materiales automáticamente</p>
        </div>
        <button onClick={() => setImportarOrden(!importarOrden)} style={{ padding: '9px 18px', background: importarOrden ? '#0369a1' : '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>
          {importarOrden ? '✓ Importada: OS-2024-0022' : '📋 Importar Orden'}
        </button>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Cabecera */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#059669', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
            💰 Datos de la Cuenta
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Cliente *</label>
              <select style={inputStyle} defaultValue={importarOrden ? 'Clínica Santa María' : ''}>
                <option value="">Seleccionar...</option>
                <option>Clínica Santa María</option>
                <option>Banco del Progreso</option>
                <option>Vigilancia Segura Ltda</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fecha Emisión *</label>
              <input type="date" style={inputStyle} defaultValue="2024-12-27" />
            </div>
            <div>
              <label style={labelStyle}>Fecha Vencimiento</label>
              <input type="date" style={inputStyle} defaultValue="2025-01-27" />
            </div>
            <div>
              <label style={labelStyle}>Concepto *</label>
              <input type="text" style={inputStyle} defaultValue={importarOrden ? 'Instalación red estructurada Cat6 — OS-2024-0022' : ''} placeholder="Descripción general del servicio..." />
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#059669', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
            📝 Detalle de Servicios / Materiales
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {detalles.map((d, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 80px 140px 40px', gap: '8px', alignItems: 'end' }}>
                <div>
                  {i === 0 && <label style={{ ...labelStyle, fontSize: '11px' }}>DESCRIPCIÓN</label>}
                  <input style={inputStyle} value={d.desc} placeholder="Servicio o material..." onChange={e => { const n=[...detalles]; n[i].desc=e.target.value; setDetalles(n) }} />
                </div>
                <div>
                  {i === 0 && <label style={{ ...labelStyle, fontSize: '11px' }}>CANT.</label>}
                  <input type="number" min="1" style={inputStyle} value={d.qty} onChange={e => { const n=[...detalles]; n[i].qty=e.target.value; setDetalles(n) }} />
                </div>
                <div>
                  {i === 0 && <label style={{ ...labelStyle, fontSize: '11px' }}>VALOR UNIT.</label>}
                  <input type="number" style={inputStyle} value={d.valor} placeholder="0" onChange={e => { const n=[...detalles]; n[i].valor=e.target.value; setDetalles(n) }} />
                </div>
                <div style={{ paddingBottom: '2px' }}>
                  {i === 0 && <div style={{ height: '20px' }} />}
                  <button type="button" onClick={() => remove(i)} style={{ width: '36px', height: '42px', border: '1px solid #fee2e2', background: '#fff5f5', borderRadius: '8px', color: '#dc2626', cursor: 'pointer', fontSize: '16px' }}>×</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addDetalle} style={{ marginTop: '12px', padding: '9px 16px', border: '2px dashed #bbf7d0', borderRadius: '8px', background: '#f0fdf4', color: '#059669', fontWeight: 600, fontSize: '13px', cursor: 'pointer', width: '100%' }}>
            + Agregar línea
          </button>
        </div>

        {/* Totales */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#059669', marginBottom: '20px', paddingBottom: '10px', borderBottom: '1px solid #f1f5f9' }}>
            🧮 Cálculos
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div>
              <label style={labelStyle}>Retención (%)</label>
              <input type="number" min="0" max="100" step="0.5" value={retencion} onChange={e => setRetencion(e.target.value)} style={inputStyle} placeholder="0" />
            </div>
            <div>
              <label style={labelStyle}>Descuento ($ COP)</label>
              <input type="number" min="0" value={descuento} onChange={e => setDescuento(e.target.value)} style={inputStyle} placeholder="0" />
            </div>
          </div>
          {/* Resumen */}
          <div style={{ background: '#f8fafc', borderRadius: '10px', overflow: 'hidden' }}>
            {[
              { label: 'Subtotal', value: fmt(subtotal) },
              ...(parseFloat(retencion) > 0 ? [{ label: `Retención (${retencion}%)`, value: `- ${fmt(valorRet)}` }] : []),
              ...(parseFloat(descuento) > 0 ? [{ label: 'Descuento', value: `- ${fmt(parseFloat(descuento))}` }] : []),
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>{row.label}</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.value}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 16px', background: '#059669' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '15px' }}>TOTAL NETO</span>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '20px' }}>{fmt(total)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingBottom: '40px' }}>
          <Link href="/dashboard/cuentas" style={{ padding: '12px 24px', border: '1.5px solid #e2e8f0', borderRadius: '10px', color: '#64748b', fontWeight: 600, textDecoration: 'none', fontSize: '14px' }}>
            Cancelar
          </Link>
          <button type="button" style={{ padding: '12px 22px', border: '1.5px solid #059669', borderRadius: '10px', color: '#059669', background: 'white', fontWeight: 600, fontSize: '14px', cursor: 'pointer' }}>
            📄 Vista previa PDF
          </button>
          <button type="submit" style={{ padding: '12px 28px', background: '#059669', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            Guardar Cuenta
          </button>
        </div>
      </form>
    </div>
  )
}
