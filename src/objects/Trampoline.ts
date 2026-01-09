/**
 * Trampoline - Bouncy surface that adds energy
 *
 * Physics behavior:
 * - Static body
 * - High restitution (>1.0) to add energy on bounce
 * - Ball bounces higher than drop height
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, PHYSICS, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getRotatedSize } from './ObjectRegistry';

export class Trampoline extends GameObject {
    private bounceEffectTime: number = 0;

    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const rotation = options.rotation ?? 0;
        const size = getRotatedSize(ObjectType.TRAMPOLINE, rotation);
        super(scene, grid, ObjectType.TRAMPOLINE, gridPosition, size, options);
    }

    protected getLabel(): string {
        return 'TRAMP';
    }

    protected getColor(): number {
        return OBJECT_COLORS.TRAMPOLINE;
    }

    protected getRotationDirections(): number[] {
        return [0, 90]; // Horizontal or vertical
    }

    protected getSpriteKey(): string {
        return 'trampoline';
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height, {
            label: `trampoline_${this.id}`,
            isStatic: true,
            restitution: PHYSICS.TRAMPOLINE.RESTITUTION,
            friction: PHYSICS.TRAMPOLINE.FRICTION,
        });

        // Set up collision detection for bounce effect
        this.setupBounceEffect();
    }

    /**
     * Set up collision detection for bounce effect with active impulse
     */
    private setupBounceEffect(): void {
        this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            for (const pair of event.pairs) {
                const { bodyA, bodyB } = pair;

                const isTrampA = bodyA.label === `trampoline_${this.id}`;
                const isTrampB = bodyB.label === `trampoline_${this.id}`;

                if (!isTrampA && !isTrampB) continue;

                const otherBody = isTrampA ? bodyB : bodyA;

                // Apply bounce force and visual effect on collision with dynamic objects
                if (otherBody.label && (otherBody.label.startsWith('ball_') || otherBody.label.startsWith('domino_'))) {
                    this.triggerBounceEffect();

                    // Apply active upward impulse to make the bounce more pronounced
                    // Get incoming velocity and reflect it with amplification
                    const velocityY = otherBody.velocity.y;
                    const bounceMultiplier = 1.5; // Bounce higher than drop

                    // Only apply if object is moving downward (hitting from above)
                    if (velocityY > 0) {
                        const newVelocityY = -velocityY * bounceMultiplier;
                        this.scene.matter.body.setVelocity(otherBody, {
                            x: otherBody.velocity.x,
                            y: newVelocityY
                        });
                    }
                }
            }
        });
    }

    /**
     * Trigger visual bounce effect
     */
    private triggerBounceEffect(): void {
        this.bounceEffectTime = 200; // ms
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

        const effectAlpha = this.bounceEffectTime > 0 ? 0.5 : 0;

        // Draw base
        this.graphics.fillStyle(0x006666, 1);
        this.graphics.fillRect(
            pos.x - width / 2,
            pos.y - height / 2,
            width,
            height
        );

        // Draw bouncy surface (top portion)
        const surfaceHeight = Math.min(height * 0.4, 16);
        this.graphics.fillStyle(this.getColor(), 1);
        this.graphics.fillRect(
            pos.x - width / 2,
            pos.y - height / 2,
            width,
            surfaceHeight
        );

        // Draw springs (zigzag pattern)
        this.graphics.lineStyle(2, 0x00aaaa, 1);
        const springCount = Math.max(2, Math.floor(width / 30));
        const springWidth = width / springCount;

        for (let i = 0; i < springCount; i++) {
            const sx = pos.x - width / 2 + springWidth * i + springWidth / 2;
            const sy = pos.y - height / 2 + surfaceHeight;
            const eh = height - surfaceHeight - 4;

            // Draw spring coils
            this.graphics.beginPath();
            this.graphics.moveTo(sx, sy);
            const coils = 3;
            for (let c = 0; c <= coils; c++) {
                const cx = sx + (c % 2 === 0 ? -6 : 6);
                const cy = sy + (eh / coils) * c;
                this.graphics.lineTo(cx, cy);
            }
            this.graphics.strokePath();
        }

        // Draw bounce effect (flash)
        if (effectAlpha > 0) {
            this.graphics.fillStyle(0xffffff, effectAlpha);
            this.graphics.fillRect(
                pos.x - width / 2,
                pos.y - height / 2,
                width,
                surfaceHeight
            );
        }

        // Draw border
        this.graphics.lineStyle(2, 0x004444, 1);
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
     * Update visual effect
     */
    public update(delta: number): void {
        if (this.bounceEffectTime > 0) {
            this.bounceEffectTime -= delta;
            if (this.bounceEffectTime <= 0) {
                this.bounceEffectTime = 0;
                this.updateVisuals();
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

        const newSize = getRotatedSize(ObjectType.TRAMPOLINE, this._rotation);
        this._size = newSize;

        if (!this.grid.canPlaceObject(this._gridPosition, this._size)) {
            this._rotation = directions[currentIndex];
            this._size = getRotatedSize(ObjectType.TRAMPOLINE, this._rotation);
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
