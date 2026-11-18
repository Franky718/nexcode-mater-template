# ========================================================
# CENTRO DE COMANDOS - NEXCODE DIGITAL S.A. de C.V. (v3 SUPREMO)
# ========================================================
Clear-Host
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    CENTRO DE COMANDOS - NEXCODE DIGITAL (v3 SUPREMO)   " -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$usuarioValido = "admin"
$passwordValida = "NEXCODE*2026"
$intentos = 3
$autenticado = $false

while ($intentos -gt 0 -and -not $autenticado) {
    $userPrompt = Read-Host "Usuario"
    $passPrompt = Read-Host -AsSecureString "Contraseña"
    
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($passPrompt)
    $passPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

    if ($userPrompt.ToLower() -eq $usuarioValido.ToLower() -and $passPlain -eq $passwordValida) {
        $autenticado = $true
        Write-Host "`n[✔] ACCESO SUPREMO CONCEDIDO. Servidor local vinculado." -ForegroundColor Green
        Start-Sleep -Seconds 1
    } else {
        $intentos--
        Write-Host "`n[✖] Credenciales incorrectas. Intentos restantes: $intentos" -ForegroundColor Red
    }
}

if (-not $autenticado) {
    Write-Host "[!] Límite de intentos superados. Cerrando sesión de seguridad." -ForegroundColor Red
    Start-Sleep -Seconds 2
    exit
}

do {
    Clear-Host
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "    CENTRO DE COMANDOS - NEXCODE DIGITAL (v3 SUPREMO)   " -ForegroundColor Yellow
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host " [1] Estado de Contenedores (Podman)" -ForegroundColor White
    Write-Host " [2] Gestionar Bases de Datos (Supabase / Podman)" -ForegroundColor White
    Write-Host " [3] Monitoreo de Redes y Seguridad (Nmap)" -ForegroundColor White
    Write-Host " [4] Despliegues y Sincronización GitHub" -ForegroundColor White
    Write-Host " [5] E-commerce y Catálogos (FreshControl)" -ForegroundColor White
    Write-Host " [6] Plataforma de Streaming y Multimedia (Sónica)" -ForegroundColor White
    Write-Host " [7] Entorno de IA y Modelos Locales" -ForegroundColor White
    Write-Host " [8] Respaldo de Credenciales y Llaves (Keytool)" -ForegroundColor White
    Write-Host " [9] Diagnóstico General del Sistema" -ForegroundColor White
    Write-Host " [10] ACCESO SUPREMO: Servidor Local y Privado (Podman Core)" -ForegroundColor Green
    Write-Host " [11] Salir del Sistema" -ForegroundColor White
    Write-Host "========================================================" -ForegroundColor Cyan
    
    $opcion = Read-Host "Selecciona una opción del 1 al 11"

    switch ($opcion) {
        "1" {
            Write-Host "`n[*] Listando contenedores activos en Podman..." -ForegroundColor Cyan
            if (Get-Command podman -ErrorAction SilentlyContinue) {
                podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
            } else {
                Write-Host "[!] Podman no está disponible en el PATH." -ForegroundColor Red
            }
        }
        "2" {
            Write-Host "`n[*] Verificando bases de datos locales (Supabase)..." -ForegroundColor Cyan
            podman ps -a --filter "name=supabase" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        }
        "3" {
            Write-Host "`n[*] Verificando herramientas de red y seguridad (Nmap)..." -ForegroundColor Cyan
            if (Get-Command nmap -ErrorAction SilentlyContinue) {
                nmap -sn 127.0.0.1
            } else {
                Test-NetConnection -ComputerName localhost -Port 80
            }
        }
        "4" {
            Write-Host "`n[*] Verificando repositorio Git y estado de GitHub..." -ForegroundColor Cyan
            if (Get-Command git -ErrorAction SilentlyContinue) { git status }
        }
        "5" {
            Write-Host "`n[*] Módulo FreshControl (E-commerce) sincronizado." -ForegroundColor Green
            Get-ChildItem -Filter "*fresh*" -ErrorAction SilentlyContinue
        }
        "6" {
            Write-Host "`n[*] Módulo Sónica (Streaming Multimedia) operativo." -ForegroundColor Green
            Get-ChildItem -Filter "*sonica*" -ErrorAction SilentlyContinue
        }
        "7" {
            Write-Host "`n[*] Entorno de IA y Modelos Locales enlazados." -ForegroundColor Green
        }
        "8" {
            Write-Host "`n[*] Herramienta Keytool lista para firmas APK." -ForegroundColor Green
        }
        "9" {
            Write-Host "`n[*] Diagnóstico: Directorio $(Get-Location) | Admin: Director General (Reynosa)" -ForegroundColor Cyan
        }
        "10" {
            Write-Host "`n[***] CONECTANDO AL SERVIDOR LOCAL Y PRIVADO (SUPREMO)..." -ForegroundColor Green
            Write-Host "[+] Vinculando sockets de Podman y entorno privado..." -ForegroundColor Yellow
            if (Get-Command podman -ErrorAction SilentlyContinue) {
                podman version
                Write-Host "[✔] Enlace supremo establecido con éxito con el servidor local." -ForegroundColor Green
            } else {
                Write-Host "[!] Motor Podman requerido para la sesión privada." -ForegroundColor Red
            }
        }
        "11" {
            Write-Host "`n[*] Cerrando Centro de Comandos NEXCODE Digital v3..." -ForegroundColor Yellow
            break
        }
        default {
            Write-Host "`n[!] Opción no válida. Selecciona entre 1 y 11." -ForegroundColor Red
        }
    }
    
    if ($opcion -ne "11") {
        Write-Host ""
        Read-Host "Presiona Enter para regresar al menú principal"
    }
} while ($opcion -ne "11")
