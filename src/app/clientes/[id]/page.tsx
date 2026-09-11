'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Visita {
  _id?: string;
  fecha: string;
  servicio: string;
  monto: number;
}

interface ClienteDetalle {
  _id: string;
  nombre: string;
  whatsapp: string;
  totalVisitas: number;
  historialVisitas: Visita[];
  fechaRegistro: string;
}

export default function ClienteDetallePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [cliente, setCliente] = useState<ClienteDetalle | null>(null);
  const [loading, setLoading] = useState(true);

  // Visita rápida directa en la ficha
  const [tipoServicio, setTipoServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');

  const cargarCliente = async () => {
    if (!id) return;
    try {
      const res = await fetch(`/api/clientes/${id}`);
      if (res.ok) {
        const data = await res.json();
        setCliente(data);
      } else {
        alert('No se encontró el cliente.');
        router.push('/clientes');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCliente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAgregarVisita = async (e: React.FormEvent) => {
    e.preventDefault();
    const servicioCompleto = `${tipoServicio} - ${descripcion}`;
    const montoNumerico = Number(monto);

    if (montoNumerico < 0) {
      alert('No se permiten montos negativos.');
      return;
    }

    try {
      const res = await fetch(`/api/clientes/${id}/visitas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servicio: servicioCompleto, monto: montoNumerico }),
      });
      if (res.ok) {
        alert('Visita agregada correctamente.');
        setTipoServicio('');
        setDescripcion('');
        setMonto('');
        cargarCliente();
      }
    } catch {
      alert('Error al registrar visita.');
    }
  };

  if (loading) return <div className="loading-state">Cargando ficha de clienta...</div>;
  if (!cliente) return <div className="error-state">Clienta no encontrada.</div>;

  const totalGastado = cliente.historialVisitas.reduce((acc, v) => acc + (v.monto || 0), 0);
  const ticketPromedio = cliente.totalVisitas > 0 ? totalGastado / cliente.totalVisitas : 0;

  return (
    <div className="detalle-cliente-view">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/clientes" className="btn btn-secondary" style={{ display: 'inline-block' }}>
          ← Volver al Directorio
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, color: 'var(--dark)' }}>{cliente.nombre}</h1>
            <p style={{ color: '#666', marginTop: '0.4rem' }}>
              📱 WhatsApp: <strong>{cliente.whatsapp}</strong> | Miembro desde:{' '}
              {new Date(cliente.fechaRegistro).toLocaleDateString('es-EC')}
            </p>
          </div>
          <a
            href={`https://wa.me/593${cliente.whatsapp.replace(/^0/, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
          >
            💬 Contactar por WhatsApp
          </a>
        </div>

        {/* Mini KPIs de la Clienta */}
        <div className="kpi-grid" style={{ marginTop: '1.5rem' }}>
          <div className="kpi-card">
            <span className="kpi-label">Total Visitas</span>
            <span className="kpi-value">{cliente.totalVisitas}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Inversión Acumulada</span>
            <span className="kpi-value">${totalGastado.toFixed(2)}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">Ticket Promedio</span>
            <span className="kpi-value">${ticketPromedio.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Registrar Visita en esta Ficha */}
      <div className="grid-forms">
        <div className="card form-card">
          <h2>Registrar Nueva Visita</h2>
          <form onSubmit={handleAgregarVisita}>
            <div className="form-group">
              <label>Tipo de Servicio</label>
              <select value={tipoServicio} onChange={(e) => setTipoServicio(e.target.value)} required>
                <option value="">-- Seleccionar --</option>
                <option value="Corte">Corte</option>
                <option value="Tinte">Tinte / Coloración</option>
                <option value="Keratina">Keratina / Alisado</option>
                <option value="Peinado">Peinado / Cepillado</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label>Detalle / Fórmula</label>
              <input
                type="text"
                placeholder="Ej. Tinte 7.1 con matizador azul"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Monto ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="30.00"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Guardar en Ficha
            </button>
          </form>
        </div>

        {/* Historial Cronológico */}
        <div className="card table-card">
          <h2>Historial de Atenciones ({cliente.historialVisitas.length})</h2>
          {cliente.historialVisitas.length === 0 ? (
            <p className="no-data">No se registran visitas previas.</p>
          ) : (
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Servicio / Detalle</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {[...cliente.historialVisitas].reverse().map((v, i) => (
                    <tr key={v._id || i}>
                      <td>{new Date(v.fecha).toLocaleDateString('es-EC')}</td>
                      <td>{v.servicio}</td>
                      <td>
                        <strong>${Number(v.monto).toFixed(2)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
