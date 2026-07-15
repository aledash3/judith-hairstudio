import React, { useEffect, useState } from 'react';
import { getMetricas } from '../services/api';

const Dashboard = () => {

    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState("mes");
    const [data, setData] = useState(null);

    useEffect(() => {

        setLoading(true);

        getMetricas(filtro)
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar métricas:", err);
                setLoading(false);
            });

    }, [filtro]);

    if (loading)
        return <div className="loading-state">Cargando indicadores...</div>;

    if (!data)
        return <div className="error-state">No fue posible cargar el Dashboard.</div>;

    return (

        <div className="dashboard-view">

            <h1 className="page-title">
                Panel de Control - Peluquería Judith
            </h1>

            <p
                style={{
                    textAlign: "center",
                    color: "#666",
                    marginTop: "-10px",
                    marginBottom: "20px"
                }}
            >
                Mostrando estadísticas de{" "}
                <strong>
                    {filtro === "dia" && "hoy"}
                    {filtro === "semana" && "los últimos 7 días"}
                    {filtro === "mes" && "los últimos 30 días"}
                </strong>
            </p>

            <div className="filter-buttons">

                <button
                    className={filtro === "dia" ? "active" : ""}
                    onClick={() => setFiltro("dia")}
                >
                    📅 Hoy
                </button>

                <button
                    className={filtro === "semana" ? "active" : ""}
                    onClick={() => setFiltro("semana")}
                >
                    📆 Últimos 7 días
                </button>

                <button
                    className={filtro === "mes" ? "active" : ""}
                    onClick={() => setFiltro("mes")}
                >
                    🗓️ Últimos 30 días
                </button>

            </div>

            {/* ================= KPI ================= */}

            <div className="kpi-grid">

                <div className="kpi-card">
                    <span className="kpi-label">
                        Ingresos Totales
                    </span>

                    <span className="kpi-value">
                        ${Number(data.kpis.ingresosTotales).toFixed(2)}
                    </span>
                </div>

                <div className="kpi-card">
                    <span className="kpi-label">
                        Clientes Registrados
                    </span>

                    <span className="kpi-value">
                        {data.kpis.totalClientes}
                    </span>
                </div>

                <div className="kpi-card">
                    <span className="kpi-label">
                        Servicios Realizados
                    </span>

                    <span className="kpi-value">
                        {data.kpis.totalServicios}
                    </span>
                </div>

                <div className="kpi-card">
                    <span className="kpi-label">
                        Trabajos en Portafolio
                    </span>

                    <span className="kpi-value">
                        {data.kpis.totalPortafolios}
                    </span>
                </div>

            </div>

            {/* ================= RANKING ================= */}

            <div className="ranking-section">

                <h2 className="section-title">

                    {filtro === "dia" &&
                        "Servicios Estrella (Más solicitados hoy)"}

                    {filtro === "semana" &&
                        "Servicios Estrella (Más solicitados en los últimos 7 días)"}

                    {filtro === "mes" &&
                        "Servicios Estrella (Más solicitados en los últimos 30 días)"}

                </h2>

                <div className="ranking-list">

                    {data.serviciosTop.length === 0 ? (

                        <p className="no-data">
                            No existen servicios registrados para este período.
                        </p>

                    ) : (

                        data.serviciosTop.map((srv, index) => (

                            <div
                                key={index}
                                className="ranking-item"
                            >

                                <span className="ranking-position">
                                    #{index + 1}
                                </span>

                                <span className="ranking-name">
                                    {srv._id}
                                </span>

                                <span className="ranking-count">
                                    {srv.cantidad}{" "}
                                    {srv.cantidad === 1 ? "visita" : "visitas"}
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