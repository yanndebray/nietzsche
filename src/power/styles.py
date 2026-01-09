"""Styling constants for Power presentations."""

from dataclasses import dataclass

from pptx.dml.color import RGBColor
from pptx.util import Inches, Pt


@dataclass(frozen=True)
class BrandColors:
    """Brand color palette - use these consistently."""

    PRIMARY = RGBColor(0x00, 0x66, 0xCC)  # Blue
    SECONDARY = RGBColor(0x33, 0x33, 0x33)  # Dark gray
    ACCENT = RGBColor(0xFF, 0x99, 0x00)  # Orange
    SUCCESS = RGBColor(0x00, 0x99, 0x00)  # Green
    DANGER = RGBColor(0xCC, 0x00, 0x00)  # Red
    LIGHT_BG = RGBColor(0xF5, 0xF5, 0xF5)  # Light gray background
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

    # Title positioning
    TITLE_LEFT = Inches(0.5)
    TITLE_TOP = Inches(0.3)
    TITLE_WIDTH = Inches(9)
    TITLE_HEIGHT = Inches(0.8)

    # Content area
    CONTENT_LEFT = Inches(0.5)
    CONTENT_TOP = Inches(1.3)
    CONTENT_WIDTH = Inches(9)
    CONTENT_HEIGHT = Inches(5.5)

    # Chart area
    CHART_LEFT = Inches(0.5)
    CHART_TOP = Inches(1.5)
    CHART_WIDTH = Inches(9)
    CHART_HEIGHT = Inches(5)

    # Table area
    TABLE_LEFT = Inches(0.5)
    TABLE_TOP = Inches(1.5)
    TABLE_WIDTH = Inches(9)


# Singleton instances for easy import
BRAND = BrandColors()
FONTS = FontSizes()
POSITIONS = SlidePositions()


# Slide layout indices
class Layouts:
    """Standard PowerPoint layout indices."""

    TITLE = 0  # Title slide
    TITLE_CONTENT = 1  # Title and content
    SECTION = 2  # Section header
    TWO_CONTENT = 3  # Two content columns
    COMPARISON = 4  # Comparison layout
    TITLE_ONLY = 5  # Title only (good for custom content)
    BLANK = 6  # Blank (full control)
    CONTENT_CAPTION = 7  # Content with caption
    PICTURE_CAPTION = 8  # Picture with caption
