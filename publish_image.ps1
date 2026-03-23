param (
    [Parameter(Mandatory=$true, HelpMessage="Name of the local Docker image")]
    [string]$ImageName,

    [Parameter(Mandatory=$true, HelpMessage="DockerHub account name to publish to")]
    [string]$DockerhubAccount
)

# Script to publish the Docker image to a specified DockerHub account

$TargetImage = "$DockerhubAccount/$ImageName"

Write-Host "Tagging image '$ImageName' as '$TargetImage'..." -ForegroundColor Cyan
docker tag "$ImageName" "$TargetImage"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Error tagging the image."
    exit $LASTEXITCODE
}

Write-Host "Publishing image '$TargetImage' to DockerHub..." -ForegroundColor Cyan
docker push "$TargetImage"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Image successfully published to DockerHub!" -ForegroundColor Green
} else {
    Write-Error "Error publishing the image."
    exit $LASTEXITCODE
}
