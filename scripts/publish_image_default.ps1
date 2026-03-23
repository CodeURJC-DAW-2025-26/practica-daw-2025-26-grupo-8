param (
    [Parameter(Mandatory=$false, HelpMessage="DockerHub account name")]
    [string]$DockerhubAccount = "aparisi02",

    [Parameter(Mandatory=$false, HelpMessage="Local image name and repository image name")]
    [string]$ImageName = "pizzeria"
)

# Build and push a default image to Docker Hub.
# Default target: aparisi02/pizzeria:latest

$TargetImage = "$DockerhubAccount/$ImageName"

Write-Host "Building Docker image '$ImageName'..." -ForegroundColor Cyan
docker build -t "$ImageName" .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error building image '$ImageName'."
    exit $LASTEXITCODE
}

Write-Host "Tagging image as '$TargetImage'..." -ForegroundColor Cyan
docker tag "$ImageName" "$TargetImage"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error tagging image as '$TargetImage'."
    exit $LASTEXITCODE
}

Write-Host "Pushing image '$TargetImage' to Docker Hub..." -ForegroundColor Cyan
docker push "$TargetImage"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Error pushing image '$TargetImage'."
    exit $LASTEXITCODE
}

Write-Host "Image successfully published: $TargetImage" -ForegroundColor Green
