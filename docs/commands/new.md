# power new

Interactively create a new presentation.

## Synopsis

```bash
power new [OPTIONS]
```

## Description

Launches an interactive session that guides you through creating a presentation step by step. Ideal for quick presentations without writing YAML.

## Options

| Option | Short | Default | Description |
|--------|-------|---------|-------------|
| `--template` | `-t` | None | Template .pptx file to use |
| `--output` | `-o` | presentation.pptx | Output file path |
| `--help` | `-h` | | Show help and exit |

## Examples

### Basic interactive mode

```bash
power new
```

### With template and output

```bash
power new -t Galaxy.pptx -o my_deck.pptx
```

## Interactive Session

When you run `power new`, you'll see:

```
╭──────────────────────────────────────────╮
│ Power - Interactive Presentation Builder │
╰──────────────────────────────────────────╯
Using template: Galaxy.pptx
Presentation title: Q1 Report
Subtitle (optional): 2024 Results

Add a slide:
  1. Content slide (bullets)
  2. Section header
  3. Blank slide
  4. Done - save presentation
Choice [4]:
```

### Adding a Content Slide

```
Choice [4]: 1
Slide title: Key Achievements
Enter bullet points (empty line to finish):
  -: Revenue grew 25%
  -: Customer satisfaction at 94%
  -: Launched 3 new products
  -:
Added content slide
```

### Adding a Section Header

```
Choice [4]: 2
Section title: Financial Overview
Subtitle (optional): Q4 Numbers
Added section slide
```

### Saving

```
Choice [4]: 4
Saved: my_deck.pptx (4 slides)
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+C` | Cancel and exit without saving |
| `Enter` | Accept default value |

## Output

On success:

```
Saved: presentation.pptx (5 slides)
```

On cancel:

```
Cancelled
```

## Limitations

Interactive mode currently supports:

- Title slides (created automatically)
- Content slides with bullets
- Section headers
- Blank slides

For tables, charts, and images, use [`power generate`](generate.md) with a YAML file.

## Tips

1. **Start with a template** - Use `-t` to apply corporate branding
2. **Plan your structure** - Decide on sections before starting
3. **Use blank slides** - Add complex content later in PowerPoint
4. **Save often** - The session only saves at the end

## See Also

- [`power create`](create.md) - Quick single-slide creation
- [`power generate`](generate.md) - Full YAML-based generation
- [`power add`](add.md) - Add slides to existing presentations
