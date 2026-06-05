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
          </>
        )}
        {auth && <button onClick={handleLogout}>Salir</button>}
      </div>
    </nav>
  )
}
