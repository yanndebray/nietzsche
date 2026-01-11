# power inspect

Inspect a PowerPoint template or presentation.

## Synopsis

```bash
power inspect PPTX_FILE [OPTIONS]
```

## Description

Displays information about a PowerPoint file including available layouts, placeholders, and slide dimensions. Essential for understanding template structure before generating presentations.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `PPTX_FILE` | Yes | PowerPoint file to inspect |

## Options

| Option | Short | Description |
|--------|-------|-------------|
| `--json` | | Output as JSON instead of formatted text |
| `--help` | `-h` | Show help and exit |

## Examples

### Basic inspection

```bash
power inspect Galaxy.pptx
```

### JSON output

```bash
power inspect template.pptx --json
```

### Pipe to jq for processing

```bash
power inspect Galaxy.pptx --json | jq '.layouts[].name'
```

## Output

### Formatted Output

```
╭─────────────────────────────────╮
│       PowerPoint Inspection      │
│          Galaxy.pptx             │
╰─────────────────────────────────╯
Slides:     0
Layouts:    11
Dimensions: 13.33" x 7.50"

Available Layouts
├── 0: Title Slide
│   ├── idx=0 Title (TITLE)
│   └── idx=1 Subtitle (SUBTITLE)
├── 1: Title and Content
│   ├── idx=0 Title (TITLE)
│   └── idx=1 Content (OBJECT)
├── 2: Section Header
│   └── idx=0 Title (TITLE)
├── 5: Title Only
│   └── idx=0 Title (TITLE)
├── 6: Blank
└── ...
```

### JSON Output

```json
{
  "slide_count": 0,
  "layout_count": 11,
  "slide_width": "13.33 inches",
  "slide_height": "7.50 inches",
  "layouts": [
    {
      "index": 0,
      "name": "Title Slide",
      "placeholders": [
        {"idx": 0, "name": "Title", "type": "TITLE"},
        {"idx": 1, "name": "Subtitle", "type": "SUBTITLE"}
      ]
    }
  ]
}
```

## Layout Reference

Common PowerPoint layout indices:

| Index | Layout Name | Use Case |
|-------|------------|----------|
| 0 | Title Slide | Opening/closing slides |
| 1 | Title and Content | Standard content slides |
| 2 | Section Header | Section dividers |
| 3 | Two Content | Side-by-side content |
| 4 | Comparison | Before/after, pros/cons |
| 5 | Title Only | Charts, tables, custom |
| 6 | Blank | Full custom control |

!!! note
    Layout indices and names vary by template. Always use `power inspect` to check your specific template.

## Placeholder Types

| Type | Description |
|------|-------------|
| TITLE | Slide title |
| SUBTITLE | Slide subtitle |
| BODY | Main content area |
| OBJECT | General content placeholder |
| PICTURE | Image placeholder |
| TABLE | Table placeholder |
| CHART | Chart placeholder |

## Use Cases

### Finding the right layout

Before using `power generate` with a custom layout:

```bash
# Check available layouts
power inspect MyTemplate.pptx

# Use the layout name in YAML
# slides:
#   - type: content
#     layout: "Title and Content 1"
```

### Understanding picture placeholders

```bash
power inspect Corporate.pptx | grep -i picture
```

### Scripting with JSON

```bash
# Get all layout names
power inspect template.pptx --json | jq -r '.layouts[].name'

# Count layouts
power inspect template.pptx --json | jq '.layout_count'
```

## See Also

- [`power generate`](generate.md) - Generate presentations
- [YAML Format](../yaml-format.md) - Specify layouts in YAML
