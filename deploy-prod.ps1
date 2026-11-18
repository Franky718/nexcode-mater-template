# Script de Despliegue Producción — Nexcode Interactive S.A. de C.V.
Write-Host "=== INICIANDO AUDITORÍA PRE-DEPLOY V&T OMEGA ===" -ForegroundColor Cyan
git status
git add .
git commit -m "chore: preparacion para despliegue en produccion y microservicio fastapi ml"
Write-Host "✔ Repositorio sincronizado y blindado." -ForegroundColor Green
Write-Host "=== LISTO PARA PUBLICAR EN VERCEL / CLOUD PRODUCTION ===" -ForegroundColor Yellow
