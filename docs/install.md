# Installation

## Requirements

- Python 3.9 or higher
- pip (Python package manager)

## Install from PyPI

The recommended way to install Power CLI:

```bash
pip install nietzsche
```

This installs the `power` command and all dependencies.

## Install with pipx (Isolated Environment)

For CLI tools, [pipx](https://pypa.github.io/pipx/) is recommended as it installs the tool in an isolated environment:

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
pip install --upgrade nietzsche
```

Or with pipx:

```bash
pipx upgrade nietzsche
```

## Uninstalling

```bash
pip uninstall nietzsche
```

Or with pipx:

```bash
pipx uninstall nietzsche
```
