import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/client'

export default function RegistroEmpresa() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ id:'', correo:'', clave:'', nombre:'', localizacion:'', telefono:'', descripcion:'' })
  const [confirmar, setConfirmar] = useState('')
  const [msg, setMsg] = useState(null)

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const claveNoCoincide = confirmar.length > 0 && form.clave !== confirmar

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.clave !== confirmar) {
      setMsg({ ok: false, text: 'Las contraseñas no coinciden.' })
      return
    }
    try {
      await api.post('/auth/registro/empresa', form)
      setMsg({ ok: true, text: 'Empresa registrada. Espera aprobación del administrador.' })
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al registrar' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Registro de Empresa</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <form onSubmit={handleSubmit} className="card">
        {[['id','Identificación'],['correo','Correo'],['nombre','Nombre empresa'],
          ['localizacion','Localización'],['telefono','Teléfono']].map(([k,l]) => (
          <div key={k} className="form-group">
            <label>{l}</label>
            <input type={k==='correo'?'email':'text'}
              value={form[k]} onChange={set(k)} required={['id','correo','nombre'].includes(k)} />
          </div>
        ))}

        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" value={form.clave} onChange={set('clave')} required />
        </div>

        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)} required
            style={{ borderColor: claveNoCoincide ? '#dc2626' : undefined }} />
          {claveNoCoincide && (
            <p style={{ color: '#dc2626', fontSize: '.82rem', marginTop: '.25rem' }}>
              Las contraseñas no coinciden.
            </p>
          )}
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea rows={3} value={form.descripcion} onChange={set('descripcion')} />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={claveNoCoincide}>
          Registrar
        </button>
      </form>
    </div>
  )
}
