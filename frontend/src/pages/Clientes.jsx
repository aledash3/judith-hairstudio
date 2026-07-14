import React, { useEffect, useState } from 'react';
import {
    getClientes,
    getCliente,
    registrarCliente,
    agregarVisita,
    actualizarCliente,
    eliminarCliente
} from '../services/api';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [nombre, setNombre] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    
    // NUEVOS ESTADOS PARA VISTA INTERNA
    const [vista, setVista] = useState('lista'); // 'lista' o 'detalle'
    const [clienteSeleccionadoId, setClienteSeleccionadoId] = useState(null);

    // Estados para visitas
    const [selectedCliente, setSelectedCliente] = useState('');
    const [tipoServicio, setTipoServicio] = useState(''); 
    const [descripcion, setDescripcion] = useState('');   
    const [monto, setMonto] = useState('');

    const [editandoClienteId, setEditandoClienteId] = useState(null);

    const cargarClientes = () => {
        getClientes()
            .then(res => setClientes(res.data))
            .catch(err => console.error("Error cargando clientes:", err));
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleVerDetalle = async (id) => {

    try {

        const res = await getCliente(id);

        setClienteSeleccionadoId(res.data);

        setVista("detalle");

    } catch (error) {

        alert("No se pudo cargar el cliente.");

    }

};
    const handleGuardarCliente = async (e) => {
        e.preventDefault();
        try {
            if (editandoClienteId) {
                await actualizarCliente(editandoClienteId, { nombre, whatsapp });
                alert("Cliente actualizado con éxito.");
            } else {
                await registrarCliente({ nombre, whatsapp });
                alert("Cliente registrado con éxito.");
            }
            resetFormularioCliente();
            cargarClientes();
        } catch (error) {
            alert(error.response?.data?.mensaje || "Error al procesar la solicitud.");
        }
    };

    const handleIniciarEdicionCliente = (cliente) => {
        setEditandoClienteId(cliente._id);
        setNombre(cliente.nombre);
        setWhatsapp(cliente.whatsapp);
    };

    const handleEliminarCliente = async (id, nombreCliente) => {
        if (window.confirm(`¿Seguro que deseas eliminar a "${nombreCliente}"?`)) {
            try {
                await eliminarCliente(id);
                alert("Cliente eliminado.");
                if (editandoClienteId === id) resetFormularioCliente();
                cargarClientes();
            } catch (error) {
                alert("Error al eliminar cliente.");
            }
        }
    };

    const resetFormularioCliente = () => {
        setEditandoClienteId(null);
        setNombre('');
        setWhatsapp('');
    };

    const handleAgregarVisita = async (e) => {
        e.preventDefault();
        const servicioCompleto = `${tipoServicio} - ${descripcion}`;
        try {
            await agregarVisita(selectedCliente, { servicio: servicioCompleto, monto });
            alert("Visita agregada correctamente.");
            setTipoServicio('');
            setDescripcion('');
            setMonto('');
            setSelectedCliente('');
            cargarClientes();
        } catch (error) {
            alert("Error al registrar visita.");
        }
    };

    const obtenerPlaceholderDescripcion = () => {
        switch (tipoServicio) {
            case 'Corte': return 'Ej. Bob largo con capas sutiles';
            case 'Tinte': return 'Ej. Balayage en tonos cenizos';
            case 'Keratina': return 'Ej. Alisado orgánico';
            case 'Peinado': return 'Ej. Recogido elegante';
            default: return 'Seleccione un tipo de servicio...';
        }
    };

    const obtenerBadgeFidelidad = (totalVisitas) => {
        if (totalVisitas > 10) return { texto: '🔥 Cliente Fiel', clase: 'fiel' };
        else if (totalVisitas >= 5) return { texto: '⭐ Cliente Frecuente', clase: 'frecuente' };
        else return { texto: 'Cliente', clase: 'estandar' };
    };

    return (
        <div className="clientes-view">
            {vista === 'lista' ? (
                <>
                    <h1 className="page-title">Gestión de Perfiles y Fidelización</h1>

                    <div className="forms-split-layout">
                        <form onSubmit={handleGuardarCliente} className="form-container">
                            <h2 className="form-title">{editandoClienteId ? "📝 Editar Perfil" : "Registrar Nuev@ Client@"}</h2>
                            <div className="form-group">
                                <label className="form-label">Nombre Completo:</label>
                                <input type="text" className="form-input" value={nombre} onChange={e => setNombre(e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Número de WhatsApp:</label>
                                <input type="text" className="form-input" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button type="submit" className="btn-submit" style={{ flex: 2 }}>{editandoClienteId ? "Guardar Cambios" : "Dar de Alta"}</button>
                                {editandoClienteId && <button type="button" className="btn-submit" style={{ flex: 1, backgroundColor: '#a8a099' }} onClick={resetFormularioCliente}>Cancelar</button>}
                            </div>
                        </form>

                        <form onSubmit={handleAgregarVisita} className="form-container">
                            <h2 className="form-title">Añadir Visita / Servicio</h2>
                            <div className="form-group">
                                <label className="form-label">Seleccionar Clienta:</label>
                                <select className="form-select" value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)} required>
                                    <option value="">Seleccione...</option>
                                    {clientes.map(c => <option key={c._id} value={c._id}>{c.nombre} ({c.whatsapp})</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tipo de Servicio:</label>
                                <select className="form-select" value={tipoServicio} onChange={e => setTipoServicio(e.target.value)} required>
                                    <option value="">Seleccione...</option>
                                    <option value="Corte">Corte</option>
                                    <option value="Tinte">Tinte / Colorimetría</option>
                                    <option value="Keratina">Keratina / Alisado</option>
                                    <option value="Peinado">Peinado</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Descripción técnica:</label>
                                <input type="text" className="form-input" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder={obtenerPlaceholderDescripcion()} disabled={!tipoServicio} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Monto Cobrado ($):</label>
                                <input type="number" className="form-input" value={monto} onChange={e => setMonto(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-submit">Registrar Visita</button>
                        </form>
                    </div>

                    <h2 className="table-title">Historial y Fidelización de Clientes</h2>
                    <div className="table-wrapper">
                        <table className="table-custom">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>WhatsApp</th>
                                    <th>Visitas Totales</th>
                                    <th>Fidelidad</th>
                                    <th style={{ textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientes.map((c) => {
                                    const badge = obtenerBadgeFidelidad(c.totalVisitas || 0);
                                    return (
                                        <tr key={c._id}>
                                            <td>{c.nombre}</td>
                                            <td>{c.whatsapp}</td>
                                            <td>{c.totalVisitas || 0}</td>
                                            <td><span className={`badge-fidelidad ${badge.clase}`}>{badge.texto}</span></td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                                    <button type="button" style={{ padding: '0.3rem 0.6rem', background: '#d4a373', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }} onClick={() => handleVerDetalle(c._id)}>👁️ Ver</button>
                                                    <button type="button" style={{ padding: '0.3rem 0.6rem', background: '#dfd3c3', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => handleIniciarEdicionCliente(c)}>✏️ Editar</button>
                                                    <button type="button" style={{ padding: '0.3rem 0.6rem', background: '#e76f51', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', fontWeight: 'bold' }} onClick={() => handleEliminarCliente(c._id, c.nombre)}>🗑️ Eliminar</button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                /* VISTA DE DETALLE INTEGRADA */
                <div className="detalle-container">
                    <button
                        type="button"
                        className="btn-submit"
                        style={{ marginBottom: '1rem', backgroundColor: '#a8a099', width: 'auto', padding: '0.5rem 1rem' }}
                        onClick={() => setVista('lista')}
                    >
                        ← Volver a la lista
                    </button>

                    <h2 className="page-title">Detalle del Cliente</h2>

                    <div className="form-container">
                        {clienteSeleccionadoId ? (
                            <div>
                                <h3>Información de: {clienteSeleccionadoId.nombre}</h3>

                                <p><strong>ID:</strong> {clienteSeleccionadoId._id}</p>
                                <p><strong>WhatsApp:</strong> {clienteSeleccionadoId.whatsapp}</p>
                                <p><strong>Total Visitas:</strong> {clienteSeleccionadoId.totalVisitas || 0}</p>

                                <hr style={{ margin: '1.5rem 0' }} />

<h3 style={{ marginBottom: '1rem' }}>
    Historial de Visitas
</h3>

{clienteSeleccionadoId.historialVisitas &&
clienteSeleccionadoId.historialVisitas.length > 0 ? (

    <table className="table-custom">
        <thead>
            <tr>
                <th>#</th>
                <th>Servicio</th>
                <th>Monto</th>
                <th>Fecha</th>
            </tr>
        </thead>

        <tbody>

            {clienteSeleccionadoId.historialVisitas.map((visita,index)=>(

                <tr key={index}>
                    <td>{index+1}</td>
                    <td>{visita.servicio}</td>
                    <td>$ {Number(visita.monto).toFixed(2)}</td>
                    <td>
                        {new Date(visita.fecha).toLocaleDateString("es-EC")}
                    </td>
                </tr>

            ))}

        </tbody>

    </table>

) : (

    <p>Este cliente aún no registra visitas.</p>

)}
                            </div>
                        ) : (
                            <p>Cargando información...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clientes;