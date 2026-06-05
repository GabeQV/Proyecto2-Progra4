import { useState } from 'react'
import api from '../../api/client'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function AdminReporte() {
  const now = new Date()
  const [mes, setMes] = useState(now.getMonth() + 1)
  const [anio, setAnio] = useState(now.getFullYear())
  const [datos, setDatos] = useState([])
  const [cargado, setCargado] = useState(false)
  const [loading, setLoading] = useState(false)

  const consultar = async () => {
    setLoading(true)
    try {
      const { data } = await api.get(`/admin/reportes?mes=${mes}&anio=${anio}`)
      setDatos(Array.isArray(data) ? data : [])
      setCargado(true)
    } catch {
      setDatos([])
      setCargado(true)
    } finally {
      setLoading(false)
    }
  }

  const generarPDF = () => {
    // Construimos el HTML del reporte directamente desde los datos ya cargados
    const filas = datos.map(r => `
      <tr>
        <td>${r.empresa ?? ''}</td>
        <td>${r.descripcion ?? ''}</td>
        <td>${r.moneda ?? ''} ${r.salario?.toLocaleString('es-CR') ?? ''}</td>
        <td>${r.tipoPuesto?.replace(/_/g, ' ') ?? ''}</td>
        <td>${r.activo ? 'Activo' : 'Inactivo'}</td>
        <td>${r.fechaRegistro ?? ''}</td>
      </tr>`).join('')

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Reporte de Puestos — ${MESES[mes - 1]} ${anio}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #1a1a1a; padding: 2rem; }
    h1 { font-size: 20px; margin-bottom: .25rem; color: #1d4ed8; }
    .subtitulo { font-size: 13px; color: #555; margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
    thead { background: #1d4ed8; color: white; }
    th { padding: .5rem .75rem; text-align: left; font-weight: 600; }
    td { padding: .45rem .75rem; border-bottom: 1px solid #e5e7eb; vertical-align: top; }
    tr:nth-child(even) td { background: #f8fafc; }
    .activo { color: #16a34a; font-weight: bold; }
    .inactivo { color: #dc2626; font-weight: bold; }
    .resumen { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; padding: .75rem 1rem; font-size: 12px; }
    .resumen strong { display: inline-block; min-width: 160px; }
    @media print {
      body { padding: 1rem; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>Reporte de Puestos Publicados</h1>
  <p class="subtitulo">${MESES[mes - 1]} ${anio} — Generado el ${new Date().toLocaleDateString('es-CR')}</p>

  ${datos.length === 0
    ? '<p style="color:#888;margin-bottom:1rem">No se registraron puestos en este período.</p>'
    : `<table>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Descripción</th>
            <th>Salario</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Fecha registro</th>
          </tr>
        </thead>
        <tbody>
          ${datos.map(r => `
          <tr>
            <td>${r.empresa ?? ''}</td>
            <td>${r.descripcion ?? ''}</td>
            <td>${r.moneda ?? ''} ${r.salario?.toLocaleString('es-CR') ?? ''}</td>
            <td>${r.tipoPuesto?.replace(/_/g, ' ') ?? ''}</td>
            <td class="${r.activo ? 'activo' : 'inactivo'}">${r.activo ? 'Activo' : 'Inactivo'}</td>
            <td>${r.fechaRegistro ?? ''}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="resumen">
        <p><strong>Total de puestos:</strong> ${datos.length}</p>
        <p><strong>Activos:</strong> ${datos.filter(r => r.activo).length}</p>
        <p><strong>Inactivos:</strong> ${datos.filter(r => !r.activo).length}</p>
      </div>`
  }
</body>
</html>`

    // Abrimos en ventana nueva para vista previa e impresión/guardado como PDF
    const ventana = window.open('', '_blank', 'width=900,height=700')
    ventana.document.write(html)
    ventana.document.close()
    // Damos tiempo a que cargue el HTML antes de llamar print()
    ventana.onload = () => ventana.print()
  }

  return (
    <div className="container" style={{ maxWidth: 800 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Reporte de Puestos</h1>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Mes</label>
          <select value={mes} onChange={e => setMes(Number(e.target.value))} style={{ minWidth: 130 }}>
            {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Año</label>
          <input type="number" value={anio} onChange={e => setAnio(Number(e.target.value))}
            style={{ width: 90 }} min="2020" max="2099" />
        </div>
        <button className="btn btn-primary" onClick={consultar} disabled={loading}>
          {loading ? 'Consultando...' : 'Consultar'}
        </button>
        {cargado && datos.length > 0 && (
          <button className="btn btn-secondary" onClick={generarPDF}>
            📄 Generar PDF
          </button>
        )}
      </div>

      {cargado && (
        datos.length === 0
          ? <p style={{ color: '#888' }}>No se encontraron puestos para este período.</p>
          : <>
              <p style={{ marginBottom: '.75rem', color: '#555', fontSize: '.9rem' }}>
                {datos.length} puesto(s) encontrado(s) — {datos.filter(r => r.activo).length} activos, {datos.filter(r => !r.activo).length} inactivos
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Empresa</th>
                    <th>Descripción</th>
                    <th>Salario</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.map(r => (
                    <tr key={r.id}>
                      <td>{r.empresa}</td>
                      <td>{r.descripcion}</td>
                      <td>{r.moneda} {r.salario?.toLocaleString('es-CR')}</td>
                      <td>{r.tipoPuesto?.replace(/_/g, ' ')}</td>
                      <td style={{ color: r.activo ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>
                        {r.activo ? 'Activo' : 'Inactivo'}
                      </td>
                      <td>{r.fechaRegistro}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
      )}
    </div>
  )
}
