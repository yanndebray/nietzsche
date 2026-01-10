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
    """Standard positioning for slide elements.

    Optimized for 16:9 slides (13.333" x 7.5").
    Content is centered horizontally.
    """

    # Slide dimensions (16:9)
    SLIDE_WIDTH = Inches(13.333)
    SLIDE_HEIGHT = Inches(7.5)

    # Title positioning
    TITLE_LEFT = Inches(0.5)
    TITLE_TOP = Inches(0.3)
    TITLE_WIDTH = Inches(12.333)
    TITLE_HEIGHT = Inches(0.8)

    # Content area (centered, below title)
    CONTENT_WIDTH = Inches(11)
    CONTENT_HEIGHT = Inches(5)
    CONTENT_LEFT = Inches(1.17)  # (13.333 - 11) / 2
    CONTENT_TOP = Inches(1.8)

    # Chart area (centered)
    CHART_WIDTH = Inches(10)
    CHART_HEIGHT = Inches(5)
    CHART_LEFT = Inches(1.67)  # (13.333 - 10) / 2
    CHART_TOP = Inches(2.0)

    # Table area (centered)
    TABLE_WIDTH = Inches(10)
    TABLE_LEFT = Inches(1.67)  # (13.333 - 10) / 2
    TABLE_TOP = Inches(2.0)


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
