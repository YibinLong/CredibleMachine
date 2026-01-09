/**
 * Core game type definitions for Credible Machine
 */

/**
 * Grid position in cell coordinates (0-19 for col, 0-14 for row)
 */
export interface GridPosition {
    col: number;
    row: number;
}

/**
 * Pixel position in game coordinates
 */
export interface PixelPosition {
    x: number;
    y: number;
}

/**
 * Object size in grid cells
 */
export interface ObjectSize {
    cols: number;
    rows: number;
}

/**
 * Cell occupancy tracking
 */
export interface CellOccupancy {
    objectId: string;
    objectType: string;
}

/**
 * localStorage save data schema
 */
export interface SaveData {
    completedLevels: number[];
    audioMuted: boolean;
}

/**
 * Level status for UI display
 */
export type LevelStatus = 'locked' | 'unlocked' | 'completed';

/**
 * Data passed between scenes
 */
export interface GameSceneData {
    level: number;
}

export interface VictorySceneData {
    level: number;
}
