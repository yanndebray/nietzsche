# Cookbook

Real-world examples and recipes for common presentation tasks.

## Automated Reporting

### Weekly Status Report

Generate a weekly status report from data:

```yaml
# weekly_status.yaml
title: Weekly Status Report
subtitle: "Week of {{WEEK_DATE}}"

slides:
  - type: content
    title: Completed This Week
    bullets:
      - "{{COMPLETED_1}}"
      - "{{COMPLETED_2}}"
      - "{{COMPLETED_3}}"

  - type: content
    title: In Progress
    bullets:
      - "{{INPROGRESS_1}}"
      - "{{INPROGRESS_2}}"

  - type: content
    title: Blockers
    bullets:
      - "{{BLOCKER_1}}"

  - type: content
    title: Next Week
    bullets:
      - "{{NEXT_1}}"
      - "{{NEXT_2}}"
```

Generate and fill:

```bash
power generate weekly_status.yaml -o status.pptx -t Corporate.pptx
power replace status.pptx \
    "WEEK_DATE=January 15, 2024" \
    "COMPLETED_1=Finished feature X" \
    "COMPLETED_2=Fixed bug Y" \
    "COMPLETED_3=Updated documentation" \
    "INPROGRESS_1=Working on feature Z" \
    "INPROGRESS_2=Code review for PR #123" \
    "BLOCKER_1=Waiting on API access" \
    "NEXT_1=Complete feature Z" \
    "NEXT_2=Start integration testing" \
    -o weekly_report.pptx
```

### Financial Dashboard

```yaml
title: Financial Dashboard
subtitle: Monthly Report - {{MONTH}} {{YEAR}}

slides:
  - type: section
    title: Revenue Overview

  - type: chart
    title: Monthly Revenue
    chart_type: bar
    categories: [Jan, Feb, Mar, Apr, May, Jun]
    series:
      Actual: [100, 120, 115, 140, 155, 170]
      Target: [100, 110, 120, 130, 140, 150]

  - type: table
    title: Key Metrics
    headers: [Metric, Current, Previous, Change]
    data:
      - [Revenue, "$1.7M", "$1.5M", "+13%"]
      - [Expenses, "$1.2M", "$1.1M", "+9%"]
      - [Profit, "$500K", "$400K", "+25%"]
      - [Margin, "29%", "27%", "+2pp"]

  - type: chart
    title: Expense Breakdown
    chart_type: pie
    categories: [Salaries, Marketing, Operations, R&D, Other]
    series:
      Expenses: [45, 20, 15, 12, 8]
```

## Batch Generation

### Generate from CSV Data

Python script to generate presentations from CSV:

```python
import csv
from pathlib import Path
import subprocess
import yaml

# Read CSV data
with open('customers.csv') as f:
    customers = list(csv.DictReader(f))

# Generate a presentation for each customer
for customer in customers:
    # Create YAML spec
    spec = {
        'title': f"Proposal for {customer['company']}",
        'subtitle': f"Prepared for {customer['contact']}",
        'slides': [
            {
                'type': 'content',
                'title': 'Our Solution',
                'bullets': [
                    f"Tailored for {customer['industry']}",
                    f"Budget: {customer['budget']}",
                    'Implementation in 30 days'
                ]
            },
            {
                'type': 'table',
                'title': 'Pricing',
                'headers': ['Service', 'Price'],
                'data': [
                    ['Setup', '$5,000'],
                    ['Monthly', '$500/mo'],
                    ['Support', 'Included']
                ]
            }
        ]
    }

    # Write YAML
    yaml_file = f"temp_{customer['id']}.yaml"
    with open(yaml_file, 'w') as f:
        yaml.dump(spec, f)

    # Generate presentation
    output = f"proposals/proposal_{customer['company'].replace(' ', '_')}.pptx"
    subprocess.run([
        'power', 'generate', yaml_file,
        '-o', output,
        '-t', 'Corporate.pptx'
    ])

    Path(yaml_file).unlink()  # Clean up

print(f"Generated {len(customers)} proposals")
```

### Shell Script for Multiple Reports

```bash
#!/bin/bash

QUARTERS=("Q1" "Q2" "Q3" "Q4")
YEAR="2024"

for quarter in "${QUARTERS[@]}"; do
    power generate quarterly_template.yaml -o "reports/${quarter}_${YEAR}.pptx" -t Galaxy.pptx
    power replace "reports/${quarter}_${YEAR}.pptx" \
        "QUARTER=${quarter}" \
        "YEAR=${YEAR}" \
        -o "reports/${quarter}_${YEAR}.pptx"
    echo "Generated ${quarter} ${YEAR} report"
done
```

## Template Workflows

### Corporate Template Setup

1. Inspect your corporate template:

```bash
power inspect Corporate.pptx
```

2. Note the layout names and indices:

```
0: Title Slide
1: Title and Content
2: Section Header
5: Title Only
6: Blank
7: Content with Caption
```

3. Use specific layouts in YAML:

```yaml
slides:
  - type: content
    title: Overview
    layout: "Title and Content"  # Use exact name
    bullets:
      - Point 1
      - Point 2
```

### Picture Placeholder Workflow

1. Find picture placeholders:

```bash
power inspect BrandedTemplate.pptx | grep -i picture
```

Output:
```
├── idx=10 Picture Placeholder (PICTURE)
├── idx=11 Picture Placeholder 2 (PICTURE)
```

2. Fill placeholders in YAML:

```yaml
- type: content
  title: Our Team
  bullets:
    - Experienced professionals
    - Global presence
  placeholder_images:
    10: images/team.jpg
    11: images/office.jpg
```

## Integration Examples

### GitHub Actions

```yaml
# .github/workflows/generate-report.yml
name: Generate Report

on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday at 9 AM
  workflow_dispatch:

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install Power CLI
        run: pip install nietzsche

      - name: Generate Report
        run: |
          power generate report.yaml -o weekly_report.pptx -t templates/Corporate.pptx
          power replace weekly_report.pptx \
            "DATE=$(date +%Y-%m-%d)" \
            "WEEK=$(date +%V)" \
            -o weekly_report.pptx

      - name: Upload Artifact
        uses: actions/upload-artifact@v4
        with:
          name: weekly-report
          path: weekly_report.pptx
```

### Python Integration

```python
from power import PowerPresentation

# Create programmatically
ppt = PowerPresentation(template="Galaxy.pptx")
ppt.clear_slides()

# Add slides
ppt.add_title_slide("Data Analysis", "Generated Report")
ppt.add_section_slide("Overview")
ppt.add_content_slide("Key Findings", [
    "Finding 1",
    "Finding 2",
    "Finding 3"
])

# Add chart
slide = ppt.add_slide(5)  # Title Only layout
slide.set_title("Trends")
slide.add_bar_chart(
    categories=["2021", "2022", "2023", "2024"],
    series_data={
        "Revenue": [100, 150, 200, 280],
        "Costs": [80, 100, 120, 150]
    }
)

ppt.save("analysis.pptx")
```

## Tips and Tricks

### Reusable Slide Components

Create partial YAML files and merge them:

```python
import yaml

# Load components
with open('header.yaml') as f:
    header = yaml.safe_load(f)

with open('financials.yaml') as f:
    financials = yaml.safe_load(f)

with open('footer.yaml') as f:
    footer = yaml.safe_load(f)

# Combine
presentation = {
    'title': 'Combined Report',
    'slides': header['slides'] + financials['slides'] + footer['slides']
}

with open('combined.yaml', 'w') as f:
    yaml.dump(presentation, f)
```

### Conditional Content

Generate different content based on conditions:

```python
slides = []

if include_executive_summary:
    slides.append({
        'type': 'section',
        'title': 'Executive Summary'
    })

if revenue > target:
    slides.append({
        'type': 'content',
        'title': 'Great Quarter!',
        'bullets': [f'Revenue: ${revenue}M (+{growth}%)']
    })
else:
    slides.append({
        'type': 'content',
        'title': 'Improvement Needed',
        'bullets': [f'Revenue: ${revenue}M (Target: ${target}M)']
    })
```

## See Also

- [YAML Format](yaml-format.md) - Complete YAML reference
- [Commands](commands/index.md) - CLI reference
- [Troubleshooting](troubleshooting.md) - Common issues
