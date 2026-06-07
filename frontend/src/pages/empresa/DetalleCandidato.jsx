import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../../api/client'

export default function DetalleCandidato() {
  const { idOferente } = useParams()
  const [oferente, setOferente] = useState(null)
  const [habilidades, setHabilidades] = useState([])

  useEffect(() => {
    api.get(`/empresa/oferentes/${idOferente}`).then(r => setOferente(r.data)).catch(() => {})

    // El backend ahora devuelve DTOs limpios: [{idCaracteristica, nombre, nivel}]
    api.get(`/empresa/oferentes/${idOferente}/habilidades`).then(r => {
      setHabilidades(Array.isArray(r.data) ? r.data : [])
    }).catch(() => {})
  }, [idOferente])

  if (!oferente) return <div className="container"><p>Cargando...</p></div>

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>{oferente.nombre} {oferente.primerApellido}</h1>
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <p><strong>Teléfono:</strong> {oferente.telefono}</p>
        <p><strong>Residencia:</strong> {oferente.residencia}</p>
        <p><strong>Nacionalidad:</strong> {oferente.nacionalidad}</p>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Habilidades</h3>
        {habilidades.length === 0
          ? <p>Sin habilidades registradas.</p>
          : <table>
              <thead><tr><th>Habilidad</th><th>Nivel</th></tr></thead>
              <tbody>
                {habilidades.map((h, i) => (
                  <tr key={i}>
                    <td>{h.nombre}</td>
                    <td>Nivel {h.nivel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        }
      </div>

      {oferente.cvRuta && (
        <a href={`/api/oferente/${idOferente}/cv`} target="_blank" rel="noreferrer"
          className="btn btn-primary">
          📄 Ver CV en PDF
        </a>
      )}
    </div>
  )
}
