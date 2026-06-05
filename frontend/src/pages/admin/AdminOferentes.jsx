import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function AdminOferentes() {
  const [oferentes, setOferentes] = useState([])

  const cargar = () => api.get('/admin/oferentes/pendientes').then(r => setOferentes(Array.isArray(r.data) ? r.data : [])).catch(() => {})

  useEffect(() => { cargar() }, [])

  const aprobar = async id => {
    try { await api.put(`/admin/oferentes/${id}/aprobar`); cargar() } catch { /* ignorar */ }
  }
  const rechazar = async id => {
    try { await api.put(`/admin/oferentes/${id}/rechazar`); cargar() } catch { /* ignorar */ }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Oferentes Pendientes</h1>
      {oferentes.length === 0 && <p>No hay oferentes pendientes.</p>}
      <table>
        <thead>
          <tr><th>Nombre</th><th>Correo</th><th>Localización</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {oferentes.map(o => (
            <tr key={o.id}>
              <td>{o.nombre}</td>
              <td>{o.correo}</td>
              <td>{o.localizacion}</td>
              <td style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-primary" onClick={() => aprobar(o.id)}>Aprobar</button>
                <button className="btn btn-danger" onClick={() => rechazar(o.id)}>Rechazar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
