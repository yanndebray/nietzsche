import type { Slide, SlideLayout } from '../shared/types';
import { createSlide } from '../shared/slide-schema';

// Simulated Copilot response for development
// In production, this would use the actual GitHub Copilot SDK

interface StreamCallback {
  (chunk: string): void;
}

interface SlideGenerationResult {
  slides: Slide[];
  message: string;
}

export class CopilotManager {
  private abortController: AbortController | null = null;

  async send(prompt: string, onStream: StreamCallback): Promise<string> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;

    try {
      // Parse the prompt to understand intent
      const result = await this.processPrompt(prompt, onStream, signal);
      return result;
    } finally {
      this.abortController = null;
    }
  }

  cancel(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  private async processPrompt(
    prompt: string,
    onStream: StreamCallback,
    signal: AbortSignal
  ): Promise<string> {
    // Simulate streaming response
    const response = await this.generateResponse(prompt, onStream, signal);
    return response;
  }

  private async generateResponse(
    prompt: string,
    onStream: StreamCallback,
    signal: AbortSignal
  ): Promise<string> {
    const lowerPrompt = prompt.toLowerCase();

    // Determine the type of request
    if (this.isSlideGenerationRequest(lowerPrompt)) {
      return this.handleSlideGeneration(prompt, onStream, signal);
    } else if (this.isEditRequest(lowerPrompt)) {
      return this.handleEditRequest(prompt, onStream, signal);
    } else {
      return this.handleGeneralQuery(prompt, onStream, signal);
    }
  }

  private isSlideGenerationRequest(prompt: string): boolean {
    const keywords = ['create', 'generate', 'make', 'build', 'presentation', 'slides', 'deck'];
    return keywords.some((kw) => prompt.includes(kw));
  }

  private isEditRequest(prompt: string): boolean {
    const keywords = ['edit', 'change', 'modify', 'update', 'revise', 'improve'];
    return keywords.some((kw) => prompt.includes(kw));
  }

  private async handleSlideGeneration(
    prompt: string,
    onStream: StreamCallback,
    signal: AbortSignal
  ): Promise<string> {
    const chunks = [
      "I'll help you create a presentation. Let me plan out the slides...\n\n",
      "**Analyzing your request...**\n\n",
      "Based on your description, I'll create a structured presentation with:\n\n",
      "1. **Title Slide** - Introduction\n",
      "2. **Overview** - Key points\n",
      "3. **Main Content** - Core information\n",
      "4. **Summary** - Key takeaways\n\n",
      "---\n\n",
      "**Generating slides...**\n\n",
      `\`\`\`json:slides\n`,
      JSON.stringify(this.generateSampleSlides(prompt), null, 2),
      `\n\`\`\`\n\n`,
      "I've created a basic presentation structure. You can now:\n",
      "- Edit any slide by clicking on it\n",
      "- Ask me to modify specific slides\n",
      "- Add more slides or change the layout\n",
    ];

    let fullResponse = '';
    for (const chunk of chunks) {
      if (signal.aborted) break;
      await this.delay(50);
      onStream(chunk);
      fullResponse += chunk;
    }

    return fullResponse;
  }

  private async handleEditRequest(
    prompt: string,
    onStream: StreamCallback,
    signal: AbortSignal
  ): Promise<string> {
    const chunks = [
      "I understand you want to make some changes. ",
      "Let me help you with that.\n\n",
      "Please select the slide you'd like to modify, ",
      "or describe which slide number you want to change.",
    ];

    let fullResponse = '';
    for (const chunk of chunks) {
      if (signal.aborted) break;
      await this.delay(30);
      onStream(chunk);
      fullResponse += chunk;
    }

    return fullResponse;
  }

  private async handleGeneralQuery(
    prompt: string,
    onStream: StreamCallback,
    signal: AbortSignal
  ): Promise<string> {
    const chunks = [
      "I'm Nietzsche, your AI presentation assistant. ",
      "I can help you:\n\n",
      "- **Create presentations** from a description or topic\n",
      "- **Edit existing slides** with natural language\n",
      "- **Add images** and visual elements\n",
      "- **Export** to PowerPoint format\n\n",
      "Just describe what you'd like to create, ",
      "and I'll help you build it step by step.",
    ];

    let fullResponse = '';
    for (const chunk of chunks) {
      if (signal.aborted) break;
      await this.delay(30);
      onStream(chunk);
      fullResponse += chunk;
    }

    return fullResponse;
  }

  private generateSampleSlides(prompt: string): Slide[] {
    // Extract topic from prompt
    const topic = this.extractTopic(prompt);

    return [
      createSlide('title', topic, 'A comprehensive overview'),
      createSlide(
        'content',
        'Overview',
        '- Key point one\n- Key point two\n- Key point three\n- Key point four'
      ),
      createSlide(
        'content',
        'Main Content',
        '- Detailed information\n- Supporting evidence\n- Examples and use cases'
      ),
      createSlide(
        'content',
        'Summary',
        '- Recap of key points\n- Call to action\n- Next steps'
      ),
    ];
  }

  private extractTopic(prompt: string): string {
    // Simple topic extraction - in production this would be more sophisticated
    const words = prompt.split(' ');
    const aboutIndex = words.findIndex((w) => w.toLowerCase() === 'about');
    if (aboutIndex !== -1 && aboutIndex < words.length - 1) {
      return words.slice(aboutIndex + 1).join(' ').replace(/[.,!?]/g, '');
    }

    const forIndex = words.findIndex((w) => w.toLowerCase() === 'for');
    if (forIndex !== -1 && forIndex < words.length - 1) {
      return words.slice(forIndex + 1).join(' ').replace(/[.,!?]/g, '');
    }

    return 'Presentation';
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
