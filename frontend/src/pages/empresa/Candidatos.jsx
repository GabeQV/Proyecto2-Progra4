import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function Candidatos() {
  const { idPuesto } = useParams()
  const navigate = useNavigate()
  const [candidatos, setCandidatos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/empresa/puestos/${idPuesto}/candidatos`)
      .then(r => setCandidatos(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [idPuesto])

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Candidatos para el puesto</h1>
      {loading && <p>Cargando...</p>}
      {!loading && candidatos.length === 0 && <p>No hay candidatos que cumplan los requisitos.</p>}
      <table>
        <thead>
          <tr><th>Nombre</th><th>Correo</th><th>Localización</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {candidatos.map(c => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.correo}</td>
              <td>{c.localizacion}</td>
              <td>
                <button className="btn btn-primary"
                  onClick={() => navigate(`/empresa/candidato/${c.id}`)}>
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
