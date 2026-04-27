#!/bin/bash

# Script to build the Docker image of the application from source.
# It uses the multi-stage Dockerfile provided, requiring only Docker.

set -e

# Check if image name is provided
if [ -z "$1" ]; then
  echo "Error: Image name parameter is required."
  echo "Usage: ./create_image.sh <image_name>"
  exit 1
fi

IMAGE_NAME=$1

echo "Building Docker image '$IMAGE_NAME' from source..."

# Build the docker image
docker build -t "$IMAGE_NAME" .

echo "Docker image '$IMAGE_NAME' built successfully!"
