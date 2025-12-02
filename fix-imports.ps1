# Script para corregir imports en todo el proyecto
# Ejecutar desde la raíz del proyecto: .\fix-imports.ps1

Write-Host "🔧 Corrigiendo imports en el proyecto..." -ForegroundColor Cyan

# Archivos a corregir
$archivos = @(
    "src\pages\LoginPage.jsx",
    "src\pages\HomePage.jsx",
    "src\pages\DashboardPage.jsx",
    "src\components\casino\PanelListas.jsx",
    "src\components\casino\PanelConfiguracion.jsx",
    "src\components\casino\PanelPINDelDia.jsx",
    "src\components\casino\PanelHistorial.jsx",
    "src\components\casino\TablaAnotaciones.jsx"
)

foreach ($archivo in $archivos) {
    if (Test-Path $archivo) {
        Write-Host "📝 Procesando: $archivo" -ForegroundColor Yellow
        
        # Leer contenido
        $contenido = Get-Content $archivo -Raw -Encoding UTF8
        
        # Calcular nivel de carpetas hacia src/
        $nivel = ($archivo -split "\\").Count - 2
        $prefijo = "../" * $nivel
        
        # Reemplazos según ubicación del archivo
        if ($archivo -like "*\pages\*") {
            # Archivos en src/pages/ necesitan '../'
            $contenido = $contenido -replace "from 'components/", "from '../components/"
            $contenido = $contenido -replace 'from "components/', 'from "../components/'
        }
        elseif ($archivo -like "*\components\casino\*") {
            # Archivos en src/components/casino/ necesitan '../'
            $contenido = $contenido -replace "from 'components/", "from '../"
            $contenido = $contenido -replace 'from "components/', 'from "../'
        }
        
        # Corregir imports duplicados
        $contenido = $contenido -replace "components/components/", "components/"
        
        # Guardar cambios
        $contenido | Set-Content $archivo -Encoding UTF8 -NoNewline
        
        Write-Host "✅ Corregido: $archivo" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  No existe: $archivo" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎉 ¡Proceso completado!" -ForegroundColor Green
Write-Host "Ejecuta ahora: npm run build" -ForegroundColor Cyan
