import { Scene } from 'phaser';
import { GameState } from '../utils/GameState';
import { AudioManager, SFX } from '../utils/AudioManager';
import { COLORS, FONTS, GAME } from '../utils/Constants';
import { VictorySceneData } from '../types';

export class VictoryScene extends Scene {
    private completedLevel: number = 1;
    private audioManager!: AudioManager;

    constructor() {
        super('VictoryScene');
    }

    init(data: VictorySceneData) {
        this.completedLevel = data.level || 1;
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = GameState.getInstance();

        // Update audio manager scene reference
        this.audioManager = AudioManager.getInstance();
        this.audioManager.setScene(this);

        // Play victory sound
        this.audioManager.playSound(SFX.VICTORY);

        // Save level completion
        gameState.completeLevel(this.completedLevel);

        // Check if this was the final level
        const isLastLevel = this.completedLevel === GAME.TOTAL_LEVELS;

        // If final level, go to final victory screen
        if (isLastLevel) {
            this.scene.start('FinalVictoryScene');
            return;
        }

        // Background color (celebratory green)
        this.cameras.main.setBackgroundColor(COLORS.DARK_GREEN);

        // Victory message
        this.add.text(width / 2, height / 3, 'LEVEL COMPLETE!', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '64px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Level info
        this.add.text(width / 2, height / 2, `Level ${this.completedLevel} cleared!`, {
            fontFamily: FONTS.PRIMARY,
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // Next Level button
        const nextLevel = this.completedLevel + 1;
        const nextLevelBtn = this.add.text(width / 2, height / 2 + 80, '[ NEXT LEVEL ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '36px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        nextLevelBtn.setInteractive({ useHandCursor: true });
        nextLevelBtn.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.scene.start('GameScene', { level: nextLevel });
        });

        // Level Select button
        const selectBtn = this.add.text(width / 2, height / 2 + 140, '[ LEVEL SELECT ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '24px',
            color: '#ffffff',
        }).setOrigin(0.5);

        selectBtn.setInteractive({ useHandCursor: true });
        selectBtn.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.scene.start('LevelSelectScene');
        });
    }
}
