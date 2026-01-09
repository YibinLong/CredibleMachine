/**
 * Level Data for Credible Machine
 *
 * Grid is 20 columns x 15 rows (0-indexed)
 * Each cell is 48x48 pixels
 *
 * Levels 1-3: Tutorial levels (always unlocked)
 * Levels 4-10: To be implemented in EPIC 8
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
        { type: ObjectType.RAMP, count: 1 },
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
        { type: ObjectType.RAMP, count: 2 },
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
 * Placeholder levels 4-10 (to be designed in EPIC 8)
 * These provide basic test data for now
 */
const level4: LevelData = {
    id: 4,
    name: 'Bounce',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 5, row: 2 } },
        { type: ObjectType.BASKET, position: { col: 14, row: 2 } },
    ],
    inventory: [
        { type: ObjectType.TRAMPOLINE, count: 1 },
        { type: ObjectType.RAMP, count: 1 },
    ],
};

const level5: LevelData = {
    id: 5,
    name: 'Catapult',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 3, row: 2 } },
        { type: ObjectType.BASKET, position: { col: 15, row: 8 } },
    ],
    inventory: [
        { type: ObjectType.SEESAW, count: 1 },
        { type: ObjectType.RAMP, count: 1 },
    ],
};

const level6: LevelData = {
    id: 6,
    name: 'Wind Power',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 2, row: 7 } },
        { type: ObjectType.BASKET, position: { col: 16, row: 12 } },
    ],
    inventory: [
        { type: ObjectType.FAN, count: 1 },
        { type: ObjectType.RAMP, count: 1 },
    ],
};

const level7: LevelData = {
    id: 7,
    name: 'Trigger',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 3, row: 2 } },
        { type: ObjectType.BASKET, position: { col: 15, row: 10 } },
    ],
    inventory: [
        { type: ObjectType.PRESSURE_PLATE, count: 1 },
        { type: ObjectType.FAN, count: 1 },
        { type: ObjectType.RAMP, count: 1 },
    ],
};

const level8: LevelData = {
    id: 8,
    name: 'Domino Effect',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 2, row: 3 } },
        { type: ObjectType.BASKET, position: { col: 16, row: 11 } },
    ],
    inventory: [
        { type: ObjectType.DOMINO, count: 3 },
        { type: ObjectType.RAMP, count: 1 },
    ],
};

const level9: LevelData = {
    id: 9,
    name: 'Combo',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 2, row: 2 } },
        { type: ObjectType.BASKET, position: { col: 16, row: 10 } },
    ],
    inventory: [
        { type: ObjectType.SEESAW, count: 1 },
        { type: ObjectType.TRAMPOLINE, count: 1 },
        { type: ObjectType.FAN, count: 1 },
        { type: ObjectType.RAMP, count: 1 },
    ],
};

const level10: LevelData = {
    id: 10,
    name: 'Master',
    fixtures: [
        { type: ObjectType.BALL, position: { col: 1, row: 1 } },
        { type: ObjectType.BASKET, position: { col: 17, row: 12 } },
    ],
    inventory: [
        { type: ObjectType.RAMP, count: 2 },
        { type: ObjectType.PLATFORM, count: 2 },
        { type: ObjectType.SEESAW, count: 1 },
        { type: ObjectType.TRAMPOLINE, count: 1 },
        { type: ObjectType.DOMINO, count: 2 },
        { type: ObjectType.FAN, count: 1 },
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
