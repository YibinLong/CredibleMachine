# Credible Machine

**A love letter to The Incredible Machine (1993)**

Build chain-reaction contraptions. Watch physics unfold. Get the ball to the basket.

Credible Machine is a browser-based Rube Goldberg puzzle game that captures the charm of classic MS-DOS physics puzzlers. No downloads, no accounts—just pure puzzle-solving nostalgia delivered straight to your browser.

---

## Gameplay

Drag objects from your inventory onto a grid-based play area. Position ramps, trampolines, fans, and seesaws to guide a ball through obstacles and into the goal basket. Press play and watch your contraption come to life—or spectacularly fail.

**10 hand-crafted levels** introduce mechanics progressively:

| Levels | Concepts |
|--------|----------|
| 1–3 | Ramps, platforms, basic trajectory planning |
| 4–5 | Trampolines, seesaws, momentum transfer |
| 6–7 | Fans, pressure plates, triggered mechanisms |
| 8–10 | Dominoes, multi-stage chain reactions, everything combined |

---

## Physics Objects

| Object | Behavior |
|--------|----------|
| **Ball** | Heavy, momentum-preserving. Your protagonist. |
| **Ramp** | 45° incline. Rotates in 4 directions. |
| **Platform** | Static barrier. Horizontal or vertical. |
| **Trampoline** | Bounces the ball higher than it fell. |
| **Seesaw** | Pivots at center. Can catapult objects. |
| **Fan** | Applies constant force. 5-cell range. |
| **Domino** | Hair-trigger sensitivity. Tips on contact. |
| **Pressure Plate** | Triggers linked objects instantly. |
| **Basket** | The goal. Get the ball here to win. |

---

## Controls

| Input | Action |
|-------|--------|
| **Drag** | Place objects from inventory |
| **Click** | Rotate placed objects |
| **Space** | Start simulation |
| **R** | Reset level |
| **Esc** | Return to level select |
| **Ctrl+Z** | Undo last placement |

---

## Technical Details

### Stack

- **Engine**: [Phaser 3](https://phaser.io/) with Matter.js physics
- **Language**: TypeScript (strict mode)
- **Build**: Vite
- **Runtime**: Bun

### Architecture

```
src/
├── scenes/     # Title, LevelSelect, Game, Victory
├── objects/    # Physics object classes
├── ui/         # Buttons, panels, dialogs
├── utils/      # Grid logic, state management
└── types/      # TypeScript definitions

public/assets/
├── sprites/    # Pixel art (48×48 base)
└── audio/      # Chiptune music, JSFXR effects
```

### Design Constraints

- **Grid**: 20×15 cells, 48px each (960×720 play area)
- **Palette**: VGA 256-color aesthetic
- **Rendering**: Anti-aliasing disabled for pixel-perfect output
- **Target**: 60fps on mid-range hardware (2020+ laptops)

---

## Development

### Prerequisites

[Bun](https://bun.sh/) v1.0+

### Commands

```bash
bun install       # Install dependencies
bun run dev       # Start dev server (localhost:8080)
bun run build     # Production build
bun run preview   # Preview production build
bun run lint      # Run ESLint
```

### Deployment

Static build deploys to Vercel. No backend required—all state persists in localStorage.

---

## Browser Support

| Browser | Status |
|---------|--------|
| Chrome | Fully supported |
| Firefox | Should work |
| Safari | Should work |
| Mobile | Not supported (desktop only) |

Minimum resolution: 1280×720

---

## License

[MIT](LICENSE.md)
