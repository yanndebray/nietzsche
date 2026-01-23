# Nietzsche Desktop

> "One must have chaos in oneself to give birth to a dancing star." - Nietzsche

A local-first, developer-native presentation generator powered by AI. Competes with Gamma.app but lives where developers work.

## Features

- **Natural Language to Slides**: Describe what you want, get a presentation
- **Local-First**: Your content never leaves your machine unless you want it to
- **Developer-Native**: Works with markdown, supports code slides
- **Iterative Refinement**: Chat to refine and improve your slides
- **Export Options**: Save as `.nietzsche` (JSON) or export to PowerPoint

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run electron:dev

# Build for production
npm run electron:build
```

## Tech Stack

- **Electron** - Cross-platform desktop app
- **React** - UI framework
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Zustand** - State management

## Project Structure

```
electron/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts    # Entry point
│   │   ├── copilot.ts  # AI integration
│   │   ├── file-manager.ts
│   │   └── menu.ts
│   ├── preload/        # Context bridge
│   │   └── index.ts
│   ├── renderer/       # React app
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── stores/
│   └── shared/         # Shared types
│       ├── types.ts
│       └── slide-schema.ts
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Usage

1. **Create a new presentation**: Launch the app and describe your presentation in the chat
2. **Edit slides**: Click any slide thumbnail to select it, then click "Edit" to modify
3. **Add slides**: Use the "+" button in the sidebar or ask the AI
4. **Export**: File > Export to PowerPoint or save as `.nietzsche`

## Example Prompts

- "Create a 10-slide pitch deck for a B2B SaaS product"
- "Make a presentation about machine learning basics"
- "Generate slides for a quarterly business review"
- "Add a slide comparing our product to competitors"

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + N | New presentation |
| Cmd/Ctrl + O | Open presentation |
| Cmd/Ctrl + S | Save |
| Cmd/Ctrl + Shift + S | Save As |
| Cmd/Ctrl + E | Export to PowerPoint |
| Cmd/Ctrl + Shift + N | Add new slide |

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Run tests
npm test
```

## License

MIT
