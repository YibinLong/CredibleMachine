/**
 * ObjectRegistry - Configuration registry for all game object types
 *
 * Stores per-type configuration including:
 * - Grid size
 * - Allowed rotations
 * - Static vs dynamic body
 * - Physics properties
 */

import { ObjectType, ObjectConfig } from '../types';
import { PHYSICS } from '../utils/Constants';

/**
 * Registry of all object configurations
 */
export const OBJECT_CONFIGS: Record<ObjectType, ObjectConfig> = {
    [ObjectType.BALL]: {
        type: ObjectType.BALL,
        size: { cols: 1, rows: 1 },
        rotations: [0], // No rotation
        isStatic: false,
        physics: {
            mass: PHYSICS.BALL.MASS,
            friction: PHYSICS.BALL.FRICTION,
            frictionAir: PHYSICS.BALL.FRICTION_AIR,
            frictionStatic: PHYSICS.BALL.FRICTION_STATIC,
            restitution: PHYSICS.BALL.RESTITUTION,
        },
        label: 'BALL',
    },

    [ObjectType.RAMP]: {
        type: ObjectType.RAMP,
        size: { cols: 3, rows: 1 },
        rotations: [0, 90, 180, 270], // 4 directions
        isStatic: true,
        physics: {
            friction: PHYSICS.RAMP.FRICTION,
        },
        label: 'RAMP',
    },

    [ObjectType.PLATFORM]: {
        type: ObjectType.PLATFORM,
        size: { cols: 2, rows: 1 },
        rotations: [0, 90], // Horizontal or vertical
        isStatic: true,
        physics: {
            friction: PHYSICS.PLATFORM.FRICTION,
        },
        label: 'PLAT',
    },

    [ObjectType.BASKET]: {
        type: ObjectType.BASKET,
        size: { cols: 2, rows: 2 },
        rotations: [0], // No rotation
        isStatic: true,
        physics: {
            isSensor: true,
        },
        label: 'GOAL',
    },

    [ObjectType.SEESAW]: {
        type: ObjectType.SEESAW,
        size: { cols: 3, rows: 1 },
        rotations: [0, 90], // Horizontal or vertical
        isStatic: true, // Static body with manual rotation
        physics: {},
        label: 'SEESAW',
    },

    [ObjectType.TRAMPOLINE]: {
        type: ObjectType.TRAMPOLINE,
        size: { cols: 2, rows: 1 },
        rotations: [0, 90], // Horizontal or vertical
        isStatic: true,
        physics: {
            restitution: PHYSICS.TRAMPOLINE.RESTITUTION,
            friction: PHYSICS.TRAMPOLINE.FRICTION,
        },
        label: 'TRAMP',
    },

    [ObjectType.DOMINO]: {
        type: ObjectType.DOMINO,
        size: { cols: 1, rows: 2 },
        rotations: [0, 90], // Standing or lying
        isStatic: false,
        physics: {
            mass: PHYSICS.DOMINO.MASS,
            friction: PHYSICS.DOMINO.FRICTION,
            frictionStatic: PHYSICS.DOMINO.FRICTION_STATIC,
            frictionAir: PHYSICS.DOMINO.FRICTION_AIR,
        },
        label: 'DOM',
    },

    [ObjectType.FAN]: {
        type: ObjectType.FAN,
        size: { cols: 2, rows: 2 },
        rotations: [0, 90, 180, 270], // 4 directions (up, right, down, left)
        isStatic: true,
        physics: {},
        label: 'FAN',
    },

    [ObjectType.PRESSURE_PLATE]: {
        type: ObjectType.PRESSURE_PLATE,
        size: { cols: 1, rows: 1 },
        rotations: [0], // No rotation
        isStatic: true,
        physics: {
            isSensor: true,
        },
        label: 'PLATE',
    },
};

/**
 * Get the configuration for an object type
 */
export function getObjectConfig(type: ObjectType): ObjectConfig {
    return OBJECT_CONFIGS[type];
}

/**
 * Get size with rotation applied
 * For objects that swap width/height when rotated 90/270
 */
export function getRotatedSize(
    type: ObjectType,
    rotation: number
): { cols: number; rows: number } {
    const config = OBJECT_CONFIGS[type];
    const size = { ...config.size };

    // Swap dimensions for 90° or 270° rotation
    if (rotation === 90 || rotation === 270) {
        const temp = size.cols;
        size.cols = size.rows;
        size.rows = temp;
    }

    return size;
}

/**
 * Check if an object type is static
 */
export function isStaticObject(type: ObjectType): boolean {
    return OBJECT_CONFIGS[type].isStatic;
}

/**
 * Check if an object type is a sensor
 */
export function isSensorObject(type: ObjectType): boolean {
    return OBJECT_CONFIGS[type].physics.isSensor === true;
}
