# CLI Commands

Power CLI provides seven commands for creating and manipulating PowerPoint presentations.

## Command Overview

| Command | Description |
|---------|-------------|
| [`power create`](create.md) | Create a new presentation with a title slide |
| [`power generate`](generate.md) | Generate presentation from YAML/JSON specification |
| [`power inspect`](inspect.md) | Inspect template layouts and placeholders |
| [`power new`](new.md) | Interactive presentation builder |
| [`power add`](add.md) | Add a slide to an existing presentation |
| [`power remove`](remove.md) | Remove a slide by index |
| [`power replace`](replace.md) | Replace `{{PLACEHOLDER}}` text |

## Global Options

All commands support these options:

| Option | Description |
|--------|-------------|
| `-h`, `--help` | Show help message and exit |
| `--version` | Show version (main command only) |

## Getting Help

Get help for any command:

```bash
# Main help
power --help
power -h

# Command-specific help
power create --help
power generate -h
```

## Common Patterns

### Using Templates

Most commands support the `-t` or `--template` option:

```bash
power create output.pptx -t Galaxy.pptx --title "My Deck"
power generate slides.yaml -o output.pptx -t Galaxy.pptx
power new -t Galaxy.pptx
```

### Output Files

Commands that create or modify presentations use `-o` or `--output`:

```bash
power generate slides.yaml -o presentation.pptx
power add deck.pptx -o updated.pptx --title "New Slide"
power remove deck.pptx 0 -o trimmed.pptx
power replace template.pptx NAME=John -o filled.pptx
```

### Chaining Commands

Combine commands for complex workflows:

```bash
# Create, then add slides
power create deck.pptx -t Galaxy.pptx --title "Report"
power add deck.pptx -o deck.pptx --title "Slide 2" --bullets "Point 1"
power add deck.pptx -o deck.pptx --title "Slide 3" --bullets "Point 2"
```

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Error (file not found, invalid input, etc.) |

## Environment Variables

Currently, Power CLI does not use environment variables. All configuration is done via command-line options or input files.
