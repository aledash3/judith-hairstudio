import React, { useEffect, useState } from 'react';
import { getMetricas } from '../services/api';

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMetricas()
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar métricas:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="loading-state">Cargando indicadores de gestión...</div>;
    if (!data) return <div className="error-state">Error al conectar con las métricas del sistema.</div>;

    return (
        <div className="dashboard-view">
            <h1 className="page-title">Panel de Control - Peluqueria Judith</h1>
            
            {/* Tarjetas de Indicadores Clave (KPIs) */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <span className="kpi-label">Ingresos Totales</span>
                    <span className="kpi-value">${data.kpis.ingresosTotales}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Clientes Registrados</span>
                    <span className="kpi-value">{data.kpis.totalClientes}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Servicios Realizados</span>
                    <span className="kpi-value">{data.kpis.totalServicios}</span>
                </div>
                <div className="kpi-card">
                    <span className="kpi-label">Trabajos en Portafolio</span>
                    <span className="kpi-value">{data.kpis.totalPortafolios}</span>
                </div>
            </div>

            {/* Listado de Servicios Más Solicitados */}
            <div className="ranking-section">
                <h2 className="section-title">Servicios Estrella (Más Solicitados)</h2>
                <div className="ranking-list">
                    {data.serviciosTop.length === 0 ? (
                        <p className="no-data">Aún no se registran servicios en el historial.</p>
                    ) : (
                        data.serviciosTop.map((srv, index) => (
                            <div key={index} className="ranking-item">
                                <span className="ranking-position">#{index + 1}</span>
                                <span className="ranking-name">{srv._id}</span>
                                <span className="ranking-count">
                                    {srv.cantidad} {srv.cantidad === 1 ? "visita" : "visitas"}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
