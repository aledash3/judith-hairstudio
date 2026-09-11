# 🛡️ Política de Seguridad — Judith HairStudio

## Versiones Soportadas

| Versión | Soportada | Estado |
| :--- | :---: | :--- |
| 2.x (Next.js 15) | ✅ | Activa / Recomendada |
| 1.x (MERN Legacy) | ❌ | Obsoleta |

---

## ⚠️ Advertencia de Seguridad Crítica: Protección de Datos Personales

La aplicación gestiona datos de clientas (nombres, números de WhatsApp, servicios realizados e importes monetarios). 

### Exclusividad de Basic Auth sobre HTTPS:
El sistema incluye un mecanismo opcional de **HTTP Basic Auth** mediante middleware (`ENABLE_BASIC_AUTH=true`). 

> **🚨 AVISO CRÍTICO DE SEGURIDAD:**  
> Las credenciales de Basic Auth se transmiten en Base64 en las cabeceras HTTP. **NUNCA actives `ENABLE_BASIC_AUTH=true` sobre conexiones HTTP planas en una IP pública**. 
> Si despliegas en un servidor VPS o nube pública, la aplicación **DEBE estar estrictamente protegida detrás de un proxy inverso con certificado SSL/TLS (HTTPS)** como Nginx, Caddy o Cloudflare.

---

## 🚨 Reporte Responsable de Vulnerabilidades

Si descubres una vulnerabilidad de seguridad en Judith HairStudio, por favor **NO abras un issue público**. 

Envía un correo electrónico detallado a:
📧 **davidcruzcv2005@gmail.com**

Incluye:
1. Descripción detallada de la vulnerabilidad.
2. Pasos exactos o prueba de concepto (PoC) para reproducirla.
3. Impacto potencial en la seguridad de los datos.

Agradecemos tu colaboración responsable para proteger la privacidad y seguridad del software.
