# CLAUDE.md - Python-PPTX Project Guidelines

## Project Overview

This project generates PowerPoint presentations programmatically using python-pptx. Common use cases include automated report generation, template-based slide creation, and batch presentation production from data sources.

## Tech Stack

- **Python**: 3.9+
- **Core Library**: python-pptx (v1.0.2+)
- **Data Processing**: pandas, openpyxl
- **Image Handling**: Pillow
- **Charts**: python-pptx native charts, matplotlib (for complex visualizations exported as images)
- **Testing**: pytest, pytest-cov
- **Type Checking**: mypy
- **Formatting**: black, isort, ruff

## Installation

```bash
pip install python-pptx pandas pillow openpyxl
pip install pytest pytest-cov mypy black isort ruff  # dev dependencies
```

## Project Structure

```
project/
├── CLAUDE.md
├── pyproject.toml
├── src/
│   └── pptx_generator/
│       ├── __init__.py
│       ├── core/
│       │   ├── __init__.py
│       │   ├── presentation.py    # Main presentation builder
│       │   ├── slides.py          # Slide creation utilities
│       │   └── styles.py          # Brand/styling constants
│       ├── components/
│       │   ├── __init__.py
│       │   ├── charts.py          # Chart creation helpers
│       │   ├── tables.py          # Table creation helpers
│       │   └── images.py          # Image handling utilities
│       ├── templates/
│       │   ├── __init__.py
│       │   └── placeholder.py     # Template placeholder replacement
│       └── utils/
│           ├── __init__.py
│           ├── units.py           # Unit conversion helpers
│           └── colors.py          # Color utilities
├── templates/                      # .pptx template files
│   └── company_template.pptx
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_presentation.py
│   ├── test_charts.py
│   └── test_tables.py
├── examples/
│   ├── report_generation.py
│   ├── template_replacement.py
│   └── batch_creation.py
└── output/                         # Generated presentations (gitignored)
```

## Core Imports Pattern

Always use this import structure for consistency:

```python
from pptx import Presentation
from pptx.util import Inches, Pt, Emu, Cm
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.chart import XL_CHART_TYPE, XL_LEGEND_POSITION
from pptx.enum.dml import MSO_THEME_COLOR
from pptx.chart.data import CategoryChartData, ChartData
from pptx.oxml.ns import nsmap
```

## Styling Constants

Define brand/styling constants in a dedicated module (`src/pptx_generator/core/styles.py`):

```python
from pptx.util import Pt, Inches
from pptx.dml.color import RGBColor
from dataclasses import dataclass

@dataclass(frozen=True)
class BrandColors:
    """Company brand colors - use these consistently."""
    PRIMARY = RGBColor(0x00, 0x66, 0xCC)      # Blue
    SECONDARY = RGBColor(0x33, 0x33, 0x33)    # Dark gray
    ACCENT = RGBColor(0xFF, 0x99, 0x00)       # Orange
    SUCCESS = RGBColor(0x00, 0x99, 0x00)      # Green
    DANGER = RGBColor(0xCC, 0x00, 0x00)       # Red
    LIGHT_BG = RGBColor(0xF5, 0xF5, 0xF5)     # Light gray background
    WHITE = RGBColor(0xFF, 0xFF, 0xFF)
    BLACK = RGBColor(0x00, 0x00, 0x00)

@dataclass(frozen=True)
class FontSizes:
    """Standard font sizes."""
    TITLE = Pt(44)
    SLIDE_TITLE = Pt(32)
    SUBTITLE = Pt(24)
    BODY = Pt(18)
    CAPTION = Pt(14)
    SMALL = Pt(12)

@dataclass(frozen=True)
class SlidePositions:
    """Standard positioning for slide elements."""
    TITLE_LEFT = Inches(0.5)
    TITLE_TOP = Inches(0.3)
    TITLE_WIDTH = Inches(9)
    TITLE_HEIGHT = Inches(0.8)
    
    CONTENT_LEFT = Inches(0.5)
    CONTENT_TOP = Inches(1.3)
    CONTENT_WIDTH = Inches(9)
    CONTENT_HEIGHT = Inches(5.5)
    
    CHART_LEFT = Inches(0.5)
    CHART_TOP = Inches(1.5)
    CHART_WIDTH = Inches(9)
    CHART_HEIGHT = Inches(5)

BRAND = BrandColors()
FONTS = FontSizes()
POSITIONS = SlidePositions()
```

## Slide Layouts Reference

Standard PowerPoint layouts (access via `prs.slide_layouts[index]`):

| Index | Layout Name | Use Case |
|-------|------------|----------|
| 0 | Title Slide | Opening/closing slides |
| 1 | Title and Content | Standard content slides |
| 2 | Section Header | Section dividers |
| 3 | Two Content | Side-by-side content |
| 4 | Comparison | Before/after, pros/cons |
| 5 | Title Only | Charts, tables, custom layouts |
| 6 | Blank | Full custom control |
| 7 | Content with Caption | Image with description |
| 8 | Picture with Caption | Photo slides |

**Best Practice**: Use layout 5 (Title Only) or 6 (Blank) for programmatic content to avoid placeholder conflicts.

## Common Patterns

### Creating a New Presentation

```python
def create_presentation(template_path: str | None = None) -> Presentation:
    """Create presentation from template or blank."""
    if template_path:
        return Presentation(template_path)
    return Presentation()
```

### Adding a Title Slide

```python
def add_title_slide(
    prs: Presentation,
    title: str,
    subtitle: str = ""
) -> None:
    """Add a title slide with optional subtitle."""
    slide = prs.slides.add_slide(prs.slide_layouts[0])
    slide.shapes.title.text = title
    if subtitle and len(slide.placeholders) > 1:
        slide.placeholders[1].text = subtitle
```

### Adding Content with Text Box (Preferred for Custom Layouts)

```python
def add_text_box(
    slide,
    text: str,
    left: Inches,
    top: Inches,
    width: Inches,
    height: Inches,
    font_size: Pt = FONTS.BODY,
    bold: bool = False,
    color: RGBColor = BRAND.SECONDARY
) -> None:
    """Add a text box with consistent styling."""
    text_box = slide.shapes.add_textbox(left, top, width, height)
    tf = text_box.text_frame
    tf.word_wrap = True
    
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = font_size
    p.font.bold = bold
    p.font.color.rgb = color
```

### Adding Tables

```python
def add_data_table(
    slide,
    data: list[list[str]],
    headers: list[str],
    left: Inches = POSITIONS.CONTENT_LEFT,
    top: Inches = POSITIONS.CONTENT_TOP,
    width: Inches = POSITIONS.CONTENT_WIDTH,
    height: Inches | None = None
) -> None:
    """Add a formatted data table."""
    rows = len(data) + 1  # +1 for header
    cols = len(headers)
    
    # Calculate height if not provided
    if height is None:
        height = Inches(0.4 * rows)
    
    table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    
    # Style header row
    for col_idx, header in enumerate(headers):
        cell = table.cell(0, col_idx)
        cell.text = header
        cell.fill.solid()
        cell.fill.fore_color.rgb = BRAND.PRIMARY
        
        para = cell.text_frame.paragraphs[0]
        para.font.bold = True
        para.font.color.rgb = BRAND.WHITE
        para.font.size = FONTS.CAPTION
    
    # Populate data rows
    for row_idx, row_data in enumerate(data):
        for col_idx, value in enumerate(row_data):
            cell = table.cell(row_idx + 1, col_idx)
            cell.text = str(value)
            cell.text_frame.paragraphs[0].font.size = FONTS.CAPTION
```

### Adding Charts

```python
from pptx.chart.data import CategoryChartData

def add_bar_chart(
    slide,
    categories: list[str],
    series_data: dict[str, list[float]],
    left: Inches = POSITIONS.CHART_LEFT,
    top: Inches = POSITIONS.CHART_TOP,
    width: Inches = POSITIONS.CHART_WIDTH,
    height: Inches = POSITIONS.CHART_HEIGHT
) -> None:
    """Add a bar chart with multiple series."""
    chart_data = CategoryChartData()
    chart_data.categories = categories
    
    for series_name, values in series_data.items():
        chart_data.add_series(series_name, values)
    
    graphic_frame = slide.shapes.add_chart(
        XL_CHART_TYPE.COLUMN_CLUSTERED,
        left, top, width, height,
        chart_data
    )
    
    chart = graphic_frame.chart
    chart.has_legend = True
    chart.legend.position = XL_LEGEND_POSITION.BOTTOM
    chart.legend.include_in_layout = False
```

### Template Placeholder Replacement

```python
def replace_placeholders(
    prs: Presentation,
    replacements: dict[str, str]
) -> None:
    """Replace {{PLACEHOLDER}} text throughout presentation."""
    for slide in prs.slides:
        for shape in slide.shapes:
            if not shape.has_text_frame:
                continue
            for paragraph in shape.text_frame.paragraphs:
                for run in paragraph.runs:
                    for placeholder, value in replacements.items():
                        if placeholder in run.text:
                            run.text = run.text.replace(placeholder, str(value))
```

### Adding Images

```python
from pathlib import Path

def add_image(
    slide,
    image_path: str | Path,
    left: Inches,
    top: Inches,
    width: Inches | None = None,
    height: Inches | None = None
) -> None:
    """Add image with optional sizing (maintains aspect ratio if one dimension given)."""
    image_path = Path(image_path)
    if not image_path.exists():
        raise FileNotFoundError(f"Image not found: {image_path}")
    
    # If neither dimension specified, use default width
    if width is None and height is None:
        width = Inches(4)
    
    slide.shapes.add_picture(
        str(image_path),
        left, top,
        width=width,
        height=height
    )
```

## Unit Conversion Reference

```python
from pptx.util import Inches, Pt, Emu, Cm

# 1 inch = 914400 EMUs (English Metric Units)
# 1 inch = 72 points
# 1 cm = 360000 EMUs

# Common conversions
Inches(1)      # 1 inch
Pt(12)         # 12 points (font size)
Cm(2.54)       # 1 inch in centimeters
Emu(914400)    # 1 inch in EMUs

# Slide dimensions (standard 16:9)
SLIDE_WIDTH = Inches(13.333)   # 10 inches for 4:3
SLIDE_HEIGHT = Inches(7.5)     # 7.5 inches for both
```

## Error Handling Patterns

```python
from pptx.exc import PackageNotFoundError
import logging

logger = logging.getLogger(__name__)

def safe_load_template(template_path: str) -> Presentation | None:
    """Safely load a template with error handling."""
    try:
        return Presentation(template_path)
    except PackageNotFoundError:
        logger.error(f"Template not found: {template_path}")
        return None
    except Exception as e:
        logger.error(f"Failed to load template: {e}")
        return None

def safe_save(prs: Presentation, output_path: str) -> bool:
    """Save presentation with error handling."""
    try:
        prs.save(output_path)
        logger.info(f"Saved presentation to {output_path}")
        return True
    except PermissionError:
        logger.error(f"Permission denied: {output_path}")
        return False
    except Exception as e:
        logger.error(f"Failed to save presentation: {e}")
        return False
```

## Testing Guidelines

### Test Fixtures (conftest.py)

```python
import pytest
from pptx import Presentation

@pytest.fixture
def blank_presentation():
    """Provide a blank presentation for testing."""
    return Presentation()

@pytest.fixture
def presentation_with_slide(blank_presentation):
    """Provide a presentation with one blank slide."""
    blank_presentation.slides.add_slide(blank_presentation.slide_layouts[6])
    return blank_presentation

@pytest.fixture
def tmp_output(tmp_path):
    """Provide a temporary output path."""
    return tmp_path / "test_output.pptx"
```

### Test Patterns

```python
import pytest
from pptx import Presentation
from pptx.util import Inches

def test_add_slide_creates_slide(blank_presentation):
    """Test that adding a slide increases slide count."""
    initial_count = len(blank_presentation.slides)
    blank_presentation.slides.add_slide(blank_presentation.slide_layouts[6])
    assert len(blank_presentation.slides) == initial_count + 1

def test_presentation_saves_successfully(presentation_with_slide, tmp_output):
    """Test that presentation can be saved to file."""
    presentation_with_slide.save(str(tmp_output))
    assert tmp_output.exists()
    
    # Verify it can be reopened
    loaded = Presentation(str(tmp_output))
    assert len(loaded.slides) == 1

def test_table_has_correct_dimensions(presentation_with_slide):
    """Test table creation with correct rows and columns."""
    slide = presentation_with_slide.slides[0]
    table_shape = slide.shapes.add_table(3, 4, Inches(1), Inches(1), Inches(6), Inches(2))
    
    assert len(table_shape.table.rows) == 3
    assert len(table_shape.table.columns) == 4
```

## Common Pitfalls to Avoid

### ❌ DON'T: Modify placeholders when you need full control

```python
# Bad - placeholder constraints limit positioning
slide.placeholders[1].text = "Content"
```

### ✅ DO: Use shapes for full control

```python
# Good - full control over positioning and styling
text_box = slide.shapes.add_textbox(Inches(1), Inches(1.5), Inches(8), Inches(5))
text_box.text_frame.text = "Content"
```

### ❌ DON'T: Hardcode positions throughout code

```python
# Bad - magic numbers everywhere
slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
```

### ✅ DO: Use constants

```python
# Good - centralized, consistent positioning
from .styles import POSITIONS
slide.shapes.add_textbox(
    POSITIONS.TITLE_LEFT, POSITIONS.TITLE_TOP,
    POSITIONS.TITLE_WIDTH, POSITIONS.TITLE_HEIGHT
)
```

### ❌ DON'T: Forget to handle missing placeholders

```python
# Bad - will crash if placeholder doesn't exist
slide.placeholders[1].text = subtitle
```

### ✅ DO: Check placeholder existence

```python
# Good - defensive programming
if len(slide.placeholders) > 1:
    slide.placeholders[1].text = subtitle
```

### ❌ DON'T: Create charts without data validation

```python
# Bad - will create broken chart with mismatched data
chart_data.categories = ['A', 'B']
chart_data.add_series('Sales', [1, 2, 3])  # Length mismatch!
```

### ✅ DO: Validate data before chart creation

```python
# Good - ensure data consistency
assert len(values) == len(categories), "Data length must match categories"
chart_data.categories = categories
chart_data.add_series(series_name, values)
```

## Performance Considerations

1. **Batch Operations**: Create all slides before saving, not save-per-slide
2. **Image Optimization**: Resize large images before embedding (use Pillow)
3. **Template Reuse**: Load template once, copy for multiple outputs
4. **Memory Management**: For large batches, process in chunks and release references

```python
from PIL import Image
from io import BytesIO

def optimize_image(image_path: str, max_width: int = 1920) -> BytesIO:
    """Optimize image size before embedding."""
    with Image.open(image_path) as img:
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.Resampling.LANCZOS)
        
        buffer = BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        buffer.seek(0)
        return buffer
```

## Git Workflow

### .gitignore entries

```
# Generated presentations
output/
*.pptx
!templates/*.pptx

# Python
__pycache__/
*.pyc
.pytest_cache/
.mypy_cache/
.coverage
htmlcov/
dist/
*.egg-info/

# Environment
.env
.venv/
venv/
```

## Quick Reference Commands

```bash
# Run tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=src/pptx_generator --cov-report=html

# Type checking
mypy src/

# Format code
black src/ tests/
isort src/ tests/

# Lint
ruff check src/ tests/

# Generate example presentation
python examples/report_generation.py
```

## Additional Resources

- [python-pptx Documentation](https://python-pptx.readthedocs.io/)
- [python-pptx GitHub](https://github.com/scanny/python-pptx)
- [Open XML SDK Documentation](https://docs.microsoft.com/en-us/office/open-xml/open-xml-sdk)
