import React, { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Portafolio from './pages/Portafolio.jsx'
import Clientes from './pages/Clientes.jsx'
import './styles/custom-palette.css'

function App() {
  const [page, setPage] = useState('dashboard')

  return (
    <div className="app-container">
      <nav className="navbar-custom">
        <div className="navbar-brand">Judith HairStudio</div>
        <div className="navbar-menu">
          <button 
            className={`nav-link ${page === 'dashboard' ? 'active' : ''}`} 
            onClick={() => setPage('dashboard')}
          >Dashboard</button>
          <button 
            className={`nav-link ${page === 'portafolio' ? 'active' : ''}`} 
            onClick={() => setPage('portafolio')}
          >Portafolio</button>
          <button 
            // El botón se marca activo también si estamos en el detalle de un cliente
            className={`nav-link ${(page === 'clientes' || page === 'detalle-cliente') ? 'active' : ''}`} 
            onClick={() => setPage('clientes')}
          >Clientes</button>
        </div>
      </nav>

      <main className="content-container">
        {page === 'dashboard' && <Dashboard />}
        {page === 'portafolio' && <Portafolio />}
        {page === 'clientes' && <Clientes />}
      </main>
    </div>
  )
}

export default App