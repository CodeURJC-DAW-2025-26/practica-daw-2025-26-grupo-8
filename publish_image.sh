#!/bin/bash

# Script to publish the Docker image to a specified DockerHub account

set -e

if [ "$#" -ne 2 ]; then
  echo "Error: Missing parameters."
  echo "Usage: ./publish_image.sh <image_name> <dockerhub_account>"
  exit 1
fi

IMAGE_NAME=$1
DOCKERHUB_ACCOUNT=$2
TARGET_IMAGE="$DOCKERHUB_ACCOUNT/$IMAGE_NAME"

echo "Tagging image '$IMAGE_NAME' as '$TARGET_IMAGE'..."
docker tag "$IMAGE_NAME" "$TARGET_IMAGE"

echo "Publishing image '$TARGET_IMAGE' to DockerHub..."
docker push "$TARGET_IMAGE"

echo "Image successfully published to DockerHub!"
