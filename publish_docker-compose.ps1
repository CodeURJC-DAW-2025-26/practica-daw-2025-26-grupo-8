param(
    [string]$DockerhubAccount,
    [string]$ProjectName = "pizzeria-compose"
)

if (-not $DockerhubAccount) {
    Write-Host "Error: Missing DockerHub account parameter." -ForegroundColor Red
    Write-Host "Usage: .\publish_docker-compose.ps1 <dockerhub_account> [project_name]"
    exit 1
}

$TargetRepo = "$DockerhubAccount/$ProjectName"

Write-Host "Publishing docker-compose application to DockerHub as '$TargetRepo'..."
docker compose publish "$TargetRepo"

Write-Host "docker-compose application successfully published to DockerHub!" -ForegroundColor Green
