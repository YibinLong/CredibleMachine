/**
 * ConfirmDialog - Reusable confirmation dialog component
 *
 * Features:
 * - Modal overlay that blocks underlying interaction
 * - Customizable message
 * - Confirm and Cancel buttons
 * - VGA retro aesthetic styling
 */

import { Scene, GameObjects } from 'phaser';
import { COLORS, FONTS } from '../utils/Constants';

export class ConfirmDialog extends GameObjects.Container {
    private overlay: GameObjects.Rectangle;
    private panel: GameObjects.Rectangle;
    private panelBorder: GameObjects.Rectangle;
    private messageText: GameObjects.Text;
    private confirmButton: GameObjects.Text;
    private cancelButton: GameObjects.Text;

    private onConfirmCallback: (() => void) | null = null;
    private onCancelCallback: (() => void) | null = null;

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

        // Dialog panel border (for retro look)
        const panelWidth = 450;
        const panelHeight = 200;
        this.panelBorder = scene.add.rectangle(
            width / 2,
            height / 2,
            panelWidth + 4,
            panelHeight + 4,
            COLORS.DIALOG_BORDER
        );

        // Dialog panel background
        this.panel = scene.add.rectangle(
            width / 2,
            height / 2,
            panelWidth,
            panelHeight,
            COLORS.DIALOG_BG
        );

        // Message text
        this.messageText = scene.add.text(width / 2, height / 2 - 40, '', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '20px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: panelWidth - 40 },
        }).setOrigin(0.5);

        // Confirm button
        this.confirmButton = scene.add.text(width / 2 - 80, height / 2 + 50, '[ YES ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '22px',
            color: '#00ff00',
        }).setOrigin(0.5);
        this.confirmButton.setInteractive({ useHandCursor: true });
        this.confirmButton.on('pointerdown', () => this.handleConfirm());

        // Cancel button
        this.cancelButton = scene.add.text(width / 2 + 80, height / 2 + 50, '[ NO ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '22px',
            color: '#ff6600',
        }).setOrigin(0.5);
        this.cancelButton.setInteractive({ useHandCursor: true });
        this.cancelButton.on('pointerdown', () => this.handleCancel());

        // Add all elements to container
        this.add([
            this.overlay,
            this.panelBorder,
            this.panel,
            this.messageText,
            this.confirmButton,
            this.cancelButton,
        ]);

        // Initially hidden
        this.setVisible(false);

        // High depth to ensure it's on top
        this.setDepth(1000);
    }

    /**
     * Show the dialog with a message and callbacks
     */
    show(
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    ): void {
        this.messageText.setText(message);
        this.onConfirmCallback = onConfirm;
        this.onCancelCallback = onCancel ?? null;
        this.setVisible(true);
    }

    /**
     * Hide the dialog
     */
    hide(): void {
        this.setVisible(false);
        this.onConfirmCallback = null;
        this.onCancelCallback = null;
    }

    /**
     * Handle confirm button click
     */
    private handleConfirm(): void {
        const callback = this.onConfirmCallback;
        this.hide();
        if (callback) {
            callback();
        }
    }

    /**
     * Handle cancel button click
     */
    private handleCancel(): void {
        const callback = this.onCancelCallback;
        this.hide();
        if (callback) {
            callback();
        }
    }

    /**
     * Check if dialog is currently visible
     */
    isShowing(): boolean {
        return this.visible;
    }
}
