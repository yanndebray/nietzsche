# Installation

## Requirements

- Python 3.9 or higher

## Install with uv (Recommended)

Install this tool using [uv](https://docs.astral.sh/uv/):

```bash
uv tool install nietzsche
```

Or run it directly without installing using `uvx`:

```bash
uvx --from nietzsche power --help
```

## Install with pip

```bash
pip install nietzsche
```

## Install with pipx

For an isolated environment using [pipx](https://pypa.github.io/pipx/):

```bash
pipx install nietzsche
```

## Install from Source

Clone the repository and install in development mode:

```bash
git clone https://github.com/yanndebray/nietzsche.git
cd nietzsche
pip install -e .
```

For development with all dev dependencies:

```bash
pip install -e ".[dev]"
```

## Verify Installation

Check that Power CLI is installed correctly:

```bash
power --version
```

You should see output like:

```
power, version 0.1.6
```

Get help:

```bash
power --help
```

## Dependencies

Power CLI automatically installs these dependencies:

| Package | Version | Purpose |
|---------|---------|---------|
| python-pptx | >=1.0.2 | PowerPoint file manipulation |
| click | >=8.0.0 | CLI framework |
| rich | >=13.0.0 | Terminal formatting |
| pyyaml | >=6.0 | YAML parsing |
| pillow | >=10.0.0 | Image handling |

## Development Dependencies

For contributors, additional dev dependencies are available:

```bash
pip install nietzsche[dev]
```

This includes:

- pytest - Testing framework
- pytest-cov - Coverage reporting
- mypy - Type checking
- black - Code formatting
- ruff - Linting

## Upgrading

To upgrade to the latest version:

```bash
uv tool upgrade nietzsche
# or
pip install --upgrade nietzsche
# or
pipx upgrade nietzsche
```

!!! tip "uvx always uses latest"
    When using `uvx`, you automatically get the latest version each time (cached for performance).

## Uninstalling

```bash
uv tool uninstall nietzsche
# or
pip uninstall nietzsche
# or
pipx uninstall nietzsche
```
