import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ onLoginClick }) {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontWeight: 700, fontSize: '1.1rem' }}>🏢 Bolsa de Empleo</Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link to="/buscar">Buscar Puestos</Link>
        {!auth && (
          <>
            <button onClick={onLoginClick}>Iniciar Sesión</button>
            <Link to="/registro/empresa">Registro Empresa</Link>
            <Link to="/registro/oferente">Registro Oferente</Link>
          </>
        )}
        {auth?.rol === 'ROLE_EMPRESA' && (
          <>
            <Link to="/empresa/puestos">Mis Puestos</Link>
            <Link to="/empresa/publicar">Publicar Puesto</Link>
          </>
        )}
        {auth?.rol === 'ROLE_OFERENTE' && (
          <>
            <Link to="/oferente/perfil">Mi Perfil</Link>
            <Link to="/oferente/habilidades">Habilidades</Link>
            <Link to="/oferente/cv">Mi CV</Link>
          </>
        )}
        {auth?.rol === 'ROLE_ADMIN' && (
          <>
            <Link to="/admin/empresas">Empresas</Link>
            <Link to="/admin/oferentes">Oferentes</Link>
            <Link to="/admin/caracteristicas">Características</Link>
            <Link to="/admin/reporte">Reporte</Link>
          </>
        )}
        {auth && (
          <span style={{
            background: auth.rol === 'ROLE_ADMIN' ? '#ffedd5' : auth.rol === 'ROLE_EMPRESA' ? '#dbeafe' : '#d1fae5',
            color: auth.rol === 'ROLE_ADMIN' ? '#7c2d12' : auth.rol === 'ROLE_EMPRESA' ? '#1e40af' : '#065f46',
            borderRadius: 20, padding: '3px 10px', fontSize: '.8rem', fontWeight: 600,
            whiteSpace: 'nowrap', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis'
          }}
          >
            {auth.nombre}
            <span style={{ marginLeft: 4, background: 'rgba(0,0,0,.15)', borderRadius: 10, padding: '1px 6px', fontSize: '.7rem' }}>
              {auth.rol === 'ROLE_ADMIN' ? 'Admin' : auth.rol === 'ROLE_EMPRESA' ? 'Empresa' : 'Oferente'}
            </span>
          </span>
        )}
        {auth && <button onClick={handleLogout}>Salir</button>}
      </div>
    </nav>
  )
}
