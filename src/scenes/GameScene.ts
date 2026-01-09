/**
 * GameScene - Main gameplay scene
 *
 * Features:
 * - Level loading with fixtures and inventory
 * - Drag-and-drop object placement
 * - Object rotation and repositioning
 * - Simulation controls (Play/Reset)
 * - Victory detection and transition
 */

import { Scene } from 'phaser';
import { Grid } from '../utils/Grid';
import { GameState } from '../utils/GameState';
import { AudioManager, SFX } from '../utils/AudioManager';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { TutorialOverlay } from '../ui/TutorialOverlay';
import { InventoryPanel } from '../ui/InventoryPanel';
import { DragDropManager } from '../ui/DragDropManager';
import { GRID, COLORS, FONTS, UI } from '../utils/Constants';
import { GameSceneData, LevelData, SimulationSnapshot } from '../types';
import { getLevelData } from '../data/levels';
import { createObject } from '../objects/ObjectFactory';
import { GameObject } from '../objects/GameObject';

export class GameScene extends Scene {
    private currentLevel: number = 1;
    private levelData: LevelData | null = null;
    private isSimulating: boolean = false;
    private hasPlacedObjects: boolean = false;

    // Core systems
    private grid!: Grid;
    private inventoryPanel!: InventoryPanel;
    private dragDropManager!: DragDropManager;
    private confirmDialog!: ConfirmDialog;
    private tutorialOverlay!: TutorialOverlay;
    private audioManager!: AudioManager;

    // UI elements
    private muteButton!: Phaser.GameObjects.Text;
    private playButton!: Phaser.GameObjects.Text;
    private resetButton!: Phaser.GameObjects.Text;

    // Game objects
    private placedObjects: GameObject[] = [];
    private fixtureObjects: GameObject[] = [];

    // Selection state
    private selectedObject: GameObject | null = null;
    private selectionGraphics: Phaser.GameObjects.Graphics | null = null;

    // Simulation state for reset
    private preSimulationSnapshot: SimulationSnapshot | null = null;

    constructor() {
        super('GameScene');
    }

    init(data: GameSceneData) {
        this.currentLevel = data.level || 1;
        this.isSimulating = false;
        this.hasPlacedObjects = false;
        this.placedObjects = [];
        this.fixtureObjects = [];
        this.preSimulationSnapshot = null;
        this.selectedObject = null;
        this.selectionGraphics = null;
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = GameState.getInstance();

        // Update audio manager scene reference
        this.audioManager = AudioManager.getInstance();
        this.audioManager.setScene(this);

        // Load level data
        this.levelData = getLevelData(this.currentLevel);
        if (!this.levelData) {
            console.error(`Level ${this.currentLevel} not found!`);
            this.scene.start('LevelSelectScene');
            return;
        }

        // Background color
        this.cameras.main.setBackgroundColor(COLORS.DARK_GRAY);

        // Play area background (left side)
        this.add.rectangle(
            GRID.PLAY_AREA_WIDTH / 2,
            GRID.PLAY_AREA_HEIGHT / 2,
            GRID.PLAY_AREA_WIDTH,
            GRID.PLAY_AREA_HEIGHT,
            COLORS.PLAY_AREA_BG
        );

        // Inventory panel background (right side)
        this.add.rectangle(
            GRID.PLAY_AREA_WIDTH + UI.INVENTORY_WIDTH / 2,
            height / 2,
            UI.INVENTORY_WIDTH,
            height,
            COLORS.INVENTORY_BG
        );

        // Initialize Grid
        this.grid = new Grid(this);

        // Create top bar
        this.createTopBar(width, gameState);

        // Level indicator
        this.add.text(GRID.PLAY_AREA_WIDTH / 2, 30, `LEVEL ${this.currentLevel}`, {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Level name
        this.add.text(GRID.PLAY_AREA_WIDTH / 2, 55, this.levelData.name, {
            fontFamily: FONTS.PRIMARY,
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0.5);

        // Create inventory panel
        this.inventoryPanel = new InventoryPanel(this);
        this.add.existing(this.inventoryPanel);
        this.inventoryPanel.loadInventory(this.levelData.inventory);

        // Create drag-drop manager
        this.dragDropManager = new DragDropManager(this, this.grid, this.inventoryPanel);

        // Create bottom bar
        this.createBottomBar();

        // Create confirmation dialog
        this.confirmDialog = new ConfirmDialog(this);
        this.add.existing(this.confirmDialog);

        // Create tutorial overlay
        this.tutorialOverlay = new TutorialOverlay(this);
        this.add.existing(this.tutorialOverlay);

        // Show tutorial on first Level 1 play
        if (TutorialOverlay.shouldShow(this.currentLevel)) {
            this.tutorialOverlay.show();
        }

        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Load fixture objects
        this.loadFixtures();

        // Set up object interaction
        this.setupObjectInteraction();

        // Set up ball collision sound
        this.setupCollisionSound();

        // Pause physics until user clicks Play (fixes ball falling immediately on load)
        this.matter.world.pause();
    }

    /**
     * Set up collision detection for ball bounce sound
     */
    private setupCollisionSound(): void {
        this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
            if (!this.isSimulating) return;

            for (const pair of event.pairs) {
                const labelA = pair.bodyA.label || '';
                const labelB = pair.bodyB.label || '';

                // Check if ball is involved in collision
                if (labelA.includes('ball') || labelB.includes('ball')) {
                    this.audioManager.playSound(SFX.BOUNCE);
                    break; // Only play once per collision frame
                }
            }
        });
    }

    /**
     * Load pre-placed fixture objects from level data
     */
    private loadFixtures(): void {
        if (!this.levelData) return;

        for (const fixture of this.levelData.fixtures) {
            const obj = createObject(
                this,
                this.grid,
                fixture.type,
                fixture.position,
                {
                    isFixed: true,
                    rotation: fixture.rotation ?? 0,
                    linkedObjectId: fixture.linkedObjectId,
                }
            );

            if (obj) {
                this.fixtureObjects.push(obj);
            }
        }
    }

    /**
     * Set up click interaction for placed objects
     * Click without drag = select, drag = reposition
     */
    private setupObjectInteraction(): void {
        let clickedObject: GameObject | null = null;
        let hasMoved = false;

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isSimulating) return;
            if (this.confirmDialog.isShowing()) return;
            if (this.tutorialOverlay.isShowing()) return;
            if (this.dragDropManager.getIsDragging()) return;

            // Only handle left clicks in play area
            if (!pointer.leftButtonDown()) return;
            if (pointer.x >= GRID.PLAY_AREA_WIDTH) return;

            // Find object at click position
            const gridPos = this.grid.pixelToCell({ x: pointer.x, y: pointer.y });
            const occupancy = this.grid.getOccupancy(gridPos);

            clickedObject = null;
            hasMoved = false;

            if (occupancy) {
                const obj = this.findObjectById(occupancy.objectId);
                if (obj && !obj.isFixed) {
                    clickedObject = obj;
                }
            } else {
                // Clicked on empty space - deselect
                this.selectObject(null);
            }
        });

        // Track movement to distinguish click from drag
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (!clickedObject) return;
            if (!pointer.isDown) return;
            if (this.dragDropManager.getIsDragging()) return;

            // Start drag on first movement
            if (!hasMoved) {
                hasMoved = true;
                // Clear selection when starting drag
                this.selectObject(null);
                this.dragDropManager.startPlacedObjectDrag(clickedObject);
                clickedObject = null;
            }
        });

        // On pointer up, if no movement occurred, select the object
        this.input.on('pointerup', () => {
            if (clickedObject && !hasMoved) {
                this.selectObject(clickedObject);
            }
            clickedObject = null;
            hasMoved = false;
        });
    }

    /**
     * Find an object by its ID
     */
    private findObjectById(id: string): GameObject | null {
        // Check placed objects
        for (const obj of this.placedObjects) {
            if (obj.id === id) return obj;
        }
        // Check fixtures
        for (const obj of this.fixtureObjects) {
            if (obj.id === id) return obj;
        }
        return null;
    }

    /**
     * Select an object (or deselect if null)
     */
    private selectObject(obj: GameObject | null): void {
        // Clear previous selection highlight
        if (this.selectionGraphics) {
            this.selectionGraphics.destroy();
            this.selectionGraphics = null;
        }

        this.selectedObject = obj;

        // Draw new selection highlight
        if (obj) {
            this.drawSelectionHighlight(obj);
        }
    }

    /**
     * Draw selection highlight around an object
     */
    private drawSelectionHighlight(obj: GameObject): void {
        if (!this.selectionGraphics) {
            this.selectionGraphics = this.add.graphics();
        }

        const pos = obj.getPixelPosition();
        const gridSize = obj.size;
        const pixelWidth = gridSize.cols * GRID.CELL_SIZE;
        const pixelHeight = gridSize.rows * GRID.CELL_SIZE;

        // Draw cyan dashed rectangle around the object
        this.selectionGraphics.clear();
        this.selectionGraphics.lineStyle(3, 0x00ffff, 1);
        this.selectionGraphics.strokeRect(
            pos.x - pixelWidth / 2 - 4,
            pos.y - pixelHeight / 2 - 4,
            pixelWidth + 8,
            pixelHeight + 8
        );
    }

    /**
     * Update selection highlight (after rotation)
     */
    private updateSelectionHighlight(): void {
        if (this.selectedObject && this.selectionGraphics) {
            this.drawSelectionHighlight(this.selectedObject);
        }
    }

    /**
     * Delete selected object and return to inventory
     */
    private deleteSelectedObject(): void {
        if (!this.selectedObject) return;

        // Return to inventory
        this.inventoryPanel.incrementCount(this.selectedObject.objectType);

        // Remove from grid and scene
        this.selectedObject.destroy();
        this.removePlacedObject(this.selectedObject);

        // Clear selection
        this.selectedObject = null;
        if (this.selectionGraphics) {
            this.selectionGraphics.destroy();
            this.selectionGraphics = null;
        }

        // Update placed objects flag
        this.hasPlacedObjects = this.placedObjects.length > 0;
    }

    private createTopBar(width: number, _gameState: GameState) {
        // Back button
        const backBtn = this.add.text(20, 20, '< BACK', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0);

        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.handleBackButton();
        });

        // Mute toggle button
        this.muteButton = this.add.text(width - 20, 20, this.getMuteText(this.audioManager.isMuted()), {
            fontFamily: FONTS.PRIMARY,
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(1, 0);

        this.muteButton.setInteractive({ useHandCursor: true });
        this.muteButton.on('pointerdown', () => {
            const muted = this.audioManager.toggleMute();
            this.muteButton.setText(this.getMuteText(muted));
        });
    }

    private createBottomBar() {
        const barY = UI.GAME_HEIGHT - 40;

        // Play button
        this.playButton = this.add.text(GRID.PLAY_AREA_WIDTH / 2 - 80, barY, '[ PLAY ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5);

        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.startSimulation();
        });

        // Reset button
        this.resetButton = this.add.text(GRID.PLAY_AREA_WIDTH / 2 + 80, barY, '[ RESET ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ff6600'
        }).setOrigin(0.5);

        this.resetButton.setInteractive({ useHandCursor: true });
        this.resetButton.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.resetLevel();
        });
    }

    private setupKeyboardShortcuts() {
        // Space = Start simulation (edit mode only)
        this.input.keyboard?.on('keydown-SPACE', () => {
            if (!this.isSimulating && !this.confirmDialog.isShowing() && !this.tutorialOverlay.isShowing()) {
                this.startSimulation();
            }
        });

        // R = Rotate selected object or object being dragged
        this.input.keyboard?.on('keydown-R', () => {
            if (this.isSimulating) return;
            if (this.confirmDialog.isShowing()) return;
            if (this.tutorialOverlay.isShowing()) return;

            // If dragging, rotate the dragged object preview
            if (this.dragDropManager.getIsDragging()) {
                this.dragDropManager.rotateCurrentDrag();
                return;
            }

            // If object is selected, rotate it
            if (this.selectedObject && !this.selectedObject.isFixed) {
                this.dragDropManager.handlePlacedObjectClick(this.selectedObject);
                this.updateSelectionHighlight();
            }
        });

        // X = Delete selected object (return to inventory)
        this.input.keyboard?.on('keydown-X', () => {
            if (this.isSimulating) return;
            if (this.confirmDialog.isShowing()) return;
            if (this.tutorialOverlay.isShowing()) return;

            if (this.selectedObject && !this.selectedObject.isFixed) {
                this.deleteSelectedObject();
            }
        });

        // ESC = Back to level select (with confirmation if objects placed)
        this.input.keyboard?.on('keydown-ESC', () => {
            if (!this.confirmDialog.isShowing() && !this.tutorialOverlay.isShowing()) {
                this.handleBackButton();
            }
        });

        // Ctrl+Z = Undo last placement (edit mode only)
        this.input.keyboard?.on('keydown-Z', (event: KeyboardEvent) => {
            if (event.ctrlKey && !this.isSimulating && !this.confirmDialog.isShowing() && !this.tutorialOverlay.isShowing()) {
                this.undoLastPlacement();
            }
        });
    }

    private handleBackButton() {
        if (this.hasPlacedObjects) {
            this.confirmDialog.show(
                'Exit level?\nAll placed objects will be lost.',
                () => this.scene.start('LevelSelectScene')
            );
        } else {
            this.scene.start('LevelSelectScene');
        }
    }

    private startSimulation() {
        if (this.isSimulating) return;

        // Clear selection before simulation
        this.selectObject(null);

        // Take snapshot before simulation
        this.takeSnapshot();

        this.isSimulating = true;

        // Update UI
        this.playButton.setColor('#666666');

        // Hide grid lines
        this.grid.hideGridLines();

        // Enable physics for all dynamic objects
        this.matter.world.resume();
    }

    private resetLevel() {
        if (this.preSimulationSnapshot) {
            // Restore from snapshot
            this.restoreFromSnapshot();
        } else {
            // Full reset
            this.isSimulating = false;
            this.hasPlacedObjects = false;

            // Clear placed objects
            for (const obj of this.placedObjects) {
                obj.destroy();
            }
            this.placedObjects = [];

            // Reset fixtures
            for (const obj of this.fixtureObjects) {
                if ('reset' in obj && typeof obj.reset === 'function') {
                    obj.reset();
                }
            }

            // Reload inventory
            if (this.levelData) {
                this.inventoryPanel.loadInventory(this.levelData.inventory);
            }
        }

        // Update UI
        this.playButton.setColor('#00ff00');
        this.dragDropManager.clearUndo();
    }

    /**
     * Take snapshot of current state before simulation
     */
    private takeSnapshot(): void {
        this.preSimulationSnapshot = {
            placedObjects: this.placedObjects.map(obj => ({
                type: obj.objectType,
                position: obj.gridPosition,
                rotation: obj.rotation,
            })),
            inventoryCounts: this.inventoryPanel.getAllCounts(),
        };
    }

    /**
     * Restore state from snapshot
     */
    private restoreFromSnapshot(): void {
        if (!this.preSimulationSnapshot) return;

        this.isSimulating = false;

        // Pause physics
        this.matter.world.pause();

        // Clear current placed objects
        for (const obj of this.placedObjects) {
            obj.destroy();
        }
        this.placedObjects = [];

        // Reset fixtures
        for (const obj of this.fixtureObjects) {
            obj.destroy();
        }
        this.fixtureObjects = [];

        // Reload fixtures
        this.loadFixtures();

        // Recreate placed objects from snapshot
        for (const data of this.preSimulationSnapshot.placedObjects) {
            const obj = createObject(this, this.grid, data.type, data.position, {
                rotation: data.rotation,
            });
            if (obj) {
                this.placedObjects.push(obj);
            }
        }

        // Restore inventory counts
        this.inventoryPanel.restoreCounts(this.preSimulationSnapshot.inventoryCounts);

        this.preSimulationSnapshot = null;
    }

    private undoLastPlacement() {
        if (this.dragDropManager.undo()) {
            // Update hasPlacedObjects flag
            this.hasPlacedObjects = this.placedObjects.length > 0;
        }
    }

    private getMuteText(muted: boolean): string {
        return muted ? '[ SOUND: OFF ]' : '[ SOUND: ON ]';
    }

    /**
     * Called each frame
     */
    update(_time: number, delta: number) {
        if (this.isSimulating) {
            // Update all objects
            for (const obj of this.placedObjects) {
                obj.update(delta);
            }
            for (const obj of this.fixtureObjects) {
                obj.update(delta);
            }
        }
    }

    // ========== Public API for DragDropManager ==========

    getGrid(): Grid {
        return this.grid;
    }

    setHasPlacedObjects(hasPlaced: boolean): void {
        this.hasPlacedObjects = hasPlaced;
    }

    getIsSimulating(): boolean {
        return this.isSimulating;
    }

    addPlacedObject(obj: GameObject): void {
        this.placedObjects.push(obj);
    }

    removePlacedObject(obj: GameObject): void {
        const index = this.placedObjects.indexOf(obj);
        if (index >= 0) {
            this.placedObjects.splice(index, 1);
        }
    }

    getPlacedObjects(): GameObject[] {
        return this.placedObjects;
    }

    /**
     * Trigger victory (called when ball enters basket)
     */
    triggerVictory(): void {
        // Pause physics immediately (freeze frame)
        this.matter.world.pause();

        // Brief delay before transition
        this.time.delayedCall(500, () => {
            this.scene.start('VictoryScene', { level: this.currentLevel });
        });
    }

    /**
     * Clean up when scene is destroyed
     */
    shutdown() {
        // Destroy all objects
        for (const obj of this.placedObjects) {
            obj.destroy();
        }
        for (const obj of this.fixtureObjects) {
            obj.destroy();
        }

        this.grid?.destroy();
        this.inventoryPanel?.destroy();
        this.dragDropManager?.destroy();
        this.tutorialOverlay?.destroy();
    }
}
