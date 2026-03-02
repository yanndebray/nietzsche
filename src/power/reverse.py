"""Reverse-engineer image-only PPTX into editable YAML specs."""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

from power.vision import VisionProvider, get_provider


@dataclass
class SlideAnalysis:
    """Result of vision AI analysis for a single slide."""

    index: int
    slide_type: str = "content"
    title: str = ""
    subtitle: str = ""
    bullets: list[str] = field(default_factory=list)
    headers: list[str] = field(default_factory=list)
    table_data: list[list[str]] = field(default_factory=list)
    visual_description: str = ""
    confidence: float = 1.0
    image_path: str = ""


def extract_images(pptx_path: str | Path, output_dir: str | Path) -> list[Path]:
    """Extract slide images from an image-only PPTX.

    Opens the PPTX, iterates through slides, and saves each picture
    shape's image blob to disk.

    Args:
        pptx_path: Path to the input PPTX file.
        output_dir: Directory to save extracted images.

    Returns:
        List of paths to extracted image files.
    """
    from pptx import Presentation

    pptx_path = Path(pptx_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    prs = Presentation(str(pptx_path))
    image_paths: list[Path] = []

    for i, slide in enumerate(prs.slides):
        for shape in slide.shapes:
            if shape.shape_type == 13:  # MSO_SHAPE_TYPE.PICTURE
                image = shape.image
                ext = image.content_type.split("/")[-1]
                if ext == "jpeg":
                    ext = "jpg"
                filename = f"slide_{i + 1:02d}.{ext}"
                image_path = output_dir / filename
                image_path.write_bytes(image.blob)
                image_paths.append(image_path)
                break  # One image per slide

    return image_paths


def build_vision_prompt(slide_index: int, total_slides: int) -> str:
    """Build a structured prompt for vision AI analysis of a slide image.

    Args:
        slide_index: 0-based index of the current slide.
        total_slides: Total number of slides in the presentation.

    Returns:
        Prompt string for the vision model.
    """
    position_hint = ""
    if slide_index == 0:
        position_hint = "This is the FIRST slide (likely a title slide)."
    elif slide_index == total_slides - 1:
        position_hint = "This is the LAST slide (likely a closing/thank-you slide)."
    else:
        position_hint = f"This is slide {slide_index + 1} of {total_slides} (a body slide)."

    return f"""Analyze this presentation slide image and extract its content.
{position_hint}

Return a JSON object with these fields:
- "slide_type": one of "title", "section", "content", "table", "two_column", "diagram", "image_only"
- "title": the main title text (empty string if none)
- "subtitle": subtitle or tagline text (empty string if none)
- "bullets": array of bullet point strings (empty array if none). Include ALL bullet text, preserving hierarchy with "- " prefix for sub-bullets.
- "headers": array of table column headers (empty array if no table)
- "table_data": array of arrays for table rows (empty array if no table)
- "visual_description": brief description of any diagrams, charts, or visual elements that cannot be represented as text
- "confidence": float 0.0-1.0 indicating how confident you are in the text extraction

Rules:
- Extract ALL visible text accurately, preserving the original wording
- For tables, capture every cell value including empty cells as ""
- For diagrams/flowcharts, describe the structure in visual_description and set slide_type to "diagram"
- If the slide is purely decorative with no extractable text structure, use slide_type "image_only"
- Return ONLY the JSON object, no other text"""


def analyze_slide_image(
    image_path: str | Path,
    slide_index: int,
    total_slides: int,
    provider: VisionProvider,
) -> SlideAnalysis:
    """Analyze a single slide image using vision AI.

    Args:
        image_path: Path to the slide image file.
        slide_index: 0-based index of the slide.
        total_slides: Total number of slides.
        provider: Vision AI provider instance.

    Returns:
        SlideAnalysis dataclass with extracted content.
    """
    image_path = Path(image_path)
    image_bytes = image_path.read_bytes()
    prompt = build_vision_prompt(slide_index, total_slides)

    result = provider.analyze_image(image_bytes, prompt)

    return SlideAnalysis(
        index=slide_index,
        slide_type=result.get("slide_type", "content"),
        title=result.get("title", ""),
        subtitle=result.get("subtitle", ""),
        bullets=result.get("bullets", []),
        headers=result.get("headers", []),
        table_data=result.get("table_data", []),
        visual_description=result.get("visual_description", ""),
        confidence=result.get("confidence", 1.0),
        image_path=str(image_path),
    )


def _analysis_to_slide_spec(analysis: SlideAnalysis) -> dict[str, Any]:
    """Convert a SlideAnalysis to a YAML-compatible slide spec dict.

    Mapping:
        AI slide_type  -> YAML type
        title          -> title (title + subtitle)
        section        -> section (title + subtitle)
        content        -> content (title + bullets)
        table          -> table (title + headers + data)
        two_column     -> content (flattened bullets + note)
        diagram        -> image (embed original image)
        image_only     -> image (embed original image)
    """
    st = analysis.slide_type

    if st == "title":
        spec: dict[str, Any] = {"type": "title", "title": analysis.title}
        if analysis.subtitle:
            spec["subtitle"] = analysis.subtitle
        return spec

    if st == "section":
        spec = {"type": "section", "title": analysis.title}
        if analysis.subtitle:
            spec["subtitle"] = analysis.subtitle
        return spec

    if st == "table" and analysis.headers:
        spec = {
            "type": "table",
            "title": analysis.title,
            "headers": analysis.headers,
            "data": analysis.table_data,
        }
        return spec

    if st in ("diagram", "image_only") or analysis.confidence < 0.5:
        spec = {"type": "image", "image": analysis.image_path}
        if analysis.title:
            spec["title"] = analysis.title
        if analysis.visual_description:
            spec["note"] = analysis.visual_description
        return spec

    if st == "two_column":
        spec = {"type": "content", "title": analysis.title}
        if analysis.bullets:
            spec["bullets"] = analysis.bullets
        if analysis.visual_description:
            spec["note"] = analysis.visual_description
        return spec

    # Default: content slide
    spec = {"type": "content", "title": analysis.title}
    if analysis.bullets:
        spec["bullets"] = analysis.bullets
    if analysis.subtitle and not analysis.bullets:
        spec["bullets"] = [analysis.subtitle]
    if analysis.visual_description:
        spec["note"] = analysis.visual_description
    return spec


def slides_to_yaml_spec(
    analyses: list[SlideAnalysis],
    presentation_title: str | None = None,
) -> dict[str, Any]:
    """Convert a list of SlideAnalysis objects to a YAML-compatible spec.

    Args:
        analyses: List of SlideAnalysis from vision AI.
        presentation_title: Optional override for the presentation title.

    Returns:
        Dict matching the `power generate` YAML spec format.
    """
    spec: dict[str, Any] = {}

    # Use the first slide's title as the presentation title if it's a title slide
    slides_specs = [_analysis_to_slide_spec(a) for a in analyses]

    if slides_specs and slides_specs[0].get("type") == "title":
        # Pull top-level title from the first title slide
        first = slides_specs[0]
        spec["title"] = presentation_title or first.get("title", "Untitled")
        if first.get("subtitle"):
            spec["subtitle"] = first["subtitle"]
        # Remove the first slide since it becomes the top-level title
        slides_specs = slides_specs[1:]

    elif presentation_title:
        spec["title"] = presentation_title

    spec["slides"] = slides_specs
    return spec


def reverse_presentation(
    pptx_path: str | Path,
    output_yaml: str | Path,
    images_dir: str | Path | None = None,
    provider_name: str = "claude",
    provider_kwargs: dict[str, Any] | None = None,
    presentation_title: str | None = None,
    progress_callback: Any | None = None,
) -> Path:
    """Orchestrate the full reverse-engineering pipeline.

    Args:
        pptx_path: Path to the input image-only PPTX.
        output_yaml: Path for the output YAML spec.
        images_dir: Directory to save extracted images (default: alongside YAML).
        provider_name: Vision AI provider name.
        provider_kwargs: Extra kwargs for the provider constructor.
        presentation_title: Optional title override.
        progress_callback: Optional callable(step, total, message) for progress.

    Returns:
        Path to the generated YAML file.
    """
    pptx_path = Path(pptx_path)
    output_yaml = Path(output_yaml)

    if images_dir is None:
        images_dir = output_yaml.parent / "extracted_images"
    images_dir = Path(images_dir)

    def _progress(step: int, total: int, message: str) -> None:
        if progress_callback:
            progress_callback(step, total, message)

    # Step 1: Extract images
    _progress(0, 3, "Extracting images from PPTX...")
    image_paths = extract_images(pptx_path, images_dir)
    total_slides = len(image_paths)

    if total_slides == 0:
        raise ValueError(f"No images found in {pptx_path}. Is this an image-only presentation?")

    _progress(1, 3, f"Extracted {total_slides} slide images")

    # Step 2: Analyze each slide with vision AI
    _progress(1, 3, f"Analyzing {total_slides} slides with vision AI...")
    provider = get_provider(provider_name, **(provider_kwargs or {}))

    analyses: list[SlideAnalysis] = []
    for i, img_path in enumerate(image_paths):
        _progress(1, 3, f"Analyzing slide {i + 1}/{total_slides}...")
        analysis = analyze_slide_image(img_path, i, total_slides, provider)
        analyses.append(analysis)

    # Step 3: Build YAML spec and write
    _progress(2, 3, "Building YAML spec...")
    spec = slides_to_yaml_spec(analyses, presentation_title)

    output_yaml.parent.mkdir(parents=True, exist_ok=True)
    with open(output_yaml, "w", encoding="utf-8") as f:
        yaml.dump(spec, f, default_flow_style=False, allow_unicode=True, sort_keys=False)

    _progress(3, 3, f"Wrote YAML spec to {output_yaml}")
    return output_yaml
