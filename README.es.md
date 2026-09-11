# 💇 Judith HairStudio — Sistema de Gestión y Portafolio para Salón de Belleza

[![CI](https://img.shields.io/github/actions/workflow/status/aledash3/judith-hairstudio/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/aledash3/judith-hairstudio/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11+-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![English](https://img.shields.io/badge/Language-English-blue?style=for-the-badge)](README.md)

Aplicación web Full-Stack moderna diseñada para salones de belleza, peluquerías y centros estéticos. Desarrollada con **Next.js 15 (App Router)**, **TypeScript**, **Mongoose** y **Sharp**, centraliza la administración de clientas, registro de visitas e ingresos, analítica financiera en tiempo real y un portafolio de transformaciones capilares Antes/Después optimizado a WebP con exportador vertical para historias de Instagram y TikTok.

> 🌐 **Language / Idioma:** [Read in English](README.md) | Español

---

## 🖥️ Interfaz de la Aplicación

| Panel de Control (KPIs en Vivo) | Directorio de Clientas |
| :---: | :---: |
| ![Dashboard](docs/dashboard.png) | ![Clientes](docs/clientes.png) |

| Ficha Individual de Clienta & Historial | Portafolio de Transformaciones (Antes/Después) |
| :---: | :---: |
| ![Detalle Clientes](docs/detalleclientes.png) | ![Portafolio](docs/portafolio.png) |

> *Nota: Las capturas muestran datos ficticios únicamente para fines demostrativos.*

---

## 📌 Características Principales

### 👥 Gestión de Clientas y Visitas (Reglas de Negocio Ecuatorianas)
- **Deep Linking Real:** Navegación directa a la ficha de cada clienta (`/clientes/[id]`) con historial cronológico, inversión acumulada y cálculo de ticket promedio.
- **Validación Estricta de Teléfono:** Validación de celulares ecuatorianos de exactamente 10 dígitos iniciando con `09` (`^09\d{8}$`).
- **Deduplicación Inteligente:** Permite números compartidos entre familiares y bloquea duplicados únicamente cuando coinciden nombre y celular normalizados.
- **Integridad Financiera:** Bloqueo de montos negativos en cobro de servicios.

### 📊 Dashboard Analítico en Tiempo Real
- Filtro dinámico por período: **Hoy**, **Últimos 7 días** y **Últimos 30 días**.
- Indicadores clave: ingresos totales, clientes registradas, servicios completados y trabajos en portafolio.
- Ranking de servicios más solicitados (*Servicios Estrella*).

### 📸 Pipeline de Imágenes con Sharp & Generador de Historias
- **Arquitectura de Almacenamiento Desacoplada (`StorageProvider`):** Soporte mediante variable de entorno (`STORAGE_DRIVER`) para **Almacenamiento Local** (`public/uploads/`) o **Cloudinary CDN**.
- **Compresión Server-Side:** Conversión y redimensión a WebP (800px ancho, calidad 80) utilizando Sharp bajo runtime explícito de Node.js.
- **Exportador a Redes Sociales:** Generador HTML5 Canvas en resolución HD 9:16 (1080x1920) para descargar historias listas para Instagram y TikTok con marca de agua.

---

## 🏗️ Arquitectura del Sistema

```text
Next.js 15 App Router (Monolito Full-Stack)
│
├── Capa Frontend (React 19 + TypeScript)
│   ├── Vistas App Router (/, /clientes, /clientes/[id], /portafolio)
│   ├── Componentes y Navegación (components/Navbar.tsx)
│   └── Estilos Profesionales (styles/custom-palette.css)
│
├── Capa Middleware (src/middleware.ts)
│   └── HTTP Basic Auth opcional (ENABLE_BASIC_AUTH=true sobre HTTPS)
│
├── Capa API REST (Route Handlers - src/app/api/)
│   ├── /api/clientes (GET, POST)
│   ├── /api/clientes/[id] (GET, PUT, DELETE)
│   ├── /api/clientes/[id]/visitas (POST)
│   ├── /api/dashboard/metricas (GET)
│   └── /api/portafolio (GET, POST, PUT, DELETE)
│
├── Capa de Dominio y Servicios (src/lib/)
│   ├── Servicios de Dominio (clienteService, dashboardService, portafolioService)
│   ├── Validadores de Entrada (clienteValidator, portafolioValidator)
│   ├── Proveedores de Almacenamiento (LocalStorageProvider, CloudinaryStorageProvider)
│   └── Conexión a Base de Datos (Mongoose Connection Singleton)
│
└── Base de Datos (MongoDB)
    ├── Clientes (Índice Compuesto: { nombre: 1, whatsapp: 1 })
    └── Portafolios
```

---

## 📁 Estructura del Repositorio

```text
judith-hairstudio/
├── .github/
│   ├── ISSUE_TEMPLATE/          # Plantillas de issues estructuradas (YAML)
│   ├── PULL_REQUEST_TEMPLATE.md # Plantilla de PR
│   └── workflows/
│       └── ci.yml               # Flujo CI/CD automatizado
├── public/
│   └── uploads/                 # Almacenamiento local persistente de imágenes
├── src/
│   ├── app/                     # Vistas y Route Handlers (App Router)
│   ├── components/              # Componentes visuales (Navbar, etc.)
│   ├── lib/                     # Servicios, modelos Mongoose, storage y validadores
│   ├── styles/                  # Paleta de estilos personalizada
│   └── middleware.ts            # Capa de seguridad opcional (Basic Auth)
├── test/
│   ├── api-integration.test.ts  # Pruebas de integración de endpoints
│   └── validators.test.ts       # Pruebas unitarias de validación
├── scripts/
│   ├── backup-db.sh             # Script de respaldo de base de datos (Linux/macOS)
│   ├── backup-db.ps1            # Script de respaldo (Windows)
│   ├── migrate-uploads-to-cloud.ts # Migración a Cloudinary
│   └── verify-db-parity.ts      # Verificación de integridad de esquema
├── docs/                        # Capturas de la interfaz
├── Dockerfile                   # Dockerfile multi-stage optimizado
├── docker-compose.yml           # Entorno de producción con volúmenes persistentes
├── CONTRIBUTING.md              # Guía de contribución y Conventional Commits
├── CODE_OF_CONDUCT.md           # Código de Conducta Contributor Covenant
├── SECURITY.md                  # Política de reporte y directiva de seguridad HTTPS
├── LICENSE                      # Licencia MIT
├── package.json                 # Dependencias y scripts
└── README.es.md                 # Documentación técnica en español
```

---

## 🚀 Puesta en Marcha Local

### Requisitos Previos
- **Node.js**: >= 22.0.0
- **pnpm**: >= 10.0.0
- **MongoDB**: Instancia local o URI de conexión a MongoDB Atlas

### Instalación y Ejecución

```bash
# 1. Clonar repositorio
git clone https://github.com/aledash3/judith-hairstudio.git
cd judith-hairstudio

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
pnpm dev
```

Accede a [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Pruebas Automatizadas y Calidad de Código

```bash
# Ejecutar todas las pruebas (Unitarias y de Integración)
pnpm test

# Ejecutar pruebas unitarias de validación
pnpm test:unit

# Ejecutar pruebas de integración de endpoints (Route Handlers)
pnpm test:integration

# Verificación estática con linter
pnpm lint

# Compilación de producción
pnpm build
```

---

## 🐳 Despliegue con Docker

El proyecto incluye un `Dockerfile` multi-stage optimizado y un `docker-compose.yml` con volumen persistente nombrado para salvaguardar las imágenes del portafolio entre actualizaciones:

```bash
# Iniciar contenedor de la app y base de datos
docker-compose up -d --build
```

---

## 🛡️ Aviso de Seguridad y Privacidad

> ⚠️ **DIRECTIVA DE SEGURIDAD OBLIGATORIA:**  
> Si la aplicación se publica en internet en un servidor VPS con IP pública, **activa `ENABLE_BASIC_AUTH=true` únicamente detrás de un proxy inverso con certificado HTTPS (Nginx, Caddy o Cloudflare)**. Nunca expongas la autenticación básica sobre HTTP plano.

---

## 👨‍💻 Autor

Desarrollado con dedicación por **David Alejandro Cruz Palacios** ([@aledash3](https://github.com/aledash3)).

Distribuido bajo la **Licencia MIT**. Consulta `LICENSE` para más detalles.
