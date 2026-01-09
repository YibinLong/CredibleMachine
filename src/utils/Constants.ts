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
    ALWAYS_UNLOCKED_LEVELS: [1, 2, 3] as readonly number[],
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
