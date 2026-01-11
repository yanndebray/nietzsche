# power replace

Replace placeholder text throughout a presentation.

## Synopsis

```bash
power replace PPTX_FILE REPLACEMENTS... -o OUTPUT
```

## Description

Finds and replaces `{{PLACEHOLDER}}` text patterns throughout all slides in a presentation. Useful for filling template presentations with dynamic content.

## Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `PPTX_FILE` | Yes | Input presentation file |
| `REPLACEMENTS` | Yes | One or more `KEY=VALUE` pairs |

## Options

| Option | Short | Required | Description |
|--------|-------|----------|-------------|
| `--output` | `-o` | Yes | Output file path |
| `--help` | `-h` | No | Show help and exit |

## Examples

### Single replacement

```bash
power replace template.pptx NAME=John -o filled.pptx
```

This replaces all occurrences of `{{NAME}}` with `John`.

### Multiple replacements

```bash
power replace report.pptx \
    TITLE="Q1 Report" \
    DATE="January 2024" \
    AUTHOR="Jane Smith" \
    -o q1_report.pptx
```

### Values with spaces

Use quotes for values containing spaces:

```bash
power replace template.pptx "COMPANY=Acme Corporation" -o filled.pptx
```

### From variables

```bash
NAME="John Doe"
DATE=$(date +%Y-%m-%d)
power replace template.pptx "NAME=$NAME" "DATE=$DATE" -o output.pptx
```

## Output

On success:

```
Replaced 3 placeholder(s)
Saved to: filled.pptx
```

On error:

```
Error: Invalid replacement format: invalid (expected KEY=VALUE)
```

## Template Format

In your PowerPoint template, use double curly braces for placeholders:

```
Welcome, {{NAME}}!

Report Date: {{DATE}}
Prepared by: {{AUTHOR}}
```

After running:

```bash
power replace template.pptx NAME=John DATE=2024-01-15 AUTHOR=Jane -o output.pptx
```

The output will contain:

```
Welcome, John!

Report Date: 2024-01-15
Prepared by: Jane
```

## Notes

- Placeholder names are case-sensitive (`{{Name}}` ≠ `{{NAME}}`)
- Placeholders can appear in titles, body text, tables, and notes
- Unreplaced placeholders remain as-is in the output
- The replacement searches all text frames in all shapes

## Use Cases

### Dynamic Reports

Create a template with placeholders:

- `{{QUARTER}}` - Q1, Q2, Q3, Q4
- `{{YEAR}}` - 2024
- `{{REVENUE}}` - $2.5M
- `{{GROWTH}}` - +25%

Generate reports for each quarter:

```bash
power replace quarterly.pptx QUARTER=Q1 YEAR=2024 REVENUE="$2.1M" GROWTH="+20%" -o q1.pptx
power replace quarterly.pptx QUARTER=Q2 YEAR=2024 REVENUE="$2.3M" GROWTH="+22%" -o q2.pptx
```

### Personalized Presentations

```bash
for name in Alice Bob Carol; do
    power replace welcome.pptx NAME=$name -o "welcome_${name}.pptx"
done
```

### CI/CD Integration

```bash
# In a GitHub Action or CI pipeline
power replace release.pptx \
    VERSION=${{ github.ref_name }} \
    DATE=$(date +%Y-%m-%d) \
    COMMIT=${{ github.sha }} \
    -o release_notes.pptx
```

## See Also

- [`power generate`](generate.md) - Generate with YAML (alternative approach)
- [`power create`](create.md) - Create new presentations
