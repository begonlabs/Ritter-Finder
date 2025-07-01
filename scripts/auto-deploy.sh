#!/bin/bash

# Auto-deployment script for RitterFinder
# This script pulls the latest changes and rebuilds the Docker containers

set -e  # Exit on any error

echo "🚀 Starting auto-deployment process..."

# Configuration
PROJECT_DIR="/path/to/your/ritterfinder"  # Update this path
CONTAINER_NAME="ritterfinder_app"
LOG_FILE="/var/log/ritterfinder-deploy.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to send notification (optional)
notify() {
    # You can add webhook notifications here
    # curl -X POST "your-webhook-url" -d "message=$1"
    log "NOTIFICATION: $1"
}

log "🔄 Starting deployment process..."

# Navigate to project directory
cd "$PROJECT_DIR" || {
    log "❌ ERROR: Cannot access project directory: $PROJECT_DIR"
    exit 1
}

# Check if git repository is clean (optional safety check)
if [[ -n $(git status --porcelain) ]]; then
    log "⚠️  WARNING: Working directory is not clean. Uncommitted changes detected."
    # Uncomment the next line if you want to stash changes automatically
    # git stash
fi

# Pull latest changes
log "📥 Pulling latest changes from repository..."
if git pull origin main; then
    log "✅ Successfully pulled latest changes"
else
    log "❌ ERROR: Failed to pull changes"
    notify "Deployment failed: Git pull error"
    exit 1
fi

# Check if there are actual changes to deploy
CHANGES=$(git log HEAD@{1}..HEAD --oneline)
if [[ -z "$CHANGES" ]]; then
    log "ℹ️  No new changes to deploy"
    exit 0
else
    log "📝 New changes detected:"
    echo "$CHANGES" | tee -a "$LOG_FILE"
fi

# Stop existing containers
log "🛑 Stopping existing containers..."
docker-compose down || log "⚠️  No containers were running"

# Remove old images to free space (optional)
log "🧹 Cleaning up old Docker images..."
docker image prune -f

# Build and start new containers
log "🔨 Building and starting new containers..."
if docker-compose up -d --build; then
    log "✅ Successfully built and started containers"
else
    log "❌ ERROR: Failed to build/start containers"
    notify "Deployment failed: Docker build/start error"
    exit 1
fi

# Wait for containers to be healthy
log "⏳ Waiting for containers to be healthy..."
sleep 30

# Check if the application is responding
log "🏥 Checking application health..."
for i in {1..5}; do
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "✅ Application is healthy and responding"
        notify "Deployment successful! 🎉"
        break
    else
        log "⚠️  Attempt $i: Application not yet responding, waiting..."
        sleep 10
        if [[ $i -eq 5 ]]; then
            log "❌ ERROR: Application failed to start properly"
            notify "Deployment failed: Application not responding"
            
            # Show recent logs for debugging
            log "📋 Recent container logs:"
            docker logs "$CONTAINER_NAME" --tail 50 | tee -a "$LOG_FILE"
            exit 1
        fi
    fi
done

# Clean up old logs (keep last 100 lines)
tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"

log "🎉 Deployment completed successfully!"

# Optional: Show container status
log "📊 Container status:"
docker-compose ps | tee -a "$LOG_FILE" 