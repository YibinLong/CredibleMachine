import { Scene, GameObjects } from 'phaser';

export class TitleScene extends Scene {
    private titleText!: GameObjects.Text;
    private playButton!: GameObjects.Text;

    constructor() {
        super('TitleScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background color (MS-DOS blue)
        this.cameras.main.setBackgroundColor('#000080');

        // Game title
        this.titleText = this.add.text(width / 2, height / 3, 'CREDIBLE MACHINE', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height / 3 + 60, 'A Rube Goldberg Puzzle Game', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Play button
        this.playButton = this.add.text(width / 2, height / 2 + 50, '[ PLAY ]', {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });
    }
}
