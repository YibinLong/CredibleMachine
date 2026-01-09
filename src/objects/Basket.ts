/**
 * Basket - Win condition sensor
 *
 * Physics behavior:
 * - Static sensor (no physical collision)
 * - Triggers victory when ball contacts it
 * - Any contact direction counts
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getObjectConfig } from './ObjectRegistry';

export class Basket extends GameObject {
    private isTriggered: boolean = false;

    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const config = getObjectConfig(ObjectType.BASKET);
        super(scene, grid, ObjectType.BASKET, gridPosition, config.size, options);
    }

    protected getLabel(): string {
        return 'GOAL';
    }

    protected getColor(): number {
        return OBJECT_COLORS.BASKET;
    }

    protected getRotationDirections(): number[] {
        return [0]; // Basket doesn't rotate
    }

    protected getSpriteKey(): string {
        return 'basket';
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height, {
            label: `basket_${this.id}`,
            isStatic: true,
            isSensor: true, // No physical collision, only triggers events
        });

        // Set up collision detection for win condition
        this.setupCollisionDetection();
    }

    /**
     * Set up collision detection for the basket sensor
     */
    private setupCollisionDetection(): void {
        this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            for (const pair of event.pairs) {
                const { bodyA, bodyB } = pair;

                // Check if one body is this basket and the other is a ball
                const isBasketA = bodyA.label === `basket_${this.id}`;
                const isBasketB = bodyB.label === `basket_${this.id}`;

                if (!isBasketA && !isBasketB) continue;

                const otherBody = isBasketA ? bodyB : bodyA;

                // Check if the other body is a ball
                if (otherBody.label && otherBody.label.startsWith('ball_')) {
                    this.handleBallContact();
                }
            }
        });
    }

    /**
     * Handle ball contact - trigger victory
     */
    private handleBallContact(): void {
        if (this.isTriggered) return;
        this.isTriggered = true;

        console.log('Ball entered basket! Victory!');

        // Access the GameScene to trigger victory
        // The scene should have a triggerVictory method
        const gameScene = this.scene as { triggerVictory?: () => void };
        if (gameScene.triggerVictory) {
            gameScene.triggerVictory();
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
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Draw U-shaped basket outline
        const padding = 4;
        const wallThickness = 8;
        const left = pos.x - width / 2 + padding;
        const right = pos.x + width / 2 - padding;
        const top = pos.y - height / 2 + padding;
        const bottom = pos.y + height / 2 - padding;

        // Fill background
        this.graphics.fillStyle(this.getColor(), 0.3);
        this.graphics.fillRect(left, top, width - padding * 2, height - padding * 2);

        // Draw U-shape (left wall, bottom, right wall)
        this.graphics.fillStyle(this.getColor(), 1);

        // Left wall
        this.graphics.fillRect(left, top, wallThickness, height - padding * 2);
        // Right wall
        this.graphics.fillRect(right - wallThickness, top, wallThickness, height - padding * 2);
        // Bottom
        this.graphics.fillRect(left, bottom - wallThickness, width - padding * 2, wallThickness);

        // Draw border
        this.graphics.lineStyle(2, 0xcc9900, 1);
        this.graphics.strokeRect(left, top, width - padding * 2, height - padding * 2);

        // Add decorative pattern (diamonds)
        this.graphics.fillStyle(0xffaa00, 0.5);
        const diamondSize = 6;
        for (let dy = top + 15; dy < bottom - 15; dy += 20) {
            this.graphics.beginPath();
            this.graphics.moveTo(pos.x, dy - diamondSize);
            this.graphics.lineTo(pos.x + diamondSize, dy);
            this.graphics.lineTo(pos.x, dy + diamondSize);
            this.graphics.lineTo(pos.x - diamondSize, dy);
            this.graphics.closePath();
            this.graphics.fillPath();
        }

        // Create label
        this.createLabel(this.getLabel());

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Reset the basket (for level reset)
     */
    public reset(): void {
        this.isTriggered = false;
    }
}
