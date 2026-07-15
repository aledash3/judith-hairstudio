# 💇 Judith HairStudio - Sistema de Gestión y Fidelización de Clientes

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![](https://img.shields.io/badge/-646CFF?style=for-the-badge&logo=&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge)
![REST API](https://img.shields.io/badge/REST-API-blue?style=for-the-badge)

---

# 📌 Descripción General

**Judith HairStudio** es una aplicación web Full Stack desarrollada con la arquitectura **MERN (MongoDB, Express.js, React y Node.js)**, diseñada para optimizar la administración de un salón de belleza.

El sistema centraliza la gestión de clientes, el registro de visitas, el seguimiento de fidelización y la administración del portafolio de servicios, permitiendo mantener organizada la información del negocio mediante una interfaz moderna e intuitiva.

El proyecto implementa una arquitectura basada en el patrón **MVC (Modelo-Vista-Controlador)** y una API REST para la comunicación entre el frontend y el backend.

---

# 🎯 Objetivos

## Objetivo General

Desarrollar un sistema web que facilite la gestión administrativa de un salón de belleza mediante el registro de clientes, servicios y visitas, mejorando el control de la información y el seguimiento de la fidelización de los clientes.

## Objetivos Específicos

- Administrar el registro de clientes.
- Registrar visitas y servicios realizados.
- Llevar un historial completo de cada cliente.
- Implementar indicadores de fidelización.
- Administrar el portafolio de servicios del salón.
- Mostrar indicadores generales mediante un dashboard.
- Aplicar una arquitectura Full Stack utilizando tecnologías MERN.

---

# ✨ Funcionalidades

## 👥 Gestión de Clientes

- Registro de nuevos clientes.
- Actualización de información.
- Eliminación de clientes.
- Consulta del historial individual.
- Visualización del total de visitas.

---

## 💎 Fidelización

- Registro de visitas.
- Historial completo por cliente.
- Conteo automático de visitas.
- Clasificación de clientes según frecuencia.

---

## 💇 Portafolio de Servicios

- Registro de servicios.
- Carga de imágenes.
- Edición de información.
- Eliminación de servicios.
- Organización del portafolio.

---

## 📊 Dashboard

- Total de clientes registrados.
- Total de servicios.
- Indicadores generales.
- Métricas de fidelización.

---

# 🏗 Arquitectura del Sistema

```text
React + 
      │
      │ Axios
      ▼
API REST (Express.js)
      │
      ▼
Controladores (MVC)
      │
      ▼
MongoDB (Mongoose)
```

---

# 🛠 Tecnologías Utilizadas

## Frontend

- React
- Vite
- Axios
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Multer

## Herramientas

- Git
- GitHub
- Visual Studio Code
- Postman

---

# 📂 Estructura del Proyecto

```text
JudithHairStudio/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routers/
│   ├── uploads/
│   ├── package.json
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── .config.js
│   └── index.html
│
├── README.md
└── .gitignore
```

---

# 🗄 Modelo de Base de Datos

## Cliente

```text
Nombre
WhatsApp
Historial de Visitas
Total de Visitas
Fecha de Registro
```

---

## Visita

```text
Servicio
Monto
Fecha
```

---

## Servicio del Portafolio

```text
Título
Descripción
Imagen
Categoría
```

---

# 🚀 Despliegue

A continuación se describen los pasos necesarios para ejecutar el sistema en un nuevo equipo.

## Requisitos Previos

Antes de comenzar, asegúrese de contar con:

- Node.js 20 o superior
- npm
- Git
- Una instancia de MongoDB (local o MongoDB Atlas)

---

## 1. Clonar el repositorio

```bash
git clone https://github.com/aledash3/sistema-gestion-salon-belleza.git
```

---

## 2. Instalar dependencias

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

---

## 3. Configurar las variables de entorno

Crear el archivo:

```text
backend/.env
```

Si utiliza **MongoDB Atlas**, configure una cadena de conexión similar a:

```env
PORT=5000
MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/JudithHairStudio
```

Si utiliza **MongoDB Community** de forma local:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/JudithHairStudio
```

> **Importante:** El archivo `.env` no se encuentra incluido en este repositorio por razones de seguridad.

---

## 4. Configurar MongoDB Atlas (si aplica)

Si la base de datos se encuentra alojada en MongoDB Atlas:

- Crear un usuario con permisos sobre la base de datos.
- Configurar la cadena de conexión en el archivo `.env`.
- Agregar la dirección IP del equipo en **Network Access**.
- Para pruebas o desarrollo puede utilizar temporalmente:

```text
0.0.0.0/0
```

Esto permitirá conexiones desde cualquier dirección IP.

---

## 5. Ejecutar el Backend

```bash
cd backend
npm run dev
```

El servidor iniciará por defecto en:

```text
http://localhost:5000
```

---

## 6. Ejecutar el Frontend

```bash
cd frontend
npm run dev
```

 mostrará una dirección similar a:

```text
http://localhost:3000
```

---

## 7. Acceso desde otros dispositivos

El frontend obtiene automáticamente la dirección IP del equipo donde se ejecuta el servidor mediante:

```javascript
window.location.hostname
```

Esto permite acceder al sistema desde otros dispositivos conectados a la misma red local sin modificar el código fuente.

Únicamente es necesario que:

- Backend y Frontend estén en ejecución.
- Ambos dispositivos pertenezcan a la misma red.
- El puerto **5000** se encuentre disponible para el Backend.
- El puerto utilizado por **** se encuentre accesible para el Frontend.

---

## 8. Consideraciones

- No subir el archivo `.env` al repositorio.
- Verificar la conectividad con MongoDB antes de iniciar el sistema.
- Para un entorno de producción se recomienda restringir el acceso a MongoDB Atlas únicamente a las direcciones IP autorizadas.

---

# 📚 Conocimientos Aplicados

Durante el desarrollo del proyecto se implementaron conceptos de:

- Desarrollo Full Stack.
- Arquitectura MERN.
- Arquitectura MVC.
- Diseño de APIs REST.
- CRUD completo.
- Persistencia de datos con MongoDB.
- Consumo de APIs mediante Axios.
- Componentes funcionales de React.
- Hooks (`useState`, `useEffect`).
- Manejo de imágenes con Multer.
- Diseño de interfaces responsivas.

---

# 📸 Capturas del Sistema

## 📊 Dashboard

![Dashboard](docs/dashboard.png)

---

## 👥 Gestión de Clientes

![Clientes](docs/clientes.png)

---

## 📋 Detalle del Cliente

![Detalle Cliente](docs/detalleclientes.png)

---

## 💇 Portafolio de Servicios

![Portafolio](docs/portafolio.png)

---

# 📝 Nota

Las capturas de pantalla y los registros mostrados en este repositorio corresponden a **datos ficticios** creados exclusivamente con fines demostrativos y académicos.

No se utiliza información personal ni datos reales de clientes.

---
# 👨‍💻 Autor

**David Alejandro Cruz Palacios**

Estudiante de Ingeniería en Ciencias de la Computación

Universidad Politécnica Salesiana

Quito, Ecuador

---

# 📄 Licencia

Este proyecto fue desarrollado con fines académicos y de aprendizaje.

El código puede utilizarse como referencia educativa respetando los derechos de autor correspondientes.
