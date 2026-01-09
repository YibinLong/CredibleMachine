/**
 * TutorialOverlay - First-time player tutorial for Level 1
 *
 * Features:
 * - Modal overlay that blocks underlying interaction
 * - Displays keyboard/mouse controls
 * - X button for immediate dismissal
 * - Persists "shown" state in localStorage via GameState
 * - VGA retro aesthetic styling
 */

import { Scene, GameObjects } from 'phaser';
import { COLORS, FONTS } from '../utils/Constants';
import { GameState } from '../utils/GameState';

export class TutorialOverlay extends GameObjects.Container {
    private overlay: GameObjects.Rectangle;
    private panel: GameObjects.Rectangle;
    private panelBorder: GameObjects.Rectangle;
    private titleText: GameObjects.Text;
    private controlsText: GameObjects.Text;
    private closeButton: GameObjects.Text;
    private hintText: GameObjects.Text;

    private onCloseCallback: (() => void) | null = null;
    private keyboardListener: ((event: KeyboardEvent) => void) | null = null;

    constructor(scene: Scene) {
        super(scene, 0, 0);

        const { width, height } = scene.cameras.main;

        // Semi-transparent overlay to block clicks
        this.overlay = scene.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            COLORS.DIALOG_OVERLAY,
            COLORS.DIALOG_OVERLAY_ALPHA
        );
        this.overlay.setInteractive(); // Block clicks through

        // Panel dimensions (larger than ConfirmDialog for more content)
        const panelWidth = 560;
        const panelHeight = 380;

        // Panel border for retro look
        this.panelBorder = scene.add.rectangle(
            width / 2,
            height / 2,
            panelWidth + 4,
            panelHeight + 4,
            COLORS.DIALOG_BORDER
        );

        // Panel background
        this.panel = scene.add.rectangle(
            width / 2,
            height / 2,
            panelWidth,
            panelHeight,
            COLORS.DIALOG_BG
        );

        // Title
        this.titleText = scene.add.text(width / 2, height / 2 - 150, '== HOW TO PLAY ==', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ffdd00', // Gold for title
            align: 'center',
        }).setOrigin(0.5);

        // Controls content
        const controlsContent = this.buildControlsContent();
        this.controlsText = scene.add.text(width / 2, height / 2 + 20, controlsContent, {
            fontFamily: FONTS.PRIMARY,
            fontSize: '14px',
            color: '#ffffff',
            align: 'left',
            lineSpacing: 6,
        }).setOrigin(0.5);

        // Close button [X] in top-right corner of panel
        this.closeButton = scene.add.text(
            width / 2 + panelWidth / 2 - 30,
            height / 2 - panelHeight / 2 + 25,
            '[X]',
            {
                fontFamily: FONTS.PRIMARY,
                fontSize: '20px',
                color: '#ff6600', // Orange
            }
        ).setOrigin(0.5);
        this.closeButton.setInteractive({ useHandCursor: true });
        this.closeButton.on('pointerdown', () => this.close());

        // Hint text at bottom
        this.hintText = scene.add.text(
            width / 2,
            height / 2 + panelHeight / 2 - 30,
            'Click [X] or press any key to start',
            {
                fontFamily: FONTS.PRIMARY,
                fontSize: '12px',
                color: '#888888',
            }
        ).setOrigin(0.5);

        // Add all elements to container
        this.add([
            this.overlay,
            this.panelBorder,
            this.panel,
            this.titleText,
            this.controlsText,
            this.closeButton,
            this.hintText,
        ]);

        // Initially hidden
        this.setVisible(false);

        // High depth to ensure it's on top
        this.setDepth(1000);
    }

    /**
     * Build the controls content text
     */
    private buildControlsContent(): string {
        return [
            'PLACEMENT',
            '=========',
            'Drag & Drop    Place objects from inventory',
            'Click object   Rotate placed object',
            'Drag placed    Move object to new position',
            '',
            'SIMULATION',
            '==========',
            'SPACE          Start simulation',
            'R              Reset level',
            'ESC            Back to level select',
            'Ctrl+Z         Undo last placement',
            '',
            'GOAL: Guide the ball into the basket!',
        ].join('\n');
    }

    /**
     * Show the tutorial overlay
     */
    show(onClose?: () => void): void {
        this.onCloseCallback = onClose ?? null;
        this.setVisible(true);

        // Set up keyboard listener for "any key" dismissal
        this.keyboardListener = () => {
            if (this.visible) {
                this.close();
            }
        };
        this.scene.input.keyboard?.once('keydown', this.keyboardListener);
    }

    /**
     * Close the tutorial and mark as shown
     */
    close(): void {
        this.setVisible(false);
        GameState.getInstance().markTutorialShown();

        // Clean up keyboard listener
        if (this.keyboardListener) {
            this.scene.input.keyboard?.off('keydown', this.keyboardListener);
            this.keyboardListener = null;
        }

        if (this.onCloseCallback) {
            this.onCloseCallback();
        }
    }

    /**
     * Check if tutorial should be shown
     * Returns true only on Level 1, first time ever
     */
    static shouldShow(levelNum: number): boolean {
        if (levelNum !== 1) return false;
        return !GameState.getInstance().hasTutorialBeenShown();
    }

    /**
     * Check if overlay is currently visible
     */
    isShowing(): boolean {
        return this.visible;
    }

    /**
     * Clean up resources
     */
    destroy(fromScene?: boolean): void {
        if (this.keyboardListener) {
            this.scene.input.keyboard?.off('keydown', this.keyboardListener);
            this.keyboardListener = null;
        }
        super.destroy(fromScene);
    }
}
