/**
 * Platform - Static rectangular barrier
 *
 * Physics behavior:
 * - Static body (doesn't move)
 * - Medium friction
 * - 2 orientations: horizontal (2x1) or vertical (1x2)
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getRotatedSize } from './ObjectRegistry';

export class Platform extends GameObject {
    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const rotation = options.rotation ?? 0;
        const size = getRotatedSize(ObjectType.PLATFORM, rotation);
        super(scene, grid, ObjectType.PLATFORM, gridPosition, size, options);
    }

    protected getLabel(): string {
        return 'PLAT';
    }

    protected getColor(): number {
        return OBJECT_COLORS.PLATFORM;
    }

    protected getRotationDirections(): number[] {
        return [0, 90]; // Horizontal or vertical
    }

    protected getSpriteKey(): string {
        return 'platform';
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height, {
            label: `platform_${this.id}`,
            isStatic: true,
            friction: PHYSICS.PLATFORM.FRICTION,
        });
    }

    protected render(): void {
        // Use sprite if available
        if (this.hasSpriteTexture()) {
            this.createSprite();
            this.renderFixedIndicator();
            return;
        }

        // Fallback to graphics rendering
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Draw filled rectangle
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.fillRect(
            pos.x - width / 2,
            pos.y - height / 2,
            width,
            height
        );

        // Draw darker border
        this.graphics.lineStyle(2, 0x3d2817, 1);
        this.graphics.strokeRect(
            pos.x - width / 2,
            pos.y - height / 2,
            width,
            height
        );

        // Add wood grain effect (horizontal lines)
        this.graphics.lineStyle(1, 0x4a3520, 0.3);
        const lineSpacing = 8;
        for (let y = pos.y - height / 2 + lineSpacing; y < pos.y + height / 2; y += lineSpacing) {
            this.graphics.lineBetween(
                pos.x - width / 2 + 2,
                y,
                pos.x + width / 2 - 2,
                y
            );
        }

        // Create label
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Override rotate to also update size and recreate body
     */
    rotate(): boolean {
        if (this._isFixed) return false;

        const directions = this.getRotationDirections();
        if (directions.length <= 1) return false;

        // Free current grid cells
        this.unregisterFromGrid();

        // Calculate new rotation and size
        const currentIndex = directions.indexOf(this._rotation);
        const nextIndex = (currentIndex + 1) % directions.length;
        this._rotation = directions[nextIndex];

        // Update size based on rotation
        const newSize = getRotatedSize(ObjectType.PLATFORM, this._rotation);
        this._size = newSize;

        // Check if new size fits at current position
        if (!this.grid.canPlaceObject(this._gridPosition, this._size)) {
            // Revert rotation
            this._rotation = directions[currentIndex];
            this._size = getRotatedSize(ObjectType.PLATFORM, this._rotation);
            this.registerWithGrid();
            return false;
        }

        // Re-register with new size
        this.registerWithGrid();

        // Recreate physics body with new dimensions
        if (this.body && this.scene.matter) {
            this.scene.matter.world.remove(this.body);
            this.body = null;
        }
        this.createBody();

        // Update visuals
        this.updateVisuals();

        return true;
    }
}
