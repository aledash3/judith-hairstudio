#!/usr/bin/env bash
# ==============================================================================
# Script de Respaldo Preventivo de Base de Datos MongoDB (Linux / macOS)
# ==============================================================================

set -e

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="./backup/${TIMESTAMP}"

if [ -z "$MONGODB_URI" ]; then
  echo "⚠️ MONGODB_URI no está definido en el entorno. Usando valor por defecto local..."
  MONGODB_URI="mongodb://localhost:27017/judith-hairstudio"
fi

echo "🚀 Creando respaldo de MongoDB en ${BACKUP_DIR}..."
mkdir -p "${BACKUP_DIR}"

mongodump --uri="${MONGODB_URI}" --out="${BACKUP_DIR}"

echo "✅ Respaldo generado exitosamente en ${BACKUP_DIR}."
