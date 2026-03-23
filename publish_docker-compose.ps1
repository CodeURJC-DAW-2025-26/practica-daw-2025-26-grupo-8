param (
    [Parameter(Mandatory=$true, HelpMessage="DockerHub account name to publish to")]
    [string]$DockerhubAccount,

    [Parameter(Mandatory=$false, HelpMessage="Project name to use as repository name")]
    [string]$ProjectName = "pizzeria-compose"
)

# Script to publish the docker-compose.yml to a specified DockerHub account
# Uses the Docker Compose v2 feature to publish the compose application as an OCI artifact.

$TargetRepo = "$DockerhubAccount/$ProjectName"

Write-Host "Publishing docker-compose application to DockerHub as '$TargetRepo'..." -ForegroundColor Cyan

docker compose publish "$TargetRepo"

if ($LASTEXITCODE -eq 0) {
    Write-Host "docker-compose application successfully published to DockerHub!" -ForegroundColor Green
} else {
    Write-Error "Error publishing the docker-compose application."
    exit $LASTEXITCODE
}
