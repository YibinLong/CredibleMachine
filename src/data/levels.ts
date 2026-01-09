/**
 * Level Data for Credible Machine
 *
 * Grid is 20 columns x 15 rows (0-indexed)
 * Each cell is 48x48 pixels
 *
 * Level progression:
 * - Levels 1-3: Tutorial levels (basic mechanics)
 * - Levels 4-6: Intermediate levels (trampoline, seesaw, fan)
 * - Levels 7-9: Advanced levels (pressure plate, dominoes, combo)
 * - Level 10: Master challenge (all mechanics)
 *
 * All levels are unlocked from the start.
 */

import { LevelData, ObjectType } from '../types';

/**
 * Level 1: Basic Placement
 * Concept: Single ramp to guide ball to basket
 *
 * Layout:
 * - Ball starts at top-left
 * - Basket at bottom-right
 * - Player places 1 ramp to guide ball down
 */
const level1: LevelData = {
    id: 1,
    name: 'First Steps',
    fixtures: [
        // Ball at top-left area
        { type: ObjectType.BALL, position: { col: 3, row: 2 } },
        // Basket at bottom-right area
        { type: ObjectType.BASKET, position: { col: 14, row: 11 } },
    ],
    inventory: [
        // Extra ramps for experimentation (optimal: 1)
        { type: ObjectType.RAMP, count: 3 },
    ],
};

/**
 * Level 2: Multiple Ramps
 * Concept: Chain two ramps together
 *
 * Layout:
 * - Ball starts at top-left
 * - Basket at bottom-right, lower
 * - Player chains 2 ramps to create a path
 */
const level2: LevelData = {
    id: 2,
    name: 'Chain Reaction',
    fixtures: [
        // Ball at top-left
        { type: ObjectType.BALL, position: { col: 2, row: 1 } },
        // Basket at bottom-right
        { type: ObjectType.BASKET, position: { col: 16, row: 12 } },
    ],
    inventory: [
        // Extra ramps for experimentation (optimal: 2)
        { type: ObjectType.RAMP, count: 4 },
    ],
};

/**
 * Level 3: Platforms as Blockers
 * Concept: Use walls/platforms to redirect ball
 *
 * Layout:
 * - Ball starts at top
 * - Basket at side
 * - Player uses platforms to block and redirect
 */
const level3: LevelData = {
    id: 3,
    name: 'Redirect',
    fixtures: [
        // Ball at top-center
        { type: ObjectType.BALL, position: { col: 10, row: 1 } },
        // Basket at bottom-left
        { type: ObjectType.BASKET, position: { col: 2, row: 11 } },
    ],
    inventory: [
        { type: ObjectType.RAMP, count: 3 },
        { type: ObjectType.PLATFORM, count: 3 },
    ],
};

/**
 * Level 4: Bounce
 * Concept: Use trampoline to bounce ball upward to reach elevated basket
 *
 * Layout:
 * - Ball starts at top-left, will fall down
 * - Basket is elevated on the right side
 * - Player uses trampoline to bounce ball up to basket height
 */
const level4: LevelData = {
    id: 4,
    name: 'Bounce',
    fixtures: [
        // Ball at top-left, will fall down
        { type: ObjectType.BALL, position: { col: 3, row: 2 } },
        // Basket elevated on right side (ball must bounce UP to reach)
        { type: ObjectType.BASKET, position: { col: 15, row: 3 } },
    ],
    inventory: [
        { type: ObjectType.TRAMPOLINE, count: 2 },
        { type: ObjectType.RAMP, count: 2 },
    ],
};

/**
 * Level 5: Catapult
 * Concept: Use seesaw to redirect/launch ball
 *
 * Layout:
 * - Ball starts at top-left
 * - Pre-placed platform obstacle in middle
 * - Basket at mid-right
 * - Player uses seesaw to tilt and guide ball around obstacle
 */
const level5: LevelData = {
    id: 5,
    name: 'Catapult',
    fixtures: [
        // Ball at top-left
        { type: ObjectType.BALL, position: { col: 2, row: 2 } },
        // Pre-placed platform obstacle in middle (vertical wall)
        { type: ObjectType.PLATFORM, position: { col: 10, row: 6 }, rotation: 90 },
        // Basket at mid-right
        { type: ObjectType.BASKET, position: { col: 16, row: 6 } },
    ],
    inventory: [
        { type: ObjectType.SEESAW, count: 2 },
        { type: ObjectType.RAMP, count: 2 },
    ],
};

/**
 * Level 6: Wind Power
 * Concept: Use fan to push ball horizontally
 *
 * Layout:
 * - Ball starts at mid-left
 * - Pre-placed platform creates a ledge
 * - Basket at bottom-right
 * - Player uses fan to push ball across to ramp leading to basket
 */
const level6: LevelData = {
    id: 6,
    name: 'Wind Power',
    fixtures: [
        // Ball at mid-left, on a ledge
        { type: ObjectType.BALL, position: { col: 2, row: 7 } },
        // Pre-placed platform as a ledge under ball
        { type: ObjectType.PLATFORM, position: { col: 2, row: 8 } },
        // Basket at bottom-right
        { type: ObjectType.BASKET, position: { col: 16, row: 12 } },
    ],
    inventory: [
        { type: ObjectType.FAN, count: 2 },
        { type: ObjectType.RAMP, count: 2 },
        { type: ObjectType.PLATFORM, count: 1 },
    ],
};

/**
 * Level 7: Trigger
 * Concept: Use pressure plates to trigger events
 *
 * Layout:
 * - Ball starts at top-left
 * - Basket at right side
 * - Player uses pressure plate + fan combo
 */
const level7: LevelData = {
    id: 7,
    name: 'Trigger',
    fixtures: [
        // Ball at top-left
        { type: ObjectType.BALL, position: { col: 2, row: 2 } },
        // Basket at right side
        { type: ObjectType.BASKET, position: { col: 16, row: 10 } },
    ],
    inventory: [
        { type: ObjectType.PRESSURE_PLATE, count: 2 },
        { type: ObjectType.FAN, count: 2 },
        { type: ObjectType.RAMP, count: 2 },
        { type: ObjectType.PLATFORM, count: 1 },
    ],
};

/**
 * Level 8: Domino Effect
 * Concept: Use dominoes to create a chain reaction
 *
 * Layout:
 * - Ball starts at top-left
 * - Basket at bottom-right
 * - Player sets up dominoes in a chain
 * - Ball knocks first domino, chain reaction leads to basket
 */
const level8: LevelData = {
    id: 8,
    name: 'Domino Effect',
    fixtures: [
        // Ball at top-left
        { type: ObjectType.BALL, position: { col: 2, row: 3 } },
        // Basket at bottom-right
        { type: ObjectType.BASKET, position: { col: 16, row: 11 } },
    ],
    inventory: [
        { type: ObjectType.DOMINO, count: 5 },
        { type: ObjectType.RAMP, count: 2 },
        { type: ObjectType.PLATFORM, count: 2 },
    ],
};

/**
 * Level 9: Combo
 * Concept: Multi-step solution using various mechanics
 *
 * Layout:
 * - Ball starts at top-left
 * - Pre-placed obstacles create a complex path
 * - Basket at bottom-right
 * - Player combines multiple mechanics
 */
const level9: LevelData = {
    id: 9,
    name: 'Combo',
    fixtures: [
        // Ball at top-left
        { type: ObjectType.BALL, position: { col: 2, row: 2 } },
        // Pre-placed platform obstacles
        { type: ObjectType.PLATFORM, position: { col: 8, row: 5 }, rotation: 90 },
        { type: ObjectType.PLATFORM, position: { col: 12, row: 8 }, rotation: 90 },
        // Basket at bottom-right
        { type: ObjectType.BASKET, position: { col: 17, row: 10 } },
    ],
    inventory: [
        { type: ObjectType.SEESAW, count: 1 },
        { type: ObjectType.TRAMPOLINE, count: 2 },
        { type: ObjectType.FAN, count: 1 },
        { type: ObjectType.RAMP, count: 2 },
        { type: ObjectType.PLATFORM, count: 2 },
    ],
};

/**
 * Level 10: Master
 * Concept: Complex multi-stage contraption using all mechanics
 *
 * Layout:
 * - Ball starts at top-left corner
 * - Multiple pre-placed obstacles create a challenging path
 * - Basket at bottom-right corner
 * - Player has access to all object types
 */
const level10: LevelData = {
    id: 10,
    name: 'Master',
    fixtures: [
        // Ball at top-left corner
        { type: ObjectType.BALL, position: { col: 1, row: 1 } },
        // Pre-placed obstacles creating complex path
        { type: ObjectType.PLATFORM, position: { col: 5, row: 4 }, rotation: 90 },
        { type: ObjectType.PLATFORM, position: { col: 10, row: 3 } },
        { type: ObjectType.PLATFORM, position: { col: 14, row: 7 }, rotation: 90 },
        // Basket at bottom-right corner
        { type: ObjectType.BASKET, position: { col: 17, row: 12 } },
    ],
    inventory: [
        { type: ObjectType.RAMP, count: 3 },
        { type: ObjectType.PLATFORM, count: 2 },
        { type: ObjectType.SEESAW, count: 1 },
        { type: ObjectType.TRAMPOLINE, count: 2 },
        { type: ObjectType.DOMINO, count: 3 },
        { type: ObjectType.FAN, count: 2 },
        { type: ObjectType.PRESSURE_PLATE, count: 1 },
    ],
};

/**
 * All levels indexed by level number
 */
export const LEVELS: Map<number, LevelData> = new Map([
    [1, level1],
    [2, level2],
    [3, level3],
    [4, level4],
    [5, level5],
    [6, level6],
    [7, level7],
    [8, level8],
    [9, level9],
    [10, level10],
]);

/**
 * Get level data by level number
 */
export function getLevelData(levelNum: number): LevelData | null {
    return LEVELS.get(levelNum) ?? null;
}

/**
 * Get total number of levels
 */
export function getTotalLevels(): number {
    return LEVELS.size;
}
