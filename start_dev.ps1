# Start Backend
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd c:\Users\aakas\Documents\RentShield; .\backend\venv\Scripts\uvicorn app.main:app --app-dir backend --reload --port 8000"

# Start Frontend
Start-Process -FilePath "powershell.exe" -ArgumentList "-NoExit", "-Command", "cd c:\Users\aakas\Documents\RentShield\frontend; npm run dev"

Write-Host "RentShield Development Environment Started!"
Write-Host "Backend: http://localhost:8000/docs"
Write-Host "Frontend: http://localhost:5173"
