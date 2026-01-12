# Dockerfile for Power API - Cloud Run deployment
#
# Build:
#   docker build -t power-api .
#
# Run locally:
#   docker run -p 8080:8080 power-api
#
# Deploy to Cloud Run:
#   gcloud run deploy power-api --source .

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8080

WORKDIR /app

# Install system dependencies (minimal for python-pptx)
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files first (for better caching)
COPY pyproject.toml .
COPY README.md .

# Copy source code
COPY src/ src/

# Install the package with API dependencies
RUN pip install --no-cache-dir . fastapi[standard] uvicorn[standard]

# Copy templates (if you want built-in templates available)
COPY templates/ templates/

# Expose the port Cloud Run expects
EXPOSE 8080

# Health check for container orchestration
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

# Run the FastAPI app with uvicorn
CMD ["uvicorn", "power.api:app", "--host", "0.0.0.0", "--port", "8080"]
