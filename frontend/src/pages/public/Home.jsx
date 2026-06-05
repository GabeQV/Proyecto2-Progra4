import { useEffect, useState } from 'react'
import api from '../../api/client'

function RequisitosArbol({ chars }) {
  const grupos = {}
  for (const c of chars) {
    const key = c.padre ?? '__sin_padre__'
    if (!grupos[key]) grupos[key] = []
    grupos[key].push(c)
  }

  return (
    <ul style={{ paddingLeft: '1rem', margin: 0 }}>
      {Object.entries(grupos).map(([padre, hijos]) =>
        padre === '__sin_padre__'
          ? hijos.map(h => (
              <li key={h.nombre}>{h.nombre}{h.nivel > 1 ? ` (Nivel ${h.nivel})` : ''}</li>
            ))
          : (
            <li key={padre}>
              <strong>{padre}</strong>
              <ul style={{ paddingLeft: '1rem', margin: '.1rem 0 0' }}>
                {hijos.map(h => <li key={h.nombre}>{h.nombre}{h.nivel > 1 ? ` (Nivel ${h.nivel})` : ''}</li>)}
              </ul>
            </li>
          )
      )}
    </ul>
  )
}

function PuestoCard({ puesto }) {
  const [chars, setChars] = useState([])
  const [modal, setModal] = useState(false)
  const [hover, setHover] = useState(false)

  const fetchChars = async () => {
    if (chars.length) return
    try {
      const { data } = await api.get(`/public/puestos/${puesto.id}/caracteristicas`)
      setChars(Array.isArray(data) ? data : [])
    } catch { /* ignorar */ }
  }

  const handleMouseEnter = () => { setHover(true); fetchChars() }

  return (
    <>
      <div
        className="card puesto-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHover(false)}
      >
        <p className="puesto-empresa">{puesto.idEmpresa?.nombre ?? ''}</p>
        <h3>{puesto.descripcion}</h3>
        <p className="puesto-salario">₡ {puesto.salario?.toLocaleString()}</p>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: '.75rem' }}
          onClick={() => { fetchChars(); setModal(true) }}>
          Ver detalle
        </button>

        {hover && chars.length > 0 && (
          <div className="puesto-hover-tooltip">
            <strong>{puesto.descripcion}</strong>
            <p style={{ margin: '.25rem 0', fontSize: '.85rem' }}>₡ {puesto.salario?.toLocaleString()}</p>
            <strong style={{ display: 'block', margin: '.5rem 0 .25rem' }}>Requisitos</strong>
            <RequisitosArbol chars={chars} />
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <p className="puesto-empresa">{puesto.idEmpresa?.nombre ?? ''}</p>
            <h2 style={{ margin: '.25rem 0 .5rem' }}>{puesto.descripcion}</h2>
            <p className="puesto-salario" style={{ fontSize: '1.1rem', marginBottom: '.5rem' }}>
              {puesto.moneda} {puesto.salario?.toLocaleString()}
            </p>
            <p style={{ fontSize: '.85rem', color: '#555', marginBottom: '.25rem' }}>
              <strong>Tipo:</strong> {puesto.tipoPuesto?.replace(/_/g, ' ')}
            </p>
            <p style={{ fontSize: '.85rem', color: '#555', marginBottom: '1rem' }}>
              <strong>Publicado:</strong> {puesto.fechaRegistro}
            </p>
            {chars.length > 0 && (
              <>
                <strong>Requisitos</strong>
                <div style={{ marginTop: '.5rem' }}>
                  <RequisitosArbol chars={chars} />
                </div>
              </>
            )}
            {chars.length === 0 && <p style={{ color: '#888', fontSize: '.85rem' }}>Sin requisitos especificados.</p>}
            <button className="btn btn-secondary" style={{ marginTop: '1.25rem', width: '100%' }}
              onClick={() => setModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  )
}

export default function Home() {
  const [puestos, setPuestos] = useState([])

  useEffect(() => {
    api.get('/public/puestos/recientes').then(r => setPuestos(Array.isArray(r.data) ? r.data : [])).catch(() => {})
  }, [])

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Bolsa de Empleo</h1>
      {puestos.length === 0
        ? <p>No hay puestos disponibles.</p>
        : <div className="card-grid">{puestos.map(p => <PuestoCard key={p.id} puesto={p} />)}</div>
      }
    </div>
  )
}
