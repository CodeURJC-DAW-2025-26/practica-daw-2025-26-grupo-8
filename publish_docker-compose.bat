@echo off
REM Script to publish the docker-compose.yml to a specified DockerHub account
REM Uses the Docker Compose v2 feature to publish the compose application as an OCI artifact.

IF "%~1"=="" (
    echo Error: Missing DockerHub account parameter.
    echo Usage: publish_docker-compose.bat ^<dockerhub_account^> [project_name]
    exit /b 1
)

SET DOCKERHUB_ACCOUNT=%~1
SET PROJECT_NAME=%~2
IF "%PROJECT_NAME%"=="" SET PROJECT_NAME=pizzeria-compose

SET TARGET_REPO=%DOCKERHUB_ACCOUNT%/%PROJECT_NAME%

echo Publishing docker-compose application to DockerHub as '%TARGET_REPO%'...
docker compose publish "%TARGET_REPO%"

IF %ERRORLEVEL% NEQ 0 (
    echo Error publishing docker-compose application.
    exit /b %ERRORLEVEL%
)

echo docker-compose application successfully published to DockerHub!
