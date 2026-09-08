# 💇 Judith HairStudio — Sistema de Gestión para Salón de Belleza

[![CI](https://img.shields.io/github/actions/workflow/status/aledash3/judith-hairstudio/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/aledash3/judith-hairstudio/actions)
[![Node.js](https://img.shields.io/badge/Node.js-22.13+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11+-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Licencia: MIT](https://img.shields.io/badge/Licencia-MIT-yellow?style=for-the-badge)](LICENSE)
[![English](https://img.shields.io/badge/Language-English-blue?style=for-the-badge)](README.md)

Sistema web Full-Stack MERN diseñado para la administración integral de peluquerías, salones de belleza y centros estéticos. Permite gestionar clientes, historial de visitas, control de ingresos, análisis de fidelización en un dashboard interactivo y un catálogo de transformaciones visuales optimizado en WebP con exportación para redes sociales.

> 🌐 **Language / Idioma:** Español | [Switch to English documentation](README.md)

---

## Alcance y verificación

Proyecto académico/de portafolio. El repositorio documenta funciones, capturas de demostración y un workflow de CI; no afirma uso productivo validado. Antes de utilizar datos reales, deben verificarse accesos, archivos subidos, HTTPS, respaldos y configuración de despliegue. El requisito de Node.js se define en `engines.node` del `package.json` raíz: >=22.13.

## 🖥️ Interfaz de la Aplicación

| Dashboard de Métricas | Directorio de Clientes |
| :---: | :---: |
| ![Dashboard](docs/dashboard.png) | ![Clientes](docs/clientes.png) |

| Detalle de Visitas | Portafolio de Transformaciones |
| :---: | :---: |
| ![Detalle de cliente](docs/detalleclientes.png) | ![Portafolio](docs/portafolio.png) |

> *Nota: Los datos visualizados en las capturas son ficticios y con fines ilustrativos.*

---

## 📌 Funcionalidades

### 👥 Gestión de Clientes y Visitas
- Operaciones completas CRUD (Crear, Consultar, Actualizar y Eliminar) para clientes e historiales de visitas.
- Identificador interno generado por MongoDB (`_id`), sin solicitar ni almacenar cédulas de identidad.
- Validación estricta de números telefónicos móviles de Ecuador (exactamente 10 dígitos numéricos iniciando con `09`).
- Soporte para números compartidos entre diferentes personas (por ejemplo, miembros de una misma familia).
- Prevención de duplicados inteligente: solo se bloquea el registro si coinciden el nombre normalizado y el número de teléfono.
- Registro detallado de visitas con validación de importes no negativos, servicios prestados y notas técnicas.

### 📊 Dashboard de Métricas en Tiempo Real
- Indicadores comerciales clave: total de clientes registrados, ingresos acumulados, número de visitas y ticket promedio.
- Métricas agregadas con el ranking de servicios más solicitados e índices de recurrencia de clientes.
- Gráficos y resúmenes para el seguimiento operativo diario y mensual del negocio.

### 📸 Portafolio y Pipeline de Imágenes en WebP
- Catálogo de transformaciones de antes y después categorizado por técnica de peinado o colorimetría.
- Compresión y conversión automática en el servidor a formato WebP de alto rendimiento mediante la librería `sharp`.
- Generador de composiciones verticales de alta calidad diseñadas para historias de Instagram y publicaciones en redes sociales.

---

## 🏗 Arquitectura del Sistema

El proyecto está estructurado como un **monorepo workspace con pnpm**, aplicando el patrón arquitectónico MVC con separación rigurosa de responsabilidades:

```text
React 18 + Vite (Frontend)
    │
    │  Cliente Axios / Proxy de desarrollo
    ▼
API REST con Express.js (Backend)
    │
    ├── Middlewares (Manejo de archivos Multer, errores centralizados, validadores)
    ├── Routers (Enrutadores modulares por entidad)
    ├── Controllers (Controladores de peticiones y respuestas HTTP)
    ├── Services (Capa de lógica de negocio y validaciones de dominio)
    └── Models (Esquemas de Mongoose e índices en MongoDB)
    │
    ▼
MongoDB (Base de datos NoSQL)
```

---

## 📁 Estructura del Repositorio

```text
judith-hairstudio/
├── .github/
│   └── workflows/
│       └── ci.yml               # Pipeline de CI (pnpm install, test, lint, build)
├── backend/
│   ├── config/                  # Conexión a la base de datos (MongoDB / Mongoose)
│   ├── controllers/             # Controladores de las rutas HTTP
│   ├── middlewares/             # Subida de imágenes, manejador asíncrono y errores
│   ├── models/                  # Modelos Mongoose (Cliente, Portafolio)
│   ├── routers/                 # Definición de rutas de la API
│   ├── scripts/                 # Scripts de migración (ej. remoción de índice único)
│   ├── services/                # Lógica de negocio desacoplada
│   ├── test/                    # Pruebas unitarias con el test runner nativo de Node.js
│   ├── utils/                   # Clases y utilidades de errores HTTP
│   ├── validators/              # Validadores de datos de entrada
│   ├── package.json             # Dependencias y scripts del backend
│   └── server.js                # Inicialización del servidor Express
├── frontend/
│   ├── src/
│   │   ├── pages/               # Vistas (Clientes, Dashboard, Portafolio)
│   │   ├── services/            # Cliente Axios centralizado
│   │   ├── styles/              # Sistema de estilos y diseño personalizado
│   │   ├── App.jsx              # Enrutador principal de React
│   │   └── index.jsx            # Punto de entrada de la aplicación
│   ├── index.html               # Plantilla SPA
│   ├── package.json             # Dependencias y scripts del frontend
│   └── vite.config.js           # Configuración de Vite y proxy de desarrollo
├── docs/                        # Capturas de pantalla de la interfaz
├── .gitignore                   # Reglas de exclusión para Git
├── .npmrc                       # Reglas estrictas de dependencias y motores
├── pnpm-lock.yaml               # Archivo de bloqueo reproducible de pnpm
├── pnpm-workspace.yaml          # Declaración del espacio de trabajo pnpm
├── package.json                 # Scripts globales y metadatos del monorepo
├── LICENSE                      # Licencia MIT
├── README.md                    # Documentación técnica en inglés
└── README.es.md                 # Documentación pedagógica en español
```

---

## 🛠 Tecnologías Utilizadas

| Capa | Tecnologías |
| --- | --- |
| **Frontend** | React 18, Vite 5, React Router 7, Axios, CSS Modules / Paleta personalizada |
| **Backend** | Node.js 22.13+, Express 4, Multer, Sharp, Mongoose 8, MongoDB Driver |
| **Gestión y Workspace** | pnpm 11 Workspace, ESLint 9, Node.js Native Test Runner |
| **CI / DevOps** | GitHub Actions, Git |

---

## 🚀 Instalación y Despliegue Local

### Requisitos previos
- **Node.js**: versión 22 o superior.
- **pnpm**: versión 11 o superior (`npm install -g pnpm` o vía `corepack enable`).
- **MongoDB**: instancia local activa o clúster en MongoDB Atlas.

### 1. Clonar el repositorio
```bash
git clone https://github.com/aledash3/judith-hairstudio.git
cd judith-hairstudio
```

### 2. Instalar dependencias del espacio de trabajo
```bash
pnpm install
```

### 3. Configuración de variables de entorno
Crea el archivo `.env` en la carpeta `backend` a partir de la plantilla de ejemplo:
```bash
# En backend/.env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/judith-hairstudio
```

Para el frontend, puedes configurar `frontend/.env`:
```bash
# En frontend/.env
# Dejar en blanco en desarrollo para aprovechar el proxy inverso de Vite
VITE_API_URL=
```

### 4. Ejecución del sistema
```bash
# Ejecutar backend y frontend de forma simultánea
pnpm dev

# O ejecutarlos en terminales separadas
pnpm dev:backend   # API disponible en http://localhost:5000
pnpm dev:frontend  # Interfaz en http://localhost:3000
```

---

## 🧪 Pruebas Automatizadas y Calidad de Código

El monorepo cuenta con verificación de pruebas unitarias, análisis estático y compilación:

```bash
# Ejecutar pruebas unitarias del backend
pnpm test

# Ejecutar análisis de linter en el frontend
pnpm lint

# Compilar build de producción del frontend
pnpm build
```

---

## 🔌 Referencia de la API REST

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Verificación de estado del servidor |
| `GET` | `/api/dashboard/metricas` | Métricas generales del dashboard y análisis de ingresos |
| `GET` | `/api/clientes` | Obtiene la lista completa de clientes |
| `POST` | `/api/clientes` | Registra un nuevo cliente |
| `GET` | `/api/clientes/:id` | Obtiene el detalle y visitas de un cliente |
| `POST` | `/api/clientes/:id/visitas` | Registra una nueva visita para el cliente |
| `PUT` | `/api/clientes/:id` | Actualiza los datos de un cliente |
| `DELETE` | `/api/clientes/:id` | Elimina el registro de un cliente |
| `GET` | `/api/portafolio` | Obtiene la lista de trabajos del portafolio |
| `POST` | `/api/portafolio` | Sube un nuevo trabajo con imágenes |
| `PUT` | `/api/portafolio/:id` | Actualiza la información de un trabajo |
| `DELETE` | `/api/portafolio/:id` | Elimina un trabajo y sus recursos |

---

## 👨‍💻 Autor

**David Alejandro Cruz Palacios**
Estudiante de Ingeniería en Ciencias de la Computación — Universidad Politécnica Salesiana
GitHub: [@aledash3](https://github.com/aledash3)

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
