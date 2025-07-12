# StackIt Application Startup Script

Write-Host "Starting StackIt Q&A Platform..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "Starting MongoDB..." -ForegroundColor Yellow
    Start-Process -FilePath "mongod" -WindowStyle Minimized -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 5
} else {
    Write-Host "MongoDB is already running" -ForegroundColor Green
}

# Start Backend Server
Write-Host "Starting Backend Server on port 8000..." -ForegroundColor Yellow
$backendPath = "c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\New folder\stackit_odoo\backend"
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"$backendPath`" && npm run dev" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "Starting Frontend Server on port 3000..." -ForegroundColor Yellow
$frontendPath = "c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\New folder\stackit_odoo\frontend"
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"$frontendPath`" && npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Application is starting up..." -ForegroundColor Green
Write-Host "Backend API: http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "API Health: http://localhost:8000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
Start-Process -FilePath "cmd" -ArgumentList "/c", "cd `"c:\Users\HP\OneDrive - pdpu.ac.in\Odoo\Round1\stackit-frontend`" && npm start" -WindowStyle Normal

Write-Host "`nStackIt is starting up!" -ForegroundColor Green
Write-Host "Backend will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")