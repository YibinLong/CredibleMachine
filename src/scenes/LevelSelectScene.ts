import { Scene, GameObjects } from 'phaser';
import { GameState } from '../utils/GameState';
import { AudioManager, SFX } from '../utils/AudioManager';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { COLORS, FONTS, GAME } from '../utils/Constants';
import { LevelStatus } from '../types';

export class LevelSelectScene extends Scene {
    private levelButtons: GameObjects.Text[] = [];
    private confirmDialog!: ConfirmDialog;
    private audioManager!: AudioManager;

    constructor() {
        super('LevelSelectScene');
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = GameState.getInstance();

        // Update audio manager scene reference
        this.audioManager = AudioManager.getInstance();
        this.audioManager.setScene(this);

        // Background color
        this.cameras.main.setBackgroundColor(COLORS.MEDIUM_BLUE);

        // Title
        this.add.text(width / 2, 60, 'SELECT LEVEL', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '48px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create level buttons (2 rows of 5)
        const buttonWidth = 100;
        const buttonHeight = 100;
        const gap = 20;
        const startX = width / 2 - (buttonWidth * 2.5 + gap * 2);
        const startY = height / 2 - buttonHeight;

        for (let i = 0; i < GAME.TOTAL_LEVELS; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const x = startX + col * (buttonWidth + gap) + buttonWidth / 2;
            const y = startY + row * (buttonHeight + gap) + buttonHeight / 2;

            const levelNum = i + 1;
            const status = gameState.getLevelStatus(levelNum);

            this.createLevelButton(x, y, levelNum, status);
        }

        // Back button
        const backButton = this.add.text(100, height - 50, '< BACK', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.scene.start('TitleScene');
        });

        // Reset Progress button (only show if there's progress)
        if (gameState.hasAnyProgress()) {
            const resetButton = this.add.text(width - 100, height - 50, 'RESET PROGRESS', {
                fontFamily: FONTS.PRIMARY,
                fontSize: '18px',
                color: '#ff6600'
            }).setOrigin(0.5);

            resetButton.setInteractive({ useHandCursor: true });
            resetButton.on('pointerdown', () => {
                this.audioManager.playSound(SFX.CLICK);
                this.showResetConfirmation();
            });
        }

        // ESC key to go back
        this.input.keyboard?.on('keydown-ESC', () => {
            if (!this.confirmDialog?.isShowing()) {
                this.scene.start('TitleScene');
            }
        });

        // Create confirmation dialog (hidden initially)
        this.confirmDialog = new ConfirmDialog(this);
        this.add.existing(this.confirmDialog);
    }

    private createLevelButton(x: number, y: number, levelNum: number, status: LevelStatus): void {
        let displayText: string;
        let textColor: string;
        let bgColor: number;
        let isInteractive: boolean;

        switch (status) {
            case 'completed':
                displayText = `${levelNum} \u2713`; // Checkmark
                textColor = '#00ff00';
                bgColor = COLORS.DARK_GREEN;
                isInteractive = true;
                break;
            case 'unlocked':
                displayText = `${levelNum}`;
                textColor = '#00ff00';
                bgColor = COLORS.DARK_GREEN;
                isInteractive = true;
                break;
            case 'locked':
            default:
                displayText = `${levelNum} \u{1F512}`; // Lock emoji
                textColor = '#666666';
                bgColor = COLORS.DARK_GRAY_BG;
                isInteractive = false;
                break;
        }

        // Button background
        this.add.rectangle(x, y, 90, 90, bgColor);

        // Button text
        const button = this.add.text(x, y, displayText, {
            fontFamily: FONTS.PRIMARY,
            fontSize: '32px',
            color: textColor,
        }).setOrigin(0.5);

        if (isInteractive) {
            button.setInteractive({ useHandCursor: true });
            button.on('pointerdown', () => {
                this.audioManager.playSound(SFX.CLICK);
                this.scene.start('GameScene', { level: levelNum });
            });
        }

        this.levelButtons.push(button);
    }

    private showResetConfirmation(): void {
        this.confirmDialog.show(
            'Reset all progress?\nThis cannot be undone!',
            () => {
                GameState.getInstance().resetProgress();
                // Restart the scene to refresh the UI
                this.scene.restart();
            }
        );
    }
}
