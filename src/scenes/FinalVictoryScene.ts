import { Scene } from 'phaser';
import { GameState } from '../utils/GameState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { FONTS } from '../utils/Constants';

export class FinalVictoryScene extends Scene {
    private confirmDialog!: ConfirmDialog;

    constructor() {
        super('FinalVictoryScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Save final level completion (in case we got here directly)
        GameState.getInstance().completeLevel(10);

        // Background color (golden/celebratory)
        this.cameras.main.setBackgroundColor(0x443300);

        // Victory message
        this.add.text(width / 2, height / 3 - 30, 'CONGRATULATIONS!', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '56px',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 3 + 40, 'YOU WIN!', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '72px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Message
        this.add.text(width / 2, height / 2 + 30, 'You have completed all 10 levels!', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Play Again button
        const playAgainBtn = this.add.text(width / 2, height / 2 + 100, '[ PLAY AGAIN ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '36px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        playAgainBtn.setInteractive({ useHandCursor: true });
        playAgainBtn.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });

        // Reset Progress button
        const resetBtn = this.add.text(width / 2, height / 2 + 160, '[ RESET PROGRESS ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '20px',
            color: '#ff6600',
        }).setOrigin(0.5);

        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => {
            this.showResetConfirmation();
        });

        // Create confirmation dialog
        this.confirmDialog = new ConfirmDialog(this);
        this.add.existing(this.confirmDialog);
    }

    private showResetConfirmation(): void {
        this.confirmDialog.show(
            'Reset all progress?\nThis cannot be undone!',
            () => {
                GameState.getInstance().resetProgress();
                this.scene.start('TitleScene');
            }
        );
    }
}
