/**
 * Game constants for Credible Machine
 */

/**
 * Grid system constants
 * - 20x15 cells at 48x48 pixels each
 * - Total play area: 960x720 pixels
 */
export const GRID = {
    CELL_SIZE: 48,
    COLS: 20,
    ROWS: 15,
    PLAY_AREA_WIDTH: 960,   // 20 * 48
    PLAY_AREA_HEIGHT: 720,  // 15 * 48
    PLAY_AREA_X: 0,
    PLAY_AREA_Y: 0,
} as const;

/**
 * Game progression constants
 */
export const GAME = {
    TOTAL_LEVELS: 10,
    ALWAYS_UNLOCKED_LEVELS: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as readonly number[],
    STORAGE_KEY: 'credibleMachine',
} as const;

/**
 * UI layout constants
 */
export const UI = {
    GAME_WIDTH: 1280,
    GAME_HEIGHT: 720,
    INVENTORY_WIDTH: 320,  // 1280 - 960
    GRID_LINE_COLOR: 0x444444,
    GRID_LINE_ALPHA: 0.5,
    GRID_LINE_WIDTH: 1,
} as const;

/**
 * VGA color palette for MS-DOS retro aesthetic
 */
export const COLORS = {
    // Background colors
    BLACK: 0x000000,
    DARK_BLUE: 0x000080,
    MEDIUM_BLUE: 0x000040,
    DARK_GRAY: 0x1a1a2e,
    PLAY_AREA_BG: 0x16213e,
    INVENTORY_BG: 0x0f0f23,

    // UI colors
    WHITE: 0xffffff,
    GREEN: 0x00ff00,
    DARK_GREEN: 0x004400,
    ORANGE: 0xff6600,
    GOLD: 0xffdd00,
    GRAY: 0x666666,
    DARK_GRAY_BG: 0x222222,

    // Dialog colors
    DIALOG_OVERLAY: 0x000000,
    DIALOG_OVERLAY_ALPHA: 0.7,
    DIALOG_BG: 0x000080,
    DIALOG_BORDER: 0xffffff,
} as const;

/**
 * Font configuration for retro aesthetic
 */
export const FONTS = {
    PRIMARY: 'Courier New',
    FALLBACK: 'monospace',
} as const;

/**
 * Physics configuration for game objects
 * Tuned for "bowling ball" feel with realistic interactions
 */
export const PHYSICS = {
    BALL: {
        MASS: 5,
        FRICTION: 0.05,
        FRICTION_AIR: 0.01,
        FRICTION_STATIC: 0.1,
        RESTITUTION: 0.3,
        RADIUS_OFFSET: 4, // pixels smaller than cell for visual padding
    },
    RAMP: {
        FRICTION: 0.1,
    },
    PLATFORM: {
        FRICTION: 0.5,
    },
    BASKET: {
        // Sensor - no physics collision
    },
    TRAMPOLINE: {
        RESTITUTION: 1.5, // >1.0 adds energy to bounce
        FRICTION: 0.3,
    },
    DOMINO: {
        MASS: 1,
        FRICTION: 0.8,
        FRICTION_STATIC: 0.01, // Tips easily
        FRICTION_AIR: 0.001,
    },
    FAN: {
        FORCE_STRENGTH: 0.0005,
        RANGE_CELLS: 5,
    },
    SEESAW: {
        MAX_ANGLE: 45, // degrees
        TORQUE_MULTIPLIER: 0.001,
        ANGULAR_DAMPING: 0.1,
    },
    PRESSURE_PLATE: {
        // Sensor - no physics collision
    },
} as const;

/**
 * Colors for placeholder object sprites (VGA palette)
 */
export const OBJECT_COLORS = {
    BALL: 0x0066cc,
    RAMP: 0x8b4513,
    PLATFORM: 0x654321,
    BASKET: 0xffd700,
    SEESAW: 0x808080,
    TRAMPOLINE: 0x00ffff,
    DOMINO: 0xffffff,
    FAN: 0x4169e1,
    PRESSURE_PLATE: 0xff4500,
    // Special states
    FIXED_INDICATOR: 0xff0000,
    TRIGGER_LINE: 0xffff00,
} as const;
