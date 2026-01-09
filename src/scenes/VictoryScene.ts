import { Scene } from 'phaser';

interface VictorySceneData {
    level: number;
}

export class VictoryScene extends Scene {
    private completedLevel: number = 1;

    constructor() {
        super('VictoryScene');
    }

    init(data: VictorySceneData) {
        this.completedLevel = data.level || 1;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background color (celebratory)
        this.cameras.main.setBackgroundColor('#004400');

        // Victory message
        this.add.text(width / 2, height / 3, 'LEVEL COMPLETE!', {
            fontFamily: 'Arial Black',
            fontSize: '64px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Level info
        this.add.text(width / 2, height / 2, `Level ${this.completedLevel} cleared!`, {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Continue button
        const continueBtn = this.add.text(width / 2, height / 2 + 100, '[ CONTINUE ]', {
            fontFamily: 'Arial Black',
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        continueBtn.setInteractive({ useHandCursor: true });
        continueBtn.on('pointerdown', () => {
            this.scene.start('LevelSelectScene');
        });
    }
}
