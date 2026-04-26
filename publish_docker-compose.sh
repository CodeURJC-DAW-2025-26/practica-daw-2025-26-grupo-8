#!/bin/bash

# Script to publish the docker-compose.yml to a specified DockerHub account
# Uses the Docker Compose v2 feature to publish the compose application as an OCI artifact.

set -e

if [ "$#" -lt 1 ]; then
  echo "Error: Missing DockerHub account parameter."
  echo "Usage: ./publish_docker-compose.sh <dockerhub_account> [project_name]"
  exit 1
fi

DOCKERHUB_ACCOUNT=$1
# Default project name if none is provided
PROJECT_NAME=${2:-pizzeria-compose}
TARGET_REPO="$DOCKERHUB_ACCOUNT/$PROJECT_NAME"

echo "Publishing docker-compose application to DockerHub as '$TARGET_REPO'..."
docker compose publish "$TARGET_REPO"

echo "docker-compose application successfully published to DockerHub!"
