/**
 * DragDropManager - Coordinates drag-and-drop object placement
 *
 * Features:
 * - Handles drag from inventory items
 * - Handles pickup and repositioning of placed objects
 * - Shows/hides grid lines during drag
 * - Manages ghost preview
 * - Creates objects on valid drop
 */

import { Scene } from 'phaser';
import { ObjectType, GridPosition, PlacementAction } from '../types';
import { Grid } from '../utils/Grid';
import { GRID } from '../utils/Constants';
import { AudioManager, SFX } from '../utils/AudioManager';
import { InventoryPanel } from './InventoryPanel';
import { InventoryItem } from './InventoryItem';
import { GhostPreview } from './GhostPreview';
import { GameObject } from '../objects/GameObject';
import { createObject } from '../objects/ObjectFactory';

// GameScene interface for type safety
interface GameSceneInterface {
    getGrid(): Grid;
    getIsSimulating(): boolean;
    setHasPlacedObjects(hasPlaced: boolean): void;
    addPlacedObject(obj: GameObject): void;
    removePlacedObject(obj: GameObject): void;
    getPlacedObjects(): GameObject[];
}

export class DragDropManager {
    private scene: Scene & GameSceneInterface;
    private grid: Grid;
    private inventoryPanel: InventoryPanel;
    private ghostPreview: GhostPreview;
    private audioManager: AudioManager;

    // Drag state
    private isDragging: boolean = false;
    private dragSource: 'inventory' | 'placed' | null = null;
    private draggedType: ObjectType | null = null;
    private originalPosition: GridPosition | null = null;
    private originalRotation: number = 0;

    // Undo system
    private lastAction: PlacementAction | null = null;

    constructor(
        scene: Scene & GameSceneInterface,
        grid: Grid,
        inventoryPanel: InventoryPanel
    ) {
        this.scene = scene;
        this.grid = grid;
        this.inventoryPanel = inventoryPanel;
        this.audioManager = AudioManager.getInstance();

        // Create ghost preview
        this.ghostPreview = new GhostPreview(scene, grid);
        scene.add.existing(this.ghostPreview);

        // Set up drag event listeners
        this.setupDragEvents();
    }

    /**
     * Set up all drag event listeners
     */
    private setupDragEvents(): void {
        // Inventory item drag start
        this.scene.input.on('dragstart', (
            _pointer: Phaser.Input.Pointer,
            gameObject: Phaser.GameObjects.GameObject
        ) => {
            if (this.scene.getIsSimulating()) return;

            if (gameObject instanceof InventoryItem) {
                this.startInventoryDrag(gameObject);
            }
        });

        // Drag update (for inventory items using Phaser's drag system)
        this.scene.input.on('drag', (
            pointer: Phaser.Input.Pointer,
            _gameObject: Phaser.GameObjects.GameObject,
            _dragX: number,
            _dragY: number
        ) => {
            if (!this.isDragging) return;

            // Update ghost preview position
            this.ghostPreview.updatePosition(pointer.x, pointer.y);
        });

        // Pointer move (for placed objects using manual drag detection)
        this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!this.isDragging) return;
            if (this.dragSource !== 'placed') return;

            // Update ghost preview position
            this.ghostPreview.updatePosition(pointer.x, pointer.y);
        });

        // Drag end (for inventory items using Phaser's drag system)
        this.scene.input.on('dragend', (
            pointer: Phaser.Input.Pointer,
            _gameObject: Phaser.GameObjects.GameObject,
            _dropped: boolean
        ) => {
            if (!this.isDragging) return;

            this.handleDragEnd(pointer);
        });

        // Pointer up (for placed objects using manual drag detection)
        this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
            // Only handle if we're dragging a placed object
            if (!this.isDragging) return;
            if (this.dragSource !== 'placed') return;

            this.handleDragEnd(pointer);
        });
    }

    /**
     * Rotate the currently dragged object preview (called by R key)
     */
    public rotateCurrentDrag(): void {
        if (this.isDragging) {
            this.ghostPreview.rotatePreview();
            this.audioManager.playSound(SFX.ROTATE);
            // Update position to reflect new rotation bounds
            const pointer = this.scene.input.activePointer;
            this.ghostPreview.updatePosition(pointer.x, pointer.y);
        }
    }

    /**
     * Start dragging from inventory
     */
    private startInventoryDrag(item: InventoryItem): void {
        if (!item.hasStock()) return;

        this.isDragging = true;
        this.dragSource = 'inventory';
        this.draggedType = item.objectType;

        // Show grid lines
        this.grid.showGridLines();

        // Start ghost preview
        this.ghostPreview.startPreview(item.objectType);
    }

    /**
     * Start dragging a placed object (for repositioning)
     */
    public startPlacedObjectDrag(obj: GameObject): void {
        if (this.scene.getIsSimulating()) return;
        if (obj.isFixed) return;

        this.isDragging = true;
        this.dragSource = 'placed';
        this.draggedType = obj.objectType;
        this.originalPosition = obj.gridPosition;
        this.originalRotation = obj.rotation;

        // Temporarily remove from grid to allow repositioning
        obj.destroy();
        this.scene.removePlacedObject(obj);

        // Return to inventory temporarily
        this.inventoryPanel.incrementCount(obj.objectType);

        // Show grid lines
        this.grid.showGridLines();

        // Start ghost preview with same rotation
        this.ghostPreview.startPreview(obj.objectType, this.originalRotation);
    }

    /**
     * Handle drag end - either place object or return to inventory
     */
    private handleDragEnd(pointer: Phaser.Input.Pointer): void {
        const wasFromInventory = this.dragSource === 'inventory';
        const wasFromPlaced = this.dragSource === 'placed';

        // Check if drop is in play area and valid
        const inPlayArea = pointer.x >= 0 && pointer.x < GRID.PLAY_AREA_WIDTH &&
                          pointer.y >= 0 && pointer.y < GRID.PLAY_AREA_HEIGHT;

        if (inPlayArea && this.ghostPreview.isValid && this.draggedType) {
            // Place the object
            this.placeObject(
                this.draggedType,
                this.ghostPreview.gridPosition,
                this.ghostPreview.currentRotation
            );

            // Play placement sound
            this.audioManager.playSound(SFX.PLACE);

            // Decrement inventory (already incremented if from placed)
            if (wasFromInventory) {
                this.inventoryPanel.decrementCount(this.draggedType);
            }

            // Record action for undo
            if (wasFromInventory) {
                this.lastAction = {
                    type: 'place',
                    objectType: this.draggedType,
                    position: this.ghostPreview.gridPosition,
                    rotation: this.ghostPreview.currentRotation,
                };
            } else if (wasFromPlaced && this.originalPosition) {
                this.lastAction = {
                    type: 'move',
                    objectType: this.draggedType,
                    position: this.ghostPreview.gridPosition,
                    rotation: this.ghostPreview.currentRotation,
                    previousPosition: this.originalPosition,
                    previousRotation: this.originalRotation,
                };

                // Decrement since we incremented when picking up
                this.inventoryPanel.decrementCount(this.draggedType);
            }
        } else {
            // Invalid placement - return to inventory
            // If from placed object, it's already in inventory from pickup
            // If from inventory, nothing to do (count wasn't decremented yet)
        }

        // Clean up
        this.endDrag();
    }

    /**
     * Place an object at the specified grid position
     */
    private placeObject(type: ObjectType, position: GridPosition, rotation: number): void {
        const obj = createObject(this.scene, this.grid, type, position, { rotation });

        if (obj) {
            this.scene.addPlacedObject(obj);
            this.scene.setHasPlacedObjects(true);
        }
    }

    /**
     * End drag operation and clean up
     */
    private endDrag(): void {
        this.isDragging = false;
        this.dragSource = null;
        this.draggedType = null;
        this.originalPosition = null;
        this.originalRotation = 0;

        // Hide grid lines
        this.grid.hideGridLines();

        // Stop ghost preview
        this.ghostPreview.stopPreview();
    }

    /**
     * Handle click on a placed object (for rotation)
     */
    public handlePlacedObjectClick(obj: GameObject): boolean {
        if (this.scene.getIsSimulating()) return false;
        if (this.isDragging) return false;
        if (obj.isFixed) return false;

        // Rotate the object
        if (obj.canRotate()) {
            const prevRotation = obj.rotation;
            const rotated = obj.rotate();

            if (rotated) {
                // Play rotation sound
                this.audioManager.playSound(SFX.ROTATE);

                // Record for undo
                this.lastAction = {
                    type: 'rotate',
                    objectType: obj.objectType,
                    position: obj.gridPosition,
                    rotation: obj.rotation,
                    previousRotation: prevRotation,
                };
                return true;
            }
        }

        return false;
    }

    /**
     * Undo the last placement action
     */
    public undo(): boolean {
        if (!this.lastAction) return false;
        if (this.scene.getIsSimulating()) return false;

        const action = this.lastAction;
        this.lastAction = null;

        switch (action.type) {
            case 'place': {
                // Find and remove the placed object
                const objects = this.scene.getPlacedObjects();
                const obj = objects.find(o =>
                    o.objectType === action.objectType &&
                    o.gridPosition.col === action.position.col &&
                    o.gridPosition.row === action.position.row
                );

                if (obj) {
                    obj.destroy();
                    this.scene.removePlacedObject(obj);
                    this.inventoryPanel.incrementCount(action.objectType);
                    return true;
                }
                break;
            }

            case 'rotate': {
                // Find the object and rotate it back
                const objects = this.scene.getPlacedObjects();
                const obj = objects.find(o =>
                    o.objectType === action.objectType &&
                    o.gridPosition.col === action.position.col &&
                    o.gridPosition.row === action.position.row
                );

                if (obj && action.previousRotation !== undefined) {
                    // Rotate until we get back to previous rotation
                    while (obj.rotation !== action.previousRotation) {
                        obj.rotate();
                    }
                    return true;
                }
                break;
            }

            case 'move': {
                // Find the object at new position and move it back
                const objects = this.scene.getPlacedObjects();
                const obj = objects.find(o =>
                    o.objectType === action.objectType &&
                    o.gridPosition.col === action.position.col &&
                    o.gridPosition.row === action.position.row
                );

                if (obj && action.previousPosition) {
                    // Remove and recreate at original position
                    obj.destroy();
                    this.scene.removePlacedObject(obj);

                    const newObj = createObject(
                        this.scene,
                        this.grid,
                        action.objectType,
                        action.previousPosition,
                        { rotation: action.previousRotation ?? 0 }
                    );

                    if (newObj) {
                        this.scene.addPlacedObject(newObj);
                    }
                    return true;
                }
                break;
            }
        }

        return false;
    }

    /**
     * Check if currently dragging
     */
    public getIsDragging(): boolean {
        return this.isDragging;
    }

    /**
     * Clear undo history (called on reset)
     */
    public clearUndo(): void {
        this.lastAction = null;
    }

    /**
     * Clean up
     */
    public destroy(): void {
        this.ghostPreview.destroy();
    }
}
