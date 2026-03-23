param(
    [string]$ImageName,
    [string]$DockerhubAccount
)

if (-not $ImageName -or -not $DockerhubAccount) {
    Write-Host "Error: Missing parameters." -ForegroundColor Red
    Write-Host "Usage: .\publish_image.ps1 <image_name> <dockerhub_account>"
    exit 1
}

$TargetImage = "$DockerhubAccount/$ImageName"

Write-Host "Tagging image '$ImageName' as '$TargetImage'..."
docker tag "$ImageName" "$TargetImage"

Write-Host "Publishing image '$TargetImage' to DockerHub..."
docker push "$TargetImage"

Write-Host "Image successfully published to DockerHub!" -ForegroundColor Green
