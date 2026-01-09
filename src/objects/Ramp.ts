/**
 * Ramp - Static 45-degree angled surface
 *
 * Physics behavior:
 * - Static body
 * - Low friction for smooth rolling
 * - 4 rotation directions for different slope orientations
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getObjectConfig } from './ObjectRegistry';

export class Ramp extends GameObject {
    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const config = getObjectConfig(ObjectType.RAMP);
        super(scene, grid, ObjectType.RAMP, gridPosition, config.size, options);
    }

    protected getLabel(): string {
        return 'RAMP';
    }

    protected getColor(): number {
        return OBJECT_COLORS.RAMP;
    }

    protected getRotationDirections(): number[] {
        return [0, 180]; // 2 states: horizontal mirror only
    }

    protected getSpriteKey(): string {
        return 'ramp';
    }

    /**
     * Get triangle vertices based on rotation
     * Returns vertices relative to center point
     * Only 2 states: horizontal mirror (slopes left or right)
     */
    private getTriangleVertices(): { x: number; y: number }[] {
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;
        const halfW = width / 2;
        const halfH = height / 2;

        switch (this._rotation) {
            case 0: // Slopes down-right: \ shape (ball rolls right)
                return [
                    { x: -halfW, y: -halfH }, // Top-left
                    { x: -halfW, y: halfH },  // Bottom-left
                    { x: halfW, y: halfH },   // Bottom-right
                ];
            case 180: // Slopes down-left: / shape (ball rolls left)
                return [
                    { x: halfW, y: -halfH },  // Top-right
                    { x: -halfW, y: halfH },  // Bottom-left
                    { x: halfW, y: halfH },   // Bottom-right
                ];
            default: // Fallback to state 0
                return [
                    { x: -halfW, y: -halfH },
                    { x: -halfW, y: halfH },
                    { x: halfW, y: halfH },
                ];
        }
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const vertices = this.getTriangleVertices();

        // Convert to absolute positions for Matter.js
        const absVertices = vertices.map(v => ({
            x: pos.x + v.x,
            y: pos.y + v.y,
        }));

        this.body = this.scene.matter.add.fromVertices(
            pos.x,
            pos.y,
            [absVertices],
            {
                label: `ramp_${this.id}`,
                isStatic: true,
                friction: PHYSICS.RAMP.FRICTION,
            }
        );

        // Matter.js may reposition the body based on center of mass
        // Force it to our desired position
        if (this.body) {
            this.scene.matter.body.setPosition(this.body, pos);
        }
    }

    /**
     * Override createSprite to use horizontal flip instead of rotation
     */
    protected createSprite(): void {
        const key = this.getSpriteKey();
        if (!key || !this.scene.textures.exists(key)) return;

        const pos = this.getPixelPosition();
        this.sprite = this.scene.add.sprite(pos.x, pos.y, key);
        // Use horizontal flip for mirroring instead of rotation
        this.sprite.setFlipX(this._rotation === 180);
        this.sprite.setDepth(5);
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
        const vertices = this.getTriangleVertices();

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Draw filled triangle
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.beginPath();
        this.graphics.moveTo(pos.x + vertices[0].x, pos.y + vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            this.graphics.lineTo(pos.x + vertices[i].x, pos.y + vertices[i].y);
        }
        this.graphics.closePath();
        this.graphics.fillPath();

        // Draw outline
        this.graphics.lineStyle(2, 0x5c3317, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(pos.x + vertices[0].x, pos.y + vertices[0].y);
        for (let i = 1; i < vertices.length; i++) {
            this.graphics.lineTo(pos.x + vertices[i].x, pos.y + vertices[i].y);
        }
        this.graphics.closePath();
        this.graphics.strokePath();

        // Create label
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Override rotate to recreate physics body with new shape
     */
    rotate(): boolean {
        if (this._isFixed) return false;

        const directions = this.getRotationDirections();
        if (directions.length <= 1) return false;

        const currentIndex = directions.indexOf(this._rotation);
        const nextIndex = (currentIndex + 1) % directions.length;
        this._rotation = directions[nextIndex];

        // Recreate physics body with new triangle orientation
        if (this.body && this.scene.matter) {
            this.scene.matter.world.remove(this.body);
            this.body = null;
        }
        this.createBody();

        // Update sprite with horizontal flip instead of rotation
        if (this.sprite) {
            this.sprite.setFlipX(this._rotation === 180);
        } else {
            // Update graphics visuals
            this.updateVisuals();
        }

        return true;
    }
}
