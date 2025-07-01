#!/bin/bash

# Webhook deployment script for GitHub integration
# This script can be called by GitHub webhooks for automatic deployment

set -e

# Configuration
WEBHOOK_SECRET="your-webhook-secret-here"  # Change this!
PROJECT_DIR="/path/to/your/ritterfinder"   # Update this path
ALLOWED_BRANCH="main"
LOG_FILE="/var/log/ritterfinder-webhook.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] WEBHOOK: $1" | tee -a "$LOG_FILE"
}

# Function to verify GitHub webhook signature (optional security)
verify_signature() {
    local payload_body="$1"
    local signature_header="$2"
    
    if [[ -z "$WEBHOOK_SECRET" ]]; then
        log "⚠️  WARNING: No webhook secret configured"
        return 0
    fi
    
    if [[ -z "$signature_header" ]]; then
        log "❌ ERROR: No signature provided"
        return 1
    fi
    
    local expected_signature=$(echo -n "$payload_body" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -binary | base64)
    
    if [[ "$signature_header" == "sha256=$expected_signature" ]]; then
        log "✅ Webhook signature verified"
        return 0
    else
        log "❌ ERROR: Invalid webhook signature"
        return 1
    fi
}

log "🎣 Webhook deployment triggered"

# Read payload from stdin if available
if [[ -p /dev/stdin ]]; then
    PAYLOAD=$(cat)
    log "📦 Received payload: ${#PAYLOAD} bytes"
else
    PAYLOAD=""
    log "📦 No payload received (manual trigger)"
fi

# Parse branch from payload (GitHub webhook format)
if [[ -n "$PAYLOAD" ]]; then
    BRANCH=$(echo "$PAYLOAD" | jq -r '.ref // empty' | sed 's|refs/heads/||')
    COMMITS=$(echo "$PAYLOAD" | jq -r '.commits // [] | length')
    
    if [[ -n "$BRANCH" ]]; then
        log "🌿 Branch: $BRANCH"
        log "📝 Commits: $COMMITS"
        
        # Check if this is the branch we want to deploy
        if [[ "$BRANCH" != "$ALLOWED_BRANCH" ]]; then
            log "ℹ️  Ignoring push to branch '$BRANCH' (only deploying '$ALLOWED_BRANCH')"
            exit 0
        fi
        
        # Skip if no commits
        if [[ "$COMMITS" == "0" ]]; then
            log "ℹ️  No commits in push, skipping deployment"
            exit 0
        fi
    fi
fi

# Verify webhook signature if GitHub headers are available
if [[ -n "$HTTP_X_HUB_SIGNATURE_256" ]] && [[ -n "$PAYLOAD" ]]; then
    if ! verify_signature "$PAYLOAD" "$HTTP_X_HUB_SIGNATURE_256"; then
        exit 1
    fi
fi

log "🚀 Starting automatic deployment..."

# Navigate to project directory
cd "$PROJECT_DIR" || {
    log "❌ ERROR: Cannot access project directory: $PROJECT_DIR"
    exit 1
}

# Check if auto-deploy script exists
if [[ ! -f "scripts/auto-deploy.sh" ]]; then
    log "❌ ERROR: Auto-deploy script not found"
    exit 1
fi

# Make sure the deploy script is executable
chmod +x scripts/auto-deploy.sh

# Run the deployment script
if ./scripts/auto-deploy.sh; then
    log "✅ Webhook deployment completed successfully"
else
    log "❌ ERROR: Webhook deployment failed"
    exit 1
fi

log "🎉 Webhook processing completed" 