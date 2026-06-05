import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

export default function LoginModal({ onClose }) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ correo: '', clave: '' })
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      onClose()
      if (data.rol === 'ROLE_EMPRESA')  navigate('/empresa/puestos')
      else if (data.rol === 'ROLE_OFERENTE') navigate('/oferente/perfil')
      else if (data.rol === 'ROLE_ADMIN')    navigate('/admin/empresas')
    } catch {
      setError('Correo o clave incorrectos')
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>Iniciar Sesión</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Correo</label>
            <input type="email" value={form.correo}
              onChange={e => setForm(p => ({ ...p, correo: e.target.value }))} required />
          </div>
          <div className="form-group">
            <label>Clave</label>
            <input type="password" value={form.clave}
              onChange={e => setForm(p => ({ ...p, clave: e.target.value }))} required />
          </div>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">Ingresar</button>
          </div>
        </form>
      </div>
    </div>
  )
}
