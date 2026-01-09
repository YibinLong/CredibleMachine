import { Scene } from 'phaser';

interface GameSceneData {
    level: number;
}

export class GameScene extends Scene {
    private currentLevel: number = 1;
    private isSimulating: boolean = false;

    constructor() {
        super('GameScene');
    }

    init(data: GameSceneData) {
        this.currentLevel = data.level || 1;
        this.isSimulating = false;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background color
        this.cameras.main.setBackgroundColor('#1a1a2e');

        // Play area background (left 80%)
        const playAreaWidth = 960;
        const playAreaHeight = 720;
        this.add.rectangle(playAreaWidth / 2, playAreaHeight / 2, playAreaWidth, playAreaHeight, 0x16213e);

        // Inventory panel background (right 20%)
        this.add.rectangle(playAreaWidth + (width - playAreaWidth) / 2, height / 2, width - playAreaWidth, height, 0x0f0f23);

        // Level indicator
        this.add.text(playAreaWidth / 2, 30, `LEVEL ${this.currentLevel}`, {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Placeholder text for play area
        this.add.text(playAreaWidth / 2, playAreaHeight / 2, 'Play Area\n(Grid will be here)', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#666666',
            align: 'center'
        }).setOrigin(0.5);

        // Placeholder text for inventory
        this.add.text(playAreaWidth + (width - playAreaWidth) / 2, 100, 'INVENTORY', {
            fontFamily: 'Arial Black',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Bottom bar with buttons
        this.createBottomBar(playAreaWidth);

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    private createBottomBar(playAreaWidth: number) {
        const { height } = this.cameras.main;
        const barY = height - 40;

        // Play button
        const playBtn = this.add.text(playAreaWidth / 2 - 80, barY, '[ PLAY ]', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5);

        playBtn.setInteractive({ useHandCursor: true });
        playBtn.on('pointerdown', () => this.startSimulation());

        // Reset button
        const resetBtn = this.add.text(playAreaWidth / 2 + 80, barY, '[ RESET ]', {
            fontFamily: 'Arial Black',
            fontSize: '24px',
            color: '#ff6600'
        }).setOrigin(0.5);

        resetBtn.setInteractive({ useHandCursor: true });
        resetBtn.on('pointerdown', () => this.resetLevel());
    }

    private setupKeyboardShortcuts() {
        // Space = Start simulation
        this.input.keyboard?.on('keydown-SPACE', () => {
            if (!this.isSimulating) {
                this.startSimulation();
            }
        });

        // R = Reset level
        this.input.keyboard?.on('keydown-R', () => {
            this.resetLevel();
        });

        // ESC = Back to level select
        this.input.keyboard?.on('keydown-ESC', () => {
            this.scene.start('LevelSelectScene');
        });
    }

    private startSimulation() {
        if (this.isSimulating) return;
        this.isSimulating = true;
        // TODO: Start physics simulation
    }

    private resetLevel() {
        this.isSimulating = false;
        // TODO: Reset to pre-simulation state
        this.scene.restart({ level: this.currentLevel });
    }
}
