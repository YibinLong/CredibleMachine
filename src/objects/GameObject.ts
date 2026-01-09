/**
 * GameObject - Abstract base class for all physics objects
 *
 * Provides common functionality for:
 * - Grid-based positioning and snapping
 * - Rotation system with configurable directions
 * - Matter.js physics body management
 * - Placeholder sprite rendering
 * - Fixed/movable object distinction
 */

import { Scene, GameObjects } from 'phaser';
import { GridPosition, ObjectSize, ObjectType, GameObjectOptions } from '../types';
import { GRID, OBJECT_COLORS } from '../utils/Constants';
import { Grid } from '../utils/Grid';

export abstract class GameObject {
    protected scene: Scene;
    protected grid: Grid;

    // Identity
    public readonly id: string;
    public readonly objectType: ObjectType;

    // Grid properties
    protected _gridPosition: GridPosition;
    protected _size: ObjectSize;
    protected _rotation: number; // 0, 90, 180, 270

    // State
    protected _isFixed: boolean;
    protected _isDestroyed: boolean = false;

    // Phaser objects
    protected graphics: GameObjects.Graphics | null = null;
    protected sprite: GameObjects.Sprite | null = null;
    protected label: GameObjects.Text | null = null;
    protected body: MatterJS.BodyType | null = null;

    constructor(
        scene: Scene,
        grid: Grid,
        objectType: ObjectType,
        gridPosition: GridPosition,
        size: ObjectSize,
        options: GameObjectOptions = {}
    ) {
        this.scene = scene;
        this.grid = grid;
        this.objectType = objectType;
        this._gridPosition = { ...gridPosition };
        this._size = { ...size };
        this._rotation = options.rotation ?? 0;
        this._isFixed = options.isFixed ?? false;
        this.id = this.generateId();
    }

    // ========== Abstract Methods ==========

    /**
     * Create the Matter.js physics body for this object
     * Must be implemented by subclasses
     */
    protected abstract createBody(): void;

    /**
     * Render the placeholder sprite for this object
     * Must be implemented by subclasses
     */
    protected abstract render(): void;

    /**
     * Get the allowed rotation angles for this object type
     * Override in subclasses that support rotation
     */
    protected getRotationDirections(): number[] {
        return [0]; // Default: no rotation
    }

    /**
     * Get the display label for this object
     */
    protected abstract getLabel(): string;

    /**
     * Get the color for the placeholder sprite
     */
    protected abstract getColor(): number;

    // ========== Initialization ==========

    /**
     * Initialize the object (call after construction)
     * Creates physics body and renders sprite
     */
    public init(): void {
        this.createBody();
        this.render();
        this.registerWithGrid();
    }

    /**
     * Register this object with the grid occupancy system
     */
    protected registerWithGrid(): void {
        this.grid.occupyCells(
            this._gridPosition,
            this._size,
            this.id,
            this.objectType
        );
    }

    /**
     * Unregister this object from the grid
     */
    protected unregisterFromGrid(): void {
        this.grid.freeCells(this._gridPosition, this._size);
    }

    // ========== Position & Rotation ==========

    /**
     * Get the grid position
     */
    get gridPosition(): GridPosition {
        return { ...this._gridPosition };
    }

    /**
     * Get the object size in grid cells
     */
    get size(): ObjectSize {
        return { ...this._size };
    }

    /**
     * Get the current rotation angle
     */
    get rotation(): number {
        return this._rotation;
    }

    /**
     * Check if this object is fixed (pre-placed fixture)
     */
    get isFixed(): boolean {
        return this._isFixed;
    }

    /**
     * Get the physics body (may be null)
     */
    get physicsBody(): MatterJS.BodyType | null {
        return this.body;
    }

    /**
     * Get the pixel position (center of the object)
     */
    getPixelPosition(): { x: number; y: number } {
        const topLeft = this.grid.cellToPixel(this._gridPosition);
        return {
            x: topLeft.x + (this._size.cols * GRID.CELL_SIZE) / 2,
            y: topLeft.y + (this._size.rows * GRID.CELL_SIZE) / 2,
        };
    }

    /**
     * Set a new grid position
     */
    setGridPosition(newPos: GridPosition): boolean {
        if (this._isFixed) return false;

        // Check if new position is valid
        if (!this.grid.canPlaceObject(newPos, this._size)) {
            // Temporarily free current cells to check
            this.unregisterFromGrid();
            if (!this.grid.canPlaceObject(newPos, this._size)) {
                // Re-register at old position and fail
                this.registerWithGrid();
                return false;
            }
        } else {
            this.unregisterFromGrid();
        }

        // Update position
        this._gridPosition = { ...newPos };
        this.registerWithGrid();
        this.updateVisuals();
        this.updateBodyPosition();

        return true;
    }

    /**
     * Rotate the object to the next allowed direction
     */
    rotate(): boolean {
        if (this._isFixed) return false;

        const directions = this.getRotationDirections();
        if (directions.length <= 1) return false;

        const currentIndex = directions.indexOf(this._rotation);
        const nextIndex = (currentIndex + 1) % directions.length;
        this._rotation = directions[nextIndex];

        this.updateVisuals();
        this.updateBodyAngle();

        return true;
    }

    /**
     * Check if this object can be rotated
     */
    canRotate(): boolean {
        return !this._isFixed && this.getRotationDirections().length > 1;
    }

    // ========== Visual Updates ==========

    /**
     * Update visual representation after position/rotation change
     */
    protected updateVisuals(): void {
        if (this._isDestroyed) return;

        // Update sprite position and rotation if using sprite
        if (this.sprite) {
            const pos = this.getPixelPosition();
            this.sprite.setPosition(pos.x, pos.y);
            this.sprite.setRotation((this._rotation * Math.PI) / 180);
            return;
        }

        // Clear and re-render graphics fallback
        if (this.graphics) {
            this.graphics.clear();
        }
        if (this.label) {
            this.label.destroy();
            this.label = null;
        }
        this.render();
    }

    /**
     * Get the sprite texture key for this object type
     * Override in subclasses to specify the texture
     */
    protected getSpriteKey(): string | null {
        return null; // Default: no sprite
    }

    /**
     * Check if sprite texture is available
     */
    protected hasSpriteTexture(): boolean {
        const key = this.getSpriteKey();
        return key !== null && this.scene.textures.exists(key);
    }

    /**
     * Create a sprite for this object using the loaded texture
     */
    protected createSprite(): void {
        const key = this.getSpriteKey();
        if (!key || !this.scene.textures.exists(key)) return;

        const pos = this.getPixelPosition();
        this.sprite = this.scene.add.sprite(pos.x, pos.y, key);
        this.sprite.setRotation((this._rotation * Math.PI) / 180);
        this.sprite.setDepth(5);
    }

    /**
     * Update physics body position to match grid position
     */
    protected updateBodyPosition(): void {
        if (this.body && this.scene.matter) {
            const pos = this.getPixelPosition();
            this.scene.matter.body.setPosition(this.body, { x: pos.x, y: pos.y });
        }
    }

    /**
     * Update physics body angle to match rotation
     */
    protected updateBodyAngle(): void {
        if (this.body && this.scene.matter) {
            const angleRad = (this._rotation * Math.PI) / 180;
            this.scene.matter.body.setAngle(this.body, angleRad);
        }
    }

    /**
     * Render fixed indicator if this is a pre-placed fixture
     */
    protected renderFixedIndicator(): void {
        if (!this._isFixed || !this.graphics) return;

        const pos = this.getPixelPosition();
        const width = this._size.cols * GRID.CELL_SIZE;
        const height = this._size.rows * GRID.CELL_SIZE;

        // Draw corner brackets to indicate fixed object
        this.graphics.lineStyle(2, OBJECT_COLORS.FIXED_INDICATOR, 0.8);

        const cornerSize = 8;
        const left = pos.x - width / 2;
        const right = pos.x + width / 2;
        const top = pos.y - height / 2;
        const bottom = pos.y + height / 2;

        // Top-left corner
        this.graphics.lineBetween(left, top + cornerSize, left, top);
        this.graphics.lineBetween(left, top, left + cornerSize, top);

        // Top-right corner
        this.graphics.lineBetween(right - cornerSize, top, right, top);
        this.graphics.lineBetween(right, top, right, top + cornerSize);

        // Bottom-left corner
        this.graphics.lineBetween(left, bottom - cornerSize, left, bottom);
        this.graphics.lineBetween(left, bottom, left + cornerSize, bottom);

        // Bottom-right corner
        this.graphics.lineBetween(right - cornerSize, bottom, right, bottom);
        this.graphics.lineBetween(right, bottom, right, bottom - cornerSize);
    }

    // ========== Lifecycle ==========

    /**
     * Called when triggered by a pressure plate
     * Override in subclasses that respond to triggers
     */
    public onTrigger(): void {
        // Default: do nothing
    }

    /**
     * Called each frame during simulation
     * Override in subclasses that need per-frame updates
     */
    public update(_delta: number): void {
        // Default: do nothing
    }

    /**
     * Destroy this object and clean up resources
     */
    public destroy(): void {
        if (this._isDestroyed) return;
        this._isDestroyed = true;

        // Remove from grid
        this.unregisterFromGrid();

        // Destroy physics body
        if (this.body && this.scene.matter) {
            this.scene.matter.world.remove(this.body);
            this.body = null;
        }

        // Destroy sprite
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }

        // Destroy graphics
        if (this.graphics) {
            this.graphics.destroy();
            this.graphics = null;
        }

        // Destroy label
        if (this.label) {
            this.label.destroy();
            this.label = null;
        }
    }

    /**
     * Check if this object has been destroyed
     */
    get isDestroyed(): boolean {
        return this._isDestroyed;
    }

    // ========== Utility ==========

    /**
     * Generate a unique ID for this object
     */
    private generateId(): string {
        return `${this.objectType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Helper to create text label for placeholder sprites
     */
    protected createLabel(text: string): void {
        const pos = this.getPixelPosition();
        this.label = this.scene.add.text(pos.x, pos.y, text, {
            fontFamily: 'Courier New',
            fontSize: '10px',
            color: '#000000',
            align: 'center',
        });
        this.label.setOrigin(0.5);
        this.label.setDepth(10);
    }
}
