# ==============================================================================
# Dockerfile Multi-Stage Optimizado para Judith HairStudio (Next.js 15 Standalone)
# ==============================================================================

# Etapa 1: Dependencias
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.25.0 --activate

COPY package.json pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Etapa 2: Compilación (Build)
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.25.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Activar 'standalone' para el empaquetado de producción en Linux
ENV DOCKER_BUILD=1
ENV NODE_ENV=production

RUN pnpm build

# Etapa 3: Runner de Producción
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia explícita de archivos estáticos y públicos para evitar errores 404
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Directorio de subidas con permisos adecuados
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
