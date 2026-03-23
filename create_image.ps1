param (
    [Parameter(Mandatory=$true, HelpMessage="Name of the Docker image to build")]
    [string]$ImageName
)

# Script to build the Docker image of the application from source.
# It uses the multi-stage Dockerfile provided, requiring only Docker.

Write-Host "Building Docker image '$ImageName' from source..." -ForegroundColor Cyan

# Build the docker image
docker build -t "$ImageName" .

if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker image '$ImageName' built successfully!" -ForegroundColor Green
} else {
    Write-Error "Error building Docker image."
    exit $LASTEXITCODE
}
