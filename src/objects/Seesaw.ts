/**
 * Seesaw - Pivoting platform for catapult mechanics
 *
 * Physics behavior:
 * - Static body that rotates around center pivot
 * - Limited to ±45° tilt
 * - Can catapult objects when tilted quickly
 * - Uses simpler rotation approach (angle limits + torque)
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getRotatedSize } from './ObjectRegistry';

export class Seesaw extends GameObject {
    private currentAngle: number = 0; // Current tilt angle in radians
    private angularVelocity: number = 0;
    private objectsOnSeesaw: Map<string, { x: number; mass: number }> = new Map();

    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const rotation = options.rotation ?? 0;
        const size = getRotatedSize(ObjectType.SEESAW, rotation);
        super(scene, grid, ObjectType.SEESAW, gridPosition, size, options);
    }

    protected getLabel(): string {
        return 'SEESAW';
    }

    protected getColor(): number {
        return OBJECT_COLORS.SEESAW;
    }

    protected getRotationDirections(): number[] {
        return [0, 90]; // Horizontal or vertical orientation
    }

    protected getSpriteKey(): string {
        return 'seesaw';
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        // Seesaw body is initially flat
        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height * 0.3, {
            label: `seesaw_${this.id}`,
            isStatic: true,
            friction: 0.5,
        });

        // Set up collision detection for weight distribution
        this.setupCollisionTracking();
    }

    /**
     * Set up collision detection to track objects on the seesaw
     */
    private setupCollisionTracking(): void {
        // Track collision start
        this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            for (const pair of event.pairs) {
                this.handleCollision(pair, true);
            }
        });

        // Track collision end
        this.scene.matter.world.on('collisionend', (event: Phaser.Physics.Matter.Events.CollisionEndEvent) => {
            for (const pair of event.pairs) {
                this.handleCollision(pair, false);
            }
        });

        // Track active collisions for position updates
        this.scene.matter.world.on('collisionactive', (event: Phaser.Physics.Matter.Events.CollisionActiveEvent) => {
            for (const pair of event.pairs) {
                this.updateObjectPosition(pair);
            }
        });
    }

    /**
     * Handle collision start/end
     */
    private handleCollision(pair: MatterJS.Pair, isStart: boolean): void {
        // Access bodies from the pair (Matter.js collision pair structure)
        const pairAny = pair as { bodyA: MatterJS.BodyType; bodyB: MatterJS.BodyType };
        const bodyA = pairAny.bodyA;
        const bodyB = pairAny.bodyB;

        const isSeesawA = bodyA.label === `seesaw_${this.id}`;
        const isSeesawB = bodyB.label === `seesaw_${this.id}`;

        if (!isSeesawA && !isSeesawB) return;

        const otherBody = isSeesawA ? bodyB : bodyA;

        // Only track dynamic bodies (ball, domino)
        if (otherBody.isStatic) return;

        if (isStart) {
            this.objectsOnSeesaw.set(otherBody.label, {
                x: otherBody.position.x,
                mass: otherBody.mass || 1,
            });
        } else {
            this.objectsOnSeesaw.delete(otherBody.label);
        }
    }

    /**
     * Update tracked object position during active collision
     */
    private updateObjectPosition(pair: MatterJS.Pair): void {
        // Access bodies from the pair
        const pairAny = pair as { bodyA: MatterJS.BodyType; bodyB: MatterJS.BodyType };
        const bodyA = pairAny.bodyA;
        const bodyB = pairAny.bodyB;

        const isSeesawA = bodyA.label === `seesaw_${this.id}`;
        const isSeesawB = bodyB.label === `seesaw_${this.id}`;

        if (!isSeesawA && !isSeesawB) return;

        const otherBody = isSeesawA ? bodyB : bodyA;

        if (this.objectsOnSeesaw.has(otherBody.label)) {
            this.objectsOnSeesaw.set(otherBody.label, {
                x: otherBody.position.x,
                mass: otherBody.mass || 1,
            });
        }
    }

    /**
     * Calculate torque based on objects on the seesaw
     */
    private calculateTorque(): number {
        const pivotX = this.getPixelPosition().x;
        let totalTorque = 0;

        this.objectsOnSeesaw.forEach((obj) => {
            const leverArm = obj.x - pivotX;
            const torque = leverArm * obj.mass * PHYSICS.SEESAW.TORQUE_MULTIPLIER;
            totalTorque += torque;
        });

        return totalTorque;
    }

    protected render(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;
        const boardHeight = height * 0.3;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Save state and apply rotation around pivot
        this.graphics.save();
        this.graphics.translateCanvas(pos.x, pos.y);
        this.graphics.rotateCanvas(this.currentAngle);

        // Draw seesaw board
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.fillRect(-width / 2, -boardHeight / 2, width, boardHeight);

        // Draw border
        this.graphics.lineStyle(2, 0x555555, 1);
        this.graphics.strokeRect(-width / 2, -boardHeight / 2, width, boardHeight);

        // Draw wood grain
        this.graphics.lineStyle(1, 0x666666, 0.3);
        for (let x = -width / 2 + 20; x < width / 2; x += 20) {
            this.graphics.lineBetween(x, -boardHeight / 2 + 2, x, boardHeight / 2 - 2);
        }

        this.graphics.restore();

        // Draw pivot (triangle base) - not rotated
        const pivotSize = 12;
        this.graphics.fillStyle(0x444444, 1);
        this.graphics.beginPath();
        this.graphics.moveTo(pos.x - pivotSize, pos.y + boardHeight / 2 + pivotSize);
        this.graphics.lineTo(pos.x + pivotSize, pos.y + boardHeight / 2 + pivotSize);
        this.graphics.lineTo(pos.x, pos.y + boardHeight / 2);
        this.graphics.closePath();
        this.graphics.fillPath();

        // Draw pivot point indicator
        this.graphics.fillStyle(0x222222, 1);
        this.graphics.fillCircle(pos.x, pos.y, 4);

        // Create label
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Update seesaw physics and visuals each frame
     */
    public update(delta: number): void {
        if (this._isDestroyed) return;

        // Calculate torque from objects on seesaw
        const torque = this.calculateTorque();

        // Apply torque to angular velocity
        this.angularVelocity += torque * (delta / 1000);

        // Apply damping
        this.angularVelocity *= (1 - PHYSICS.SEESAW.ANGULAR_DAMPING);

        // Update angle
        this.currentAngle += this.angularVelocity * (delta / 1000);

        // Clamp to max angle
        const maxAngleRad = (PHYSICS.SEESAW.MAX_ANGLE * Math.PI) / 180;
        this.currentAngle = Math.max(-maxAngleRad, Math.min(maxAngleRad, this.currentAngle));

        // Stop at limits
        if (Math.abs(this.currentAngle) >= maxAngleRad * 0.99) {
            this.angularVelocity = 0;
        }

        // Update physics body angle
        if (this.body && this.scene.matter) {
            this.scene.matter.body.setAngle(this.body, this.currentAngle);
        }

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
     * Override rotate to update orientation
     */
    rotate(): boolean {
        if (this._isFixed) return false;

        const directions = this.getRotationDirections();
        if (directions.length <= 1) return false;

        this.unregisterFromGrid();

        const currentIndex = directions.indexOf(this._rotation);
        const nextIndex = (currentIndex + 1) % directions.length;
        this._rotation = directions[nextIndex];

        const newSize = getRotatedSize(ObjectType.SEESAW, this._rotation);
        this._size = newSize;

        if (!this.grid.canPlaceObject(this._gridPosition, this._size)) {
            this._rotation = directions[currentIndex];
            this._size = getRotatedSize(ObjectType.SEESAW, this._rotation);
            this.registerWithGrid();
            return false;
        }

        this.registerWithGrid();

        // Reset seesaw state
        this.currentAngle = 0;
        this.angularVelocity = 0;
        this.objectsOnSeesaw.clear();

        if (this.body && this.scene.matter) {
            this.scene.matter.world.remove(this.body);
            this.body = null;
        }
        this.createBody();
        this.updateVisuals();

        return true;
    }

    /**
     * Reset the seesaw to initial state
     */
    public reset(): void {
        this.currentAngle = 0;
        this.angularVelocity = 0;
        this.objectsOnSeesaw.clear();

        if (this.body && this.scene.matter) {
            this.scene.matter.body.setAngle(this.body, 0);
        }

        this.updateVisuals();
    }
}
