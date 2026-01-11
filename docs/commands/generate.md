# power generate

Generate a presentation from a YAML or JSON specification file.

## Synopsis

```bash
power generate INPUT_FILE -o OUTPUT [OPTIONS]
```

## Description

Reads a YAML or JSON file describing the presentation structure and generates a PowerPoint file. This is the most powerful command for creating complex presentations programmatically.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `INPUT_FILE` | Yes | YAML (.yaml, .yml) or JSON (.json) specification file |

## Options

| Option | Short | Required | Description |
|--------|-------|----------|-------------|
| `--output` | `-o` | Yes | Output .pptx file path |
| `--template` | `-t` | No | Template .pptx file to use |
| `--help` | `-h` | No | Show help and exit |

## Supported Slide Types

| Type | Description | Required Fields |
|------|-------------|-----------------|
| `title` | Title slide | `title` |
| `section` | Section header | `title` |
| `content` | Bullet points | `title`, `bullets` |
| `table` | Data table | `title`, `headers`, `data` |
| `chart` | Bar/line/pie chart | `title`, `chart_type`, `categories`, `series` |
| `image` | Image slide | `title`, `image` |
| `blank` | Empty slide | (none) |

## Examples

### Basic generation

```bash
power generate slides.yaml -o presentation.pptx
```

### With template

```bash
power generate slides.yaml -o presentation.pptx -t Galaxy.pptx
```

### From JSON

```bash
power generate config.json -o output.pptx
```

## Input File Format

### Minimal YAML

```yaml
title: My Presentation

slides:
  - type: content
    title: Overview
    bullets:
      - First point
      - Second point
```

### Complete Example

```yaml
title: Quarterly Report
subtitle: Q4 2024

slides:
  - type: section
    title: Financial Results

  - type: content
    title: Highlights
    bullets:
      - Revenue up 25%
      - New markets entered
      - Team expanded
    note: Speaker notes go here

  - type: table
    title: Key Metrics
    headers: [Metric, Q3, Q4, Change]
    data:
      - [Revenue, "$2.1M", "$2.6M", "+24%"]
      - [Users, "10K", "15K", "+50%"]

  - type: chart
    title: Revenue Trend
    chart_type: bar
    categories: [Q1, Q2, Q3, Q4]
    series:
      2023: [100, 120, 140, 160]
      2024: [150, 180, 210, 260]

  - type: image
    title: Product Screenshot
    image: images/screenshot.png
    width: 10
    height: 5
    left: 1.5
    top: 1.8

  - type: content
    title: With Image
    bullets:
      - Feature one
      - Feature two
    image: images/feature.png
    image_width: 4
    image_left: 8
    image_top: 2

  - type: title
    title: Thank You
    subtitle: Questions?
```

## Output

On success:

```
Generated presentation: presentation.pptx
  Slides: 8
```

On error:

```
Error: [error message]
```

## Notes

- A top-level `title` creates an automatic title slide
- Use `power inspect` to see available layouts in your template
- Image paths are relative to the input file location
- Chart values must match the number of categories

## See Also

- [YAML Format](../yaml-format.md) - Complete YAML specification
- [`power inspect`](inspect.md) - View template layouts
- [`power create`](create.md) - Simple presentation creation
