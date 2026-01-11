# power remove

Remove a slide from a presentation.

## Synopsis

```bash
power remove PPTX_FILE SLIDE_INDEX -o OUTPUT
```

## Description

Removes a slide at the specified index from a PowerPoint presentation. Indices are 0-based (first slide is 0).

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `PPTX_FILE` | Yes | Input presentation file |
| `SLIDE_INDEX` | Yes | 0-based index of slide to remove |

## Options

| Option | Short | Required | Description |
|--------|-------|----------|-------------|
| `--output` | `-o` | Yes | Output file path |
| `--help` | `-h` | No | Show help and exit |

## Examples

### Remove the first slide

```bash
power remove deck.pptx 0 -o deck_trimmed.pptx
```

### Remove the third slide (index 2)

```bash
power remove presentation.pptx 2 -o presentation.pptx
```

### Remove multiple slides

```bash
# Remove slide at index 5, then 3, then 1
# (work backwards to avoid index shifting)
power remove deck.pptx 5 -o deck.pptx
power remove deck.pptx 3 -o deck.pptx
power remove deck.pptx 1 -o deck.pptx
```

## Output

On success:

```
Removed slide 2
Slides: 10 -> 9
```

On error (index out of range):

```
Error: Slide index 15 out of range
```

## Notes

!!! warning "Index Shifting"
    When removing multiple slides, remember that indices shift after each removal. Remove from highest index to lowest to avoid confusion.

### Example: Removing slides 2, 4, and 6

**Wrong way** (indices shift):

```bash
power remove deck.pptx 2 -o deck.pptx  # Removes original slide 2
power remove deck.pptx 4 -o deck.pptx  # Removes original slide 5!
power remove deck.pptx 6 -o deck.pptx  # Removes original slide 8!
```

**Right way** (work backwards):

```bash
power remove deck.pptx 6 -o deck.pptx  # Removes original slide 6
power remove deck.pptx 4 -o deck.pptx  # Removes original slide 4
power remove deck.pptx 2 -o deck.pptx  # Removes original slide 2
```

## Slide Index Reference

| Slide | Index |
|-------|-------|
| First | 0 |
| Second | 1 |
| Third | 2 |
| Last (of 10) | 9 |

## See Also

- [`power add`](add.md) - Add slides
- [`power inspect`](inspect.md) - View slide count
