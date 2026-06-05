import { useEffect, useState } from 'react'
import api from '../../api/client'

const NIVELES = [1, 2, 3, 4, 5]

// Extrae el id de idPadre que puede llegar como objeto {id,...} o número (por @JsonIdentityInfo)
const extractPadreId = val => {
  if (val == null) return null
  if (typeof val === 'object') return val.id ?? null
  return val
}

function HabilidadTree({ nodos, habilidades, onChange }) {
  const raices = nodos.filter(n => extractPadreId(n.idPadre) == null)

  const toggleNivel = (id, nivel) => {
    onChange(prev => {
      const existe = prev.find(x => x.idCaracteristica === id)
      if (existe) {
        return nivel === 0
          ? prev.filter(x => x.idCaracteristica !== id)
          : prev.map(x => x.idCaracteristica === id ? { ...x, nivel } : x)
      }
      return [...prev, { idCaracteristica: id, nivel }]
    })
  }

  const renderNodo = nodo => {
    const hijos = nodos.filter(n => extractPadreId(n.idPadre) === nodo.id)
    // habilidades ahora es [{idCaracteristica: number, nombre: string, nivel: number}]
    const hab = habilidades.find(x => x.idCaracteristica === nodo.id)
    return (
      <div key={nodo.id} className="tree-node">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.2rem 0' }}>
          <input type="checkbox" checked={!!hab}
            onChange={e => toggleNivel(nodo.id, e.target.checked ? 1 : 0)} />
          <span>{nodo.nombre}</span>
          {hab && (
            <select value={hab.nivel}
              onChange={e => toggleNivel(nodo.id, Number(e.target.value))}
              style={{ padding: '2px 4px', fontSize: '.85rem' }}>
              {NIVELES.map(n => <option key={n} value={n}>Nivel {n}</option>)}
            </select>
          )}
        </div>
        {hijos.map(renderNodo)}
      </div>
    )
  }

  return <div>{raices.map(renderNodo)}</div>
}

export default function HabilidadesOferente() {
  const [nodos, setNodos] = useState([])
  const [habilidades, setHabilidades] = useState([])
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/public/caracteristicas'),
      api.get('/oferente/habilidades')
    ]).then(([cn, hb]) => {
      setNodos(Array.isArray(cn.data) ? cn.data : [])
      const hbData = Array.isArray(hb.data) ? hb.data : []
      // El backend ahora devuelve DTOs limpios: {idCaracteristica: number, nombre, nivel}
      setHabilidades(hbData.map(h => ({
        idCaracteristica: h.idCaracteristica,
        nivel: h.nivel ?? 1
      })))
    }).catch(() => {})
  }, [])

  const guardar = async () => {
    try {
      await api.put('/oferente/habilidades', habilidades)
      setMsg({ ok: true, text: 'Habilidades actualizadas.' })
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al guardar' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 600 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mis Habilidades</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <div className="card" style={{ marginBottom: '1rem' }}>
        <HabilidadTree nodos={nodos} habilidades={habilidades} onChange={setHabilidades} />
      </div>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={guardar}>
        Guardar Habilidades
      </button>
    </div>
  )
}
