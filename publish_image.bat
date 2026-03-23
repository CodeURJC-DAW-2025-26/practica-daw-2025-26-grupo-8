@echo off

if "%~2"=="" (
  echo Error: Missing parameters.
  echo Usage: publish_image.bat ^<image_name^> ^<dockerhub_account^>
  exit /b 1
)

set IMAGE_NAME=%~1
set DOCKERHUB_ACCOUNT=%~2
set TARGET_IMAGE=%DOCKERHUB_ACCOUNT%/%IMAGE_NAME%

echo Tagging image '%IMAGE_NAME%' as '%TARGET_IMAGE%'...
docker tag "%IMAGE_NAME%" "%TARGET_IMAGE%"

echo Publishing image '%TARGET_IMAGE%' to DockerHub...
docker push "%TARGET_IMAGE%"

echo Image successfully published to DockerHub!
