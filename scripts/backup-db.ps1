# ==============================================================================
# Script de Respaldo Preventivo de Base de Datos MongoDB (Windows PowerShell)
# ==============================================================================

$ErrorActionPreference = "Stop"

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupDir = ".ackup$Timestamp"

$MongoUri = $env:MONGODB_URI
if (-not $MongoUri) {
    Write-Host "⚠️ MONGODB_URI no está definido en el entorno. Usando valor por defecto local..." -ForegroundColor Yellow
    $MongoUri = "mongodb://localhost:27017/judith-hairstudio"
}

Write-Host "🚀 Creando respaldo de MongoDB en $BackupDir..." -ForegroundColor Cyan
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

mongodump --uri="$MongoUri" --out="$BackupDir"

Write-Host "✅ Respaldo generado exitosamente en $BackupDir." -ForegroundColor Green
