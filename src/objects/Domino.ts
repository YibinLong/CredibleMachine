/**
 * Domino - Tippable dynamic object for chain reactions
 *
 * Physics behavior:
 * - Dynamic body (affected by physics)
 * - Hair-trigger sensitivity (tips easily)
 * - Can knock ball and other dominoes
 * - Tall and thin shape
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getRotatedSize } from './ObjectRegistry';

export class Domino extends GameObject {
    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const rotation = options.rotation ?? 0;
        const size = getRotatedSize(ObjectType.DOMINO, rotation);
        super(scene, grid, ObjectType.DOMINO, gridPosition, size, options);
    }

    protected getLabel(): string {
        return 'DOM';
    }

    protected getColor(): number {
        return OBJECT_COLORS.DOMINO;
    }

    protected getRotationDirections(): number[] {
        return [0, 90]; // Standing or lying
    }

    protected getSpriteKey(): string {
        return 'domino';
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();

        // Domino is thin and tall (or wide if rotated)
        // Make it thinner than the grid cell for better physics
        let width: number;
        let height: number;

        if (this._rotation === 0) {
            // Standing (1x2): thin and tall
            width = GRID.CELL_SIZE * 0.3;
            height = this._size.rows * GRID.CELL_SIZE - 8;
        } else {
            // Lying (2x1): wide and thin
            width = this._size.cols * GRID.CELL_SIZE - 8;
            height = GRID.CELL_SIZE * 0.3;
        }

        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height, {
            label: `domino_${this.id}`,
            mass: PHYSICS.DOMINO.MASS,
            friction: PHYSICS.DOMINO.FRICTION,
            frictionStatic: PHYSICS.DOMINO.FRICTION_STATIC,
            frictionAir: PHYSICS.DOMINO.FRICTION_AIR,
            sleepThreshold: Infinity,
        });

        // Set low inertia after creation for easier tipping
        if (this.body) {
            this.scene.matter.body.setInertia(this.body, 50);
        }
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

        // Visual size matches grid cells
        const width = this._size.cols * GRID.CELL_SIZE - 8;
        const height = this._size.rows * GRID.CELL_SIZE - 8;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Get body angle for rotation
        const angle = this.body ? this.body.angle : 0;

        // Save graphics state
        this.graphics.save();
        this.graphics.translateCanvas(pos.x, pos.y);
        this.graphics.rotateCanvas(angle);

        // Draw filled rectangle (centered at origin after translation)
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.fillRect(-width / 2, -height / 2, width, height);

        // Draw border
        this.graphics.lineStyle(2, 0xcccccc, 1);
        this.graphics.strokeRect(-width / 2, -height / 2, width, height);

        // Draw dots pattern (like a real domino)
        this.graphics.fillStyle(0x000000, 0.8);
        const dotRadius = 3;
        const dotSpacing = Math.min(width, height) * 0.25;

        if (height > width) {
            // Vertical domino - dots arranged vertically
            this.graphics.fillCircle(0, -dotSpacing, dotRadius);
            this.graphics.fillCircle(0, 0, dotRadius);
            this.graphics.fillCircle(0, dotSpacing, dotRadius);
        } else {
            // Horizontal domino - dots arranged horizontally
            this.graphics.fillCircle(-dotSpacing, 0, dotRadius);
            this.graphics.fillCircle(0, 0, dotRadius);
            this.graphics.fillCircle(dotSpacing, 0, dotRadius);
        }

        // Restore graphics state
        this.graphics.restore();

        // Create label (at original position)
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Override update to sync visuals with physics body
     */
    public update(_delta: number): void {
        if (!this.body) return;

        const bodyPos = this.body.position;
        const angle = this.body.angle;

        // Sync sprite with physics body
        if (this.sprite) {
            this.sprite.setPosition(bodyPos.x, bodyPos.y);
            this.sprite.setRotation(angle);
            return;
        }

        // Fallback: sync graphics with physics body
        if (this.graphics) {
            this.graphics.clear();

            const width = this._size.cols * GRID.CELL_SIZE - 8;
            const height = this._size.rows * GRID.CELL_SIZE - 8;

            this.graphics.save();
            this.graphics.translateCanvas(bodyPos.x, bodyPos.y);
            this.graphics.rotateCanvas(angle);

            // Draw filled rectangle
            this.graphics.fillStyle(this.getColor(), 1);
            this.graphics.fillRect(-width / 2, -height / 2, width, height);

            // Draw border
            this.graphics.lineStyle(2, 0xcccccc, 1);
            this.graphics.strokeRect(-width / 2, -height / 2, width, height);

            // Draw dots
            this.graphics.fillStyle(0x000000, 0.8);
            const dotRadius = 3;
            const dotSpacing = Math.min(width, height) * 0.25;

            if (height > width) {
                this.graphics.fillCircle(0, -dotSpacing, dotRadius);
                this.graphics.fillCircle(0, 0, dotRadius);
                this.graphics.fillCircle(0, dotSpacing, dotRadius);
            } else {
                this.graphics.fillCircle(-dotSpacing, 0, dotRadius);
                this.graphics.fillCircle(0, 0, dotRadius);
                this.graphics.fillCircle(dotSpacing, 0, dotRadius);
            }

            this.graphics.restore();

            // Update label position
            if (this.label) {
                this.label.setPosition(bodyPos.x, bodyPos.y);
            }
        }
    }

    /**
     * Override rotate to update size and recreate body
     */
    rotate(): boolean {
        if (this._isFixed) return false;

        const directions = this.getRotationDirections();
        if (directions.length <= 1) return false;

        this.unregisterFromGrid();

        const currentIndex = directions.indexOf(this._rotation);
        const nextIndex = (currentIndex + 1) % directions.length;
        this._rotation = directions[nextIndex];

        const newSize = getRotatedSize(ObjectType.DOMINO, this._rotation);
        this._size = newSize;

        if (!this.grid.canPlaceObject(this._gridPosition, this._size)) {
            this._rotation = directions[currentIndex];
            this._size = getRotatedSize(ObjectType.DOMINO, this._rotation);
            this.registerWithGrid();
            return false;
        }

        this.registerWithGrid();

        if (this.body && this.scene.matter) {
            this.scene.matter.world.remove(this.body);
            this.body = null;
        }
        this.createBody();
        this.updateVisuals();

        return true;
    }
}
