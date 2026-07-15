import React, { useEffect, useState } from 'react';
import { getPortafolios, crearPortafolio, eliminarPortafolio, actualizarPortafolio } from '../services/api';
import { API_BASE_URL } from '../services/api';

const Portafolio = () => {
    const [portafolios, setPortafolios] = useState([]);
    const [tipoServicio, setTipoServicio] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fotoAntes, setFotoAntes] = useState(null);
    const [fotoDespues, setFotoDespues] = useState(null);
    
    // Estados para controlar si estamos editando
    const [editandoId, setEditandoId] = useState(null);

    const cargarPortafolio = () => {
        getQueryPortafolios();
    };

    const getQueryPortafolios = () => {
        getPortafolios()
            .then(res => setPortafolios(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        cargarPortafolio();
    }, []);

    // Acción de Guardar (Crear o Modificar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (editandoId) {
            try {
                await actualizarPortafolio(editandoId, { tipoServicio, descripcion });
                alert("Portafolio actualizado correctamente.");
                resetFormulario();
                cargarPortafolio();
            } catch (error) {
                alert("Error al actualizar el portafolio.");
            }
        } else {
            const formData = new FormData();
            formData.append('tipoServicio', tipoServicio);
            formData.append('descripcion', descripcion);
            formData.append('fotoAntes', fotoAntes);
            formData.append('fotoDespues', fotoDespues);

            try {
                await crearPortafolio(formData);
                alert("Portafolio guardado y optimizado correctamente.");
                resetFormulario();
                e.target.reset();
                cargarPortafolio();
            } catch (error) {
                alert("Error al subir el portafolio técnico.");
            }
        }
    };

    const handleIniciarEdicion = (item) => {
        setEditandoId(item._id);
        setTipoServicio(item.tipoServicio);
        setDescripcion(item.descripcion || '');
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar permanentemente este trabajo del portafolio?")) {
            try {
                await eliminarPortafolio(id);
                alert("Trabajo eliminado correctamente.");
                cargarPortafolio();
            } catch (error) {
                alert("Error al eliminar el elemento seleccionado.");
            }
        }
    };

    // 🔥 NUEVA FUNCIÓN: Combina fotos en formato vertical 9:16 (1080x1920) para Stories, TikTok e IG Reels
    const handleExportarFormatoVertical = async (item) => {
        try {
            const URL_ANTES = `${API_BASE_URL}${item.fotoAntesUrl}`;
            const URL_DESPUES = `${API_BASE_URL}${item.fotoDespuesUrl}`;

            // 1. Cargar imágenes en memoria con CORS habilitado
            const cargarImagen = (src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous'; 
                    img.src = src;
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                });
            };

            const [imgAntes, imgDespues] = await Promise.all([
                cargarImagen(URL_ANTES),
                cargarImagen(URL_DESPUES)
            ]);

            // 2. Configurar el Canvas en resolución vertical HD (1080x1920)
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1920;
            const ctx = canvas.getContext('2d');

            // Fondo blanco
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 3. Dimensiones para mitades horizontales (960px de alto cada una)
            const mitadesAlto = canvas.height / 2; // 960px

            const dibujarEnMitadHorizontal = (img, yInicio) => {
                const escala = Math.max(canvas.width / img.width, mitadesAlto / img.height);
                const xCentrado = (canvas.width - img.width * escala) / 2;
                const yCentrado = yInicio + (mitadesAlto - img.height * escala) / 2;
                
                ctx.save();
                // Delimitar el área para que no se desborde horizontalmente
                ctx.beginPath();
                ctx.rect(0, yInicio, canvas.width, mitadesAlto);
                ctx.clip();
                ctx.drawImage(img, xCentrado, yCentrado, img.width * escala, img.height * escala);
                ctx.restore();
            };

            // Dibujamos Antes (Arriba) y Después (Abajo)
            dibujarEnMitadHorizontal(imgAntes, 0);
            dibujarEnMitadHorizontal(imgDespues, mitadesAlto);

            // 4. Línea divisoria horizontal limpia
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(0, mitadesAlto);
            ctx.lineTo(canvas.width, mitadesAlto);
            ctx.stroke();

            // 5. Agregar Etiquetas estilizadas en una posición no obstructiva (Esquina superior izquierda de cada mitad)
            const configurarEtiqueta = (texto, yPosition) => {
                const xMargin = 50;
                const yMargin = yPosition + 50;

                ctx.save();
                // Caja de fondo semi-transparente y redondeada para la etiqueta
                ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                ctx.beginPath();
                ctx.roundRect(xMargin, yMargin, 200, 60, 8); // x, y, width, height, radius
                ctx.fill();

                // Texto interno
                ctx.font = 'bold 26px sans-serif';
                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(texto, xMargin + 100, yMargin + 30);
                ctx.restore();
            };

            configurarEtiqueta('ANTES', 0);
            configurarEtiqueta('DESPUÉS', mitadesAlto);

            // 6. Descarga del archivo final
            canvas.toBlob((blob) => {
                const urlBlob = window.URL.createObjectURL(blob);
                const enlace = document.createElement('a');
                enlace.href = urlBlob;
                enlace.download = `STORY-${item.tipoServicio}-${item._id.substring(18)}.webp`;
                document.body.appendChild(enlace);
                enlace.click();
                
                document.body.removeChild(enlace);
                window.URL.revokeObjectURL(urlBlob);
            }, 'image/webp', 0.95);

        } catch (error) {
            console.error("Error combinando imágenes para celular:", error);
            alert("No se pudo procesar la imagen vertical. Comprueba la conexión con tu API.");
        }
    };

    const resetFormulario = () => {
        setEditandoId(null);
        setTipoServicio('');
        setDescripcion('');
        setFotoAntes(null);
        setFotoDespues(null);
    };

    return (
        <div className="portafolio-view">
            <h1 className="page-title">Módulo de Portafolio Visual</h1>
            
            {/* Formulario Dinámico */}
            <form onSubmit={handleSubmit} className="form-container">
                <h2 className="form-title">
                    {editandoId ? "📝 Editar Información del Trabajo" : "📸 Registrar Nuevo Trabajo"}
                </h2>
                <div className="form-group">
                    <label className="form-label">Tipo de Servicio Capilar:</label>
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
                    <input type="text" className="form-input" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Ej. Balayage en tonos cenizos" />
                </div>

                {!editandoId && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Fotografía del ANTES:</label>
                            <input type="file" accept="image/*" className="form-file" onChange={e => setFotoAntes(e.target.files[0])} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Fotografía del DESPUÉS:</label>
                            <input type="file" accept="image/*" className="form-file" onChange={e => setFotoDespues(e.target.files[0])} required />
                        </div>
                    </>
                )}

                <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                    <button type="submit" className="btn-submit">
                        {editandoId ? "Actualizar Cambios" : "Guardar y Emparejar"}
                    </button>
                    {editandoId && (
                        <button type="button" className="btn-submit" style={{ backgroundColor: '#a8a099' }} onClick={resetFormulario}>
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Galería de Resultados */}
            <h2 className="gallery-title">Galería de Transformaciones</h2>
            <div className="gallery-grid">
                {portafolios.map((item) => (
                    <div key={item._id} className="gallery-card" style={{ position: 'relative' }}>
                        <span className="badge-service">{item.tipoServicio}</span>
                        <div className="images-comparison">
                            <div className="img-box">
                                <p className="img-label">Antes</p>
                                <img src={`${API_BASE_URL}${item.fotoAntesUrl}`} alt="Antes" />
                            </div>
                            <div className="img-box">
                                <p className="img-label">Después</p>
                                <img src={`${API_BASE_URL}${item.fotoDespuesUrl}`} alt="Después" />
                            </div>
                        </div>
                        
                        <div className="card-footer-layout" style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                            {item.descripcion && <p style={{ margin: 0, fontSize: '0.95rem', color: '#554a42', fontWeight: 500 }}>{item.descripcion}</p>}
                            
                            {/* Panel de Gestión de botones */}
                            <div className="card-actions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        className="btn-action-edit" 
                                        style={{ flex: 1, padding: '0.5rem', background: '#dfd3c3', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: '#2c2520' }}
                                        onClick={() => handleIniciarEdicion(item)}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className="btn-action-delete" 
                                        style={{ flex: 1, padding: '0.5rem', background: '#e76f51', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}
                                        onClick={() => handleEliminar(item._id)}
                                    >
                                        Borrar
                                    </button>
                                </div>
                                
                                {/* Botón de exportación unificada vertical para móvil */}
                                <button 
                                    type="button"
                                    style={{ width: '100%', padding: '0.6rem', background: '#e07a5f', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={() => handleExportarFormatoVertical(item)}
                                >
                                    📱 Descargar fotos para redes (Vertical)
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portafolio;