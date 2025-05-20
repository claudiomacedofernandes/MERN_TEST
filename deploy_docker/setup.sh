#!/bin/bash

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker Toolbox for Windows 7."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "docker-compose is not installed. Please install it manually in C:/Program Files/Docker Toolbox."
    exit 1
fi

# Verify docker-compose version
echo "Docker Compose version: $(docker-compose --version)"

# Ensure Docker Machine is running
echo "Checking Docker Machine..."
if ! docker-machine ls | grep -q "default.*Running"; then
    echo "Starting Docker Machine 'default'..."
    docker-machine start default
fi

# Set Docker environment variables
echo "Setting Docker environment variables..."
eval $(docker-machine env default --shell bash)

# Pull MongoDB 4.0.0 image
echo "Pulling MongoDB 4.0.0 image..."
docker pull mongo:4.0.0

# Verify MongoDB version
mongo_version=$(docker run --rm mongo:4.0.0 mongod --version | grep "db version" | awk '{print $3}')
if [ "$mongo_version" != "v4.0.0" ]; then
    echo "MongoDB version mismatch. Expected v4.0.0, got $mongo_version."
    exit 1
fi

# Install dependencies for API server
echo "Installing API server dependencies..."
cd server
npm install --production
cd ..

# Install dependencies for client server
echo "Installing client server dependencies..."
cd client
npm install --production
cd ..

# Set permissions for storage and data folders
echo "Setting permissions..."
chmod -R 777 data storage

# Add wait-for-it.sh to server and client
echo "Downloading wait-for-it.sh..."
curl -o server/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
curl -o client/wait-for-it.sh https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh
chmod +x server/wait-for-it.sh client/wait-for-it.sh

# Start services
echo "Starting services with docker-compose..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for MongoDB on port 27018..."
until docker-compose exec -T mongo mongo --port 27018 --eval "db.adminCommand('ping')" > /dev/null 2>&1; do
    sleep 1
done
echo "MongoDB is up."

echo "Waiting for API server on port 3001..."
until curl -s http://localhost:3001 > /dev/null; do
    sleep 1
done
echo "API server is up."

echo "Waiting for client server on port 3000..."
until curl -s http://localhost:3000 > /dev/null; do
    sleep 1
done
echo "Client server is up."

# Get the IP address
ip=$(docker-machine ip default 2>/dev/null || echo "localhost")
echo "All services are running. Connect to the client server at http://$ip:3000"