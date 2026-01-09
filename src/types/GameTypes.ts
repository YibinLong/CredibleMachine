/**
 * Core game type definitions for Credible Machine
 */

// ========== Object Types ==========

/**
 * Enum for all game object types
 */
export enum ObjectType {
    BALL = 'ball',
    RAMP = 'ramp',
    PLATFORM = 'platform',
    BASKET = 'basket',
    SEESAW = 'seesaw',
    TRAMPOLINE = 'trampoline',
    DOMINO = 'domino',
    FAN = 'fan',
    PRESSURE_PLATE = 'pressurePlate'
}

/**
 * Physics configuration for game objects
 */
export interface PhysicsConfig {
    mass?: number;
    friction?: number;
    frictionAir?: number;
    frictionStatic?: number;
    restitution?: number;
    isSensor?: boolean;
    inertia?: number;
}

/**
 * Configuration for a game object type
 */
export interface ObjectConfig {
    type: ObjectType;
    size: ObjectSize;
    rotations: number[];
    isStatic: boolean;
    physics: PhysicsConfig;
    label: string;
}

/**
 * Trigger link between pressure plate and target object
 */
export interface TriggerLink {
    sourceId: string;
    targetId: string;
}

/**
 * Options for creating game objects
 */
export interface GameObjectOptions {
    isFixed?: boolean;
    rotation?: number;
    linkedObjectId?: string;
}

// ========== Grid Types ==========

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
    tutorialShown?: boolean;  // Optional for backward compatibility
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

// ========== Level Data Types ==========

/**
 * Pre-placed fixture object in a level
 */
export interface FixtureData {
    type: ObjectType;
    position: GridPosition;
    rotation?: number;
    linkedObjectId?: string;  // For pressure plates
}

/**
 * Available object in inventory for a level
 */
export interface InventoryItemData {
    type: ObjectType;
    count: number;
}

/**
 * Complete level data definition
 */
export interface LevelData {
    id: number;
    name: string;
    fixtures: FixtureData[];
    inventory: InventoryItemData[];
}

/**
 * Action for undo system
 */
export interface PlacementAction {
    type: 'place' | 'remove' | 'rotate' | 'move';
    objectType: ObjectType;
    position: GridPosition;
    rotation: number;
    previousPosition?: GridPosition;
    previousRotation?: number;
}

/**
 * Snapshot of simulation state for reset
 */
export interface SimulationSnapshot {
    placedObjects: Array<{
        type: ObjectType;
        position: GridPosition;
        rotation: number;
    }>;
    inventoryCounts: Map<ObjectType, number>;
}
