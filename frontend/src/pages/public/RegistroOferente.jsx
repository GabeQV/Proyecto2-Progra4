import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function RegistroOferente() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ id:'', correo:'', clave:'', nombre:'', primerApellido:'', nacionalidad:'', telefono:'', residencia:'' })
  const [msg, setMsg] = useState(null)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      await api.post('/auth/registro/oferente', form)
      setMsg({ ok: true, text: 'Oferente registrado. Espera aprobación del administrador.' })
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al registrar' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Registro de Oferente</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="card">
        {[['id','Identificación'],['correo','Correo'],['clave','Clave'],['nombre','Nombre'],
          ['primerApellido','Primer apellido'],['nacionalidad','Nacionalidad'],
          ['telefono','Teléfono'],['residencia','Lugar de residencia']].map(([k,l]) => (
          <div key={k} className="form-group">
            <label>{l}</label>
            <input type={k==='clave'?'password':k==='correo'?'email':'text'}
              value={form[k]} onChange={set(k)} required={['id','correo','clave','nombre','primerApellido','residencia'].includes(k)} />
          </div>
        ))}
        <button className="btn btn-primary" style={{ width: '100%' }}>Registrar</button>
      </form>
    </div>
  )
}
