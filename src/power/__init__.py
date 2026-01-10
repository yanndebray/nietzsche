"""Power - A CLI tool for generating PowerPoint presentations."""

__version__ = "0.1.2"

from power.core import PowerPresentation
from power.slides import SlideBuilder
from power.styles import BRAND, FONTS, POSITIONS

__all__ = [
    "PowerPresentation",
    "SlideBuilder",
    "BRAND",
    "FONTS",
    "POSITIONS",
]
