# Credible Machine - Asset Generation List

## Overview

This document contains all sprites and sounds needed for the game, with AI-generation prompts optimized for:
- **Sprites**: Nano Banana Pro (Google Imagen) + Post-Processing
- **Sounds/Music**: Suno AI

**Visual Style Reference**: MS-DOS era, VGA 256-color palette, chunky pixel art, dithering patterns, inspired by "The Incredible Machine" (1993)

---

## SPRITE GENERATION WORKFLOW

### Two-Stage Process

Since Nano Banana Pro outputs at fixed resolutions (1K/2K/4K) and cannot generate exact pixel dimensions, we use a **generate + post-process workflow**:

#### Step 1: Generate with Nano Banana Pro
- Use the aspect ratio and resolution settings specified for each asset
- The prompt includes "clean sharp edges, no anti-aliasing, uniform pixel grid" to get cleaner output

#### Step 2: Post-Process (Downscale)
- **Tool**: Aseprite, Photoshop, or GIMP
- **Method**:
  1. Crop to exact aspect ratio if needed
  2. Downscale using **Nearest Neighbor** interpolation (preserves hard edges)
  3. Quantize colors to VGA palette if needed
  4. Touch up any messy pixels manually

#### Nano Banana Pro Supported Aspect Ratios
`1:1` | `2:3` | `3:2` | `3:4` | `4:3` | `4:5` | `5:4` | `9:16` | `16:9` | `21:9`

#### Resolution Options
- **1K** = 1024px base (use for small sprites)
- **2K** = 2048px base (use for medium sprites)
- **4K** = 4096px base (use for backgrounds)

---

## GAME OBJECT SPRITES

---

### 1
**Filename:** `ball.png`
**Target Size:** 48x48 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 48x48 using Nearest Neighbor

**Prompt:**
```
Pixel art bowling ball, top-down 3/4 view, dark blue with subtle shine highlight, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 2
**Filename:** `ramp_ne.png`
**Target Size:** 144x48 px (3:1 ratio)
**Aspect Ratio:** 3:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (closest available, outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop from 1536x1024 → 1536x512 (to get 3:1 ratio)
- Resize from 1536x512 → 144x48 using Nearest Neighbor

**Prompt:**
```
Pixel art wooden ramp incline 45 degrees, pointing up-right northeast direction, brown wood planks texture with wood grain, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shadows, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 3
**Filename:** `ramp_se.png`
**Target Size:** 144x48 px (3:1 ratio)
**Aspect Ratio:** 3:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (closest available, outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop from 1536x1024 → 1536x512 (to get 3:1 ratio)
- Resize from 1536x512 → 144x48 using Nearest Neighbor

**Prompt:**
```
Pixel art wooden ramp incline 45 degrees, pointing down-right southeast direction, brown wood planks texture with wood grain, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shadows, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 4
**Filename:** `ramp_sw.png`
**Target Size:** 144x48 px (3:1 ratio)
**Aspect Ratio:** 3:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (closest available, outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop from 1536x1024 → 1536x512 (to get 3:1 ratio)
- Resize from 1536x512 → 144x48 using Nearest Neighbor

**Prompt:**
```
Pixel art wooden ramp incline 45 degrees, pointing down-left southwest direction, brown wood planks texture with wood grain, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shadows, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 5
**Filename:** `ramp_nw.png`
**Target Size:** 144x48 px (3:1 ratio)
**Aspect Ratio:** 3:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (closest available, outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop from 1536x1024 → 1536x512 (to get 3:1 ratio)
- Resize from 1536x512 → 144x48 using Nearest Neighbor

**Prompt:**
```
Pixel art wooden ramp incline 45 degrees, pointing up-left northwest direction, brown wood planks texture with wood grain, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shadows, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 6
**Filename:** `platform_h.png`
**Target Size:** 96x48 px (2:1 ratio)
**Aspect Ratio:** 2:1

**Nano Banana Settings:**
- Aspect Ratio: `16:9` (closest available, outputs 1820x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop from 1820x1024 → 2048x1024 or center crop to 2:1 ratio
- Resize to 96x48 using Nearest Neighbor

**Prompt:**
```
Pixel art horizontal metal platform beam, industrial steel gray with rivets and bolts, rectangular bar shape, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 7
**Filename:** `platform_v.png`
**Target Size:** 48x96 px (1:2 ratio)
**Aspect Ratio:** 1:2

**Nano Banana Settings:**
- Aspect Ratio: `9:16` (closest available, outputs 1024x1820)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 1:2 ratio if needed
- Resize to 48x96 using Nearest Neighbor

**Prompt:**
```
Pixel art vertical metal platform beam, industrial steel gray with rivets and bolts, tall rectangular bar shape, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 8
**Filename:** `basket.png`
**Target Size:** 96x96 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 96x96 using Nearest Neighbor

**Prompt:**
```
Pixel art woven basket container, brown wicker texture, open top bucket shape, goal target for catching ball, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, 3/4 view showing opening, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 9
**Filename:** `seesaw_h.png`
**Target Size:** 144x48 px (3:1 ratio)
**Aspect Ratio:** 3:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (closest available, outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop from 1536x1024 → 1536x512 (to get 3:1 ratio)
- Resize from 1536x512 → 144x48 using Nearest Neighbor

**Prompt:**
```
Pixel art wooden seesaw plank balanced on triangle pivot fulcrum, horizontal orientation, brown wood plank with metal triangle fulcrum in center, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 10
**Filename:** `seesaw_v.png`
**Target Size:** 48x144 px (1:3 ratio)
**Aspect Ratio:** 1:3

**Nano Banana Settings:**
- Aspect Ratio: `2:3` (closest available, outputs 1024x1536)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 1:3 ratio (512x1536)
- Resize to 48x144 using Nearest Neighbor

**Prompt:**
```
Pixel art wooden seesaw plank balanced on triangle pivot fulcrum, vertical orientation rotated 90 degrees, brown wood plank with metal triangle fulcrum in center, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 11
**Filename:** `trampoline_h.png`
**Target Size:** 96x48 px (2:1 ratio)
**Aspect Ratio:** 2:1

**Nano Banana Settings:**
- Aspect Ratio: `16:9` (closest available, outputs 1820x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2:1 ratio
- Resize to 96x48 using Nearest Neighbor

**Prompt:**
```
Pixel art trampoline with bouncy red rubber surface and metal frame, horizontal orientation, springy coils visible on sides, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 12
**Filename:** `trampoline_v.png`
**Target Size:** 48x96 px (1:2 ratio)
**Aspect Ratio:** 1:2

**Nano Banana Settings:**
- Aspect Ratio: `9:16` (closest available, outputs 1024x1820)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 1:2 ratio
- Resize to 48x96 using Nearest Neighbor

**Prompt:**
```
Pixel art trampoline with bouncy red rubber surface and metal frame, vertical orientation rotated 90 degrees, springy coils visible, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 13
**Filename:** `domino_v.png`
**Target Size:** 48x96 px (1:2 ratio)
**Aspect Ratio:** 1:2

**Nano Banana Settings:**
- Aspect Ratio: `9:16` (closest available, outputs 1024x1820)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 1:2 ratio
- Resize to 48x96 using Nearest Neighbor

**Prompt:**
```
Pixel art standing domino tile, tall and thin rectangular block, white ivory color with black dots pattern, vertical upright position ready to fall, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 14
**Filename:** `domino_h.png`
**Target Size:** 96x48 px (2:1 ratio)
**Aspect Ratio:** 2:1

**Nano Banana Settings:**
- Aspect Ratio: `16:9` (closest available, outputs 1820x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2:1 ratio
- Resize to 96x48 using Nearest Neighbor

**Prompt:**
```
Pixel art standing domino tile rotated horizontal, tall and thin rectangular block on its side, white ivory color with black dots pattern, horizontal upright position ready to fall, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, side view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 15
**Filename:** `fan_up.png`
**Target Size:** 96x96 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 96x96 using Nearest Neighbor

**Prompt:**
```
Pixel art electric box fan with visible spinning blades, industrial gray metal housing with circular grill, pointing upward blowing air up, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, front view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 16
**Filename:** `fan_down.png`
**Target Size:** 96x96 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 96x96 using Nearest Neighbor

**Prompt:**
```
Pixel art electric box fan with visible spinning blades, industrial gray metal housing with circular grill, pointing downward blowing air down, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, front view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 17
**Filename:** `fan_left.png`
**Target Size:** 96x96 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 96x96 using Nearest Neighbor

**Prompt:**
```
Pixel art electric box fan with visible spinning blades, industrial gray metal housing with circular grill, pointing left blowing air to the left, side profile view, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 18
**Filename:** `fan_right.png`
**Target Size:** 96x96 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 96x96 using Nearest Neighbor

**Prompt:**
```
Pixel art electric box fan with visible spinning blades, industrial gray metal housing with circular grill, pointing right blowing air to the right, side profile view, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 19
**Filename:** `fan_blade_frames.png`
**Target Size:** 96x384 px (sprite sheet, 4 frames of 96x96)
**Aspect Ratio:** 1:4

**Nano Banana Settings:**
- Generate 4 separate 1:1 images at 1K, then combine into sprite sheet
- OR generate at `3:4` and crop

**Downscale Instructions:**
- Generate 4 frames of fan blades at different rotation angles
- Resize each to 96x96, stack vertically into 96x384 sprite sheet

**Prompt (generate 4 times with variations):**
```
Pixel art circular fan blades rotating, 4 blade propeller, industrial gray metal, rotation angle [0/90/180/270] degrees, isolated blades only no housing, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered metallic shading, front view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 20
**Filename:** `pressure_plate.png`
**Target Size:** 48x48 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 48x48 using Nearest Neighbor

**Prompt:**
```
Pixel art pressure plate button switch, raised red circular button on square metal base plate, industrial floor switch design, button popped up in unpressed state, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, top-down 3/4 view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

### 21
**Filename:** `pressure_plate_pressed.png`
**Target Size:** 48x48 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 48x48 using Nearest Neighbor

**Prompt:**
```
Pixel art pressure plate button switch, flat red circular button pressed down flush on square metal base plate, industrial floor switch design, button pushed down in activated pressed state, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, top-down 3/4 view, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, no blur, crisp outlines, game sprite asset
```

---

## UI ELEMENT SPRITES

---

### 22
**Filename:** `btn_play.png`
**Target Size:** 120x48 px (2.5:1 ratio)
**Aspect Ratio:** ~2.5:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2.5:1 ratio
- Resize to 120x48 using Nearest Neighbor

**Prompt:**
```
Pixel art button with text PLAY, green background color, beveled 3D raised edges, rectangular game UI button, chunky pixels, VGA 256-color palette, MS-DOS retro game style, flat design, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 23
**Filename:** `btn_reset.png`
**Target Size:** 120x48 px (2.5:1 ratio)
**Aspect Ratio:** ~2.5:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2.5:1 ratio
- Resize to 120x48 using Nearest Neighbor

**Prompt:**
```
Pixel art button with text RESET, orange background color, beveled 3D raised edges, rectangular game UI button, chunky pixels, VGA 256-color palette, MS-DOS retro game style, flat design, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 24
**Filename:** `btn_continue.png`
**Target Size:** 160x48 px (~3.3:1 ratio)
**Aspect Ratio:** ~3:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 3.3:1 ratio
- Resize to 160x48 using Nearest Neighbor

**Prompt:**
```
Pixel art button with text CONTINUE, blue background color, beveled 3D raised edges, rectangular game UI button, chunky pixels, VGA 256-color palette, MS-DOS retro game style, flat design, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 25
**Filename:** `btn_back.png`
**Target Size:** 96x48 px (2:1 ratio)
**Aspect Ratio:** 2:1

**Nano Banana Settings:**
- Aspect Ratio: `16:9` (closest available)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2:1 ratio
- Resize to 96x48 using Nearest Neighbor

**Prompt:**
```
Pixel art button with left arrow and text BACK, gray background color, beveled 3D raised edges, rectangular game UI button with arrow icon, chunky pixels, VGA 256-color palette, MS-DOS retro game style, flat design, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 26
**Filename:** `btn_play_again.png`
**Target Size:** 180x48 px (~3.75:1 ratio)
**Aspect Ratio:** ~4:1

**Nano Banana Settings:**
- Aspect Ratio: `3:2` (outputs 1536x1024)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 3.75:1 ratio
- Resize to 180x48 using Nearest Neighbor

**Prompt:**
```
Pixel art button with text PLAY AGAIN, green background color, beveled 3D raised edges, wide rectangular game UI button, chunky pixels, VGA 256-color palette, MS-DOS retro game style, flat design, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 27
**Filename:** `icon_lock.png`
**Target Size:** 32x32 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 32x32 using Nearest Neighbor

**Prompt:**
```
Pixel art padlock icon, locked closed state, gold brass and gray metal colors, simple lock symbol, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI icon asset
```

---

### 28
**Filename:** `icon_checkmark.png`
**Target Size:** 32x32 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 32x32 using Nearest Neighbor

**Prompt:**
```
Pixel art green checkmark icon, bold thick tick mark check symbol, success completion indicator, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI icon asset
```

---

### 29
**Filename:** `icon_mute_off.png`
**Target Size:** 32x32 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 32x32 using Nearest Neighbor

**Prompt:**
```
Pixel art speaker icon with sound waves, audio on unmuted state, white speaker with curved sound wave lines, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI icon asset
```

---

### 30
**Filename:** `icon_mute_on.png`
**Target Size:** 32x32 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 32x32 using Nearest Neighbor

**Prompt:**
```
Pixel art speaker icon with X mark, audio muted off state, white speaker with red X cross over it, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI icon asset
```

---

### 31
**Filename:** `icon_arrow_back.png`
**Target Size:** 32x32 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 32x32 using Nearest Neighbor

**Prompt:**
```
Pixel art left pointing arrow icon, navigation back button symbol, white arrow pointing left, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI icon asset
```

---

### 32
**Filename:** `level_button.png`
**Target Size:** 64x64 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 64x64 using Nearest Neighbor

**Prompt:**
```
Pixel art square button frame for level selection, beveled gray metal edges, empty dark center area for number overlay, unlocked available state, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 33
**Filename:** `level_button_complete.png`
**Target Size:** 64x64 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 64x64 using Nearest Neighbor

**Prompt:**
```
Pixel art square button frame for completed level, beveled gold yellow metal edges, empty dark center area for number overlay, victory celebration golden color, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

### 34
**Filename:** `level_button_locked.png`
**Target Size:** 64x64 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 64x64 using Nearest Neighbor

**Prompt:**
```
Pixel art square button frame for locked level, beveled dark gray metal edges, empty darker center area for number overlay, dimmed disabled locked appearance, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, no gradients, crisp outlines, game UI asset
```

---

## BACKGROUNDS & PANELS

---

### 35
**Filename:** `game_title.png`
**Target Size:** 480x120 px (4:1 ratio)
**Aspect Ratio:** 4:1

**Nano Banana Settings:**
- Aspect Ratio: `21:9` (closest wide ratio, outputs ~2580x1024)
- Resolution: `2K`

**Downscale Instructions:**
- Crop to 4:1 ratio
- Resize to 480x120 using Nearest Neighbor

**Prompt:**
```
Pixel art game logo text CREDIBLE MACHINE, metallic 3D beveled chrome letters, gear cog and mechanical decorations around text, industrial steampunk machinery style, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, crisp outlines, game title logo asset
```

---

### 36
**Filename:** `panel_inventory.png`
**Target Size:** 320x720 px (~1:2.25 ratio)
**Aspect Ratio:** ~9:16

**Nano Banana Settings:**
- Aspect Ratio: `9:16`
- Resolution: `2K` (outputs ~1152x2048)

**Downscale Instructions:**
- Crop to match 320:720 ratio
- Resize to 320x720 using Nearest Neighbor

**Prompt:**
```
Pixel art vertical panel background, dark blue with beveled metal frame border, industrial control panel texture with rivets, inventory sidebar design for game UI, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, subtle dithered gradients allowed, game UI panel asset
```

---

### 37
**Filename:** `panel_dialog.png`
**Target Size:** 400x200 px (2:1 ratio)
**Aspect Ratio:** 2:1

**Nano Banana Settings:**
- Aspect Ratio: `16:9` (closest)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2:1 ratio
- Resize to 400x200 using Nearest Neighbor

**Prompt:**
```
Pixel art dialog box background, gray with beveled 3D metal frame border, modal popup window design, empty center for text content, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background outside frame, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, game UI dialog asset
```

---

### 38
**Filename:** `bg_title.png`
**Target Size:** 1280x720 px (16:9 ratio)
**Aspect Ratio:** 16:9

**Nano Banana Settings:**
- Aspect Ratio: `16:9`
- Resolution: `4K` (outputs ~4096x2304)

**Downscale Instructions:**
- Resize to 1280x720 using Nearest Neighbor (or Bilinear for backgrounds)

**Prompt:**
```
Pixel art title screen background, dark industrial workshop interior with gears cogs and machinery silhouettes, moody blue and purple atmospheric tones, Rube Goldberg machine contraption elements, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading and gradients, The Incredible Machine inspired aesthetic, full scene background, clean pixel art style
```

---

### 39
**Filename:** `bg_level_select.png`
**Target Size:** 1280x720 px (16:9 ratio)
**Aspect Ratio:** 16:9

**Nano Banana Settings:**
- Aspect Ratio: `16:9`
- Resolution: `4K` (outputs ~4096x2304)

**Downscale Instructions:**
- Resize to 1280x720 using Nearest Neighbor (or Bilinear for backgrounds)

**Prompt:**
```
Pixel art level select screen background, blueprint paper with grid lines and technical drawings, industrial factory workshop theme, blue and white tones, engineering schematic aesthetic, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, The Incredible Machine inspired, full scene background, clean pixel art style
```

---

### 40
**Filename:** `bg_game.png`
**Target Size:** 960x720 px (4:3 ratio)
**Aspect Ratio:** 4:3

**Nano Banana Settings:**
- Aspect Ratio: `4:3`
- Resolution: `4K` (outputs ~4096x3072)

**Downscale Instructions:**
- Resize to 960x720 using Nearest Neighbor (or Bilinear for backgrounds)

**Prompt:**
```
Pixel art game play area background, dark workshop floor with subtle grid pattern visible, industrial concrete and metal texture, neutral gray and brown tones, workspace for building machines, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, The Incredible Machine inspired, full scene background, clean pixel art style
```

---

### 41
**Filename:** `bg_victory.png`
**Target Size:** 1280x720 px (16:9 ratio)
**Aspect Ratio:** 16:9

**Nano Banana Settings:**
- Aspect Ratio: `16:9`
- Resolution: `4K` (outputs ~4096x2304)

**Downscale Instructions:**
- Resize to 1280x720 using Nearest Neighbor (or Bilinear for backgrounds)

**Prompt:**
```
Pixel art victory celebration screen background, golden triumphant atmosphere with confetti and sparkles, trophy and success imagery, celebratory warm gold and yellow tones, chunky pixels, VGA 256-color palette, MS-DOS retro game style, dithered shading, winning achievement mood, full scene background, clean pixel art style
```

---

## VISUAL EFFECTS & INDICATORS

---

### 42
**Filename:** `ghost_overlay.png`
**Target Size:** 48x48 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 48x48 using Nearest Neighbor

**Prompt:**
```
Pixel art semi-transparent white square overlay, 50 percent opacity ghost effect, soft glowing edges, placement preview indicator, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background with white fill, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fill, game effect asset
```

---

### 43
**Filename:** `invalid_overlay.png`
**Target Size:** 48x48 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 48x48 using Nearest Neighbor

**Prompt:**
```
Pixel art semi-transparent red square overlay, 50 percent opacity error indicator, X cross pattern inside, invalid placement warning, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background with red fill, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fill, game effect asset
```

---

### 44
**Filename:** `icon_fixed_lock.png`
**Target Size:** 24x24 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 24x24 using Nearest Neighbor

**Prompt:**
```
Pixel art tiny padlock icon, small lock indicator for fixed immovable objects, gray metal miniature lock, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, no anti-aliasing, uniform pixel grid, solid color fills, game UI tiny icon asset
```

---

### 45
**Filename:** `trigger_link_dot.png`
**Target Size:** 8x8 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 8x8 using Nearest Neighbor
- Note: May need manual creation in Aseprite for this tiny size

**Prompt:**
```
Pixel art small glowing yellow dot, bright connection indicator point, energy link node, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, solid yellow circle, game effect tiny asset
```

---

### 46
**Filename:** `wind_particle.png`
**Target Size:** 16x8 px (2:1 ratio)
**Aspect Ratio:** 2:1

**Nano Banana Settings:**
- Aspect Ratio: `16:9` (closest)
- Resolution: `1K`

**Downscale Instructions:**
- Crop to 2:1 ratio
- Resize to 16x8 using Nearest Neighbor
- Note: May need manual creation in Aseprite for this tiny size

**Prompt:**
```
Pixel art horizontal wind line dash streak, white with light blue tint, motion blur air flow effect, small particle for fan wind animation, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, clean sharp edges, game particle effect asset
```

---

### 47
**Filename:** `victory_particle.png`
**Target Size:** 16x16 px
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 16x16 using Nearest Neighbor
- Note: May need manual creation in Aseprite for this tiny size

**Prompt:**
```
Pixel art star sparkle particle, golden yellow four point star, celebration victory effect, shiny twinkle, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, centered in frame, clean sharp edges, solid color fill, game particle effect asset
```

---

### 48
**Filename:** `confetti_particles.png`
**Target Size:** 64x64 px (sprite sheet, 4x4 grid of 16x16 pieces)
**Aspect Ratio:** 1:1

**Nano Banana Settings:**
- Aspect Ratio: `1:1`
- Resolution: `1K` (outputs 1024x1024)

**Downscale Instructions:**
- Resize from 1024x1024 → 64x64 using Nearest Neighbor

**Prompt:**
```
Pixel art sprite sheet of colorful confetti pieces, 4x4 grid layout of different small shapes, red blue green yellow purple orange colors, rectangles squares and triangles, celebration party confetti, chunky pixels, VGA 256-color palette, MS-DOS retro game style, transparent background, clean sharp edges, uniform pixel grid, game particle sprite sheet asset
```

---

## SOUNDS

---

### Sound Effect 1
**Filename:** `sfx_bounce.wav`
**Duration:** ~0.2 seconds

**Suno Prompt:**
```
8-bit retro game sound effect, short bouncy boing, rubber ball hitting hard surface, chiptune style, single impact hit, punchy low-mid frequency thump, classic DOS game sound, no melody just sound effect
```

---

### Sound Effect 2
**Filename:** `sfx_click.wav`
**Duration:** ~0.1 seconds

**Suno Prompt:**
```
8-bit retro UI click sound, very short button press, mechanical keyboard click, chiptune style, crisp high frequency blip beep, classic DOS menu selection sound, no melody just sound effect
```

---

### Sound Effect 3
**Filename:** `sfx_rotate.wav`
**Duration:** ~0.2 seconds

**Suno Prompt:**
```
8-bit retro game sound effect, short mechanical rotation click, gear turning ratchet sound, chiptune style, clicking mechanism, classic DOS game object manipulation sound, no melody just sound effect
```

---

### Sound Effect 4
**Filename:** `sfx_place.wav`
**Duration:** ~0.2 seconds

**Suno Prompt:**
```
8-bit retro game sound effect, object placement thunk, solid heavy drop on surface, chiptune style, satisfying mechanical clunk thud, classic DOS game building sound, no melody just sound effect
```

---

### Sound Effect 5
**Filename:** `sfx_pickup.wav`
**Duration:** ~0.15 seconds

**Suno Prompt:**
```
8-bit retro game sound effect, quick pickup swoosh, lifting grabbing object, chiptune style, short ascending rising tone, classic DOS game interaction sound, no melody just sound effect
```

---

### Sound Effect 6
**Filename:** `sfx_victory.wav`
**Duration:** ~1.5 seconds

**Suno Prompt:**
```
8-bit retro victory fanfare jingle, triumphant level complete celebration, chiptune style, ascending arpeggio with final major chord, classic DOS game win success sound, short musical phrase, FM synthesis
```

---

### Sound Effect 7
**Filename:** `sfx_error.wav`
**Duration:** ~0.3 seconds

**Suno Prompt:**
```
8-bit retro error buzz sound, invalid action rejection, short negative feedback buzzer, chiptune style, descending minor tone, classic DOS game error warning sound, no melody just sound effect
```

---

### Sound Effect 8
**Filename:** `sfx_start.wav`
**Duration:** ~0.5 seconds

**Suno Prompt:**
```
8-bit retro game start sound, simulation begin activation, mechanical engine startup whir, chiptune style, ascending energy buildup whoosh, classic DOS game launch sound, no melody just sound effect
```

---

### Sound Effect 9
**Filename:** `sfx_reset.wav`
**Duration:** ~0.3 seconds

**Suno Prompt:**
```
8-bit retro rewind tape sound, quick reverse reset effect, return to start, chiptune style, descending sweep zoop, classic DOS game reset undo sound, no melody just sound effect
```

---

### Sound Effect 10
**Filename:** `sfx_domino_fall.wav`
**Duration:** ~0.3 seconds

**Suno Prompt:**
```
8-bit retro falling impact sound, domino tile tipping over and hitting, wooden block clack, chiptune style, quick descending thump clatter, classic DOS game physics sound, no melody just sound effect
```

---

### Sound Effect 11
**Filename:** `sfx_fan_loop.wav`
**Duration:** ~1.0 seconds (loopable)

**Suno Prompt:**
```
8-bit retro mechanical hum drone, electric fan motor running loop, steady continuous whirring buzz, chiptune style, seamlessly loopable ambient drone, classic DOS game machine sound, no melody just continuous tone
```

---

### Sound Effect 12
**Filename:** `sfx_pressure_plate.wav`
**Duration:** ~0.2 seconds

**Suno Prompt:**
```
8-bit retro button press activation sound, pressure plate trigger click, mechanical switch with electronic beep confirmation, chiptune style, satisfying clunk plus blip, classic DOS game trigger sound, no melody just sound effect
```

---

### Sound Effect 13
**Filename:** `sfx_trampoline.wav`
**Duration:** ~0.3 seconds

**Suno Prompt:**
```
8-bit retro spring bounce sound, trampoline super boing, extra bouncy high pitch sproing, chiptune style, cartoon spring coil effect ascending, classic DOS game bounce sound, no melody just sound effect
```

---

### Sound Effect 14
**Filename:** `sfx_seesaw.wav`
**Duration:** ~0.4 seconds

**Suno Prompt:**
```
8-bit retro seesaw tilt sound, wooden plank pivoting creak, lever fulcrum movement wobble, chiptune style, mechanical teetering effect, classic DOS game physics sound, no melody just sound effect
```

---

## BACKGROUND MUSIC

---

### Music Track 1
**Filename:** `music_main.mp3`
**Duration:** 2-3 minutes (seamlessly loopable)

**Suno Prompt:**
```
Upbeat chiptune puzzle game background music, 8-bit retro DOS game style, playful mechanical contraption theme, FM synthesis square wave and triangle wave sounds, loopable seamless loop, moderate tempo 110-120 BPM, nostalgic 1990s computer game soundtrack, The Incredible Machine inspired, cheerful but focused concentration mood, chip-tune arpeggios and catchy melody, no vocals instrumental only
```

---

### Music Track 2
**Filename:** `music_victory.mp3`
**Duration:** 15-20 seconds

**Suno Prompt:**
```
Triumphant 8-bit victory theme fanfare, chiptune celebration win music, retro DOS game level complete jingle, short and celebratory, FM synthesis brass and lead sounds, ascending melody building to climax, nostalgic 1990s game victory screen, can fade out or loop, no vocals instrumental only
```

---

### Music Track 3
**Filename:** `music_title.mp3`
**Duration:** 1-2 minutes (seamlessly loopable)

**Suno Prompt:**
```
Mysterious chiptune title screen menu music, 8-bit retro DOS game style, anticipation and wonder theme with mechanical undertones, FM synthesis atmospheric pads, loopable seamless loop, slower tempo 80-90 BPM, nostalgic 1990s computer game menu music, The Incredible Machine inspired, inviting and curious mood, no vocals instrumental only
```

---

## FILE ORGANIZATION

After generating and processing all assets, organize them as follows:

```
public/assets/
├── sprites/
│   ├── objects/
│   │   ├── ball.png
│   │   ├── ramp_ne.png
│   │   ├── ramp_se.png
│   │   ├── ramp_sw.png
│   │   ├── ramp_nw.png
│   │   ├── platform_h.png
│   │   ├── platform_v.png
│   │   ├── basket.png
│   │   ├── seesaw_h.png
│   │   ├── seesaw_v.png
│   │   ├── trampoline_h.png
│   │   ├── trampoline_v.png
│   │   ├── domino_v.png
│   │   ├── domino_h.png
│   │   ├── fan_up.png
│   │   ├── fan_down.png
│   │   ├── fan_left.png
│   │   ├── fan_right.png
│   │   ├── fan_blade_frames.png
│   │   ├── pressure_plate.png
│   │   └── pressure_plate_pressed.png
│   ├── ui/
│   │   ├── btn_play.png
│   │   ├── btn_reset.png
│   │   ├── btn_continue.png
│   │   ├── btn_back.png
│   │   ├── btn_play_again.png
│   │   ├── icon_lock.png
│   │   ├── icon_checkmark.png
│   │   ├── icon_mute_off.png
│   │   ├── icon_mute_on.png
│   │   ├── icon_arrow_back.png
│   │   ├── level_button.png
│   │   ├── level_button_complete.png
│   │   └── level_button_locked.png
│   ├── backgrounds/
│   │   ├── game_title.png
│   │   ├── panel_inventory.png
│   │   ├── panel_dialog.png
│   │   ├── bg_title.png
│   │   ├── bg_level_select.png
│   │   ├── bg_game.png
│   │   └── bg_victory.png
│   └── effects/
│       ├── ghost_overlay.png
│       ├── invalid_overlay.png
│       ├── icon_fixed_lock.png
│       ├── trigger_link_dot.png
│       ├── wind_particle.png
│       ├── victory_particle.png
│       └── confetti_particles.png
├── audio/
│   ├── sfx/
│   │   ├── sfx_bounce.wav
│   │   ├── sfx_click.wav
│   │   ├── sfx_rotate.wav
│   │   ├── sfx_place.wav
│   │   ├── sfx_pickup.wav
│   │   ├── sfx_victory.wav
│   │   ├── sfx_error.wav
│   │   ├── sfx_start.wav
│   │   ├── sfx_reset.wav
│   │   ├── sfx_domino_fall.wav
│   │   ├── sfx_fan_loop.wav
│   │   ├── sfx_pressure_plate.wav
│   │   ├── sfx_trampoline.wav
│   │   └── sfx_seesaw.wav
│   └── music/
│       ├── music_main.mp3
│       ├── music_victory.mp3
│       └── music_title.mp3
```

---

## SUMMARY

| Category | Count |
|----------|-------|
| Game Object Sprites | 21 |
| UI Element Sprites | 13 |
| Background/Panel Sprites | 7 |
| Effect/Indicator Sprites | 7 |
| Sound Effects | 14 |
| Music Tracks | 3 |
| **Total Assets** | **65** |

---

## POST-PROCESSING CHECKLIST

For each sprite after generation:

- [ ] Download from Nano Banana Pro
- [ ] Open in Aseprite/Photoshop
- [ ] Crop to exact aspect ratio if needed
- [ ] Resize to target dimensions using **Nearest Neighbor** interpolation
- [ ] Check for anti-aliasing artifacts and clean up manually
- [ ] Verify transparent background (PNG format)
- [ ] Optional: Quantize to 256 colors for authentic VGA look
- [ ] Export as PNG with transparency
- [ ] Place in correct folder per file organization above

---

## NOTES

1. **Tiny Assets (8x8, 16x16, 24x24)**: These may be too small for AI generation. Consider creating manually in Aseprite for best results.

2. **Sprite Sheet (fan_blade_frames, confetti)**: Generate individual frames separately, then combine in Aseprite.

3. **Backgrounds**: Can use Bilinear interpolation instead of Nearest Neighbor for smoother results.

4. **Sound Effects**: If Suno doesn't generate good SFX, use JSFXR (https://sfxr.me/) as a backup.

5. **Music Looping**: After generating, trim the audio file ends in Audacity to create seamless loops.
