import { readFile, writeFile } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';
import type { Presentation } from '../shared/types';
import { createPresentation, createSlide } from '../shared/slide-schema';

const execAsync = promisify(exec);

export class FileManager {
  private currentFilePath: string | null = null;

  createNew(): Presentation {
    this.currentFilePath = null;
    const presentation = createPresentation('Untitled Presentation');

    // Add a default title slide
    const titleSlide = createSlide('title', 'Welcome', 'Click to start creating your presentation');
    presentation.slides.push({ ...titleSlide, order: 0 });

    return presentation;
  }

  async open(filePath: string): Promise<Presentation> {
    const content = await readFile(filePath, 'utf-8');
    const presentation = JSON.parse(content) as Presentation;
    this.currentFilePath = filePath;
    return presentation;
  }

  async save(presentation: Presentation): Promise<boolean> {
    if (!this.currentFilePath) {
      // If no current file, need to use save-as
      return false;
    }

    const content = JSON.stringify(presentation, null, 2);
    await writeFile(this.currentFilePath, content, 'utf-8');
    return true;
  }

  async saveAs(presentation: Presentation, filePath: string): Promise<void> {
    const content = JSON.stringify(presentation, null, 2);
    await writeFile(filePath, content, 'utf-8');
    this.currentFilePath = filePath;
  }

  async exportToPptx(presentation: Presentation, outputPath: string): Promise<void> {
    // Generate a YAML spec that can be used with the Python power CLI
    const yamlSpec = this.generateYamlSpec(presentation);
    const tempYamlPath = outputPath.replace('.pptx', '.yaml');

    await writeFile(tempYamlPath, yamlSpec, 'utf-8');

    try {
      // Try to use the Python power CLI for export
      await execAsync(`power generate "${tempYamlPath}" -o "${outputPath}"`);
    } catch {
      // If power CLI is not available, create a simple placeholder
      console.warn('Power CLI not available, creating placeholder PPTX');
      // For now, just save as JSON - in production would use python-pptx directly
      await writeFile(outputPath, JSON.stringify(presentation, null, 2), 'utf-8');
    }
  }

  private generateYamlSpec(presentation: Presentation): string {
    const lines: string[] = [
      `title: "${presentation.title}"`,
      `theme:`,
      `  primary_color: "${presentation.theme.primaryColor}"`,
      `  font_family: "${presentation.theme.fontFamily}"`,
      `slides:`,
    ];

    for (const slide of presentation.slides) {
      lines.push(`  - layout: ${slide.layout}`);
      lines.push(`    title: "${slide.title}"`);

      if (slide.content) {
        const contentLines = slide.content.split('\n');
        if (contentLines.length === 1) {
          lines.push(`    content: "${slide.content}"`);
        } else {
          lines.push(`    content: |`);
          for (const line of contentLines) {
            lines.push(`      ${line}`);
          }
        }
      }

      if (slide.speakerNotes) {
        lines.push(`    speaker_notes: "${slide.speakerNotes}"`);
      }
    }

    return lines.join('\n');
  }

  getCurrentFilePath(): string | null {
    return this.currentFilePath;
  }
}
