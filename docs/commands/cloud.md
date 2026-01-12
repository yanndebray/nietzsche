# power cloud

Generate presentations via the cloud API instead of locally.

## Overview

The `power cloud` command group allows you to generate presentations using the deployed Power API service. This is useful when you want to:

- Generate presentations without installing all dependencies locally
- Use the API from environments where python-pptx is difficult to install
- Integrate with CI/CD pipelines or other automated workflows

## Subcommands

| Command | Description |
|---------|-------------|
| `power cloud health` | Check API health status |
| `power cloud generate` | Generate presentation via cloud |
| `power cloud inspect` | Inspect template via cloud |

## Configuration

### Default API URL

By default, commands use the deployed Cloud Run service:

```
https://power-api-944767079044.us-central1.run.app
```

### Custom API URL

Override the API URL using:

=== "Command Line Flag"

    ```bash
    power cloud --api-url http://localhost:8080 health
    ```

=== "Environment Variable"

    ```bash
    export POWER_API_URL=http://localhost:8080
    power cloud health
    ```

---

## power cloud health

Check the cloud API health status.

### Usage

```bash
power cloud health
```

### Example

```bash
$ power cloud health
API Status: healthy
Version: 0.1.7
URL: https://power-api-944767079044.us-central1.run.app
```

---

## power cloud generate

Generate a presentation via the cloud API.

### Usage

```bash
power cloud generate INPUT_FILE -o OUTPUT [OPTIONS]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `INPUT_FILE` | YAML or JSON file describing the slides |

### Options

| Option | Description |
|--------|-------------|
| `-o, --output` | Output .pptx file (required) |
| `-t, --template` | Template .pptx file to upload |

### Examples

=== "Basic Generation"

    ```bash
    power cloud generate slides.yaml -o presentation.pptx
    ```

=== "With Template"

    ```bash
    power cloud generate slides.yaml -o themed.pptx -t Galaxy.pptx
    ```

=== "JSON Input"

    ```bash
    power cloud generate spec.json -o output.pptx
    ```

### Example Output

```bash
$ power cloud generate slides.yaml -o presentation.pptx
Generated via cloud: presentation.pptx
Size: 45,983 bytes
```

---

## power cloud inspect

Inspect a template via the cloud API to see its layouts and placeholders.

### Usage

```bash
power cloud inspect TEMPLATE [OPTIONS]
```

### Arguments

| Argument | Description |
|----------|-------------|
| `TEMPLATE` | Template .pptx file to inspect |

### Options

| Option | Description |
|--------|-------------|
| `--json` | Output as JSON |

### Examples

=== "Rich Output"

    ```bash
    power cloud inspect Galaxy.pptx
    ```

=== "JSON Output"

    ```bash
    power cloud inspect Galaxy.pptx --json
    ```

### Example Output

```
╭─────────────────── Template Inspection ───────────────────╮
│ Galaxy.pptx (via cloud)                                   │
╰───────────────────────────────────────────────────────────╯
 Slides:   13
 Layouts:  15

Available Layouts
├── 0: Title Only Slide
│   └── idx=0 Title 1 (CENTER_TITLE)
├── 1: Title and image
│   ├── idx=0 Title 1 (TITLE)
│   ├── idx=14 Picture Placeholder 18 (PICTURE)
│   └── idx=17 Text Placeholder 3 (BODY)
...
```

---

## Error Handling

The cloud commands handle common errors gracefully:

| Error | Cause | Solution |
|-------|-------|----------|
| "Cannot connect to API" | API unreachable | Check URL and network |
| "Request timed out" | Slow response | Try again or use local generation |
| "HTTP 500" | Server error | Check API logs or report issue |

## Local Development

To test against a local API server:

```bash
# Start local server
uvicorn power.api:app --reload --port 8080

# Use local server
power cloud --api-url http://localhost:8080 health
```
