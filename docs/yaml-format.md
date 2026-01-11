# YAML Format

This page documents the complete YAML specification for `power generate`.

## Basic Structure

```yaml
title: Presentation Title      # Creates title slide
subtitle: Optional Subtitle    # Subtitle for title slide

slides:                        # List of slides
  - type: content
    title: Slide Title
    bullets:
      - First bullet
      - Second bullet
```

## Top-Level Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | No | Presentation title (creates title slide if present) |
| `subtitle` | No | Subtitle for title slide |
| `slides` | Yes | List of slide definitions |

## Slide Types

### Title Slide

Creates a title slide (also created automatically from top-level `title`).

```yaml
- type: title
  title: Welcome
  subtitle: Introduction to Power CLI
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Main title text |
| `subtitle` | No | Subtitle text |

### Section Header

Creates a section divider slide.

```yaml
- type: section
  title: Chapter 1
  subtitle: Getting Started
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Section title |
| `subtitle` | No | Section subtitle |

### Content Slide

Creates a slide with bullet points.

```yaml
- type: content
  title: Key Points
  bullets:
    - First point
    - Second point
    - Third point
  note: Speaker notes here
  layout: "Title and Content 1"  # Optional
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Slide title |
| `bullets` | No | List of bullet points |
| `note` | No | Speaker notes |
| `layout` | No | Layout name (from `power inspect`) |

#### Content Slide with Image

```yaml
- type: content
  title: Feature Overview
  bullets:
    - Easy to use
    - Fast performance
  image: images/feature.png
  image_width: 4
  image_height: 3
  image_left: 8
  image_top: 2
```

| Field | Required | Description |
|-------|----------|-------------|
| `image` | No | Path to image file |
| `image_width` | No | Width in inches |
| `image_height` | No | Height in inches |
| `image_left` | No | Left position in inches (default: 7) |
| `image_top` | No | Top position in inches (default: 1.5) |

### Table Slide

Creates a slide with a data table.

```yaml
- type: table
  title: Financial Summary
  headers: [Metric, Q1, Q2, Q3, Q4]
  data:
    - [Revenue, "$1M", "$1.2M", "$1.4M", "$1.6M"]
    - [Profit, "$200K", "$250K", "$300K", "$350K"]
    - [Users, "10K", "12K", "15K", "18K"]
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Slide title |
| `headers` | Yes | List of column headers |
| `data` | Yes | List of rows (each row is a list) |

### Chart Slide

Creates a slide with a chart.

#### Bar Chart

```yaml
- type: chart
  title: Revenue by Region
  chart_type: bar
  categories: [North, South, East, West]
  series:
    2023: [100, 150, 120, 180]
    2024: [120, 180, 140, 210]
```

#### Line Chart

```yaml
- type: chart
  title: Growth Trend
  chart_type: line
  categories: [Jan, Feb, Mar, Apr, May, Jun]
  series:
    Users: [100, 120, 150, 180, 220, 280]
    Revenue: [50, 60, 75, 90, 110, 140]
```

#### Pie Chart

```yaml
- type: chart
  title: Market Share
  chart_type: pie
  categories: [Product A, Product B, Product C, Other]
  series:
    Share: [40, 30, 20, 10]
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Slide title |
| `chart_type` | Yes | `bar`, `line`, or `pie` |
| `categories` | Yes | List of category labels |
| `series` | Yes | Dictionary of series name to values |

!!! note
    For pie charts, only the first series is used.

### Image Slide

Creates a slide with a positioned image.

```yaml
- type: image
  title: Product Screenshot
  image: images/screenshot.png
  width: 10
  height: 5
  left: 1.5
  top: 1.8
  note: Show the main dashboard
```

| Field | Required | Description |
|-------|----------|-------------|
| `title` | No | Slide title |
| `image` | Yes | Path to image file |
| `width` | No | Width in inches |
| `height` | No | Height in inches |
| `left` | No | Left position in inches |
| `top` | No | Top position in inches |
| `note` | No | Speaker notes |

### Blank Slide

Creates an empty slide for custom content.

```yaml
- type: blank
```

## Picture Placeholders

Fill template picture placeholders by index:

```yaml
- type: content
  title: Team Photo
  bullets:
    - Our amazing team
  placeholder_images:
    10: images/team_photo.jpg
    11: images/office.jpg
```

Use `power inspect` to find placeholder indices.

## Complete Example

```yaml
title: Quarterly Business Review
subtitle: Q4 2024 Results

slides:
  - type: section
    title: Executive Summary

  - type: content
    title: Key Achievements
    bullets:
      - Revenue grew 25% year-over-year
      - Customer satisfaction at 94%
      - Launched 3 new product lines
    note: Emphasize the revenue growth

  - type: table
    title: Financial Overview
    headers: [Metric, Q3, Q4, Change]
    data:
      - [Revenue, "$2.1M", "$2.6M", "+24%"]
      - [Expenses, "$1.4M", "$1.5M", "+7%"]
      - [Net Profit, "$0.7M", "$1.1M", "+57%"]

  - type: chart
    title: Revenue by Region
    chart_type: bar
    categories: [North America, Europe, Asia, Other]
    series:
      Q3 2024: [1200, 500, 300, 100]
      Q4 2024: [1400, 650, 400, 150]

  - type: section
    title: Looking Ahead

  - type: content
    title: 2025 Priorities
    bullets:
      - Achieve $15M annual revenue
      - Launch mobile application
      - Enter Latin American market

  - type: image
    title: Our Global Presence
    image: images/world_map.png
    width: 10
    left: 1.5
    top: 1.8

  - type: title
    title: Thank You
    subtitle: Questions?
```

## JSON Alternative

The same structure works with JSON:

```json
{
  "title": "My Presentation",
  "slides": [
    {
      "type": "content",
      "title": "Overview",
      "bullets": ["Point 1", "Point 2"]
    }
  ]
}
```

## See Also

- [`power generate`](commands/generate.md) - Generate command reference
- [`power inspect`](commands/inspect.md) - View template layouts
- [Cookbook](cookbook.md) - Real-world examples
