import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'
import LoginModal from './components/LoginModal'

import Home from './pages/public/Home'
import BuscarPuestos from './pages/public/BuscarPuestos'
import RegistroEmpresa from './pages/public/RegistroEmpresa'
import RegistroOferente from './pages/public/RegistroOferente'

import MisPuestos from './pages/empresa/MisPuestos'
import PublicarPuesto from './pages/empresa/PublicarPuesto'
import Candidatos from './pages/empresa/Candidatos'
import DetalleCandidato from './pages/empresa/DetalleCandidato'

import PerfilOferente from './pages/oferente/PerfilOferente'
import HabilidadesOferente from './pages/oferente/HabilidadesOferente'
import SubirCV from './pages/oferente/SubirCV'

import AdminEmpresas from './pages/admin/AdminEmpresas'
import AdminOferentes from './pages/admin/AdminOferentes'
import AdminCaracteristicas from './pages/admin/AdminCaracteristicas'
import AdminReporte from './pages/admin/AdminReporte'

export default function App() {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar onLoginClick={() => setShowLogin(true)} />
        {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        <div style={{ minHeight: 'calc(100vh - 56px - 60px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<BuscarPuestos />} />
          <Route path="/registro/empresa" element={<RegistroEmpresa />} />
          <Route path="/registro/oferente" element={<RegistroOferente />} />

          <Route path="/empresa/puestos" element={<PrivateRoute rol="EMPRESA"><MisPuestos /></PrivateRoute>} />
          <Route path="/empresa/publicar" element={<PrivateRoute rol="EMPRESA"><PublicarPuesto /></PrivateRoute>} />
          <Route path="/empresa/candidatos/:idPuesto" element={<PrivateRoute rol="EMPRESA"><Candidatos /></PrivateRoute>} />
          <Route path="/empresa/candidato/:idOferente" element={<PrivateRoute rol="EMPRESA"><DetalleCandidato /></PrivateRoute>} />

          <Route path="/oferente/perfil" element={<PrivateRoute rol="OFERENTE"><PerfilOferente /></PrivateRoute>} />
          <Route path="/oferente/habilidades" element={<PrivateRoute rol="OFERENTE"><HabilidadesOferente /></PrivateRoute>} />
          <Route path="/oferente/cv" element={<PrivateRoute rol="OFERENTE"><SubirCV /></PrivateRoute>} />

          <Route path="/admin/empresas" element={<PrivateRoute rol="ADMIN"><AdminEmpresas /></PrivateRoute>} />
          <Route path="/admin/oferentes" element={<PrivateRoute rol="ADMIN"><AdminOferentes /></PrivateRoute>} />
          <Route path="/admin/caracteristicas" element={<PrivateRoute rol="ADMIN"><AdminCaracteristicas /></PrivateRoute>} />
          <Route path="/admin/reporte" element={<PrivateRoute rol="ADMIN"><AdminReporte /></PrivateRoute>} />
        </Routes>
        </div>
        <footer className="footer">
          <div>
            <strong>Bolsa de Empleo</strong>
            <p>Total Soft Inc.</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p>Contacto: info@bolsaempleo.local</p>
            <p>Créditos: Equipo de desarrollo</p>
          </div>
        </footer>
      </BrowserRouter>
    </AuthProvider>
  )
}
