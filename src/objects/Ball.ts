/**
 * Ball - The main dynamic object in the game
 *
 * Physics behavior:
 * - Heavy, bowling ball feel
 * - Subtle air drag
 * - Moderate bounce
 * - Rolls on surfaces
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getObjectConfig } from './ObjectRegistry';

export class Ball extends GameObject {
    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const config = getObjectConfig(ObjectType.BALL);
        super(scene, grid, ObjectType.BALL, gridPosition, config.size, options);
    }

    protected getLabel(): string {
        return 'BALL';
    }

    protected getColor(): number {
        return OBJECT_COLORS.BALL;
    }

    protected getRotationDirections(): number[] {
        return [0]; // Ball doesn't rotate (visually)
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const radius = GRID.CELL_SIZE / 2 - PHYSICS.BALL.RADIUS_OFFSET;

        this.body = this.scene.matter.add.circle(pos.x, pos.y, radius, {
            label: `ball_${this.id}`,
            mass: PHYSICS.BALL.MASS,
            friction: PHYSICS.BALL.FRICTION,
            frictionAir: PHYSICS.BALL.FRICTION_AIR,
            frictionStatic: PHYSICS.BALL.FRICTION_STATIC,
            restitution: PHYSICS.BALL.RESTITUTION,
            // Allow sleeping to be disabled for continuous simulation
            sleepThreshold: Infinity,
        });
    }

    protected render(): void {
        const pos = this.getPixelPosition();
        const radius = GRID.CELL_SIZE / 2 - PHYSICS.BALL.RADIUS_OFFSET;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Draw filled circle
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.fillCircle(pos.x, pos.y, radius);

        // Draw outline for better visibility
        this.graphics.lineStyle(2, 0x003366, 1);
        this.graphics.strokeCircle(pos.x, pos.y, radius);

        // Add shine effect (small white arc)
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillCircle(pos.x - radius * 0.3, pos.y - radius * 0.3, radius * 0.2);

        // Create label
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Override update to sync graphics with physics body position
     */
    public update(_delta: number): void {
        if (this.body && this.graphics) {
            const bodyPos = this.body.position;

            // Clear and redraw at new position
            this.graphics.clear();

            const radius = GRID.CELL_SIZE / 2 - PHYSICS.BALL.RADIUS_OFFSET;

            // Draw filled circle
            this.graphics.fillStyle(this.getColor(), 1);
            this.graphics.fillCircle(bodyPos.x, bodyPos.y, radius);

            // Draw outline
            this.graphics.lineStyle(2, 0x003366, 1);
            this.graphics.strokeCircle(bodyPos.x, bodyPos.y, radius);

            // Shine effect
            this.graphics.fillStyle(0xffffff, 0.3);
            this.graphics.fillCircle(bodyPos.x - radius * 0.3, bodyPos.y - radius * 0.3, radius * 0.2);

            // Update label position
            if (this.label) {
                this.label.setPosition(bodyPos.x, bodyPos.y);
            }
        }
    }
}
