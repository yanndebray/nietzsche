# Troubleshooting

Common issues and solutions when using Power CLI.

## Installation Issues

### Command not found: power

**Symptom**: Running `power` gives "command not found" error.

**Solutions**:

1. Ensure the package is installed:
   ```bash
   pip install nietzsche
   ```

2. Check if pip scripts are in your PATH:
   ```bash
   python -m power --help
   ```

3. Try reinstalling with pipx:
   ```bash
   pipx install nietzsche
   ```

### Import errors

**Symptom**: `ModuleNotFoundError: No module named 'pptx'`

**Solution**: Install missing dependencies:
```bash
pip install python-pptx click rich pyyaml pillow
```

Or reinstall the package:
```bash
pip uninstall nietzsche
pip install nietzsche
```

## Template Issues

### Template file not found

**Symptom**: `Error: Invalid value for '-t' / '--template': Path 'template.pptx' does not exist.`

**Solutions**:

1. Check the file path:
   ```bash
   ls -la template.pptx
   ```

2. Use absolute path:
   ```bash
   power create out.pptx -t /full/path/to/template.pptx
   ```

3. Check current directory:
   ```bash
   pwd
   ```

### Layout not found

**Symptom**: Layout specified in YAML doesn't work.

**Solution**: Inspect the template to see available layouts:
```bash
power inspect template.pptx
```

Use the exact layout name from the output:
```yaml
- type: content
  layout: "Title and Content"  # Must match exactly
```

### Placeholder index error

**Symptom**: `Warning: Could not fill placeholder 10: ...`

**Solution**:
1. Find valid placeholder indices:
   ```bash
   power inspect template.pptx
   ```

2. Use the correct index in your YAML:
   ```yaml
   placeholder_images:
     10: image.png  # Use idx from inspect output
   ```

## YAML Issues

### YAML parsing errors

**Symptom**: `Error: while parsing a block mapping`

**Common causes**:

1. **Incorrect indentation**:
   ```yaml
   # Wrong
   slides:
   - type: content
     title: Test

   # Correct
   slides:
     - type: content
       title: Test
   ```

2. **Missing quotes around special characters**:
   ```yaml
   # Wrong - colon causes issues
   title: Revenue: Q1 Report

   # Correct
   title: "Revenue: Q1 Report"
   ```

3. **Tab characters** (use spaces instead):
   ```bash
   # Convert tabs to spaces
   sed -i 's/\t/  /g' slides.yaml
   ```

### Chart data mismatch

**Symptom**: Chart looks wrong or error about data length.

**Solution**: Ensure series values match categories count:
```yaml
# Wrong - 4 categories but 3 values
categories: [Q1, Q2, Q3, Q4]
series:
  Revenue: [100, 200, 300]  # Missing one value!

# Correct
categories: [Q1, Q2, Q3, Q4]
series:
  Revenue: [100, 200, 300, 400]
```

## File Issues

### Permission denied

**Symptom**: `Error: Permission denied: output.pptx`

**Solutions**:

1. Close the file if it's open in PowerPoint
2. Check file permissions:
   ```bash
   ls -la output.pptx
   ```
3. Try a different output path:
   ```bash
   power create ~/Desktop/output.pptx
   ```

### File is corrupted

**Symptom**: PowerPoint can't open the generated file.

**Solutions**:

1. Check for errors during generation
2. Verify template isn't corrupted:
   ```bash
   power inspect template.pptx
   ```
3. Try without a template:
   ```bash
   power create test.pptx --title "Test"
   ```

### Image not found

**Symptom**: `FileNotFoundError: Image not found: images/photo.png`

**Solutions**:

1. Use absolute paths:
   ```yaml
   image: /full/path/to/image.png
   ```

2. Paths are relative to where you run the command:
   ```bash
   cd /project/root
   power generate slides.yaml -o out.pptx
   ```

3. Check the file exists:
   ```bash
   ls -la images/photo.png
   ```

## Common Errors

### Slide index out of range

**Symptom**: `Error: Slide index 5 out of range`

**Solution**: Check slide count first:
```bash
power inspect presentation.pptx
# Shows: Slides: 3
# Valid indices are 0, 1, 2
```

### Invalid replacement format

**Symptom**: `Error: Invalid replacement format: name (expected KEY=VALUE)`

**Solution**: Use the correct format:
```bash
# Wrong
power replace deck.pptx name John -o out.pptx

# Correct
power replace deck.pptx NAME=John -o out.pptx
```

### JSON output parsing

**Symptom**: JSON output contains extra characters.

**Solution**: Use `--json` flag properly:
```bash
# For piping to jq
power inspect template.pptx --json | jq '.layouts'

# For saving to file
power inspect template.pptx --json > info.json
```

## Performance Issues

### Slow generation with many images

**Solutions**:

1. Optimize images before embedding:
   ```bash
   # Resize large images
   convert large.png -resize 1920x1080 optimized.png
   ```

2. Use compressed formats (JPEG for photos)

3. Process in batches for large presentations

### Memory errors with large templates

**Solution**: Use simpler templates or split into multiple presentations.

## Getting Help

If you can't resolve an issue:

1. Check the [GitHub Issues](https://github.com/yanndebray/nietzsche/issues)

2. Create a new issue with:
   - Power CLI version (`power --version`)
   - Python version (`python --version`)
   - Operating system
   - Complete error message
   - Minimal YAML to reproduce

3. Include relevant files (sanitized of sensitive data)

## Debug Mode

For detailed error information, run Python directly:

```python
from power import PowerPresentation
import traceback

try:
    ppt = PowerPresentation(template="template.pptx")
    # ... operations
except Exception as e:
    traceback.print_exc()
```

## See Also

- [Installation](install.md) - Setup guide
- [YAML Format](yaml-format.md) - Specification reference
- [Commands](commands/index.md) - CLI reference
