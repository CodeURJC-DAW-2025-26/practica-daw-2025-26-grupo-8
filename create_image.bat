@echo off
REM Script to build the Docker image of the application from source.
REM It uses the multi-stage Dockerfile provided, requiring only Docker.

IF "%~1"=="" (
    echo Error: Image name parameter is required.
    echo Usage: create_image.bat ^<image_name^>
    exit /b 1
)

SET IMAGE_NAME=%~1

echo Building Docker image '%IMAGE_NAME%' from source...

REM Build the docker image
docker build -t "%IMAGE_NAME%" .

IF %ERRORLEVEL% EQU 0 (
    echo Docker image '%IMAGE_NAME%' built successfully!
) ELSE (
    echo Error building Docker image.
    exit /b %ERRORLEVEL%
)
