# Credible Machine

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
- As a player, I want to rotate objects before placing them so that I can orient ramps and other directional items correctly.
- As a player, I want to press a "Play" button to start the simulation so that I can see if my solution works.
- As a player, I want to press a "Reset" button to return to the initial state so that I can try a different approach.
- As a player, I want to see which objects I have available for each level so that I know what I'm working with.
- As a player, I want the game to save my progress so that I can close the browser and continue later.
- As a player, I want to be able to reset my progress on all the levels (resetting localStorage save data).
- As a player, I want to select levels from a level select screen so that I can replay completed levels or skip ahead to where I left off.
- As a player, I want clear visual and audio feedback when I complete a level so that the victory feels satisfying.

## 6. Functional Requirements

### P0 (Must-have)

**Core Gameplay**
- Grid-based play area where objects snap to cells
- Objects can span multiple grid cells (e.g., ramp is 3x1, conveyor belt is 4x1)
- Drag-and-drop object placement from inventory panel
- Object rotation (90-degree increments) before/during placement
- Fixed inventory per level (specific pieces the player must use)
- Play button to start physics simulation
- Reset button to restore level to initial state
- Win condition detection: ball enters goal basket

**Physics Objects**
- Ball: affected by gravity, bounces off surfaces
- Ramp: angled static surface that redirects ball
- Platform/Wall: static rectangular barrier
- Basket/Goal: win condition trigger zone
- Seesaw: pivoting platform (ball on one side raises the other)
- Trampoline: high-bounce surface
- Dominoes: knockable objects that create chain reactions
- Fan: applies horizontal force to ball when active
- Pressure Plate: triggers another object when ball touches it (e.g., activates fan, releases ball, drops platform)

**Game Structure**
- 10 levels with increasing difficulty
- All levels have same goal type: get ball to basket
- Title screen with "Play" button
- Level select screen showing completed/locked levels
- Progress saved to browser localStorage

**Audio**
- Retro-style sound effects (ball bounce, goal reached, button clicks, object placement)
- Background music (chiptune/FM synth style) - can be toggled off

### P1 (Should-have)

- Level completion star/score based on efficiency (fewer objects used = better score)
- Simple particle effects for impacts and goal completion
- Animated title screen
- Mute/volume controls
- Brief tutorial overlay on level 1 explaining controls

### P2 (Nice-to-have)

- Freeform/sandbox mode with unlimited objects
- Shareable level codes or screenshots
- Additional object types (balloon, magnet, portal)

## 7. Non-Functional Requirements

**Performance**
- Game should load in under 3 seconds on standard broadband connection
- Physics simulation should run at 60fps on mid-range devices (2020+ laptops/desktops)
- No perceptible input lag when dragging objects

**Compatibility**
- Supported browsers: Chrome
- Minimum resolution: 1280x720
- Should be playable on desktop/laptop; mobile is NOT a target

**Security**
- No user accounts or authentication required
- No sensitive data collected or stored
- localStorage used only for level progress (which levels completed)

**Reliability**
- Game state persists correctly across browser sessions
- Physics simulation is deterministic (same setup produces same result every time)

## 8. User Experience & Design Considerations

**Visual Style**
- MS-DOS / VGA aesthetic (256-color palette feel)
- Chunky pixel art sprites (suggest 32x32 or 64x64 base tile size)
- Dithering patterns for shading and gradients
- Inspired by original Incredible Machine visual style
- Charming, playful character to the art (objects should feel tactile and fun)

**Primary User Flow**
1. User opens website → Title screen displays
2. User clicks "Play" → Level select screen shows
3. User selects level → Game loads with empty play area, inventory on side, goal visible
4. User drags objects from inventory to grid, rotates as needed
5. User clicks "Play" → Physics simulation runs
6. If ball reaches goal → Victory screen, level marked complete, next level unlocks
7. If ball doesn't reach goal → User clicks "Reset" and tries again

**UI Layout**
- Left side: Play area (grid)
- Right side: Object inventory panel
- Bottom: Play/Reset buttons, level info
- Top: Back to level select, mute button

**Target Platform**
- Web (deployed on Vercel)
- Desktop browsers

**Asset Generation**
- Sprites and visual assets to be generated using Google's Imagen (Nano Banana Pro)
- Sound effects to be generated using JSFXR or sourced from OpenGameArt

## 9. Technical Requirements

**Game Framework**
- Phaser 3 (latest stable version)
- Handles rendering, physics, audio, input, and scene management in one integrated package

**Physics Engine**
- Matter.js (bundled with Phaser, no separate install needed)
- Use Phaser's Matter.js integration for gravity, collisions, angled surfaces, seesaws, constraints

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
- Browser localStorage for level progress persistence

**Deployment**
- Vercel (static site deployment)
- No backend required

**Code Quality**
- TypeScript with strict mode
- ESLint for linting

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

---

## Appendix A: Level Difficulty Progression

| Level | Concept Introduced | Objects Available | Complexity |
|-------|-------------------|-------------------|------------|
| 1 | Basic placement | Ball, 1 Ramp, Basket | Tutorial - single ramp to guide ball |
| 2 | Multiple ramps | Ball, 2 Ramps, Basket | Chain two ramps together |
| 3 | Platforms as blockers | Ball, Ramp, 2 Platforms, Basket | Use walls to redirect |
| 4 | Trampoline bounce | Ball, Trampoline, Ramp, Basket | Bounce ball upward to reach goal |
| 5 | Seesaw mechanics | Ball, Seesaw, Ramp, Basket | Use weight transfer |
| 6 | Fan introduction | Ball, Fan, Ramp, Basket | Horizontal force puzzle |
| 7 | Pressure plate triggers | Ball, Pressure Plate, Fan, Ramp, Basket | Activate fan mid-flight |
| 8 | Dominoes chain reaction | Ball, 3 Dominoes, Ramp, Basket | Knock dominoes to trigger sequence |
| 9 | Combined mechanics | Ball, Seesaw, Trampoline, Fan, Ramp, Basket | Multi-step solution |
| 10 | Master challenge | All object types available | Complex multi-stage contraption |

---

## Appendix B: Object Specifications

| Object | Grid Size | Rotatable | Physics Behavior |
|--------|-----------|-----------|------------------|
| Ball | 1x1 | No | Dynamic body, affected by gravity, bounces |
| Ramp | 3x1 | Yes (4 directions) | Static angled surface, 45° incline |
| Platform | 2x1 or 1x2 | Yes (2 orientations) | Static rectangular body |
| Basket | 2x2 | No | Static sensor (triggers win on ball contact) |
| Seesaw | 3x1 | Yes (2 orientations) | Pivots at center point |
| Trampoline | 2x1 | Yes (2 orientations) | Static with high restitution (bounciness) |
| Domino | 1x2 | Yes (2 orientations) | Dynamic body, tall and thin, tips over easily |
| Fan | 2x2 | Yes (4 directions) | Static, applies force in facing direction when active |
| Pressure Plate | 1x1 | No | Static sensor, triggers linked object on contact |
