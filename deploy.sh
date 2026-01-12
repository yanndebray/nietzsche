#!/bin/bash
# Deploy Power API to Google Cloud Run
#
# Prerequisites:
#   1. Google Cloud CLI installed: https://cloud.google.com/sdk/docs/install
#   2. Authenticated: gcloud auth login
#   3. Project set: gcloud config set project YOUR_PROJECT_ID
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh

set -e

# Configuration - modify these values
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project)}"
REGION="${GCP_REGION:-us-central1}"
SERVICE_NAME="power-api"

echo "=== Power API Deployment to Cloud Run ==="
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo "Service: $SERVICE_NAME"
echo ""

# Check prerequisites
if ! command -v gcloud &> /dev/null; then
    echo "Error: gcloud CLI not installed"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if [ -z "$PROJECT_ID" ]; then
    echo "Error: No project ID set"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

# Enable required APIs
echo "Enabling required APIs..."
gcloud services enable run.googleapis.com --quiet
gcloud services enable cloudbuild.googleapis.com --quiet
gcloud services enable artifactregistry.googleapis.com --quiet

# Deploy directly from source (Cloud Build handles Docker)
echo ""
echo "Deploying to Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
    --source . \
    --region "$REGION" \
    --platform managed \
    --allow-unauthenticated \
    --memory 512Mi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --timeout 60s \
    --set-env-vars="PYTHONUNBUFFERED=1"

# Get the service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format='value(status.url)')

echo ""
echo "=== Deployment Complete ==="
echo "Service URL: $SERVICE_URL"
echo ""
echo "Test endpoints:"
echo "  Health:  curl $SERVICE_URL/health"
echo "  Docs:    $SERVICE_URL/"
echo ""
echo "Example API call:"
cat << 'EOF'
curl -X POST "$SERVICE_URL/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Presentation",
    "subtitle": "Generated via API",
    "slides": [
      {
        "type": "content",
        "title": "Hello World",
        "bullets": ["Point 1", "Point 2"]
      }
    ]
  }' \
  --output test.pptx
EOF
