/**
 * MobileWarning - Full-screen overlay for mobile device warning
 *
 * Features:
 * - Full-screen modal overlay
 * - "Best played on desktop" message
 * - Continue button to dismiss and proceed
 * - VGA retro aesthetic styling
 */

import { Scene, GameObjects } from 'phaser';
import { COLORS, FONTS } from '../utils/Constants';

export class MobileWarning extends GameObjects.Container {
    private overlay: GameObjects.Rectangle;
    private panel: GameObjects.Rectangle;
    private panelBorder: GameObjects.Rectangle;
    private titleText: GameObjects.Text;
    private messageText: GameObjects.Text;
    private iconGraphics: GameObjects.Graphics;
    private continueButton: GameObjects.Text;

    private onDismissCallback: (() => void) | null = null;

    constructor(scene: Scene, onDismiss: () => void) {
        super(scene, 0, 0);

        const { width, height } = scene.cameras.main;
        this.onDismissCallback = onDismiss;

        // Full-screen semi-transparent overlay
        this.overlay = scene.add.rectangle(
            width / 2,
            height / 2,
            width,
            height,
            COLORS.DIALOG_OVERLAY,
            0.9
        );
        this.overlay.setInteractive(); // Block clicks through

        // Dialog panel border (for retro look)
        const panelWidth = 500;
        const panelHeight = 320;
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

        // Desktop/monitor icon (simple retro style)
        this.iconGraphics = scene.add.graphics();
        this.drawDesktopIcon(width / 2, height / 2 - 90);

        // Title text
        this.titleText = scene.add.text(width / 2, height / 2 - 20, 'DESKTOP RECOMMENDED', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '28px',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5);

        // Message text
        this.messageText = scene.add.text(
            width / 2,
            height / 2 + 30,
            'This game is best played on a\ndesktop or laptop computer\nwith a mouse or trackpad.',
            {
                fontFamily: FONTS.PRIMARY,
                fontSize: '18px',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 6,
            }
        ).setOrigin(0.5);

        // Continue button
        this.continueButton = scene.add.text(width / 2, height / 2 + 110, '[ CONTINUE ANYWAY ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '22px',
            color: '#00ff00',
        }).setOrigin(0.5);
        this.continueButton.setInteractive({ useHandCursor: true });
        this.continueButton.on('pointerdown', () => this.handleDismiss());

        // Add all elements to container
        this.add([
            this.overlay,
            this.panelBorder,
            this.panel,
            this.iconGraphics,
            this.titleText,
            this.messageText,
            this.continueButton,
        ]);

        // High depth to ensure it's on top of everything
        this.setDepth(2000);
    }

    /**
     * Draw a simple retro-style desktop monitor icon
     */
    private drawDesktopIcon(x: number, y: number): void {
        const g = this.iconGraphics;

        // Monitor screen (outer)
        g.fillStyle(0x666666);
        g.fillRect(x - 35, y - 25, 70, 50);

        // Monitor screen (inner/display)
        g.fillStyle(0x004488);
        g.fillRect(x - 30, y - 20, 60, 40);

        // Screen glow lines (simple dithering effect)
        g.lineStyle(1, 0x0066aa);
        for (let i = 0; i < 8; i++) {
            g.lineBetween(x - 28, y - 18 + i * 5, x + 28, y - 18 + i * 5);
        }

        // Monitor stand (neck)
        g.fillStyle(0x444444);
        g.fillRect(x - 8, y + 25, 16, 10);

        // Monitor base
        g.fillStyle(0x555555);
        g.fillRect(x - 20, y + 35, 40, 6);

        // Mouse (to the right)
        g.fillStyle(0xaaaaaa);
        g.fillRoundedRect(x + 50, y + 20, 18, 24, 4);
        g.lineStyle(1, 0x888888);
        g.lineBetween(x + 59, y + 20, x + 59, y + 30);
    }

    /**
     * Handle continue button click
     */
    private handleDismiss(): void {
        const callback = this.onDismissCallback;
        this.setVisible(false);
        if (callback) {
            callback();
        }
    }
}
