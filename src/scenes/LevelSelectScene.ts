import { Scene, GameObjects } from 'phaser';

export class LevelSelectScene extends Scene {
    private levelButtons: GameObjects.Text[] = [];

    constructor() {
        super('LevelSelectScene');
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background color
        this.cameras.main.setBackgroundColor('#000040');

        // Title
        this.add.text(width / 2, 60, 'SELECT LEVEL', {
            fontFamily: 'Arial Black',
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

        for (let i = 0; i < 10; i++) {
            const row = Math.floor(i / 5);
            const col = i % 5;
            const x = startX + col * (buttonWidth + gap) + buttonWidth / 2;
            const y = startY + row * (buttonHeight + gap) + buttonHeight / 2;

            const levelNum = i + 1;
            const isUnlocked = levelNum <= 3; // Levels 1-3 always unlocked

            const button = this.add.text(x, y, `${levelNum}`, {
                fontFamily: 'Arial Black',
                fontSize: '36px',
                color: isUnlocked ? '#00ff00' : '#666666',
                backgroundColor: isUnlocked ? '#004400' : '#222222',
                padding: { x: 30, y: 20 }
            }).setOrigin(0.5);

            if (isUnlocked) {
                button.setInteractive({ useHandCursor: true });
                button.on('pointerdown', () => {
                    this.scene.start('GameScene', { level: levelNum });
                });
            }

            this.levelButtons.push(button);
        }

        // Back button
        const backButton = this.add.text(100, height - 50, '< BACK', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        backButton.setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => {
            this.scene.start('TitleScene');
        });

        // ESC key to go back
        this.input.keyboard?.on('keydown-ESC', () => {
            this.scene.start('TitleScene');
        });
    }
}
