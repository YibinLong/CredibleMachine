# Credible Machine

A web-based Rube Goldberg puzzle game inspired by "The Incredible Machine" (1993). Players solve physics-based puzzles by placing objects on a grid to guide a ball into a goal through chain reactions.

## Features

- 10 levels of increasing difficulty
- MS-DOS retro aesthetic with chunky pixel art
- Physics-based gameplay with Matter.js
- Grid-based object placement system

## Tech Stack

- **Framework**: Phaser 3 with Matter.js physics
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0 or higher)

### Installation

```bash
# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev
```

The game will be available at `http://localhost:8080`

### Production Build

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

### Linting

```bash
# Run ESLint
bun run lint
```

## Project Structure

```
src/
├── scenes/          # Game scenes (Title, LevelSelect, Game, Victory)
├── objects/         # Physics objects (Ball, Ramp, Platform, etc.)
├── ui/              # UI components (buttons, panels, dialogs)
├── utils/           # Utility functions (grid, state management)
├── types/           # TypeScript type definitions
└── game/
    └── main.ts      # Phaser game configuration

public/
└── assets/
    ├── sprites/     # Sprite images
    └── audio/       # Sound effects and music
```

## Controls

- **Mouse**: Drag and drop objects from inventory
- **Click**: Rotate placed objects
- **Space**: Start simulation
- **R**: Reset level
- **ESC**: Return to level select
- **Ctrl+Z**: Undo last placement

## License

MIT
