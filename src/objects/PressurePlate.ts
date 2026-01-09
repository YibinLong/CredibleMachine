/**
 * PressurePlate - Trigger sensor that activates linked objects
 *
 * Physics behavior:
 * - Static sensor (no physical collision)
 * - Triggers linked object instantly on ball contact
 * - Visible connection line to linked object
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { GRID, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { getObjectConfig } from './ObjectRegistry';

export class PressurePlate extends GameObject {
    private isPressed: boolean = false;
    private linkedObject: GameObject | null = null;
    private linkedObjectId: string | null = null;
    private connectionGraphics: Phaser.GameObjects.Graphics | null = null;

    constructor(
        scene: Scene,
        grid: Grid,
        gridPosition: GridPosition,
        options: GameObjectOptions = {}
    ) {
        const config = getObjectConfig(ObjectType.PRESSURE_PLATE);
        super(scene, grid, ObjectType.PRESSURE_PLATE, gridPosition, config.size, options);
        this.linkedObjectId = options.linkedObjectId ?? null;
    }

    protected getLabel(): string {
        return 'PLATE';
    }

    protected getColor(): number {
        return OBJECT_COLORS.PRESSURE_PLATE;
    }

    protected getRotationDirections(): number[] {
        return [0]; // Pressure plate doesn't rotate
    }

    protected getSpriteKey(): string {
        return 'pressure-plate';
    }

    protected createBody(): void {
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        this.body = this.scene.matter.add.rectangle(pos.x, pos.y, width, height, {
            label: `pressurePlate_${this.id}`,
            isStatic: true,
            isSensor: true, // No physical collision
        });

        // Set up collision detection for trigger
        this.setupCollisionDetection();
    }

    /**
     * Set up collision detection for trigger activation
     */
    private setupCollisionDetection(): void {
        this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            for (const pair of event.pairs) {
                const { bodyA, bodyB } = pair;

                const isPlateA = bodyA.label === `pressurePlate_${this.id}`;
                const isPlateB = bodyB.label === `pressurePlate_${this.id}`;

                if (!isPlateA && !isPlateB) continue;

                const otherBody = isPlateA ? bodyB : bodyA;

                // Trigger on ball contact
                if (otherBody.label && otherBody.label.startsWith('ball_')) {
                    this.activate();
                }
            }
        });

        this.scene.matter.world.on('collisionend', (event: Phaser.Physics.Matter.Events.CollisionEndEvent) => {
            for (const pair of event.pairs) {
                const { bodyA, bodyB } = pair;

                const isPlateA = bodyA.label === `pressurePlate_${this.id}`;
                const isPlateB = bodyB.label === `pressurePlate_${this.id}`;

                if (!isPlateA && !isPlateB) continue;

                const otherBody = isPlateA ? bodyB : bodyA;

                // Deactivate when ball leaves
                if (otherBody.label && otherBody.label.startsWith('ball_')) {
                    this.deactivate();
                }
            }
        });
    }

    /**
     * Link this pressure plate to a target object
     */
    public linkTo(object: GameObject): void {
        this.linkedObject = object;
        this.linkedObjectId = object.id;
        this.updateConnectionLine();
    }

    /**
     * Set linked object by ID (for loading from level data)
     */
    public setLinkedObjectId(id: string): void {
        this.linkedObjectId = id;
    }

    /**
     * Resolve linked object reference by ID
     */
    public resolveLinkedObject(objects: GameObject[]): void {
        if (this.linkedObjectId) {
            this.linkedObject = objects.find(obj => obj.id === this.linkedObjectId) ?? null;
            this.updateConnectionLine();
        }
    }

    /**
     * Activate the pressure plate (trigger linked object)
     */
    private activate(): void {
        if (this.isPressed) return;
        this.isPressed = true;

        console.log(`Pressure plate ${this.id} activated!`);

        // Trigger linked object
        if (this.linkedObject && !this.linkedObject.isDestroyed) {
            this.linkedObject.onTrigger();
        }

        // Update visuals
        this.updateVisuals();
    }

    /**
     * Deactivate the pressure plate
     */
    private deactivate(): void {
        if (!this.isPressed) return;
        this.isPressed = false;

        console.log(`Pressure plate ${this.id} deactivated`);

        // Update visuals
        this.updateVisuals();
    }

    /**
     * Update the connection line to linked object
     */
    private updateConnectionLine(): void {
        // Create connection graphics if needed
        if (!this.connectionGraphics) {
            this.connectionGraphics = this.scene.add.graphics();
            this.connectionGraphics.setDepth(5);
        }

        this.connectionGraphics.clear();

        if (!this.linkedObject || this.linkedObject.isDestroyed) return;

        const startPos = this.getPixelPosition();
        const endPos = this.linkedObject.getPixelPosition();

        // Draw dotted line
        this.connectionGraphics.lineStyle(2, OBJECT_COLORS.TRIGGER_LINE, 0.6);

        const dashLength = 8;
        const gapLength = 6;
        const dx = endPos.x - startPos.x;
        const dy = endPos.y - startPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);

        let currentDist = 0;
        while (currentDist < distance) {
            const sx = startPos.x + Math.cos(angle) * currentDist;
            const sy = startPos.y + Math.sin(angle) * currentDist;
            const ex = startPos.x + Math.cos(angle) * Math.min(currentDist + dashLength, distance);
            const ey = startPos.y + Math.sin(angle) * Math.min(currentDist + dashLength, distance);

            this.connectionGraphics.lineBetween(sx, sy, ex, ey);
            currentDist += dashLength + gapLength;
        }

        // Draw small circles at endpoints
        this.connectionGraphics.fillStyle(OBJECT_COLORS.TRIGGER_LINE, 0.8);
        this.connectionGraphics.fillCircle(startPos.x, startPos.y, 4);
        this.connectionGraphics.fillCircle(endPos.x, endPos.y, 4);
    }

    protected render(): void {
        // Use sprite if available (note: sprite won't show pressed state)
        if (this.hasSpriteTexture() && !this.isPressed) {
            this.createSprite();
            this.updateConnectionLine();
            this.renderFixedIndicator();
            return;
        }

        // Fallback to graphics rendering (or when pressed for animation)
        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;
        const padding = 6;

        if (!this.graphics) {
            this.graphics = this.scene.add.graphics();
        }

        // Draw base plate
        this.graphics.fillStyle(0x333333, 1);
        this.graphics.fillRect(
            pos.x - width / 2 + padding,
            pos.y - height / 2 + padding,
            width - padding * 2,
            height - padding * 2
        );

        // Draw pressure button (depressed or raised)
        const buttonHeight = this.isPressed ? 4 : 8;
        const buttonColor = this.isPressed ? 0xff8800 : this.getColor();

        this.graphics.fillStyle(buttonColor, 1);
        this.graphics.fillRect(
            pos.x - width / 2 + padding + 4,
            pos.y - height / 2 + padding + (this.isPressed ? 4 : 0),
            width - padding * 2 - 8,
            buttonHeight
        );

        // Draw button top highlight
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillRect(
            pos.x - width / 2 + padding + 6,
            pos.y - height / 2 + padding + (this.isPressed ? 4 : 0),
            width - padding * 2 - 12,
            2
        );

        // Draw border
        this.graphics.lineStyle(2, 0x222222, 1);
        this.graphics.strokeRect(
            pos.x - width / 2 + padding,
            pos.y - height / 2 + padding,
            width - padding * 2,
            height - padding * 2
        );

        // Create label
        this.createLabel(this.getLabel());

        // Update connection line
        this.updateConnectionLine();

        // Render fixed indicator if applicable
        this.renderFixedIndicator();
    }

    /**
     * Update each frame (for connection line if objects move)
     */
    public update(_delta: number): void {
        // Update connection line in case linked object moved
        if (this.linkedObject && !this.linkedObject.isDestroyed) {
            this.updateConnectionLine();
        }
    }

    /**
     * Clean up resources
     */
    public destroy(): void {
        if (this.connectionGraphics) {
            this.connectionGraphics.destroy();
            this.connectionGraphics = null;
        }
        super.destroy();
    }

    /**
     * Reset pressure plate state
     */
    public reset(): void {
        this.isPressed = false;
        this.updateVisuals();
    }

    /**
     * Get linked object ID
     */
    public getLinkedObjectId(): string | null {
        return this.linkedObjectId;
    }
}
