@echo off

if "%~1"=="" (
  echo Error: Missing DockerHub account parameter.
  echo Usage: publish_docker-compose.bat ^<dockerhub_account^> [project_name]
  exit /b 1
)

set DOCKERHUB_ACCOUNT=%~1

if "%~2"=="" (
  set PROJECT_NAME=pizzeria-compose
) else (
  set PROJECT_NAME=%~2
)

set TARGET_REPO=%DOCKERHUB_ACCOUNT%/%PROJECT_NAME%

echo Publishing docker-compose application to DockerHub as '%TARGET_REPO%'...
docker compose publish "%TARGET_REPO%"

echo docker-compose application successfully published to DockerHub!
