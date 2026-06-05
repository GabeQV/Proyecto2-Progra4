import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function MisPuestos() {
  const [puestos, setPuestos] = useState([])
  const navigate = useNavigate()

  const cargar = () => api.get('/empresa/puestos').then(r => setPuestos(Array.isArray(r.data) ? r.data : [])).catch(() => {})

  useEffect(() => { cargar() }, [])

  const desactivar = async id => {
    try {
      await api.put(`/empresa/puestos/${id}/desactivar`)
      cargar()
    } catch { /* ignorar */ }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Mis Puestos</h1>
      <table>
        <thead>
          <tr>
            <th>Descripción</th><th>Tipo</th><th>Salario</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {puestos.map(p => (
            <tr key={p.id}>
              <td>{p.descripcion}</td>
              <td>{p.tipoPuesto}</td>
              <td>{p.moneda} {p.salario?.toLocaleString()}</td>
              <td>{p.activo ? '✅ Activo' : '❌ Inactivo'}</td>
              <td style={{ display: 'flex', gap: '.5rem' }}>
                <button className="btn btn-primary" onClick={() => navigate(`/empresa/candidatos/${p.id}`)}>
                  Candidatos
                </button>
                {p.activo && (
                  <button className="btn btn-danger" onClick={() => desactivar(p.id)}>
                    Desactivar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {puestos.length === 0 && <p style={{ marginTop: '1rem' }}>No tienes puestos publicados.</p>}
    </div>
  )
}
