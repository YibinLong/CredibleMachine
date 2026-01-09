/**
 * Grid - Cell-based grid system for object placement
 *
 * Features:
 * - 20x15 grid of 48x48 pixel cells
 * - Cell occupancy tracking for placement validation
 * - Multi-cell object support
 * - Grid line rendering (visible during drag operations)
 * - Coordinate conversion between grid and pixel positions
 */

import { Scene, GameObjects } from 'phaser';
import { GridPosition, PixelPosition, ObjectSize, CellOccupancy } from '../types';
import { GRID, UI } from './Constants';

export class Grid {
    private scene: Scene;
    private occupancy: Map<string, CellOccupancy>;
    private gridGraphics: GameObjects.Graphics | null;
    private gridVisible: boolean;

    constructor(scene: Scene) {
        this.scene = scene;
        this.occupancy = new Map();
        this.gridGraphics = null;
        this.gridVisible = false;
    }

    // ========== Coordinate Conversion ==========

    /**
     * Convert grid position to pixel position (top-left corner of cell)
     */
    cellToPixel(gridPos: GridPosition): PixelPosition {
        return {
            x: GRID.PLAY_AREA_X + gridPos.col * GRID.CELL_SIZE,
            y: GRID.PLAY_AREA_Y + gridPos.row * GRID.CELL_SIZE,
        };
    }

    /**
     * Convert pixel position to grid position
     * Uses floor to snap to the cell containing the point
     */
    pixelToCell(pixelPos: PixelPosition): GridPosition {
        return {
            col: Math.floor((pixelPos.x - GRID.PLAY_AREA_X) / GRID.CELL_SIZE),
            row: Math.floor((pixelPos.y - GRID.PLAY_AREA_Y) / GRID.CELL_SIZE),
        };
    }

    /**
     * Get the center point of a cell in pixel coordinates
     */
    getCellCenter(gridPos: GridPosition): PixelPosition {
        const topLeft = this.cellToPixel(gridPos);
        return {
            x: topLeft.x + GRID.CELL_SIZE / 2,
            y: topLeft.y + GRID.CELL_SIZE / 2,
        };
    }

    /**
     * Snap a pixel position to the nearest cell center
     */
    snapToCell(pixelPos: PixelPosition): PixelPosition {
        const cell = this.pixelToCell(pixelPos);
        return this.getCellCenter(cell);
    }

    // ========== Cell Occupancy ==========

    /**
     * Generate a unique key for a cell position
     */
    private getCellKey(gridPos: GridPosition): string {
        return `${gridPos.col},${gridPos.row}`;
    }

    /**
     * Check if a specific cell is occupied
     */
    isOccupied(gridPos: GridPosition): boolean {
        return this.occupancy.has(this.getCellKey(gridPos));
    }

    /**
     * Get the occupancy info for a cell
     */
    getOccupancy(gridPos: GridPosition): CellOccupancy | null {
        return this.occupancy.get(this.getCellKey(gridPos)) ?? null;
    }

    /**
     * Check if a multi-cell object can be placed at the given position
     * Verifies all cells are valid and unoccupied
     */
    canPlaceObject(gridPos: GridPosition, size: ObjectSize): boolean {
        for (let c = 0; c < size.cols; c++) {
            for (let r = 0; r < size.rows; r++) {
                const checkPos: GridPosition = {
                    col: gridPos.col + c,
                    row: gridPos.row + r,
                };

                if (!this.isValidCell(checkPos) || this.isOccupied(checkPos)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Mark cells as occupied by an object
     */
    occupyCells(
        gridPos: GridPosition,
        size: ObjectSize,
        objectId: string,
        objectType: string
    ): void {
        for (let c = 0; c < size.cols; c++) {
            for (let r = 0; r < size.rows; r++) {
                const cellPos: GridPosition = {
                    col: gridPos.col + c,
                    row: gridPos.row + r,
                };
                const key = this.getCellKey(cellPos);
                this.occupancy.set(key, { objectId, objectType });
            }
        }
    }

    /**
     * Free cells that were occupied by an object
     */
    freeCells(gridPos: GridPosition, size: ObjectSize): void {
        for (let c = 0; c < size.cols; c++) {
            for (let r = 0; r < size.rows; r++) {
                const cellPos: GridPosition = {
                    col: gridPos.col + c,
                    row: gridPos.row + r,
                };
                const key = this.getCellKey(cellPos);
                this.occupancy.delete(key);
            }
        }
    }

    /**
     * Get all cells occupied by a specific object
     */
    getCellsForObject(objectId: string): GridPosition[] {
        const cells: GridPosition[] = [];
        this.occupancy.forEach((occupancy, key) => {
            if (occupancy.objectId === objectId) {
                const [col, row] = key.split(',').map(Number);
                cells.push({ col, row });
            }
        });
        return cells;
    }

    // ========== Validation ==========

    /**
     * Check if a grid position is within valid bounds
     */
    isValidCell(gridPos: GridPosition): boolean {
        return (
            gridPos.col >= 0 &&
            gridPos.col < GRID.COLS &&
            gridPos.row >= 0 &&
            gridPos.row < GRID.ROWS
        );
    }

    /**
     * Check if a pixel position is within the play area
     */
    isWithinPlayArea(pixelPos: PixelPosition): boolean {
        return (
            pixelPos.x >= GRID.PLAY_AREA_X &&
            pixelPos.x < GRID.PLAY_AREA_X + GRID.PLAY_AREA_WIDTH &&
            pixelPos.y >= GRID.PLAY_AREA_Y &&
            pixelPos.y < GRID.PLAY_AREA_Y + GRID.PLAY_AREA_HEIGHT
        );
    }

    // ========== Grid Line Rendering ==========

    /**
     * Show grid lines (call when dragging an object)
     */
    showGridLines(): void {
        if (this.gridGraphics) {
            this.gridGraphics.setVisible(true);
            this.gridVisible = true;
            return;
        }

        this.gridGraphics = this.scene.add.graphics();
        this.gridGraphics.lineStyle(UI.GRID_LINE_WIDTH, UI.GRID_LINE_COLOR, UI.GRID_LINE_ALPHA);

        // Draw vertical lines
        for (let col = 0; col <= GRID.COLS; col++) {
            const x = GRID.PLAY_AREA_X + col * GRID.CELL_SIZE;
            this.gridGraphics.lineBetween(
                x,
                GRID.PLAY_AREA_Y,
                x,
                GRID.PLAY_AREA_Y + GRID.PLAY_AREA_HEIGHT
            );
        }

        // Draw horizontal lines
        for (let row = 0; row <= GRID.ROWS; row++) {
            const y = GRID.PLAY_AREA_Y + row * GRID.CELL_SIZE;
            this.gridGraphics.lineBetween(
                GRID.PLAY_AREA_X,
                y,
                GRID.PLAY_AREA_X + GRID.PLAY_AREA_WIDTH,
                y
            );
        }

        this.gridVisible = true;
    }

    /**
     * Hide grid lines (call when not dragging)
     */
    hideGridLines(): void {
        if (this.gridGraphics) {
            this.gridGraphics.setVisible(false);
        }
        this.gridVisible = false;
    }

    /**
     * Check if grid lines are currently visible
     */
    isGridVisible(): boolean {
        return this.gridVisible;
    }

    // ========== Utility ==========

    /**
     * Clear all cell occupancy (e.g., when resetting level)
     */
    clear(): void {
        this.occupancy.clear();
    }

    /**
     * Get the total number of occupied cells
     */
    getOccupiedCellCount(): number {
        return this.occupancy.size;
    }

    /**
     * Destroy the grid and clean up resources
     */
    destroy(): void {
        if (this.gridGraphics) {
            this.gridGraphics.destroy();
            this.gridGraphics = null;
        }
        this.occupancy.clear();
    }
}
