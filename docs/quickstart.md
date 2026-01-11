# Quick Start

This guide will have you creating PowerPoint presentations in 5 minutes.

## Step 1: Install Power CLI

```bash
pip install nietzsche
```

Verify the installation:

```bash
power --version
```

## Step 2: Create Your First Presentation

The simplest way to create a presentation:

```bash
power create my_first_deck.pptx --title "Hello World"
```

This creates a presentation with a single title slide.

## Step 3: Use a Template

Power CLI includes templates. Download one or use your own corporate template:

```bash
power create report.pptx -t Galaxy.pptx --title "Q1 Report" --subtitle "2024 Results"
```

## Step 4: Inspect Templates

Not sure what layouts are available? Inspect any PowerPoint file:

```bash
power inspect Galaxy.pptx
```

This shows all available layouts and their placeholders.

## Step 5: Generate from YAML

For more complex presentations, define your slides in YAML.

Create a file called `slides.yaml`:

```yaml
title: My Presentation
subtitle: Getting Started with Power CLI

slides:
  - type: section
    title: Introduction

  - type: content
    title: What We'll Cover
    bullets:
      - Installing Power CLI
      - Creating presentations
      - Using templates
      - Advanced features

  - type: table
    title: Feature Comparison
    headers: [Feature, Status]
    data:
      - [Templates, Supported]
      - [Charts, Supported]
      - [Images, Supported]

  - type: chart
    title: Progress Over Time
    chart_type: bar
    categories: [Q1, Q2, Q3, Q4]
    series:
      Revenue: [100, 150, 200, 250]
      Costs: [80, 90, 100, 110]

  - type: title
    title: Thank You!
    subtitle: Questions?
```

Generate the presentation:

```bash
power generate slides.yaml -o presentation.pptx
```

Or with a template:

```bash
power generate slides.yaml -o presentation.pptx -t Galaxy.pptx
```

## Step 6: Interactive Mode

Prefer a guided experience? Use interactive mode:

```bash
power new -t Galaxy.pptx -o my_deck.pptx
```

Follow the prompts to build your presentation step by step.

## What's Next?

- Learn about all [CLI commands](commands/index.md)
- Explore the [YAML format](yaml-format.md) in detail
- Check out the [cookbook](cookbook.md) for real-world examples
- Read the [troubleshooting guide](troubleshooting.md) if you hit any issues

## Quick Reference

| Task | Command |
|------|---------|
| Create with title | `power create out.pptx --title "Title"` |
| Use template | `power create out.pptx -t template.pptx` |
| Generate from YAML | `power generate input.yaml -o out.pptx` |
| Inspect template | `power inspect template.pptx` |
| Interactive mode | `power new` |
| Add slide | `power add deck.pptx -o out.pptx --title "New"` |
| Remove slide | `power remove deck.pptx 2 -o out.pptx` |
| Replace placeholders | `power replace deck.pptx KEY=value -o out.pptx` |
