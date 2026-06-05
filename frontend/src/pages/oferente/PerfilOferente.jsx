import { useEffect, useState } from 'react'
import api from '../../api/client'

export default function PerfilOferente() {
  const [form, setForm] = useState({ nombre:'', telefono:'', residencia:'' })
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    api.get('/oferente/perfil').then(r => {
      const { nombre, telefono, residencia } = r.data
      setForm({ nombre: nombre ?? '', telefono: telefono ?? '', residencia: residencia ?? '' })
    }).catch(() => {})
  }, [])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await api.put('/oferente/perfil', { ...form, localizacion: form.residencia })
      setMsg({ ok: true, text: 'Perfil actualizado.' })
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al actualizar' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mi Perfil</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="card">
        {[['nombre','Nombre'],['telefono','Teléfono'],['residencia','Residencia']].map(([k,l]) => (
          <div key={k} className="form-group">
            <label>{l}</label>
            <input value={form[k]} onChange={set(k)} required={k === 'nombre'} />
          </div>
        ))}
        <button className="btn btn-primary" style={{ width: '100%' }}>Guardar cambios</button>
      </form>
    </div>
  )
}
