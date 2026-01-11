# Installation

## Requirements

- Python 3.9 or higher
- A package manager (pip, uv, or pipx)

## Install from PyPI

The recommended way to install Power CLI:

```bash
pip install nietzsche
```

This installs the `power` command and all dependencies.

## Install with uv (Recommended)

[uv](https://docs.astral.sh/uv/) is an extremely fast Python package installer written in Rust. It's the recommended way to install Python tools.

### Install uv first

=== "macOS/Linux"

    ```bash
    curl -LsSf https://astral.sh/uv/install.sh | sh
    ```

=== "Windows"

    ```powershell
    powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
    ```

=== "pip"

    ```bash
    pip install uv
    ```

### Install nietzsche with uv

```bash
uv pip install nietzsche
```

Or install into an isolated tool environment:

```bash
uv tool install nietzsche
```

## Run with uvx (No Installation)

[uvx](https://docs.astral.sh/uv/guides/tools/) lets you run Python tools without installing them permanently. Perfect for one-off use or trying out Power CLI:

```bash
# Run any power command directly
uvx --from nietzsche power --help

# Create a presentation
uvx --from nietzsche power create deck.pptx --title "Quick Demo"

# Generate from YAML
uvx --from nietzsche power generate slides.yaml -o output.pptx
```

This downloads and caches the package automatically, running it in an isolated environment.

### Create an alias (optional)

For convenience, add an alias to your shell configuration:

=== "Bash/Zsh"

    ```bash
    # Add to ~/.bashrc or ~/.zshrc
    alias power='uvx --from nietzsche power'
    ```

=== "PowerShell"

    ```powershell
    # Add to $PROFILE
    function power { uvx --from nietzsche power $args }
    ```

Then use it like a normal command:

```bash
power create deck.pptx --title "My Presentation"
```

## Install with pipx (Isolated Environment)

For CLI tools, [pipx](https://pypa.github.io/pipx/) is another option that installs the tool in an isolated environment:

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

=== "pip"

    ```bash
    pip install --upgrade nietzsche
    ```

=== "uv"

    ```bash
    uv pip install --upgrade nietzsche
    # or for tool installation
    uv tool upgrade nietzsche
    ```

=== "pipx"

    ```bash
    pipx upgrade nietzsche
    ```

!!! tip "uvx always uses latest"
    When using `uvx`, you automatically get the latest version each time (cached for performance).

## Uninstalling

=== "pip"

    ```bash
    pip uninstall nietzsche
    ```

=== "uv"

    ```bash
    uv pip uninstall nietzsche
    # or for tool installation
    uv tool uninstall nietzsche
    ```

=== "pipx"

    ```bash
    pipx uninstall nietzsche
    ```
