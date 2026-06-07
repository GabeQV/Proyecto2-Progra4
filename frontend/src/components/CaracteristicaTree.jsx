export default function CaracteristicaTree({ nodos, seleccionados, onChange }) {
  const getPadreId = n => {
    if (!n.idPadre) return null
    return typeof n.idPadre === 'object' ? n.idPadre.id : n.idPadre
  }
  const raices = nodos.filter(n => !n.idPadre)

  const toggle = id => {
    onChange(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const renderNodo = nodo => {
    const hijos = nodos.filter(n => getPadreId(n) === nodo.id)
    return (
      <div key={nodo.id} className="tree-node">
        <label>
          <input type="checkbox" checked={seleccionados.includes(nodo.id)}
            onChange={() => toggle(nodo.id)} />
          {nodo.nombre}
        </label>
        {hijos.map(renderNodo)}
      </div>
    )
  }

  return <div>{raices.map(renderNodo)}</div>
}
