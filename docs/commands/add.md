# power add

Add a slide to an existing presentation.

## Synopsis

```bash
power add PPTX_FILE -o OUTPUT --title TITLE [OPTIONS]
```

## Description

Appends a new content slide to an existing PowerPoint presentation. Useful for incrementally building presentations or adding slides to template-based decks.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `PPTX_FILE` | Yes | Input presentation file |

## Options

| Option | Short | Required | Default | Description |
|--------|-------|----------|---------|-------------|
| `--output` | `-o` | Yes | | Output file path |
| `--title` | | Yes | | Slide title |
| `--bullets` | | No | | Bullet points (can specify multiple times) |
| `--layout` | | No | Auto-detect | Layout index to use |
| `--help` | `-h` | No | | Show help and exit |

## Examples

### Add a slide with bullets

```bash
power add deck.pptx -o deck.pptx --title "New Slide" \
    --bullets "First point" \
    --bullets "Second point" \
    --bullets "Third point"
```

### Add a title-only slide

```bash
power add deck.pptx -o updated.pptx --title "Discussion"
```

### Specify layout

```bash
power add deck.pptx -o deck.pptx --title "Custom" --layout 5
```

### Chain multiple adds

```bash
power add deck.pptx -o deck.pptx --title "Slide 2" --bullets "Point A"
power add deck.pptx -o deck.pptx --title "Slide 3" --bullets "Point B"
power add deck.pptx -o deck.pptx --title "Slide 4" --bullets "Point C"
```

## Output

On success:

```
Added slide: New Slide
Total slides: 5
```

On error:

```
Error: [error message]
```

## Notes

- The `--bullets` option can be specified multiple times for multiple bullet points
- If `--layout` is not specified, Power CLI auto-detects an appropriate content layout
- Use `power inspect` to see available layout indices in your template
- The input and output can be the same file to modify in place

## Layout Detection

When `--layout` is not specified, Power CLI searches for layouts in this order:

1. Layouts with "content" in the name
2. Layouts with a body/object placeholder
3. Falls back to layout index 1

## See Also

- [`power remove`](remove.md) - Remove slides
- [`power generate`](generate.md) - Generate multiple slides from YAML
- [`power inspect`](inspect.md) - View available layouts
