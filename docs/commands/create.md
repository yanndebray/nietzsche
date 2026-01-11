# power create

Create a new presentation with a title slide.

## Synopsis

```bash
power create OUTPUT [OPTIONS]
```

## Description

Creates a new PowerPoint presentation with a title slide. Optionally uses a template file for styling.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `OUTPUT` | Yes | Path for the generated .pptx file |

## Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--template` | `-t` | None | Template .pptx file to use |
| `--title` | | "Untitled Presentation" | Presentation title |
| `--subtitle` | | "" | Presentation subtitle |
| `--author` | | "" | Author name (stored in file properties) |
| `--help` | `-h` | | Show help and exit |

## Examples

### Basic presentation

```bash
power create my_deck.pptx --title "Q1 Report"
```

### With template

```bash
power create themed.pptx -t Galaxy.pptx --title "Galaxy Theme"
```

### Full options

```bash
power create report.pptx \
    --template Corporate.pptx \
    --title "Annual Report" \
    --subtitle "Fiscal Year 2024" \
    --author "John Smith"
```

## Output

On success:

```
Created presentation: my_deck.pptx
```

On error:

```
Error: [error message]
```

## Notes

- If a template is specified, the template's existing slides are cleared before adding the title slide
- The author is stored in the PowerPoint file's core properties
- The output file is overwritten if it already exists

## See Also

- [`power generate`](generate.md) - Generate from YAML/JSON
- [`power new`](new.md) - Interactive builder
