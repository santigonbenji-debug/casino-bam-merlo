# Script para corregir imports - Version simplificada
Write-Host "Corrigiendo imports en el proyecto..." -ForegroundColor Cyan
Write-Host ""

# Archivos en src/pages/
Write-Host "Corrigiendo archivos en pages..." -ForegroundColor Yellow

$pagesFiles = @(
    "src\pages\LoginPage.jsx",
    "src\pages\HomePage.jsx",
    "src\pages\DashboardPage.jsx"
)

foreach ($file in $pagesFiles) {
    if (Test-Path $file) {
        Write-Host "  Procesando: $file"
        $content = Get-Content $file -Raw -Encoding UTF8
        $content = $content -replace "from 'components/", "from '../components/"
        $content = $content -replace 'from "components/', 'from "../components/'
        $content = $content -replace "components/components/", "components/"
        $content | Set-Content $file -Encoding UTF8 -NoNewline
        Write-Host "  Corregido!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Corrigiendo archivos en components/casino..." -ForegroundColor Yellow

# Archivos en src/components/casino/
$casinoFiles = @(
    "src\components\casino\PanelListas.jsx",
    "src\components\casino\PanelConfiguracion.jsx",
    "src\components\casino\PanelPINDelDia.jsx",
    "src\components\casino\TablaAnotaciones.jsx"
)

foreach ($file in $casinoFiles) {
    if (Test-Path $file) {
        Write-Host "  Procesando: $file"
        $content = Get-Content $file -Raw -Encoding UTF8
        $content = $content -replace "from 'components/common/", "from '../common/"
        $content = $content -replace 'from "components/common/', 'from "../common/'
        $content = $content -replace "from 'components/layout/", "from '../layout/"
        $content = $content -replace 'from "components/layout/', 'from "../layout/'
        $content = $content -replace "components/components/", "components/"
        $content | Set-Content $file -Encoding UTF8 -NoNewline
        Write-Host "  Corregido!" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Proceso completado!" -ForegroundColor Green
Write-Host "Ejecuta ahora: npm run build" -ForegroundColor Cyan
