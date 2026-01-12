# Nietzsche ⚡Power⚡Point⚡Generator

[![PyPI](https://img.shields.io/pypi/v/nietzsche.svg)](https://pypi.org/project/nietzsche/)
[![Docs](https://img.shields.io/badge/docs-nietzsche-7c3aed.svg)](https://yanndebray.github.io/nietzsche/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/yanndebray/nietzsche/blob/main/LICENSE)

A CLI tool for generating PowerPoint presentations programmatically.

## Installation

Install this tool using `uv`:
```bash
uv tool install nietzsche
```
Or using `pip`:
```bash
pip install nietzsche
```
Or run it directly without installing using `uvx`:
```bash
uvx --from nietzsche power --help
```

## Quick Start

```bash
# Create a presentation with a template
power create deck.pptx -t Galaxy.pptx --title "My Presentation"

# Generate from YAML/JSON
power generate slides.yaml -o output.pptx -t Galaxy.pptx

# Inspect template layouts
power inspect Galaxy.pptx

# Interactive mode
power new -t Galaxy.pptx
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `power create` | Create presentation with title slide |
| `power generate` | Generate from YAML/JSON specification |
| `power inspect` | Inspect template layouts and placeholders |
| `power new` | Interactive presentation builder |
| `power add` | Add slide to existing presentation |
| `power remove` | Remove slide by index |
| `power replace` | Replace `{{PLACEHOLDER}}` text |
| `power cloud` | Generate presentations via cloud API |

## Cloud API

Generate presentations via REST API:

```bash
# Check API health
power cloud health

# Generate via cloud
power cloud generate slides.yaml -o presentation.pptx

# Or use the REST API directly
curl -X POST "https://power-api-944767079044.us-central1.run.app/generate" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Deck", "slides": [{"type": "content", "title": "Hello", "bullets": ["Point 1"]}]}' \
  --output presentation.pptx
```

API Documentation: https://power-api-944767079044.us-central1.run.app/

## YAML Format

```yaml
title: Quarterly Report
subtitle: Q4 2024

slides:
  - type: section
    title: Executive Summary

  - type: content
    title: Key Points
    bullets:
      - First point
      - Second point
      - Third point

  - type: table
    title: Financial Data
    headers: [Metric, Q3, Q4]
    data:
      - [Revenue, "$2.1M", "$2.6M"]
      - [Profit, "$0.7M", "$1.1M"]

  - type: chart
    title: Sales by Region
    chart_type: bar
    categories: [North, South, East, West]
    series:
      2023: [100, 200, 150, 180]
      2024: [120, 250, 170, 210]
```

## Python API

```python
from power import PowerPresentation

# Create with template
ppt = PowerPresentation(template="Galaxy.pptx")
ppt.clear_slides()

# Add slides
ppt.add_title_slide("Welcome", "Subtitle")
ppt.add_content_slide("Agenda", ["Topic 1", "Topic 2", "Topic 3"])
ppt.add_section_slide("Part 1")

# Custom slide with builder
slide = ppt.add_slide(5)
slide.set_title("Data Overview")
slide.add_table(
    data=[["A", "100"], ["B", "200"]],
    headers=["Item", "Value"]
)
slide.add_bar_chart(
    categories=["Q1", "Q2", "Q3", "Q4"],
    series_data={"Revenue": [100, 150, 200, 250]}
)

ppt.save("output.pptx")
```

## Slide Types

- **title**: Title slide with optional subtitle
- **section**: Section header slide
- **content**: Bullet points slide
- **table**: Data table slide
- **chart**: Bar, line, or pie chart (bar, line, pie)
- **blank**: Empty slide for custom content

## Requirements

- Python 3.9+
- python-pptx
- click
- rich
- pyyaml
- pillow

## License

MIT
