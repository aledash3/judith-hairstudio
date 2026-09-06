# Judith HairStudio

Sistema web full stack para la gestion de clientes, visitas, ingresos y portafolio de un salon de belleza.

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

## Funcionalidades

- Registro, edicion, consulta y eliminacion de clientes.
- Identificador interno generado por MongoDB para cada cliente.
- Validacion de nombres y telefonos ecuatorianos de exactamente 10 digitos.
- Telefonos compartidos entre personas distintas, por ejemplo familiares.
- Bloqueo de duplicados solo cuando coinciden nombre normalizado y telefono.
- Historial de visitas con ingresos no negativos.
- Dashboard con clientes, ingresos, servicios y portafolio.
- Portafolio de transformaciones con imagenes optimizadas a WebP.
- Exportacion de composiciones verticales para redes sociales.

## Arquitectura

```text
React + Vite
    |
    | Axios / proxy de desarrollo
    v
API REST con Express
    |
    +-- Routers
    +-- Validadores
    +-- Controladores
    +-- Servicios de negocio
    +-- Modelos Mongoose
    v
MongoDB
```

El backend separa rutas, validacion, controladores, servicios y modelos. El frontend consume la API mediante un cliente Axios centralizado.

## Requisitos

- Node.js 20 o superior.
- pnpm 11 o superior.
- MongoDB local o MongoDB Atlas.

## Instalacion

```bash
git clone https://github.com/aledash3/sistema-gestion-salon-belleza.git
cd sistema-gestion-salon-belleza
pnpm install
```

Crear `backend/.env` a partir de `backend/.env.example`:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/judith-hairstudio
```

Para el frontend puede crearse `frontend/.env` desde `frontend/.env.example`:

```env
VITE_API_URL=
```

En desarrollo se recomienda dejar `VITE_API_URL` vacia y utilizar el proxy de Vite. En produccion debe apuntar al origen publico de la API.

## Comandos

```bash
# Ejecutar backend y frontend en paralelo
pnpm dev

# Ejecutarlos por separado
pnpm dev:backend
pnpm dev:frontend

# Verificar calidad y compilacion
pnpm lint
pnpm build
pnpm test
```

El frontend queda disponible en `http://localhost:3000` y la API en `http://localhost:5000`.
El endpoint `GET /health` permite comprobar que el servicio esta activo.

## Validaciones de negocio

- El nombre es obligatorio, admite entre 3 y 120 caracteres y se normalizan espacios.
- El telefono debe contener unicamente numeros, comenzar con `09` y tener exactamente 10 digitos.
- No se solicita ni almacena cedula. El identificador del cliente es el `_id` interno de MongoDB.
- Dos personas pueden compartir telefono.
- Se rechaza un cliente solo si coinciden nombre normalizado y telefono.
- El monto de una visita debe ser numerico, finito, no negativo y no superar 100000.
- El tipo y descripcion del portafolio son obligatorios y tienen limites de longitud.
- Las imagenes deben ser validas, de tipo imagen y no superar 5 MB por archivo.

Si la base de datos ya fue utilizada con una version anterior, ejecutar una vez `pnpm --filter judith-hairstudio-backend migrate:phone-index` para eliminar el antiguo indice unico del telefono.

## API principal

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/health` | Estado del servicio |
| GET | `/api/dashboard/metricas` | Indicadores del dashboard |
| GET | `/api/clientes` | Lista de clientes |
| POST | `/api/clientes` | Registra un cliente |
| GET | `/api/clientes/:id` | Consulta un cliente |
| POST | `/api/clientes/:id/visitas` | Registra una visita |
| PUT | `/api/clientes/:id` | Actualiza un cliente |
| DELETE | `/api/clientes/:id` | Elimina un cliente |
| GET | `/api/portafolio` | Lista trabajos |
| POST | `/api/portafolio` | Crea un trabajo con imagenes |
| PUT | `/api/portafolio/:id` | Actualiza un trabajo |
| DELETE | `/api/portafolio/:id` | Elimina un trabajo |

## Despliegue

En produccion se deben configurar variables de entorno reales, restringir `CORS_ORIGIN` al dominio del frontend y permitir en MongoDB Atlas solo las IP o servicios necesarios. No se debe utilizar `0.0.0.0/0` como configuracion permanente.

El almacenamiento local de `backend/uploads` es adecuado para desarrollo. Para un despliegue con filesystem efimero se recomienda migrar las imagenes a un almacenamiento persistente u objeto antes de poner el sistema en produccion.

## Estructura

```text
backend/
  config/
  controllers/
  middlewares/
  models/
  routers/
  services/
  test/
  utils/
  validators/
frontend/
  src/
docs/
pnpm-workspace.yaml
package.json
```

## Capturas

![Dashboard](docs/dashboard.png)
![Clientes](docs/clientes.png)
![Detalle de cliente](docs/detalleclientes.png)
![Portafolio](docs/portafolio.png)

Las capturas utilizan datos ficticios y no contienen informacion real de clientes.

## Autor

David Alejandro Cruz Palacios
Estudiante de Ingenieria en Ciencias de la Computacion
Universidad Politecnica Salesiana, Quito, Ecuador

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta [LICENSE](LICENSE).
