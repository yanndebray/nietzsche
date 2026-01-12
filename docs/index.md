# Power CLI

**A command-line tool for generating PowerPoint presentations programmatically.**

Power CLI lets you create professional slide decks from YAML/JSON specifications, use templates, and automate presentation generation - all from your terminal.

## Why Power CLI?

- **Automation**: Generate presentations from data without touching PowerPoint
- **Templates**: Use your corporate templates with placeholder replacement
- **Version Control**: Store presentation specs in YAML alongside your code
- **Batch Generation**: Create multiple presentations from different data sources
- **Reproducibility**: Same input always produces the same output

## Quick Examples

### Create a presentation with a template

```bash
power create deck.pptx -t Galaxy.pptx --title "Q1 Report"
```

### Generate from YAML

```bash
power generate slides.yaml -o presentation.pptx -t Galaxy.pptx
```

### Inspect template layouts

```bash
power inspect Galaxy.pptx
```

### Interactive mode

```bash
power new -t Galaxy.pptx -o my_deck.pptx
```

## Features at a Glance

| Feature | Description |
|---------|-------------|
| Multiple slide types | Title, content, section, table, chart, image, blank |
| Template support | Use any .pptx as a template |
| YAML/JSON input | Define presentations declaratively |
| Placeholder replacement | Fill `{{PLACEHOLDER}}` text automatically |
| Chart generation | Bar, line, and pie charts |
| Table generation | Formatted data tables |
| Image support | Add images with precise positioning |

## Getting Started

| Guide | Description |
|-------|-------------|
| [Installation](install.md) | Install Power CLI with pip or uv in seconds |
| [Quick Start](quickstart.md) | Create your first presentation in 5 minutes |
| [Commands](commands/index.md) | Complete CLI reference documentation |
| [REST API](api.md) | Generate presentations via HTTP API |
| [Cookbook](cookbook.md) | Real-world examples and recipes |

## Supported Slide Types

```yaml
slides:
  - type: title      # Title slide with subtitle
  - type: section    # Section header
  - type: content    # Bullet points
  - type: table      # Data tables
  - type: chart      # Bar, line, pie charts
  - type: image      # Full-slide images
  - type: blank      # Custom content
```

## Project Info

- **Repository**: [github.com/yanndebray/nietzsche](https://github.com/yanndebray/nietzsche)
- **License**: MIT
- **Python**: 3.9+
