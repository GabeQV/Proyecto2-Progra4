import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function AdminCaracteristicas() {
  const [nodos, setNodos] = useState([])
  const [form, setForm] = useState({ nombre: '', idPadre: '' })
  const [editando, setEditando] = useState(null)
  const [msg, setMsg] = useState(null)

  const cargar = () => api.get('/public/caracteristicas').then(r => setNodos(Array.isArray(r.data) ? r.data : [])).catch(() => {})

  useEffect(() => { cargar() }, [])

  const guardar = async e => {
    e.preventDefault()
    const payload = { nombre: form.nombre, idPadre: form.idPadre ? Number(form.idPadre) : null }
    try {
      if (editando) {
        await api.put(`/admin/caracteristicas/${editando}`, payload)
      } else {
        await api.post('/admin/caracteristicas', payload)
      }
      setMsg({ ok: true, text: editando ? 'Actualizado.' : 'Creado.' })
      setForm({ nombre: '', idPadre: '' })
      setEditando(null)
      cargar()
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error' })
    }
  }

  const iniciarEdicion = nodo => {
    setEditando(nodo.id)
    setForm({ nombre: nodo.nombre, idPadre: nodo.idPadre?.id ?? '' })
    setMsg(null)
  }

  const eliminar = async id => {
    if (!window.confirm('¿Eliminar esta característica?')) return
    try { await api.delete(`/admin/caracteristicas/${id}`); cargar() } catch { /* ignorar */ }
  }

  const renderArbol = (parentId = null, depth = 0) => {
    const hijos = nodos.filter(n => (n.idPadre?.id ?? null) === parentId)
    const filas = []
    for (const n of hijos) {
      filas.push(
        <tr key={n.id}>
          <td style={{ paddingLeft: `${depth * 1.5 + 0.75}rem` }}>{n.nombre}</td>
          <td>{n.idPadre?.nombre ?? '—'}</td>
          <td style={{ display: 'flex', gap: '.5rem' }}>
            <button className="btn btn-secondary" onClick={() => iniciarEdicion(n)}>Editar</button>
            <button className="btn btn-danger" onClick={() => eliminar(n.id)}>Eliminar</button>
          </td>
        </tr>
      )
      for (const fila of renderArbol(n.id, depth + 1)) filas.push(fila)
    }
    return filas
  }

  return (
    <div className="container">
      <h1 style={{ marginBottom: '1.5rem' }}>Árbol de Características</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}

      <form onSubmit={guardar} className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Nombre</label>
          <input value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} required />
        </div>
        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
          <label>Padre (opcional)</label>
          <select value={form.idPadre} onChange={e => setForm(p => ({ ...p, idPadre: e.target.value }))}>
            <option value="">— Raíz —</option>
            {nodos.filter(n => n.id !== editando).map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
          </select>
        </div>
        <button className="btn btn-primary">{editando ? 'Actualizar' : 'Agregar'}</button>
        {editando && (
          <button type="button" className="btn btn-secondary"
            onClick={() => { setEditando(null); setForm({ nombre: '', idPadre: '' }) }}>
            Cancelar
          </button>
        )}
      </form>

      <table>
        <thead><tr><th>Nombre</th><th>Padre</th><th>Acciones</th></tr></thead>
        <tbody>{renderArbol()}</tbody>
      </table>
    </div>
  )
}
