@echo off
REM Script to publish the Docker image to a specified DockerHub account

IF "%~2"=="" (
    echo Error: Missing parameters.
    echo Usage: publish_image.bat ^<image_name^> ^<dockerhub_account^>
    exit /b 1
)

SET IMAGE_NAME=%~1
SET DOCKERHUB_ACCOUNT=%~2
SET TARGET_IMAGE=%DOCKERHUB_ACCOUNT%/%IMAGE_NAME%

echo Tagging image '%IMAGE_NAME%' as '%TARGET_IMAGE%'...
docker tag "%IMAGE_NAME%" "%TARGET_IMAGE%"
IF %ERRORLEVEL% NEQ 0 (
    echo Error tagging image.
    exit /b %ERRORLEVEL%
)

echo Publishing image '%TARGET_IMAGE%' to DockerHub...
docker push "%TARGET_IMAGE%"
IF %ERRORLEVEL% NEQ 0 (
    echo Error publishing image.
    exit /b %ERRORLEVEL%
)

echo Image successfully published to DockerHub!
