import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

const NIVELES = [1, 2, 3, 4, 5]

// Extrae el id numérico de un campo idPadre que puede llegar como objeto {id,nombre} o como número directo
const extractId = val => {
  if (val == null) return null
  if (typeof val === 'object') return val.id ?? null
  return val
}

function CaracteristicaSelector({ nodos, seleccionados, onChange }) {
  const raices = nodos.filter(n => extractId(n.idPadre) == null)

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
    const hijos = nodos.filter(n => extractId(n.idPadre) === nodo.id)
    const sel = seleccionados.find(x => x.idCaracteristica === nodo.id)
    return (
      <div key={nodo.id} className="tree-node">
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', padding: '.2rem 0' }}>
          <input type="checkbox" checked={!!sel}
            onChange={e => toggleNivel(nodo.id, e.target.checked ? 1 : 0)} />
          <span>{nodo.nombre}</span>
          {sel && (
            <select value={sel.nivel}
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

export default function PublicarPuesto() {
  const navigate = useNavigate()
  const [nodos, setNodos] = useState([])
  const [form, setForm] = useState({ descripcion: '', tipoPuesto: '', salario: '', moneda: 'CRC', esPublico: true })
  const [caracteristicas, setCaracteristicas] = useState([])
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    api.get('/public/caracteristicas').then(r => setNodos(Array.isArray(r.data) ? r.data : [])).catch(() => {})
  }, [])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await api.post('/empresa/puestos', { ...form, salario: Number(form.salario), caracteristicas })
      setMsg({ ok: true, text: 'Puesto publicado exitosamente.' })
      setTimeout(() => navigate('/empresa/puestos'), 1500)
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al publicar' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 700 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Publicar Puesto</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label>Descripción</label>
            <input value={form.descripcion} onChange={set('descripcion')} required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Tipo de Puesto</label>
              <select value={form.tipoPuesto} onChange={set('tipoPuesto')} required>
                <option value="">Seleccionar...</option>
                {['TIEMPO_COMPLETO', 'MEDIO_TIEMPO', 'CONTRATO', 'REMOTO'].map(t =>
                  <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Moneda</label>
              <select value={form.moneda} onChange={set('moneda')}>
                <option value="CRC">CRC</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Salario</label>
            <input type="number" min="0" value={form.salario} onChange={set('salario')} required />
          </div>
          <div className="form-group">
            <label>Visibilidad</label>
            <select value={form.esPublico} onChange={e => setForm(p => ({ ...p, esPublico: e.target.value === 'true' }))} required>
              <option value="true">Pública</option>
              <option value="false">Privada</option>
            </select>
          </div>
        </div>

        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Características requeridas</h3>
          <CaracteristicaSelector nodos={nodos} seleccionados={caracteristicas} onChange={setCaracteristicas} />
        </div>

        <button className="btn btn-primary" style={{ width: '100%' }}>Publicar Puesto</button>
      </form>
    </div>
  )
}
