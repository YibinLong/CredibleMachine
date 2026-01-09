import { Scene } from 'phaser';

export class FinalVictoryScene extends Scene {
    constructor() {
        super('FinalVictoryScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background color (golden/celebratory)
        this.cameras.main.setBackgroundColor('#443300');

        // Victory message
        this.add.text(width / 2, height / 3 - 30, 'CONGRATULATIONS!', {
            fontFamily: 'Arial Black',
            fontSize: '56px',
            color: '#ffdd00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 3 + 40, 'YOU WIN!', {
            fontFamily: 'Arial Black',
            fontSize: '72px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Message
        this.add.text(width / 2, height / 2 + 30, 'You have completed all 10 levels!', {
            fontFamily: 'Arial',
            fontSize: '28px',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Play Again button
        const playAgainBtn = this.add.text(width / 2, height / 2 + 120, '[ PLAY AGAIN ]', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        playAgainBtn.setInteractive({ useHandCursor: true });
        playAgainBtn.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });
    }
}
