@echo off

if "%~1"=="" (
  echo Error: Image name parameter is required.
  echo Usage: create_image.bat ^<image_name^>
  exit /b 1
)

set IMAGE_NAME=%~1

echo Building Docker image '%IMAGE_NAME%' from source...

docker build -t "%IMAGE_NAME%" .

echo Docker image '%IMAGE_NAME%' built successfully!
