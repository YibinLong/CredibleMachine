/**
 * Fan - Force applicator for pushing objects
 *
 * Physics behavior:
 * - Static body (doesn't move)
 * - Applies constant force in facing direction
 * - 5-cell range
 * - 4 rotation directions (up, right, down, left)
 * - Animated blade rotation and wind effect
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getObjectConfig } from './ObjectRegistry';

export class Fan extends GameObject {
    private isActive: boolean = true;
    private bladeAngle: number = 0;
    private windParticles: Array<{ x: number; y: number; life: number }> = [];
    private allObjects: GameObject[] = [];

    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const config = getObjectConfig(ObjectType.FAN);
        super(scene, grid, ObjectType.FAN, gridPosition, config.size, options);
    }

    protected getLabel(): string {
        return 'FAN';
    }

    protected getColor(): number {
        return OBJECT_COLORS.FAN;
    }

    protected getRotationDirections(): number[] {
        return [0, 90, 180, 270]; // Up, Right, Down, Left
    }

    /**
     * Get the force direction based on rotation
     */
    private getForceDirection(): { x: number; y: number } {
        switch (this._rotation) {
            case 0: return { x: 0, y: -1 };   // Up
            case 90: return { x: 1, y: 0 };   // Right
            case 180: return { x: 0, y: 1 };  // Down
            case 270: return { x: -1, y: 0 }; // Left
            default: return { x: 0, y: -1 };
        }
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        // Fan has a static body for collision
        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height, {
            label: `fan_${this.id}`,
            isStatic: true,
            isSensor: false, // Fan body blocks objects
        });
    }

    protected render(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Draw fan housing
        this.graphics.fillStyle(0x333333, 1);
        this.graphics.fillRect(
            pos.x - width / 2,
            pos.y - height / 2,
            width,
            height
        );

        // Draw fan grill
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.fillCircle(pos.x, pos.y, Math.min(width, height) / 2 - 8);

        // Draw fan blades (rotating)
        this.graphics.save();
        this.graphics.translateCanvas(pos.x, pos.y);
        this.graphics.rotateCanvas(this.bladeAngle);

        this.graphics.fillStyle(0x888888, 1);
        const bladeLength = Math.min(width, height) / 2 - 12;
        const bladeWidth = 8;

        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            this.graphics.save();
            this.graphics.rotateCanvas(angle);
            this.graphics.fillRect(-bladeWidth / 2, -2, bladeWidth, bladeLength);
            this.graphics.restore();
        }

        // Draw center hub
        this.graphics.fillStyle(0x444444, 1);
        this.graphics.fillCircle(0, 0, 8);

        this.graphics.restore();

        // Draw direction indicator
        const dir = this.getForceDirection();
        const indicatorLength = 20;
        const indicatorX = pos.x + dir.x * (width / 2 + indicatorLength / 2);
        const indicatorY = pos.y + dir.y * (height / 2 + indicatorLength / 2);

        this.graphics.lineStyle(3, this.isActive ? 0x00ff00 : 0x666666, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(pos.x + dir.x * width / 2, pos.y + dir.y * height / 2);
        this.graphics.lineTo(indicatorX, indicatorY);
        this.graphics.strokePath();

        // Draw wind particles if active
        if (this.isActive) {
            this.graphics.lineStyle(1, 0xaaaaff, 0.5);
            for (const particle of this.windParticles) {
                const lineLength = 10;
                this.graphics.lineBetween(
                    particle.x,
                    particle.y,
                    particle.x + dir.x * lineLength,
                    particle.y + dir.y * lineLength
                );
            }
        }

        // Draw border
        this.graphics.lineStyle(2, 0x222222, 1);
        this.graphics.strokeRect(
            pos.x - width / 2,
            pos.y - height / 2,
            width,
            height
        );

        // Create label
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Set the list of objects that can be affected by the fan
     */
    public setTargetObjects(objects: GameObject[]): void {
        this.allObjects = objects;
    }

    /**
     * Check if an object is within the fan's force range
     */
    private isInRange(objPos: { x: number; y: number }): boolean {
        const pos = this.getPixelPosition();
        const dir = this.getForceDirection();
        const range = PHYSICS.FAN.RANGE_CELLS * GRID.CELL_SIZE;
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        // Calculate the force cone/rectangle area
        if (dir.x !== 0) {
            // Horizontal fan
            const startX = pos.x + dir.x * width / 2;
            const endX = startX + dir.x * range;
            const minX = Math.min(startX, endX);
            const maxX = Math.max(startX, endX);

            return (
                objPos.x >= minX &&
                objPos.x <= maxX &&
                Math.abs(objPos.y - pos.y) < height / 2 + GRID.CELL_SIZE
            );
        } else {
            // Vertical fan
            const startY = pos.y + dir.y * height / 2;
            const endY = startY + dir.y * range;
            const minY = Math.min(startY, endY);
            const maxY = Math.max(startY, endY);

            return (
                objPos.y >= minY &&
                objPos.y <= maxY &&
                Math.abs(objPos.x - pos.x) < width / 2 + GRID.CELL_SIZE
            );
        }
    }

    /**
     * Apply wind force to objects in range
     */
    private applyWindForce(): void {
        if (!this.isActive) return;

        const dir = this.getForceDirection();
        const force = {
            x: dir.x * PHYSICS.FAN.FORCE_STRENGTH,
            y: dir.y * PHYSICS.FAN.FORCE_STRENGTH,
        };

        for (const obj of this.allObjects) {
            if (obj === this || obj.isDestroyed) continue;

            const body = obj.physicsBody;
            if (!body || body.isStatic) continue;

            const bodyPos = body.position;

            if (this.isInRange(bodyPos)) {
                // Calculate distance falloff
                const pos = this.getPixelPosition();
                const distance = Math.sqrt(
                    Math.pow(bodyPos.x - pos.x, 2) +
                    Math.pow(bodyPos.y - pos.y, 2)
                );
                const maxDistance = PHYSICS.FAN.RANGE_CELLS * GRID.CELL_SIZE;
                const falloff = 1 - (distance / maxDistance) * 0.5;

                // Apply force with falloff
                this.scene.matter.body.applyForce(body, bodyPos, {
                    x: force.x * falloff,
                    y: force.y * falloff,
                });
            }
        }
    }

    /**
     * Update wind particles
     */
    private updateWindParticles(delta: number): void {
        if (!this.isActive) {
            this.windParticles = [];
            return;
        }

        const pos = this.getPixelPosition();
        const dir = this.getForceDirection();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;
        const range = PHYSICS.FAN.RANGE_CELLS * GRID.CELL_SIZE;

        // Spawn new particles
        if (Math.random() < delta / 50) {
            const perpX = -dir.y;
            const perpY = dir.x;
            const spread = Math.min(width, height) / 2 - 10;

            this.windParticles.push({
                x: pos.x + dir.x * width / 2 + perpX * (Math.random() - 0.5) * spread * 2,
                y: pos.y + dir.y * height / 2 + perpY * (Math.random() - 0.5) * spread * 2,
                life: 1,
            });
        }

        // Update existing particles
        const speed = 200;
        this.windParticles = this.windParticles.filter((p) => {
            p.x += dir.x * speed * (delta / 1000);
            p.y += dir.y * speed * (delta / 1000);
            p.life -= delta / 500;

            // Check if particle is still in range
            const distFromFan =
                Math.abs((p.x - pos.x) * dir.x) + Math.abs((p.y - pos.y) * dir.y);
            return p.life > 0 && distFromFan < range;
        });
    }

    /**
     * Update fan animation and physics
     */
    public update(delta: number): void {
        if (this._isDestroyed) return;

        // Rotate blades
        if (this.isActive) {
            this.bladeAngle += delta * 0.01; // Slow rotation
        }

        // Update wind particles
        this.updateWindParticles(delta);

        // Apply wind force
        this.applyWindForce();

        // Redraw
        if (this.graphics) {
            this.graphics.clear();
            if (this.label) {
                this.label.destroy();
                this.label = null;
            }
            this.render();
        }
    }

    /**
     * Activate or deactivate the fan
     */
    public setActive(active: boolean): void {
        this.isActive = active;
    }

    /**
     * Check if the fan is active
     */
    public getIsActive(): boolean {
        return this.isActive;
    }

    /**
     * Handle trigger from pressure plate
     */
    public onTrigger(): void {
        // Toggle fan state when triggered
        this.isActive = !this.isActive;
    }

    /**
     * Override rotate to handle direction change
     */
    rotate(): boolean {
        if (this._isFixed) return false;

        const result = super.rotate();
        if (result) {
            // Clear wind particles on rotation
            this.windParticles = [];
        }
        return result;
    }
}
