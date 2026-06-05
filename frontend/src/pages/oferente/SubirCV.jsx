import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/client'

export default function SubirCV() {
  const { auth } = useAuth()
  const [archivo, setArchivo] = useState(null)
  const [msg, setMsg] = useState(null)

  const handleSubir = async e => {
    e.preventDefault()
    if (!archivo) return
    const fd = new FormData()
    fd.append('file', archivo)
    try {
      await api.post('/oferente/cv', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg({ ok: true, text: 'CV subido correctamente.' })
    } catch (err) {
      setMsg({ ok: false, text: err.response?.data?.error ?? 'Error al subir el CV' })
    }
  }

  return (
    <div className="container" style={{ maxWidth: 500 }}>
      <h1 style={{ marginBottom: '1.5rem' }}>Mi CV</h1>
      {msg && <div className={`alert ${msg.ok ? 'alert-success' : 'alert-error'}`}>{msg.text}</div>}
      <form onSubmit={handleSubir} className="card">
        <div className="form-group">
          <label>Seleccionar archivo PDF</label>
          <input type="file" accept="application/pdf"
            onChange={e => setArchivo(e.target.files[0])} required />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Subir CV</button>
      </form>
      <div style={{ marginTop: '1rem' }}>
        <a href={`/api/oferente/${auth?.userId}/cv`} target="_blank" rel="noreferrer"
          className="btn btn-secondary">
          📄 Ver mi CV actual
        </a>
      </div>
    </div>
  )
}
