# Skill: Python CLI Tool Development & Publishing

This skill documents the complete process of creating, packaging, and publishing a Python CLI tool with a project website.

## Overview

**Project**: nietzsche - A PowerPoint generation CLI tool
**CLI Command**: `power`
**Duration**: Single session
**Result**: Published PyPI package + GitHub Pages website

---

## Phase 1: Project Setup

### 1.1 Create Package Structure

```
project/
├── pyproject.toml          # Package configuration
├── src/
│   └── power/              # Main package
│       ├── __init__.py     # Package exports + version
│       ├── cli.py          # Click-based CLI
│       ├── core.py         # Main classes
│       ├── slides.py       # Slide builder utilities
│       └── styles.py       # Styling constants
├── examples/
│   └── sample.yaml         # Example input file
└── .gitignore
```

### 1.2 Key Dependencies

```toml
[project]
dependencies = [
    "python-pptx>=1.0.2",   # PowerPoint generation
    "click>=8.0.0",          # CLI framework
    "rich>=13.0.0",          # Terminal formatting
    "pyyaml>=6.0",           # YAML parsing
    "pillow>=10.0.0",        # Image handling
]

[project.scripts]
power = "power.cli:main"     # CLI entry point
```

### 1.3 CLI Structure with Click

```python
@click.group()
@click.version_option()
def main():
    """Tool description."""
    pass

@main.command()
@click.argument("output")
@click.option("-t", "--template", help="Template file")
def create(output, template):
    """Command description."""
    # Implementation
```

---

## Phase 2: Version Control

### 2.1 Git Setup

```bash
# Initialize and configure
git init
git add -A

# Proper .gitignore for Python
__pycache__/
*.egg-info/
dist/
build/
.venv/
```

### 2.2 Commit Convention

```bash
git commit -m "$(cat <<'EOF'
Short description

- Bullet point details
- More details

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"
```

### 2.3 Tagging Releases

```bash
git tag -a v0.1.0 -m "Release description"
git push origin main --tags
```

---

## Phase 3: PyPI Publishing

### 3.1 Package Naming Strategy

- **PyPI package name**: Unique name (e.g., `nietzsche`)
- **CLI command**: Can differ from package (e.g., `power`)
- **Python module**: Internal name (e.g., `power/`)

### 3.2 Build with uv

```bash
# Clean and build
rm -rf dist/ build/
uv build

# Output: dist/package-version.tar.gz + .whl
```

### 3.3 GitHub Actions for PyPI (Trusted Publishing)

```yaml
# .github/workflows/python-publish.yml
name: Upload Python Package

on:
  release:
    types: [published]

jobs:
  release-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
      - run: |
          python -m pip install build
          python -m build
      - uses: actions/upload-artifact@v4
        with:
          name: release-dists
          path: dist/

  pypi-publish:
    needs: release-build
    runs-on: ubuntu-latest
    permissions:
      id-token: write
    environment:
      name: pypi
      url: https://pypi.org/p/PACKAGE_NAME
    steps:
      - uses: actions/download-artifact@v4
      - uses: pypa/gh-action-pypi-publish@release/v1
```

### 3.4 PyPI Trusted Publishing Setup

1. Go to https://pypi.org/manage/account/publishing/
2. Add pending publisher:
   - PyPI Project Name: `your-package`
   - Owner: `github-username`
   - Repository: `repo-name`
   - Workflow: `python-publish.yml`
   - Environment: `pypi`

### 3.5 Create GitHub Release

```bash
gh release create v0.1.0 --title "v0.1.0" --notes "Release notes"
```

---

## Phase 4: Project Website

### 4.1 Single-Page Design Pattern

```
website/
└── index.html    # Self-contained HTML + CSS + JS
```

### 4.2 Key Sections

1. **Hero**: Tagline, description, CTA buttons
2. **Install Banner**: Copy-to-clipboard pip command
3. **Features Grid**: Card-based feature showcase
4. **Code Examples**: Syntax-highlighted usage
5. **CLI Reference**: Command documentation
6. **Philosophy Quote**: Project personality
7. **Footer**: Links to PyPI, GitHub, docs

### 4.3 Design Elements

```css
:root {
    --accent: #7c3aed;        /* Brand color */
    --serif: 'Crimson Pro';    /* Headings */
    --sans: 'DM Sans';         /* Body */
    --mono: 'JetBrains Mono';  /* Code */
}
```

### 4.4 GitHub Pages Deployment

1. Settings → Pages
2. Source: Deploy from branch
3. Branch: main / folder: /website
4. URL: `https://username.github.io/repo/`

---

## Phase 5: Version Bumping

### 5.1 Files to Update

1. `pyproject.toml`: `version = "X.Y.Z"`
2. `src/package/__init__.py`: `__version__ = "X.Y.Z"`

### 5.2 Release Workflow

```bash
# 1. Update version in both files
# 2. Commit
git add -A
git commit -m "Bump version to X.Y.Z"

# 3. Tag
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# 4. Push
git push origin main --tags

# 5. Create GitHub release (triggers PyPI publish)
gh release create vX.Y.Z --title "vX.Y.Z" --notes "Changes..."
```

---

## Quick Reference

### Commands Used

| Task | Command |
|------|---------|
| Install dev | `pip install -e .` |
| Build | `uv build` |
| Publish | `uv publish --token TOKEN` |
| Tag | `git tag -a vX.Y.Z -m "msg"` |
| Release | `gh release create vX.Y.Z` |
| Serve website | `python -m http.server 8000` |

### File Templates

- **pyproject.toml**: Package metadata, dependencies, entry points
- **CLI**: Click groups and commands
- **Website**: Single HTML with embedded CSS/JS

---

## Lessons Learned

1. **Package vs CLI naming**: PyPI name must be unique; CLI command can be anything
2. **Trusted Publishing**: No tokens needed with GitHub Actions + PyPI OIDC
3. **Version sync**: Keep `pyproject.toml` and `__init__.py` versions aligned
4. **Website simplicity**: Single HTML file is sufficient for project landing pages
5. **Template inspection**: Always inspect .pptx templates to understand available layouts
