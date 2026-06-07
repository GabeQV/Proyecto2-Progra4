import { useEffect, useState } from 'react'
import api from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import CaracteristicaTree from '../../components/CaracteristicaTree'

export default function BuscarPuestos() {
  const { auth } = useAuth()
  const [nodos, setNodos] = useState([])
  const [seleccionados, setSeleccionados] = useState([])
  const [resultados, setResultados] = useState([])
  const [buscado, setBuscado] = useState(false)

  useEffect(() => {
    api.get('/public/caracteristicas').then(r => setNodos(Array.isArray(r.data) ? r.data : [])).catch(() => {})
  }, [])

  const buscar = async () => {
    if (!seleccionados.length) return
    try {
      const endpoint = auth ? '/public/puestos/buscar-todos' : '/public/puestos/buscar'
      const { data } = await api.get(endpoint, {
        params: { ids: seleccionados.join(',') }
      })
      setResultados(data)
      setBuscado(true)
    } catch { setResultados([]); setBuscado(true) }
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Buscar Puestos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Filtrar por habilidades</h3>
          <CaracteristicaTree nodos={nodos} seleccionados={seleccionados} onChange={setSeleccionados} />
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={buscar}>
            Buscar
          </button>
        </div>
        <div>
          {buscado && resultados.length === 0 && <p>No se encontraron puestos.</p>}
          <div className="card-grid">
            {resultados.map(p => (
              <div key={p.id} className="card">
                <h3>{p.descripcion}</h3>
                <p style={{ fontSize: '.85rem', color: '#555' }}>
                  {p.moneda === 'USD' ? '$' : '₡'} {p.salario?.toLocaleString('es-CR')} · {p.tipoPuesto?.replace(/_/g, ' ')}
                </p>
                <p style={{ fontSize: '.8rem', color: '#888', marginTop: '.3rem' }}>{p.fechaRegistro}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
