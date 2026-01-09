# Asset Generation Guide for Credible Machine

This document describes how to set up parallel batch generation of pixel art sprites and retro sound effects for the Credible Machine game.

## Overview

The game requires:
- **Sprites**: 32x32 or 64x64 pixel art with MS-DOS/VGA aesthetic
- **Sounds**: 8-bit retro sound effects (JSFXR style)

Both can be generated programmatically and in parallel using free tools.

---

## Part 1: Sprite Generation

### Recommended Approach: Puter.js with Nano Banana Pro

Puter.js provides **free, unlimited** access to Google's Gemini 3 Pro Image model (Nano Banana Pro) with no API key management required.

#### Key Resources
- Documentation: https://developer.puter.com/tutorials/free-unlimited-nano-banana-api/
- Script include: `https://js.puter.com/v2/`
- Model identifier: `gemini-3-pro-image-preview`

#### How It Works
1. Puter.js runs in a browser context (or can be adapted for Node.js with a headless browser)
2. The `puter.ai.txt2img()` function generates images from text prompts
3. Images are returned as HTML image elements with base64 data URIs
4. No authentication required - uses Puter's "User-Pays" model

#### Implementation Steps

1. **Create a prompt list file** (`sprites/prompts.json`)
   - Define each sprite needed with its prompt text
   - Include desired dimensions in the prompt (e.g., "32x32 pixel art")
   - Always include "white background" or "transparent background" for easy extraction
   - Use MS-DOS/VGA aesthetic keywords: "retro", "16-color palette", "dithering", "chunky pixels"

2. **Write a browser-based generator script** (`sprites/generate.html`)
   - Include the Puter.js script tag
   - Load prompts from the JSON file
   - For each prompt, call `puter.ai.txt2img()` with the model set to `gemini-3-pro-image-preview`
   - Extract the base64 data from the returned image element
   - Convert to PNG and trigger download (or collect for batch download)

3. **Post-process images**
   - Use Sharp (npm package) or ImageMagick to resize to exact dimensions
   - Use nearest-neighbor interpolation to preserve pixel art crispness
   - Remove backgrounds if needed using alpha channel processing

4. **Parallelization strategy**
   - Batch prompts into groups of 3-5 concurrent requests
   - Use `Promise.all()` with a concurrency limiter to avoid overwhelming the API
   - Recommended: `p-limit` npm package for controlling concurrency

#### Alternative: Hugging Face Inference API

If Puter.js quality is insufficient, use Hugging Face with the Flux-2D-Game-Assets-LoRA model.

- Model: https://huggingface.co/gokaygokay/Flux-2D-Game-Assets-LoRA
- Prompt prefix: `GRPZA, ` (required for this LoRA)
- Prompt suffix: `, white background, game asset`
- Requires: Hugging Face API token from https://huggingface.co/settings/tokens
- Free tier: ~100 requests/hour, monthly credit limit
- API endpoint: Use `@huggingface/inference` npm package

---

## Part 2: Sound Generation

### Recommended Approach: jsfxr npm package

JSFXR is completely free, runs locally, and can generate 8-bit sound effects programmatically.

#### Key Resources
- npm package: https://www.npmjs.com/package/jsfxr
- Web interface for designing sounds: https://sfxr.me/
- GitHub repository: https://github.com/chr15m/jsfxr

#### How It Works
1. Sounds can be generated from presets or custom parameters
2. The web interface at sfxr.me lets you design sounds and export as JSON
3. The npm package can load these JSON definitions and export to WAV

#### Available Presets
- `pickupCoin` - coin/item collection
- `laserShoot` - shooting/projectile
- `explosion` - explosions/destruction
- `powerUp` - power-up/level-up
- `hitHurt` - damage/impact
- `jump` - jumping
- `blipSelect` - UI selection
- `synth` - synthesizer tone
- `tone` - pure tone
- `click` - click sound
- `random` - random effect

#### Implementation Steps

1. **Design custom sounds at sfxr.me**
   - Open https://sfxr.me/
   - Use the preset buttons as starting points
   - Tweak parameters until the sound is right
   - Click "Serialize" to get the JSON definition
   - Save each sound's JSON to a definitions file

2. **Create a sound definitions file** (`sounds/definitions.json`)
   - Map sound names to either preset names or custom JSON definitions
   - Example structure:
     ```
     {
       "ball_bounce": { "preset": "jump" },
       "collect_item": { "preset": "pickupCoin" },
       "fan_activate": { "custom": { ...serialized JSON from sfxr.me... } }
     }
     ```

3. **Write a Node.js generator script** (`sounds/generate.js`)
   - Install jsfxr: `bun add jsfxr`
   - Load the definitions file
   - For each sound:
     - If preset: use `sfxr.generate(presetName)`
     - If custom: use `sfxr.toAudio()` or parse the JSON directly
   - Convert to WAV using `sfxr.toWave(sound)`
   - Extract the dataURI and write to file as binary

4. **Alternative: CLI approach**
   - Use the `sfxr-to-wav` script from the jsfxr repo
   - Pipe JSON definitions: `cat sound.json | ./sfxr-to-wav output.wav`
   - Can be parallelized with xargs or GNU parallel

#### Parallelization Strategy
- Sound generation is CPU-bound and fast
- Simple sequential loop is usually sufficient
- If needed, use worker threads for true parallelization
- All sounds can be generated in under a second typically

---

## Part 3: Directory Structure

Create the following structure in the project:

```
scripts/
├── asset-generation/
│   ├── sprites/
│   │   ├── prompts.json         # Sprite prompt definitions
│   │   ├── generate.html        # Browser-based generator (Puter.js)
│   │   └── generate.js          # Alternative Node.js generator (HF API)
│   ├── sounds/
│   │   ├── definitions.json     # Sound definitions (presets + custom)
│   │   └── generate.js          # Node.js sound generator
│   ├── post-process.js          # Resize/optimize generated assets
│   └── run-all.sh               # Master script to run everything
```

Output directories (already exist or create):
```
public/assets/
├── sprites/                     # Generated sprite PNGs
└── sounds/                      # Generated WAV files
```

---

## Part 4: Prompt Engineering for Sprites

### General Template
```
[size] pixel art [object], [style keywords], [background], game asset
```

### Style Keywords for MS-DOS Aesthetic
- "retro VGA style"
- "16-color palette"
- "chunky pixels"
- "dithering shading"
- "1990s DOS game"
- "The Incredible Machine style"
- "2D side view" or "isometric" depending on object

### Example Prompts

| Object | Prompt |
|--------|--------|
| Ball | "32x32 pixel art red bouncing ball, shiny, retro VGA style, white background, game asset" |
| Ramp | "96x32 pixel art wooden ramp 45 degree angle, side view, retro DOS game style, white background, game asset" |
| Platform | "64x32 pixel art metal platform, horizontal bar, industrial, VGA palette, white background, game asset" |
| Basket | "64x64 pixel art wicker basket container, top-down angled view, retro game style, white background, game asset" |
| Trampoline | "64x32 pixel art trampoline, side view, red and blue, bouncy surface, DOS game aesthetic, white background, game asset" |
| Fan | "64x64 pixel art electric fan, industrial, spinning blades, retro style, white background, game asset" |
| Domino | "32x64 pixel art domino piece, standing upright, black dots on white, game piece, white background, game asset" |

---

## Part 5: Sound Design Mapping

Map game events to appropriate sound presets or custom sounds:

| Game Event | Suggested Preset | Notes |
|------------|------------------|-------|
| Ball bounces | `jump` | Modify for softer/harder surfaces |
| Ball enters basket (win) | `powerUp` | Victory jingle |
| Object placed | `blipSelect` | UI feedback |
| Object rotated | `click` | Quick rotation click |
| Fan activates | Custom | Design a sustained whoosh at sfxr.me |
| Trampoline bounce | `jump` | Higher pitch than regular bounce |
| Domino falls | `hitHurt` | Impact sound, chain for multiple |
| Pressure plate triggers | `click` | Mechanical click |
| Level start | `synth` | Short musical sting |
| Play button pressed | `blipSelect` | UI confirmation |

---

## Part 6: Execution Order

1. **First**: Generate all sounds (fast, no external API needed)
   - Run the sound generation script
   - Verify all WAV files are created in the output directory

2. **Second**: Generate all sprites (slower, uses external API)
   - Run the sprite generation script/page
   - Monitor for any failures and retry as needed
   - Expect some variation in output quality

3. **Third**: Post-process sprites
   - Resize to exact dimensions using nearest-neighbor interpolation
   - Remove white backgrounds (convert to transparency if needed)
   - Verify pixel-perfect alignment

4. **Fourth**: Manual quality check
   - Review each generated asset
   - Regenerate any that don't meet quality standards
   - Make manual adjustments in Aseprite if needed

---

## Part 7: Error Handling & Retry Logic

### For Sprite Generation
- Implement exponential backoff for API rate limits
- Save successful generations immediately (don't wait for batch completion)
- Log failed prompts to a separate file for manual retry
- Consider caching successful generations to avoid regenerating

### For Sound Generation
- Sound generation rarely fails (local processing)
- Validate WAV file sizes (should be non-zero)
- Test playback of each generated sound

---

## Part 8: Dependencies to Install

```bash
# For sound generation
bun add jsfxr

# For image post-processing
bun add sharp

# For concurrency control (sprite generation)
bun add p-limit

# For Hugging Face API (alternative sprite generation)
bun add @huggingface/inference
```

---

## Part 9: Environment Variables (if using Hugging Face)

Create a `.env` file:
```
HF_TOKEN=your_hugging_face_token_here
```

The token can be created at: https://huggingface.co/settings/tokens

Ensure `.env` is in `.gitignore` to avoid committing secrets.

---

## References

- Puter.js Documentation: https://developer.puter.com/tutorials/free-unlimited-nano-banana-api/
- jsfxr npm: https://www.npmjs.com/package/jsfxr
- jsfxr Web Interface: https://sfxr.me/
- Flux-2D-Game-Assets-LoRA: https://huggingface.co/gokaygokay/Flux-2D-Game-Assets-LoRA
- Sharp Image Processing: https://sharp.pixelplumbing.com/
