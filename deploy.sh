#!/bin/bash

# Configuration
TEAM_NAME="coffe-break"
DOCKER_USERNAME="<YOUR_DOCKER_USERNAME>" # UPDATE THIS
IMAGE_NAME="aegis-teaser"
KUBECONFIG_PATH="../coffe-break/kubeconfig.yaml"

# 1. Build Docker Image
echo "Building Docker image..."
docker build -t $DOCKER_USERNAME/$IMAGE_NAME:latest ./aegis-teaser

# 2. Push Docker Image
echo "Pushing Docker image..."
docker push $DOCKER_USERNAME/$IMAGE_NAME:latest

# 3. Update Manifest (optional if you use :latest)
# sed -i "s|<DOCKER_USERNAME>|$DOCKER_USERNAME|g" k8s/aegis-teaser.yaml

# 4. Deploy to Kubernetes
echo "Deploying to Kubernetes..."
kubectl --kubeconfig=$KUBECONFIG_PATH apply -f k8s/aegis-teaser.yaml

echo "Deployment complete! Access your app at https://$TEAM_NAME.hackathon.sev-2.com"
