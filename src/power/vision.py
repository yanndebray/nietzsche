"""Vision AI providers for reverse-engineering slide images."""

from __future__ import annotations

import base64
import os
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any


class VisionProvider(ABC):
    """Abstract base class for vision AI providers."""

    @abstractmethod
    def analyze_image(self, image_bytes: bytes, prompt: str) -> dict[str, Any]:
        """Analyze an image and return structured data.

        Args:
            image_bytes: Raw image bytes (JPEG/PNG).
            prompt: Instruction prompt for the vision model.

        Returns:
            Parsed JSON dict from the model response.
        """


class ClaudeVisionProvider(VisionProvider):
    """Vision provider using Anthropic Claude API."""

    def __init__(self, model: str = "claude-sonnet-4-20250514", api_key: str | None = None):
        try:
            import anthropic
        except ImportError:
            raise ImportError(
                "anthropic package is required for reverse engineering. "
                "Install it with: pip install 'nietzsche[reverse]'"
            )

        self.model = model
        self.client = anthropic.Anthropic(api_key=api_key or os.environ.get("ANTHROPIC_API_KEY"))

    def analyze_image(self, image_bytes: bytes, prompt: str) -> dict[str, Any]:
        """Analyze an image using Claude's vision capabilities."""
        import json

        image_b64 = base64.b64encode(image_bytes).decode("utf-8")

        # Detect media type from header bytes
        media_type = "image/jpeg"
        if image_bytes[:8] == b"\x89PNG\r\n\x1a\n":
            media_type = "image/png"

        response = self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": media_type,
                                "data": image_b64,
                            },
                        },
                        {
                            "type": "text",
                            "text": prompt,
                        },
                    ],
                }
            ],
        )

        # Extract text content and parse JSON
        text = response.content[0].text

        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.split("\n")
            # Remove first line (```json) and last line (```)
            lines = [l for l in lines[1:] if l.strip() != "```"]
            text = "\n".join(lines)

        return json.loads(text)


def get_provider(name: str = "claude", **kwargs: Any) -> VisionProvider:
    """Factory function to create a vision provider.

    Args:
        name: Provider name ("claude").
        **kwargs: Passed to the provider constructor.

    Returns:
        A VisionProvider instance.
    """
    providers = {
        "claude": ClaudeVisionProvider,
    }

    if name not in providers:
        available = ", ".join(providers.keys())
        raise ValueError(f"Unknown vision provider '{name}'. Available: {available}")

    return providers[name](**kwargs)
