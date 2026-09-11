'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const pathname = usePathname();

  const isDashboard = pathname === '/';
  const isPortafolio = pathname.startsWith('/portafolio');
  const isClientes = pathname.startsWith('/clientes');

  return (
    <nav className="navbar-custom">
      <div className="navbar-brand">
        <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>
          Judith HairStudio
        </Link>
      </div>
      <div className="navbar-menu">
        <Link
          href="/"
          className={`nav-link ${isDashboard ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          href="/portafolio"
          className={`nav-link ${isPortafolio ? 'active' : ''}`}
        >
          Portafolio
        </Link>
        <Link
          href="/clientes"
          className={`nav-link ${isClientes ? 'active' : ''}`}
        >
          Clientes
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
