# REST API

Power includes a FastAPI-based REST API for generating presentations over HTTP.

## Live Service

The API is deployed on Google Cloud Run:

**Base URL:** `https://power-api-944767079044.us-central1.run.app`

**Swagger UI:** [Open Documentation](https://power-api-944767079044.us-central1.run.app/)

## Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/generate` | POST | Generate presentation from JSON |
| `/generate-with-template` | POST | Generate with uploaded template |
| `/inspect` | POST | Inspect template layouts |
| `/batch/generate` | POST | Batch generation (up to 50) |

---

## GET /health

Check API health status.

### Response

```json
{
  "status": "healthy",
  "version": "0.1.7"
}
```

### Example

```bash
curl https://power-api-944767079044.us-central1.run.app/health
```

---

## POST /generate

Generate a presentation from a JSON specification.

### Request Body

```json
{
  "title": "My Presentation",
  "subtitle": "Optional subtitle",
  "slides": [
    {
      "type": "content",
      "title": "Slide Title",
      "bullets": ["Point 1", "Point 2"]
    }
  ]
}
```

### Response

Returns the generated `.pptx` file as a binary download.

### Example

=== "curl"

    ```bash
    curl -X POST "https://power-api-944767079044.us-central1.run.app/generate" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "My Presentation",
        "slides": [
          {"type": "content", "title": "Hello", "bullets": ["Point 1", "Point 2"]}
        ]
      }' \
      --output presentation.pptx
    ```

=== "Python"

    ```python
    import httpx

    spec = {
        "title": "My Presentation",
        "slides": [
            {"type": "content", "title": "Hello", "bullets": ["Point 1", "Point 2"]}
        ]
    }

    response = httpx.post(
        "https://power-api-944767079044.us-central1.run.app/generate",
        json=spec
    )

    with open("presentation.pptx", "wb") as f:
        f.write(response.content)
    ```

=== "JavaScript"

    ```javascript
    const response = await fetch(
      "https://power-api-944767079044.us-central1.run.app/generate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "My Presentation",
          slides: [
            { type: "content", title: "Hello", bullets: ["Point 1", "Point 2"] }
          ]
        })
      }
    );

    const blob = await response.blob();
    // Save or download the blob
    ```

---

## POST /generate-with-template

Generate a presentation using an uploaded template file.

### Request

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `template` | File | Template .pptx file |
| `spec` | String | JSON specification |
| `filename` | String | Output filename (optional) |

### Example

```bash
curl -X POST "https://power-api-944767079044.us-central1.run.app/generate-with-template" \
  -F "template=@Galaxy.pptx" \
  -F 'spec={"title": "Themed Deck", "slides": [{"type": "content", "title": "Hello", "bullets": ["Styled slide"]}]}' \
  -F "filename=themed.pptx" \
  --output themed.pptx
```

---

## POST /inspect

Inspect a template to see its layouts and placeholders.

### Request

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `template` | File | Template .pptx file |

### Response

```json
{
  "template": "Galaxy.pptx",
  "slide_count": 13,
  "layout_count": 15,
  "slide_width": "12192000",
  "slide_height": "6858000",
  "layouts": [
    {
      "index": 0,
      "name": "Title Only Slide",
      "placeholders": [
        {"idx": 0, "type": "CENTER_TITLE (3)", "name": "Title 1"}
      ]
    }
  ]
}
```

### Example

```bash
curl -X POST "https://power-api-944767079044.us-central1.run.app/inspect" \
  -F "template=@Galaxy.pptx"
```

---

## POST /batch/generate

Generate multiple presentations in a single request.

### Request Body

```json
{
  "items": [
    {
      "spec": {
        "title": "Presentation 1",
        "slides": [{"type": "content", "title": "Slide 1", "bullets": ["A", "B"]}]
      },
      "filename": "pres1.pptx"
    },
    {
      "spec": {
        "title": "Presentation 2",
        "slides": [{"type": "content", "title": "Slide 1", "bullets": ["C", "D"]}]
      },
      "filename": "pres2.pptx"
    }
  ]
}
```

### Response

```json
{
  "total": 2,
  "successful": 2,
  "failed": 0,
  "results": [
    {
      "index": 0,
      "filename": "pres1.pptx",
      "size_bytes": 29206,
      "data_base64": "UEsDBBQAAAAI..."
    }
  ],
  "errors": []
}
```

!!! note "Batch Limits"
    Maximum 50 presentations per batch request.

---

## Slide Types

All slide types supported by the CLI are available via the API:

| Type | Required Fields | Optional Fields |
|------|-----------------|-----------------|
| `title` | `title` | `subtitle` |
| `section` | `title` | `subtitle` |
| `content` | `title` | `bullets`, `layout`, `image`, `note` |
| `table` | `title`, `headers`, `data` | |
| `chart` | `title`, `categories`, `series` | `chart_type` (bar/line/pie) |
| `image` | `image` | `title`, `left`, `top`, `width`, `height` |
| `blank` | | |

---

## Self-Hosting

### Run Locally

```bash
# Install API dependencies
pip install nietzsche[api]

# Start server
uvicorn power.api:app --reload --port 8080
```

### Deploy to Cloud Run

```bash
# Clone repository
git clone https://github.com/yanndebray/nietzsche.git
cd nietzsche

# Deploy
gcloud run deploy power-api --source . --region us-central1 --allow-unauthenticated
```

Or use the provided script:

```bash
./deploy.sh
```

### Docker

```bash
# Build
docker build -t power-api .

# Run
docker run -p 8080:8080 power-api
```

---

## Rate Limits

The Cloud Run service has the following configuration:

| Setting | Value |
|---------|-------|
| Memory | 512 Mi |
| CPU | 1 |
| Timeout | 60s |
| Min instances | 0 (scales to zero) |
| Max instances | 10 |

For high-volume usage, consider self-hosting or contacting for enterprise options.
