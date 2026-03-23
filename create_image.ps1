param(
    [string]$ImageName
)

if (-not $ImageName) {
    Write-Host "Error: Image name parameter is required." -ForegroundColor Red
    Write-Host "Usage: .\create_image.ps1 <image_name>"
    exit 1
}

Write-Host "Building Docker image '$ImageName' from source..."

docker build -t "$ImageName" .

Write-Host "Docker image '$ImageName' built successfully!" -ForegroundColor Green
