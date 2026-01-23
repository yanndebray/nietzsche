# Nietzsche Desktop App

> "One must have chaos in oneself to give birth to a dancing star." — Nietzsche

A local-first, developer-native presentation generator powered by the GitHub Copilot SDK. Competes with Gamma.app but lives where developers work.

## Project Vision

Nietzsche transforms rough ideas into polished slide decks through agentic AI workflows. Unlike web-based tools, it runs locally, works offline, and integrates with your file system and dev tools natively.

**Key differentiators from Gamma.app:**
- Local-first: your content never leaves your machine unless you want it to
- Developer-native: works with markdown, git repos, READMEs
- Agentic: plans presentations, not just generates slides
- Extensible: MCP servers for custom data sources

## Tech Stack

```
├── Electron (main + renderer)
├── React (renderer UI)
├── TypeScript (strict mode)
├── GitHub Copilot SDK (@github/copilot-sdk)
├── Tailwind CSS (styling)
└── Vite (bundling)
```

### Why These Choices

- **Electron**: Cross-platform desktop, file system access, offline capability
- **Copilot SDK**: Handles agentic planning, tool orchestration, multi-turn context—we don't rebuild this
- **React + Vite**: Fast iteration, familiar patterns
- **Tailwind**: Rapid prototyping, consistent design tokens

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Main Process                │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ Copilot SDK   │  │ File System   │  │ MCP Bridge  │ │
│  │ Client        │  │ Watcher       │  │             │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
                           │ IPC
┌─────────────────────────────────────────────────────────┐
│                  Electron Renderer Process              │
│  ┌───────────────┐  ┌───────────────┐  ┌─────────────┐ │
│  │ Chat Interface│  │ Slide Editor  │  │ Preview     │ │
│  │               │  │               │  │ Panel       │ │
│  └───────────────┘  └───────────────┘  └─────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Process Responsibilities

**Main Process:**
- Copilot SDK session management
- File system operations (read/write presentations)
- MCP server connections
- Native OS integrations (file dialogs, menus)

**Renderer Process:**
- User interface and interactions
- Slide preview and editing
- Real-time streaming display from SDK

## Core Features

### 1. Natural Language to Slides
User describes what they want → SDK plans slide structure → generates content

```typescript
// Example flow
await session.send({
  prompt: "Create a 10-slide pitch deck for a B2B SaaS product that helps engineers run MATLAB in the cloud",
  tools: [slideGeneratorTool, imageSearchTool]
});
```

### 2. Source-Aware Generation
Import context from:
- Local markdown files
- Git repository READMEs
- Pasted text or URLs
- Previous presentations

### 3. Iterative Refinement
Multi-turn conversations to refine:
- "Make slide 3 more visual"
- "Add speaker notes throughout"
- "Simplify the technical jargon for executives"

### 4. Export Formats
- Native `.nietzsche` format (JSON-based, version controlled)
- PowerPoint `.pptx` export
- PDF export
- HTML for web embedding

## File Structure

```
nietzsche-desktop/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── index.ts          # Entry point
│   │   ├── copilot.ts        # SDK client wrapper
│   │   ├── ipc-handlers.ts   # IPC communication
│   │   ├── file-manager.ts   # File operations
│   │   └── mcp-bridge.ts     # MCP server connections
│   ├── renderer/             # React app
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── Chat/         # Conversation interface
│   │   │   ├── Editor/       # Slide editing
│   │   │   ├── Preview/      # Live preview
│   │   │   └── Sidebar/      # Navigation, history
│   │   ├── hooks/
│   │   │   ├── useCopilot.ts # SDK interaction hook
│   │   │   └── useSlides.ts  # Slide state management
│   │   └── stores/           # Zustand stores
│   ├── shared/               # Shared types and utils
│   │   ├── types.ts
│   │   └── slide-schema.ts
│   └── tools/                # Copilot SDK tool definitions
│       ├── slide-generator.ts
│       ├── image-search.ts
│       └── format-converter.ts
├── resources/                # Static assets, icons
├── electron-builder.json
├── package.json
├── tsconfig.json
├── vite.config.ts
└── claude.md                 # This file
```

## Copilot SDK Integration

### Session Management

```typescript
// src/main/copilot.ts
import { CopilotClient } from "@github/copilot-sdk";

class NietzscheCopilot {
  private client: CopilotClient;
  private session: CopilotSession | null = null;

  async initialize() {
    this.client = new CopilotClient();
    await this.client.start();
  }

  async createSession(model: string = "gpt-4o") {
    this.session = await this.client.createSession({
      model,
      tools: [
        slideGeneratorTool,
        imageSearchTool,
        formatConverterTool,
      ],
    });
    return this.session;
  }

  async send(prompt: string, onStream: (chunk: string) => void) {
    if (!this.session) throw new Error("No active session");
    
    return this.session.send({
      prompt,
      onStream,
    });
  }
}
```

### Custom Tools

Tools extend the SDK's capabilities with domain-specific actions:

```typescript
// src/tools/slide-generator.ts
import { defineTool } from "@github/copilot-sdk";

export const slideGeneratorTool = defineTool({
  name: "generate_slide",
  description: "Generate a single slide with title, content, and layout",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string", description: "Slide title" },
      content: { type: "string", description: "Main content in markdown" },
      layout: { 
        type: "string", 
        enum: ["title", "content", "two-column", "image-left", "image-right", "quote"],
        description: "Slide layout type"
      },
      speakerNotes: { type: "string", description: "Optional speaker notes" },
      imageQuery: { type: "string", description: "Optional image search query" },
    },
    required: ["title", "content", "layout"],
  },
  execute: async (params) => {
    // Tool implementation - creates slide in app state
    return { success: true, slideId: generateId() };
  },
});
```

## Slide Schema

```typescript
// src/shared/slide-schema.ts
interface Presentation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  slides: Slide[];
  theme: Theme;
  metadata: PresentationMetadata;
}

interface Slide {
  id: string;
  order: number;
  layout: SlideLayout;
  title: string;
  content: string;           // Markdown
  speakerNotes?: string;
  images?: SlideImage[];
  style?: SlideStyle;
}

type SlideLayout = 
  | "title"
  | "content" 
  | "two-column"
  | "image-left"
  | "image-right"
  | "quote"
  | "code"
  | "comparison";

interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  headingFont: string;
}
```

## IPC Communication

```typescript
// Main process handlers
ipcMain.handle("copilot:send", async (event, prompt: string) => {
  return copilot.send(prompt, (chunk) => {
    event.sender.send("copilot:stream", chunk);
  });
});

ipcMain.handle("file:save", async (event, presentation: Presentation) => {
  // Save to .nietzsche file
});

ipcMain.handle("file:export-pptx", async (event, presentation: Presentation) => {
  // Convert and export to PowerPoint
});
```

```typescript
// Renderer process hook
function useCopilot() {
  const [streaming, setStreaming] = useState(false);
  const [response, setResponse] = useState("");

  useEffect(() => {
    const unsubscribe = window.electron.on("copilot:stream", (chunk) => {
      setResponse((prev) => prev + chunk);
    });
    return unsubscribe;
  }, []);

  const send = async (prompt: string) => {
    setStreaming(true);
    setResponse("");
    await window.electron.invoke("copilot:send", prompt);
    setStreaming(false);
  };

  return { send, streaming, response };
}
```

## Coding Conventions

### TypeScript
- Strict mode enabled
- Explicit return types on exported functions
- Prefer `interface` over `type` for object shapes
- Use `unknown` over `any`

### React
- Functional components only
- Custom hooks for shared logic
- Zustand for global state (not Redux)
- Co-locate components with their styles and tests

### Naming
- `PascalCase`: Components, interfaces, types
- `camelCase`: Functions, variables, hooks
- `SCREAMING_SNAKE_CASE`: Constants
- `kebab-case`: File names (except components)

### File Organization
- One component per file
- Index files for public exports only
- Keep files under 200 lines when possible

## Development Workflow

```bash
# Install dependencies
npm install

# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Package for distribution
npm run package

# Run tests
npm test
```

## Environment Variables

```env
# .env.local (not committed)
GITHUB_TOKEN=           # For Copilot SDK auth (optional, can use OAuth)
UNSPLASH_API_KEY=       # For image search tool
```

## Testing Strategy

- **Unit tests**: Tool implementations, schema validation
- **Integration tests**: IPC communication, file operations
- **E2E tests**: Playwright for critical user flows
- **Manual testing**: Always test new features with real presentations

## MCP Integration Points

Future MCP servers to integrate:
- **Unsplash/Pexels**: Image search and insertion
- **Google Slides**: Import existing presentations
- **Figma**: Pull design assets
- **Local files**: Watch and sync markdown files

## Performance Considerations

- Lazy load slide previews (virtualize long presentations)
- Debounce auto-save (500ms)
- Stream SDK responses to UI immediately
- Cache generated images locally

## Security Notes

- Never log or persist full Copilot SDK responses (may contain sensitive context)
- Sanitize user input before passing to SDK
- Use Electron's context isolation
- Disable node integration in renderer

## Roadmap

### v0.1 - MVP
- [ ] Basic chat interface
- [ ] Single slide generation
- [ ] Simple preview
- [ ] Save/load .nietzsche files

### v0.2 - Core Features
- [ ] Multi-slide planning
- [ ] All layout types
- [ ] Theme support
- [ ] PPTX export

### v0.3 - Polish
- [ ] Image integration
- [ ] Speaker notes
- [ ] Keyboard shortcuts
- [ ] Presentation mode

### v1.0 - Launch
- [ ] MCP server support
- [ ] Template library
- [ ] Collaboration (maybe)
- [ ] Auto-update

## Links

- [GitHub Copilot SDK](https://github.com/github/copilot-sdk)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Vite Electron Plugin](https://github.com/electron-vite/electron-vite-vue)
- [Competitor: Gamma.app](https://gamma.app)

---

*This is a vibe-coded project. Ship fast, iterate faster.*
