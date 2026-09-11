# 💇 Judith HairStudio — Salon Management & Transformation System

[![CI](https://img.shields.io/github/actions/workflow/status/aledash3/judith-hairstudio/ci.yml?branch=main&style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/aledash3/judith-hairstudio/actions)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-11+-F69220?style=for-the-badge&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Español](https://img.shields.io/badge/Idioma-Espa%C3%B1ol-orange?style=for-the-badge)](README.es.md)

A production-ready, full-stack web application engineered for beauty salons, aesthetic centers, and hairstylists. Built with **Next.js 15 (App Router)**, **TypeScript**, **Mongoose**, and **Sharp**, it centralizes customer directory management, visit and revenue tracking, real-time analytics, and a WebP-optimized Before/After transformation showcase with automated vertical export for Instagram Stories and TikTok.

> 🌐 **Language / Idioma:** English | [Leer documentación en Español](README.es.md)

---

## 🖥️ Application Interface

| Real-Time KPI Dashboard | Customer Directory |
| :---: | :---: |
| ![Dashboard](docs/dashboard.png) | ![Clients](docs/clientes.png) |

| Individual Client Profile & History | Transformation Portfolio (Before/After) |
| :---: | :---: |
| ![Client Details](docs/detalleclientes.png) | ![Portfolio](docs/portafolio.png) |

> *Note: Screenshots display fictional placeholder data for demonstration purposes.*

---

## 📌 Core Features

### 👥 Client & Visit Tracking (Ecuadorian Domain Logic)
- **Deep Linking:** Direct routing to client profiles (`/clientes/[id]`) displaying complete chronological history and average ticket value.
- **Ecuadorian Phone Validation:** Strictly enforces 10-digit mobile numbers starting with `09` (`^09\d{8}$`).
- **Family Sharing & Intelligent Deduplication:** Allows family members to share phone numbers while preventing accidental duplicate entries when normalized full name and phone number match.
- **Financial Integrity:** Prevents negative dollar amounts in visit records and tracks cumulative expenditure.

### 📊 Financial & Operational Analytics Dashboard
- Dynamic time-range filtering: **Today**, **Last 7 Days**, and **Last 30 Days**.
- Aggregated financial KPIs: total revenue, active customers, completed services, and portfolio entries.
- Top-ranking services ranking highlight (*Star Services*).

### 📸 Sharp Image Pipeline & Social Media Generator
- **Multi-Driver Storage Architecture:** Pluggable `StorageProvider` supporting **Local Filesystem** (`public/uploads/`) or **Cloudinary CDN** via `STORAGE_DRIVER` environment variable.
- **Server-Side Optimization:** Resizes and compresses images to modern WebP (800px width, 80 quality) using Sharp within an explicit Node.js runtime.
- **Instagram Stories & TikTok Asset Generator:** Client-side HTML5 Canvas composition tool rendering HD 9:16 vertical cards with before/after comparison and custom branding.

---

## 🏗️ System Architecture

```text
Next.js 15 App Router (Full-Stack Monolith)
│
├── Frontend Layer (React 19 + TypeScript)
│   ├── App Views (/, /clientes, /clientes/[id], /portafolio)
│   ├── Navigation & Responsive Layout (components/Navbar.tsx)
│   └── Styles (styles/custom-palette.css)
│
├── Middleware Layer (src/middleware.ts)
│   └── Optional HTTP Basic Auth (ENABLE_BASIC_AUTH=true behind HTTPS)
│
├── REST API Layer (Route Handlers - src/app/api/)
│   ├── /api/clientes (GET, POST)
│   ├── /api/clientes/[id] (GET, PUT, DELETE)
│   ├── /api/clientes/[id]/visitas (POST)
│   ├── /api/dashboard/metricas (GET)
│   └── /api/portafolio (GET, POST, PUT, DELETE)
│
├── Domain & Service Layer (src/lib/)
│   ├── Domain Services (clienteService, dashboardService, portafolioService)
│   ├── Input Validators (clienteValidator, portafolioValidator)
│   ├── Storage Providers (LocalStorageProvider, CloudinaryStorageProvider)
│   └── Database Connectivity (Mongoose Cached Connection Singleton)
│
└── Data Persistence (MongoDB)
    ├── Clientes (Compound Index: { nombre: 1, whatsapp: 1 })
    └── Portafolios
```

---

## 📁 Repository Structure

```text
judith-hairstudio/
├── .github/
│   ├── ISSUE_TEMPLATE/          # Structured YAML issue templates (Bug, Feature, Config)
│   ├── PULL_REQUEST_TEMPLATE.md # Standard PR checklist
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline (pnpm install, test, lint, build)
├── public/
│   └── uploads/                 # Persistent uploaded assets storage (.gitkeep)
├── src/
│   ├── app/                     # Next.js 15 App Router (Views & REST Route Handlers)
│   ├── components/              # Reusable UI components (Navbar, etc.)
│   ├── lib/                     # Domain services, Mongoose models, validators, storage drivers
│   ├── styles/                  # Custom luxury beauty studio palette
│   └── middleware.ts            # Optional Basic Auth security layer
├── test/
│   ├── api-integration.test.ts  # Route Handlers integration test suite
│   └── validators.test.ts       # Domain validators unit test suite
├── scripts/
│   ├── backup-db.sh             # Automated database dump script (Linux/macOS)
│   ├── backup-db.ps1            # Automated database dump script (Windows)
│   ├── migrate-uploads-to-cloud.ts # Cloud migration utility
│   └── verify-db-parity.ts      # Schema parity validation script
├── docs/                        # Application UI screenshots
├── Dockerfile                   # Multi-stage optimized Docker build
├── docker-compose.yml           # Complete containerized stack with persistent volume
├── CONTRIBUTING.md              # Community contribution guidelines & Conventional Commits
├── CODE_OF_CONDUCT.md           # Contributor Covenant v2.1
├── SECURITY.md                  # Vulnerability disclosure policy & HTTPS directive
├── LICENSE                      # MIT License
├── package.json                 # Project dependencies & scripts
└── README.md                    # English technical documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: >= 22.0.0
- **pnpm**: >= 10.0.0
- **MongoDB**: Local instance or MongoDB Atlas connection URI

### Installation

```bash
# 1. Clone repository
git clone https://github.com/aledash3/judith-hairstudio.git
cd judith-hairstudio

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Automated Testing & Code Quality

```bash
# Run all automated tests (Unit & API Integration)
pnpm test

# Run domain validation unit tests
pnpm test:unit

# Run Route Handler integration tests
pnpm test:integration

# Run code linter
pnpm lint

# Production build
pnpm build
```

---

## 🐳 Docker Deployment

A production-grade multi-stage `Dockerfile` and `docker-compose.yml` are included with named persistent volumes to ensure uploaded portfolio assets survive container rebuilds:

```bash
# Start application and MongoDB
docker-compose up -d --build
```

---

## 🛡️ Security & Privacy Notice

This application is designed as a single-tenant administrative platform without multi-user roles.

> ⚠️ **IMPORTANT SECURITY DIRECTIVE:**  
> When deployed to a public server or VPS, **always activate `ENABLE_BASIC_AUTH=true` exclusively behind an HTTPS reverse proxy (Nginx, Caddy, or Cloudflare)**. Never expose Basic Auth over unencrypted HTTP.

---

## 👨‍💻 Author

Developed with ❤️ by **David Alejandro Cruz Palacios** ([@aledash3](https://github.com/aledash3)).

Distributed under the **MIT License**. See `LICENSE` for more information.
