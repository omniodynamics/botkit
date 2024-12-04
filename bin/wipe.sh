#!/bin/bash

# Stop all running containers
echo "Stopping all running containers..."
docker stop $(docker ps -aq)

# Remove all containers
echo "Removing all containers..."
docker rm $(docker ps -aq)

# Remove all volumes
echo "Removing all volumes..."
docker volume prune -f

# Optionally, you can also remove all images if needed:
# echo "Removing all images..."
# docker rmi $(docker images -q) -f

echo "Cleanup complete."