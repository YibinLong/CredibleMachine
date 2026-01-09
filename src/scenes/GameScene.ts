import { Scene } from 'phaser';
import { Grid } from '../utils/Grid';
import { GameState } from '../utils/GameState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { GRID, COLORS, FONTS, UI } from '../utils/Constants';
import { GameSceneData } from '../types';

export class GameScene extends Scene {
    private currentLevel: number = 1;
    private isSimulating: boolean = false;
    private hasPlacedObjects: boolean = false;

    private grid!: Grid;
    private confirmDialog!: ConfirmDialog;
    private muteButton!: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene');
    }

    init(data: GameSceneData) {
        this.currentLevel = data.level || 1;
        this.isSimulating = false;
        this.hasPlacedObjects = false;
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = GameState.getInstance();

        // Background color
        this.cameras.main.setBackgroundColor(COLORS.DARK_GRAY);

        // Initialize Grid
        this.grid = new Grid(this);

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

        // Top bar
        this.createTopBar(width, gameState);

        // Level indicator
        this.add.text(GRID.PLAY_AREA_WIDTH / 2, 30, `LEVEL ${this.currentLevel}`, {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Placeholder text for play area (will be replaced when grid system is in use)
        this.add.text(GRID.PLAY_AREA_WIDTH / 2, GRID.PLAY_AREA_HEIGHT / 2, 'Play Area\n(Grid Ready)', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#444444',
            align: 'center'
        }).setOrigin(0.5);

        // Inventory header
        this.add.text(GRID.PLAY_AREA_WIDTH + UI.INVENTORY_WIDTH / 2, 100, 'INVENTORY', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Bottom bar with buttons
        this.createBottomBar();

        // Create confirmation dialog
        this.confirmDialog = new ConfirmDialog(this);
        this.add.existing(this.confirmDialog);

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Show grid lines for demo (can be triggered by drag later)
        // this.grid.showGridLines();
    }

    private createTopBar(width: number, gameState: GameState) {
        // Back button
        const backBtn = this.add.text(20, 20, '< BACK', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0);

        backBtn.setInteractive({ useHandCursor: true });
        backBtn.on('pointerdown', () => this.handleBackButton());

        // Mute toggle button
        this.muteButton = this.add.text(width - 20, 20, this.getMuteText(gameState.isAudioMuted()), {
            fontFamily: FONTS.PRIMARY,
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(1, 0);

        this.muteButton.setInteractive({ useHandCursor: true });
        this.muteButton.on('pointerdown', () => {
            const muted = gameState.toggleAudioMuted();
            this.muteButton.setText(this.getMuteText(muted));
        });
    }

    private createBottomBar() {
        const barY = UI.GAME_HEIGHT - 40;

        // Play button
        const playBtn = this.add.text(GRID.PLAY_AREA_WIDTH / 2 - 80, barY, '[ PLAY ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5);

        playBtn.setInteractive({ useHandCursor: true });
        playBtn.on('pointerdown', () => this.startSimulation());

        // Reset button
        const resetBtn = this.add.text(GRID.PLAY_AREA_WIDTH / 2 + 80, barY, '[ RESET ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ff6600'
        }).setOrigin(0.5);

        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => this.resetLevel());
    }

    private setupKeyboardShortcuts() {
        // Space = Start simulation (edit mode only)
        this.input.keyboard?.on('keydown-SPACE', () => {
            if (!this.isSimulating && !this.confirmDialog.isShowing()) {
                this.startSimulation();
            }
        });

        // R = Reset level
        this.input.keyboard?.on('keydown-R', () => {
            if (!this.confirmDialog.isShowing()) {
                this.resetLevel();
            }
        });

        // ESC = Back to level select (with confirmation if objects placed)
        this.input.keyboard?.on('keydown-ESC', () => {
            if (!this.confirmDialog.isShowing()) {
                this.handleBackButton();
            }
        });

        // Ctrl+Z = Undo last placement (edit mode only) - placeholder for future
        this.input.keyboard?.on('keydown-Z', (event: KeyboardEvent) => {
            if (event.ctrlKey && !this.isSimulating && !this.confirmDialog.isShowing()) {
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
        this.isSimulating = true;

        // Hide grid lines during simulation
        this.grid.hideGridLines();

        // TODO: Start physics simulation
        // This will be implemented in EPIC 3/4
    }

    private resetLevel() {
        this.isSimulating = false;
        this.hasPlacedObjects = false;

        // Clear grid
        this.grid.clear();

        // Restart scene with same level
        this.scene.restart({ level: this.currentLevel });
    }

    private undoLastPlacement() {
        // TODO: Implement undo functionality in EPIC 4
        // This is a placeholder for the single-step undo feature
    }

    private getMuteText(muted: boolean): string {
        return muted ? '[ SOUND: OFF ]' : '[ SOUND: ON ]';
    }

    /**
     * Expose grid for object placement (used by future object system)
     */
    getGrid(): Grid {
        return this.grid;
    }

    /**
     * Mark that objects have been placed (for exit confirmation)
     */
    setHasPlacedObjects(hasPlaced: boolean): void {
        this.hasPlacedObjects = hasPlaced;
    }

    /**
     * Check if simulation is running
     */
    getIsSimulating(): boolean {
        return this.isSimulating;
    }

    /**
     * Trigger victory (called when ball enters basket)
     */
    triggerVictory(): void {
        this.scene.start('VictoryScene', { level: this.currentLevel });
    }

    /**
     * Clean up when scene is destroyed
     */
    shutdown() {
        this.grid?.destroy();
    }
}
