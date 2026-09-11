# 🤝 Guía de Contribución — Judith HairStudio

¡Gracias por tu interés en contribuir a **Judith HairStudio**! Para asegurar la máxima calidad del código y mantener un historial de desarrollo ordenado, seguimos estándares profesionales de ingeniería de software.

---

## 🚀 Flujo de Trabajo (Git Workflow)

1. **Haz un Fork** del repositorio oficial.
2. **Crea una rama de trabajo descriptiva** desde `main`:
   ```bash
   git checkout -b feat/exportacion-reportes-csv
   # o para correcciones:
   git checkout -b fix/validacion-formato-celular
   ```
3. **Instala dependencias** utilizando `pnpm`:
   ```bash
   pnpm install
   ```
4. **Inicia el entorno de desarrollo:**
   ```bash
   pnpm dev
   ```

---

## 📜 Convención de Commits (Conventional Commits)

Todos los commits deben seguir el estándar [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad (ej. `feat(clients): add whatsapp quick contact button`).
- `fix:` Corrección de errores (ej. `fix(api): handle negative amounts in visits route`).
- `refactor:` Refactorización de código que no altera funcionalidad externa.
- `docs:` Cambios en documentación (`README.md`, guías, comentarios).
- `test:` Creación o actualización de pruebas unitarias o de integración.
- `chore:` Mantenimiento de dependencias, scripts o configuración de build.
- `ci:` Cambios en pipelines de GitHub Actions o flujos de integración continua.

---

## 🧪 Verificación Obligatoria Antes de Enviar PR

Antes de abrir un Pull Request, asegúrate de que todos los siguientes comandos se ejecuten limpiamente:

```bash
# 1. Ejecutar pruebas unitarias y de integración
pnpm test

# 2. Verificación estática y linting
pnpm lint

# 3. Compilación de producción
pnpm build
```
