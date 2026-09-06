import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});

export const getMetricas = (filtro = 'mes') => API.get(`/dashboard/metricas?filtro=${filtro}`);

export const getPortafolios = () => API.get('/portafolio');
export const crearPortafolio = (formData) => API.post('/portafolio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const eliminarPortafolio = (id) => API.delete(`/portafolio/${id}`);
export const actualizarPortafolio = (id, data) => API.put(`/portafolio/${id}`, data);

export const getClientes = () => API.get('/clientes');
export const getCliente = (id) => API.get(`/clientes/${id}`);
export const registrarCliente = (data) => API.post('/clientes', data);
export const agregarVisita = (id, data) => API.post(`/clientes/${id}/visitas`, data);
export const actualizarCliente = (id, datos) => API.put(`/clientes/${id}`, datos);
export const eliminarCliente = (id) => API.delete(`/clientes/${id}`);

export default API;
