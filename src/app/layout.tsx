import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import '@/styles/custom-palette.css';

export const metadata: Metadata = {
  title: 'Judith HairStudio — Sistema de Gestión y Portafolio',
  description: 'Plataforma integral para gestión de clientes, historial de visitas, analítica financiera en tiempo real y portafolio de transformaciones capilares.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Judith HairStudio — Gestión de Salón de Belleza',
    description: 'Gestión de clientes, visitas e indicadores financieros para salones de belleza.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <div className="app-container">
          <Navbar />
          <main className="content-container">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
