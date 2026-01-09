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
        return [0, 90, 180, 270]; // 4 slope directions
    }

    /**
     * Get triangle vertices based on rotation
     * Returns vertices relative to center point
     */
    private getTriangleVertices(): { x: number; y: number }[] {
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;
        const halfW = width / 2;
        const halfH = height / 2;

        // Base triangle (0°): slopes up-right
        // Bottom-left, Bottom-right, Top-right
        switch (this._rotation) {
            case 0: // Slopes up-right (ball rolls down-left)
                return [
                    { x: -halfW, y: halfH },  // Bottom-left
                    { x: halfW, y: halfH },   // Bottom-right
                    { x: halfW, y: -halfH },  // Top-right
                ];
            case 90: // Slopes down-right (ball rolls down-right)
                return [
                    { x: -halfW, y: -halfH }, // Top-left
                    { x: halfW, y: halfH },   // Bottom-right
                    { x: -halfW, y: halfH },  // Bottom-left
                ];
            case 180: // Slopes down-left (ball rolls down-right)
                return [
                    { x: -halfW, y: -halfH }, // Top-left
                    { x: halfW, y: halfH },   // Bottom-right
                    { x: -halfW, y: halfH },  // Bottom-left
                ];
            case 270: // Slopes up-left (ball rolls down-right)
                return [
                    { x: halfW, y: -halfH },  // Top-right
                    { x: halfW, y: halfH },   // Bottom-right
                    { x: -halfW, y: halfH },  // Bottom-left
                ];
            default:
                return [
                    { x: -halfW, y: halfH },
                    { x: halfW, y: halfH },
                    { x: halfW, y: -halfH },
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

    protected render(): void {
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

        // Update visuals
        this.updateVisuals();

        return true;
    }
}
