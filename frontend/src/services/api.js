import axios from 'axios';

// 1. Detectamos dinámicamente la IP de la máquina host
const ipHost = window.location.hostname; 

// 2. Definimos la URL base apuntando al puerto de tu Backend (5000)
export const API_BASE_URL = `http://${ipHost}:5000`;

// 3. Declaramos la instancia de Axios una SOLA vez
const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});
// ==========================================
// SERVICIOS DEL DASHBOARD / INDICADORES
// ==========================================
export const getMetricas = () => API.get('/dashboard/metricas');

// ==========================================
// SERVICIOS DEL PORTAFOLIO
// ==========================================
export const getPortafolios = () => API.get('/portafolio');
export const crearPortafolio = (formData) => API.post('/portafolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const eliminarPortafolio = (id) => API.delete(`/portafolio/${id}`);
export const actualizarPortafolio = (id, data) => API.put(`/portafolio/${id}`, data);

// ==========================================
// SERVICIOS DE CLIENTES Y FIDELIZACIÓN
// ==========================================
export const getClientes = () => API.get('/clientes');
export const registrarCliente = (data) => API.post('/clientes', data);
export const agregarVisita = (id, data) => API.post(`/clientes/${id}/visitas`, data);

export default API;

// ==========================================
// MODIFICAR Y ELIMINAR CLIENTES
// ==========================================
export const actualizarCliente = (id, datos) => {
    return API.put(`/clientes/${id}`, datos); 
};

export const eliminarCliente = (id) => {
    return API.delete(`/clientes/${id}`);
};

// DETALLE
export const getCliente = (id) => {
    return API.get(`/clientes/${id}`);
};