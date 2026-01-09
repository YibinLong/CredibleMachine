# Credible Machine - Product Requirements Document

---

## 1. Executive Summary

Credible Machine is a web-based Rube Goldberg puzzle game inspired by the classic 1993 game "The Incredible Machine." Players solve physics-based puzzles by placing objects on a grid to guide a ball into a goal through chain reactions. The game features 10 levels of increasing difficulty, an MS-DOS retro aesthetic with chunky pixel art and chiptune sounds, and runs directly in the browser with no login required.

## 2. Problem Statement

Classic puzzle games like The Incredible Machine are no longer easily accessible - they require emulators, DOSBox configuration, or purchasing legacy software bundles. Modern spiritual successors often lack the charm and simplicity of the original, adding unnecessary complexity or removing the satisfying tactile feel of building machines.

There's an opportunity to create a lightweight, browser-accessible tribute that captures the nostalgic MS-DOS aesthetic and core puzzle-building gameplay while being instantly playable by anyone with a web browser.

## 3. Goals & Success Metrics

| Goal | Success Metric | Measurement Method |
|------|----------------|-------------------|
| Deliver a complete, playable game | All 10 levels are completable with intended solutions | Manual playtesting |
| Achieve authentic retro aesthetic | Visual style matches MS-DOS era games (VGA palette, dithering, chunky pixels) | Visual comparison to reference games |
| Create satisfying physics interactions | Objects behave predictably and chain reactions feel rewarding | Playtesting feedback |
| Ensure accessibility | Game loads and runs in modern browsers without installation | Test on Chrome |
| Enable casual play sessions | Players can leave and return without losing progress | Verify localStorage persistence |

## 4. Target Users & Personas

**Primary User: Nostalgic Gamer (Age 30-50)**
- Played The Incredible Machine or similar games as a kid
- Enjoys puzzle games that don't require intense reflexes
- Appreciates retro aesthetics and wants a quick hit of nostalgia
- Frustration: Modern games are overcomplicated or require lengthy installs

**Secondary User: Casual Puzzle Fan (Age 15-35)**
- Enjoys physics-based puzzle games (Angry Birds, Cut the Rope, etc.)
- Looking for quick browser games to play during breaks
- May not have nostalgia for MS-DOS games but appreciates the style
- Frustration: Many browser games are ad-heavy or require accounts

## 5. User Stories

- As a player, I want to drag and drop objects onto the play area so that I can build my contraption.
- As a player, I want to click placed objects to rotate them so that I can orient ramps and other directional items correctly.
- As a player, I want to press a "Play" button to start the simulation so that I can see if my solution works.
- As a player, I want to press a "Reset" button to return to the initial state so that I can try a different approach.
- As a player, I want to see which objects I have available for each level so that I know what I'm working with.
- As a player, I want the game to save my progress so that I can close the browser and continue later.
- As a player, I want to be able to reset my progress on all the levels (with confirmation dialog).
- As a player, I want to select levels from a level select screen so that I can replay completed levels or skip ahead to where I left off.
- As a player, I want clear visual and audio feedback when I complete a level so that the victory feels satisfying.

---

## 6. Functional Requirements

### P0 (Must-have)

#### Core Gameplay

**Grid System**
- 20x15 cell play area
- 48x48 pixel cell size
- Grid lines visible only when dragging an object
- Objects snap to grid cells
- Objects can span multiple grid cells (e.g., ramp is 3x1, conveyor belt is 4x1)
- Objects cannot overlap - placement blocked on occupied cells
- Live ghost preview shows snapped position while dragging
- Red ghost preview for invalid placement (overlapping/occupied cells)
- Dropping object outside play area returns it to inventory

**Object Placement**
- Drag-and-drop object placement from inventory panel
- Click anywhere on multi-cell objects to select and drag
- Object rotation by clicking on placed objects (cycles through 90° increments)
- Cursor changes to rotation icon when hovering over rotatable placed objects
- Direct pickup to reposition placed objects (no need to reset)
- Single-step undo (Ctrl+Z) for last placement action - edit mode only
- Can use any subset of available inventory objects (unused objects remain in inventory)

**Pre-placed Fixtures**
- Levels contain pre-placed objects that cannot be moved
- Subtle visual indicator for fixed objects (small lock icon or slight outline difference)
- Ball starting position varies by level (suspended or resting)

**Simulation Controls**
- Play button starts physics simulation
- Play button ignored during simulation (must use Reset)
- Reset button instantly snaps back to pre-simulation state (no animation)
- Manual stop only - no stuck detection or timeout
- No pause functionality - must reset to stop simulation
- Simulation continues running even if ball falls off screen

**Win Condition**
- Ball touching the goal/basket trigger zone wins instantly (any direction)
- Victory freeze frame - simulation pauses when ball enters goal
- Simple "Level Complete!" message with Continue button (no stats)

**Keyboard Controls**
- Space = Start simulation (Play)
- R = Reset level
- Esc = Back to menu
- Ctrl+Z = Undo last placement (edit mode only)

#### Physics Objects

| Object | Grid Size | Rotatable | Physics Behavior |
|--------|-----------|-----------|------------------|
| Ball | 1x1 | No | Dynamic body, bowling ball feel (heavy, momentum-preserving, less bounce), subtle air drag |
| Ramp | 3x1 | Yes (4 directions) | Static angled surface, exactly 45° incline |
| Platform | 2x1 or 1x2 | Yes (2 orientations) | Static rectangular body |
| Basket | 2x2 | No | Static sensor (triggers win on ball contact from any direction) |
| Seesaw | 3x1 | Yes (2 orientations) | Pivots at center point, limited to ±45° tilt, catapult launch capability |
| Trampoline | 2x1 | Yes (2 orientations) | Static with high restitution, adds energy (ball bounces higher than drop) |
| Domino | 1x2 | Yes (2 orientations) | Dynamic body, hair-trigger sensitivity (tips on any contact), can knock ball |
| Fan | 2x2 | Yes (4 directions) | Static, applies constant force in facing direction, 5-cell range, animated wind effect, slow visible blade rotation |
| Pressure Plate | 1x1 | No | Static sensor, raised button visual design, instant trigger, visible connection line to linked object |

**Trigger Links**
- Pressure plates connect to triggered objects
- Visible dotted line or glow connecting pressure plate to target object during planning phase
- Instant activation when ball contacts plate (no delay)

#### Game Structure

**Level Progression**
- 10 levels with increasing difficulty
- All levels have same goal type: get ball to basket
- Levels 1-3 always unlocked
- Levels 4-10 unlock sequentially (complete N to unlock N+1)
- Level completion saved to localStorage (complete/incomplete only, no star rating)
- Object placements not persisted - only level completion status

**Screens**
- Title screen: Static display with "Play" button
- Level select: Number buttons with lock icons, color change + checkmark for completed levels
- Game scene: Main gameplay
- Victory screen: Special "You Win!" screen after completing level 10

**Confirmations**
- Reset progress: Modal dialog asking "Are you sure? This cannot be undone"
- Exit to menu with placed objects: Always confirm "Are you sure?" dialog

#### Audio

**Sound Effects**
- Universal bounce sound (same for all surfaces)
- Sound only for bounces (no visual effects)
- Click sounds for buttons, rotation, placement
- Victory sound effect
- Full audio during both planning and simulation phases

**Music**
- Chiptune/FM synth style background music
- Seamless loop (no fade/pause between loops)
- Master mute toggle (mutes both music and SFX)
- Mute preference saved to localStorage across sessions

### P1 (Should-have)

- Simple particle effects for goal completion only
- Brief tutorial overlay on level 1 explaining controls (skippable immediately with X button)
- Mute button visible in UI

### P2 (Nice-to-have)

- Freeform/sandbox mode with unlimited objects
- Shareable level codes or screenshots
- Additional object types (balloon, magnet, portal)

---

## 7. Non-Functional Requirements

**Performance**
- Game should load in under 3 seconds on standard broadband connection
- Physics simulation should run at 60fps on mid-range devices (2020+ laptops/desktops)
- No perceptible input lag when dragging objects

**Compatibility**
- Supported browsers: Chrome
- Minimum resolution: 1280x720
- Desktop/laptop only - not designed for mobile
- Show "Best played on desktop" message when accessed from mobile device

**Security**
- No user accounts or authentication required
- No sensitive data collected or stored
- localStorage used only for: level completion status, mute preference

**Reliability**
- Game state (completion) persists correctly across browser sessions
- Physics simulation is deterministic (same setup produces same result every time)

---

## 8. User Experience & Design Specifications

### Visual Style

**Color Palette**
- Strict VGA 256-color palette with exceptions for pure black/white for contrast
- Dithering patterns for shading and gradients

**Sprites**
- 48x48 pixel base tile size (matching grid cells)
- Chunky pixel art aesthetic
- Dithered drop shadows on objects
- Inspired by original Incredible Machine visual style
- Charming, playful character to the art

**UI Elements**
- Flat/static buttons (no hover or pressed states - authentic DOS feel)
- VGA palette for UI with black/white exceptions for readability

**Animations**
- Fan: Slow visible blade rotation (can see individual blades)
- Fan: Animated wind effect lines/particles showing airflow when active
- Title screen: Static (no animation)
- Level load: Instant appear (no fly-in or fade)

### UI Layout

**Screen Composition**
- Left ~80%: Play area (20x15 grid at 48px = 960x720 pixels)
- Right ~20%: Object inventory panel (vertical list with icon + name + count format)
- Bottom: Play/Reset buttons, level info
- Top: Back to level select, mute button

**Inventory Panel**
- Vertical list format
- Each entry: Object icon + name + remaining count (e.g., "Ramp x3")
- Objects returned here when removed from grid (instant teleport, no animation)

**Level Select Screen**
- Numbered buttons (1-10)
- Lock icon overlay on locked levels
- Completed levels: Color change + checkmark overlay
- Simple grid layout

### Target Platform

- Web (deployed on Vercel)
- Desktop browsers (Chrome primary)
- Minimum resolution: 1280x720

### Asset Generation

- Sprites and visual assets to be generated using Google's Imagen (Nano Banana Pro)
- Sound effects to be generated using JSFXR or sourced from OpenGameArt

---

## 9. Technical Requirements

**Game Framework**
- Phaser 3 (latest stable version)
- Handles rendering, physics, audio, input, and scene management in one integrated package

**Physics Engine**
- Matter.js (bundled with Phaser, no separate install needed)
- Use Phaser's Matter.js integration for gravity, collisions, angled surfaces, seesaws, constraints
- Configure subtle air drag on ball
- Configure high restitution (energy-adding) for trampoline

**Build Tooling**
- Vite (fast dev server, hot reload, optimized production builds)
- Use official Phaser + TypeScript + Vite template as starter: `phaserjs/template-vite-ts`

**Language**
- TypeScript (strict mode enabled)

**Rendering**
- Phaser's built-in renderer (auto-selects WebGL with Canvas fallback)
- Disable anti-aliasing for pixel-perfect retro look

**Audio**
- Phaser's built-in audio system (supports Web Audio API and HTML5 Audio fallback)
- Audio files: .mp3 format (with .ogg fallback for broader compatibility)
- Sound effects generated with JSFXR

**State Management**
- Phaser scene state for game logic
- Browser localStorage for:
  - Level completion status (which levels completed)
  - Audio mute preference

**Deployment**
- Vercel (static site deployment)
- No backend required

**Code Quality**
- TypeScript with strict mode
- ESLint for linting

---

## 10. Dependencies & Assumptions

**Dependencies**
- Phaser 3 library (includes Matter.js physics)
- Bun for runtime and package management
- Browser localStorage API available
- User has JavaScript enabled
- JSFXR for generating sound effects
- Imagen (Nano Banana Pro) for generating pixel art sprites

**Assumptions**
- Users have modern browsers (ES6+ support)
- Users are on desktop/laptop devices with mouse/trackpad input
- No internet connection required after initial page load (fully client-side)
- 10 levels is sufficient for a satisfying V1 experience
- Grid-based placement is acceptable deviation from original free-form placement
- Single ball-to-basket goal type provides enough variety across 10 levels

---

## 11. Out of Scope

The following are explicitly **not** included in V1:

- User accounts, login, or authentication
- Backend server or database
- Multiplayer or collaborative features
- Level editor for players to create custom levels
- Pulleys, ropes, or rope physics
- Gears or rotational mechanics
- Electrical circuits or wiring
- Animals (cats, mice) as in original game
- Variable gravity or air pressure per level
- Leaderboards or global scores
- Social sharing integration
- In-app purchases or monetization
- Accessibility features (screen reader support, colorblind modes)
- Localization / multiple languages
- Star rating / scoring system
- Path prediction / trajectory preview
- Simulation speed control
- Pause functionality
- Mobile/touch support
- Object placement state persistence

---

## Appendix A: Level Difficulty Progression

| Level | Concept Introduced | Objects Available | Complexity |
|-------|-------------------|-------------------|------------|
| 1 | Basic placement | Ball, 1 Ramp, Basket | Tutorial - single ramp to guide ball |
| 2 | Multiple ramps | Ball, 2 Ramps, Basket | Chain two ramps together |
| 3 | Platforms as blockers | Ball, Ramp, 2 Platforms, Basket | Use walls to redirect |
| 4 | Trampoline bounce | Ball, Trampoline, Ramp, Basket | Bounce ball upward to reach goal |
| 5 | Seesaw mechanics | Ball, Seesaw, Ramp, Basket | Use weight transfer and catapult |
| 6 | Fan introduction | Ball, Fan, Ramp, Basket | Horizontal force puzzle |
| 7 | Pressure plate triggers | Ball, Pressure Plate, Fan, Ramp, Basket | Activate fan mid-flight |
| 8 | Dominoes chain reaction | Ball, 3 Dominoes, Ramp, Basket | Knock dominoes to trigger sequence |
| 9 | Combined mechanics | Ball, Seesaw, Trampoline, Fan, Ramp, Basket | Multi-step solution |
| 10 | Master challenge | All object types available | Complex multi-stage contraption |

---

## Appendix B: Object Specifications

| Object | Grid Size | Rotatable | Directions | Physics Behavior |
|--------|-----------|-----------|------------|------------------|
| Ball | 1x1 | No | N/A | Dynamic body, bowling ball feel, affected by gravity with subtle air drag, moderate bounce |
| Ramp | 3x1 | Yes | 4 (↗↘↙↖) | Static angled surface, exactly 45° incline |
| Platform | 2x1 | Yes | 2 (horizontal/vertical) | Static rectangular body |
| Basket | 2x2 | No | N/A | Static sensor (triggers win on any contact) |
| Seesaw | 3x1 | Yes | 2 (horizontal/vertical) | Pivots at center point, ±45° max tilt, can catapult objects |
| Trampoline | 2x1 | Yes | 2 (horizontal/vertical) | Static with >1.0 restitution (adds energy), super bouncy |
| Domino | 1x2 | Yes | 2 (horizontal/vertical) | Dynamic body, tall and thin, hair-trigger tip, can knock ball |
| Fan | 2x2 | Yes | 4 (↑↓←→) | Static, constant force in facing direction, 5-cell range, animated |
| Pressure Plate | 1x1 | No | N/A | Static sensor, raised button visual, instant trigger, visible link |

---

## Appendix C: Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| Space | Start simulation | Edit mode only |
| R | Reset level | Any time in game |
| Esc | Back to level select | Any time in game (confirms if objects placed) |
| Ctrl+Z | Undo last placement | Edit mode only |

---

## Appendix D: localStorage Schema

```javascript
{
  "credibleMachine": {
    "completedLevels": [1, 2, 3],  // Array of completed level numbers
    "audioMuted": false            // Boolean for mute preference
  }
}
```

---

## Appendix E: Screen Flow

```
┌─────────────┐
│ Title Screen│
│   [Play]    │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Level Select   │
│ [1][2][3]...    │◄────────────────┐
│ [Reset Progress]│                 │
└──────┬──────────┘                 │
       │                            │
       ▼                            │
┌─────────────────┐                 │
│   Game Scene    │                 │
│ ┌─────┬───────┐ │                 │
│ │Play │Inven- │ │    [Esc]        │
│ │Area │tory   │ │─────────────────┤
│ └─────┴───────┘ │                 │
│ [Play][Reset]   │                 │
└──────┬──────────┘                 │
       │ Win                        │
       ▼                            │
┌─────────────────┐                 │
│ Victory Screen  │                 │
│ Level Complete! │                 │
│   [Continue]    │─────────────────┘
└─────────────────┘

       │ (Level 10 only)
       ▼
┌─────────────────┐
│ Final Victory   │
│   You Win!      │
│   [Play Again]  │───► Title Screen
└─────────────────┘
```

---

## Appendix F: Grid Dimensions Reference

- Grid: 20 columns × 15 rows
- Cell size: 48 × 48 pixels
- Total play area: 960 × 720 pixels
- Minimum window: 1280 × 720 pixels (allows for inventory panel + margins)

---
