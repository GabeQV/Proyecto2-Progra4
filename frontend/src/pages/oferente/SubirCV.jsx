import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'

export default function SubirCV() {
  const { auth } = useAuth()
  const [archivo, setArchivo] = useState(null)
  const [msg, setMsg] = useState(null)
  const [tieneCV, setTieneCV] = useState(false)

  useEffect(() => {
    api.get('/oferente/perfil').then(r => {
      setTieneCV(!!r.data?.cvRuta)
    }).catch(() => {})
  }, [])

  const handleSubir = async e => {
    e.preventDefault()
    if (!archivo) return
    const fd = new FormData()
    fd.append('file', archivo)
    try {
      await api.post('/oferente/cv', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg({ ok: true, text: 'CV subido correctamente.' })
      setTieneCV(true)
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al subir el CV' })
    }
  }

  const handleEliminar = async () => {
    try {
      await api.delete('/oferente/cv')
      setMsg({ ok: true, text: 'CV eliminado.' })
      setTieneCV(false)
    } catch (err) {
      setMsg({ ok: false, text: 'Error al eliminar el CV' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mi CV</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <form onSubmit={handleSubir} className="card" style={{ marginBottom: '1rem' }}>
        <div className="form-group">
          <label>Seleccionar archivo PDF</label>
          <input type="file" accept="application/pdf"
            onChange={e => setArchivo(e.target.files[0])} required />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Subir CV</button>
      </form>
      {tieneCV && (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href={`/api/oferente/${auth?.userId}/cv`} target="_blank" rel="noreferrer"
            className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
            📄 Ver mi CV actual
          </a>
          <button className="btn btn-secondary" style={{ flex: 1, color: '#dc2626' }}
            onClick={handleEliminar}>
            🗑 Eliminar CV
          </button>
        </div>
      )}
      {!tieneCV && <p style={{ color: '#6b7280', fontSize: '.9rem' }}>No tienes un CV subido aún.</p>}
    </div>
  )
}
