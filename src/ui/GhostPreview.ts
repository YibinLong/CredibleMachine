/**
 * GhostPreview - Visual preview during drag-and-drop placement
 *
 * Features:
 * - Shows where object will be placed
 * - Snaps to grid cells
 * - Green when placement is valid
 * - Red when placement is invalid (occupied or out of bounds)
 */

import { Scene, GameObjects } from 'phaser';
import { ObjectType, GridPosition, ObjectSize } from '../types';
import { GRID, OBJECT_COLORS } from '../utils/Constants';
import { OBJECT_CONFIGS, getRotatedSize } from '../objects/ObjectRegistry';
import { Grid } from '../utils/Grid';

export class GhostPreview extends GameObjects.Graphics {
    private objectType: ObjectType | null = null;
    private _currentRotation: number = 0;
    private currentSize: ObjectSize = { cols: 1, rows: 1 };
    private grid: Grid;
    private _isValid: boolean = false;
    private _gridPosition: GridPosition = { col: 0, row: 0 };

    // Colors
    private static readonly VALID_COLOR = 0x00ff00;
    private static readonly VALID_ALPHA = 0.4;
    private static readonly INVALID_COLOR = 0xff0000;
    private static readonly INVALID_ALPHA = 0.4;
    private static readonly BORDER_ALPHA = 0.8;

    constructor(scene: Scene, grid: Grid) {
        super(scene);
        this.grid = grid;
        this.setDepth(100); // Above other objects
        this.setVisible(false);
    }

    /**
     * Start showing preview for an object type
     */
    startPreview(objectType: ObjectType, rotation: number = 0): void {
        this.objectType = objectType;
        this._currentRotation = rotation;
        this.currentSize = getRotatedSize(objectType, rotation);
        this.setVisible(true);
    }

    /**
     * Stop showing preview
     */
    stopPreview(): void {
        this.objectType = null;
        this.setVisible(false);
        this.clear();
    }

    /**
     * Update preview position based on pointer position
     */
    updatePosition(pointerX: number, pointerY: number): void {
        if (!this.objectType) return;

        // Convert pointer to grid position
        const gridPos = this.grid.pixelToCell({ x: pointerX, y: pointerY });

        // Adjust for object size (center on cursor)
        const adjustedPos: GridPosition = {
            col: gridPos.col - Math.floor(this.currentSize.cols / 2),
            row: gridPos.row - Math.floor(this.currentSize.rows / 2),
        };

        // Clamp to grid bounds
        adjustedPos.col = Math.max(0, Math.min(adjustedPos.col, GRID.COLS - this.currentSize.cols));
        adjustedPos.row = Math.max(0, Math.min(adjustedPos.row, GRID.ROWS - this.currentSize.rows));

        this._gridPosition = adjustedPos;

        // Check if placement is valid
        this._isValid = this.grid.canPlaceObject(adjustedPos, this.currentSize);

        // Redraw at new position
        this.redraw();
    }

    /**
     * Rotate the preview
     */
    rotatePreview(): void {
        if (!this.objectType) return;

        const config = OBJECT_CONFIGS[this.objectType];
        const rotations = config.rotations;

        if (rotations.length <= 1) return;

        const currentIndex = rotations.indexOf(this._currentRotation);
        const nextIndex = (currentIndex + 1) % rotations.length;
        this._currentRotation = rotations[nextIndex];

        // Update size for new rotation
        this.currentSize = getRotatedSize(this.objectType, this._currentRotation);
    }

    /**
     * Get current grid position
     */
    get gridPosition(): GridPosition {
        return { ...this._gridPosition };
    }

    /**
     * Get current rotation
     */
    get currentRotation(): number {
        return this._currentRotation;
    }

    /**
     * Check if current position is valid for placement
     */
    get isValid(): boolean {
        return this._isValid;
    }

    /**
     * Redraw the ghost preview
     */
    private redraw(): void {
        this.clear();

        if (!this.objectType) return;

        const pixelPos = this.grid.cellToPixel(this._gridPosition);
        const width = this.currentSize.cols * GRID.CELL_SIZE;
        const height = this.currentSize.rows * GRID.CELL_SIZE;

        const color = this._isValid ? GhostPreview.VALID_COLOR : GhostPreview.INVALID_COLOR;
        const alpha = this._isValid ? GhostPreview.VALID_ALPHA : GhostPreview.INVALID_ALPHA;

        // Fill
        this.fillStyle(color, alpha);
        this.fillRect(pixelPos.x, pixelPos.y, width, height);

        // Border
        this.lineStyle(2, color, GhostPreview.BORDER_ALPHA);
        this.strokeRect(pixelPos.x, pixelPos.y, width, height);

        // Draw object-specific shape hint
        this.drawObjectHint(pixelPos.x, pixelPos.y, width, height);
    }

    /**
     * Draw a hint of what the object looks like
     */
    private drawObjectHint(x: number, y: number, width: number, height: number): void {
        if (!this.objectType) return;

        const objectColor = this.getObjectColor(this.objectType);
        const alpha = this._isValid ? 0.6 : 0.3;

        this.fillStyle(objectColor, alpha);

        switch (this.objectType) {
            case ObjectType.BALL:
                // Circle
                this.fillCircle(
                    x + width / 2,
                    y + height / 2,
                    Math.min(width, height) / 2 - 4
                );
                break;

            case ObjectType.RAMP:
                // Triangle indicating slope direction
                this.drawRampHint(x, y, width, height);
                break;

            case ObjectType.BASKET:
                // U-shape
                this.drawBasketHint(x, y, width, height);
                break;

            default:
                // Simple rectangle for other objects
                const padding = 4;
                this.fillRect(
                    x + padding,
                    y + padding,
                    width - padding * 2,
                    height - padding * 2
                );
        }
    }

    /**
     * Draw ramp direction hint
     */
    private drawRampHint(x: number, y: number, width: number, height: number): void {
        const padding = 4;
        const left = x + padding;
        const right = x + width - padding;
        const top = y + padding;
        const bottom = y + height - padding;

        this.beginPath();

        // Draw triangle based on rotation
        switch (this._currentRotation) {
            case 0: // Down-right slope
                this.moveTo(left, bottom);
                this.lineTo(right, bottom);
                this.lineTo(right, top);
                break;
            case 90: // Down-left slope
                this.moveTo(left, top);
                this.lineTo(left, bottom);
                this.lineTo(right, bottom);
                break;
            case 180: // Up-right slope
                this.moveTo(left, top);
                this.lineTo(right, top);
                this.lineTo(left, bottom);
                break;
            case 270: // Up-left slope
                this.moveTo(left, top);
                this.lineTo(right, top);
                this.lineTo(right, bottom);
                break;
        }

        this.closePath();
        this.fillPath();
    }

    /**
     * Draw basket U-shape hint
     */
    private drawBasketHint(x: number, y: number, width: number, height: number): void {
        const padding = 8;
        const wallThickness = 12;
        const left = x + padding;
        const right = x + width - padding;
        const top = y + padding;
        const bottom = y + height - padding;

        // Left wall
        this.fillRect(left, top, wallThickness, height - padding * 2);
        // Right wall
        this.fillRect(right - wallThickness, top, wallThickness, height - padding * 2);
        // Bottom
        this.fillRect(left, bottom - wallThickness, width - padding * 2, wallThickness);
    }

    /**
     * Get color for object type
     */
    private getObjectColor(type: ObjectType): number {
        const colors: Record<ObjectType, number> = {
            [ObjectType.BALL]: OBJECT_COLORS.BALL,
            [ObjectType.RAMP]: OBJECT_COLORS.RAMP,
            [ObjectType.PLATFORM]: OBJECT_COLORS.PLATFORM,
            [ObjectType.BASKET]: OBJECT_COLORS.BASKET,
            [ObjectType.SEESAW]: OBJECT_COLORS.SEESAW,
            [ObjectType.TRAMPOLINE]: OBJECT_COLORS.TRAMPOLINE,
            [ObjectType.DOMINO]: OBJECT_COLORS.DOMINO,
            [ObjectType.FAN]: OBJECT_COLORS.FAN,
            [ObjectType.PRESSURE_PLATE]: OBJECT_COLORS.PRESSURE_PLATE,
        };
        return colors[type] || 0xffffff;
    }
}
