import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function AdminEmpresas() {
  const [empresas, setEmpresas] = useState([])

  const cargar = () => api.get('/admin/empresas/pendientes').then(r => setEmpresas(Array.isArray(r.data) ? r.data : [])).catch(() => {})

  useEffect(() => { cargar() }, [])

  const aprobar = async id => {
    try { await api.put(`/admin/empresas/${id}/aprobar`); cargar() } catch { /* ignorar */ }
  }
  const rechazar = async id => {
    try { await api.put(`/admin/empresas/${id}/rechazar`); cargar() } catch { /* ignorar */ }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Empresas Pendientes</h1>
      {empresas.length === 0 && <p>No hay empresas pendientes.</p>}
      <table>
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Localización</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {empresas.map(e => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.nombre}</td>
              <td>{e.correo}</td>
              <td>{e.localizacion}</td>
              <td style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-primary" onClick={() => aprobar(e.id)}>Aprobar</button>
                <button className="btn btn-danger" onClick={() => rechazar(e.id)}>Rechazar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
