import { Scene, GameObjects } from 'phaser';
import { GameState } from '../utils/GameState';
import { AudioManager, SFX } from '../utils/AudioManager';
import { COLORS, FONTS } from '../utils/Constants';

export class TitleScene extends Scene {
    private playButton!: GameObjects.Text;
    private muteButton!: GameObjects.Text;
    private audioManager!: AudioManager;

    constructor() {
        super('TitleScene');
    }

    create() {
        const { width, height } = this.cameras.main;
        const gameState = GameState.getInstance();

        // Initialize audio manager and start background music
        this.audioManager = AudioManager.getInstance();
        this.audioManager.init(this);
        this.audioManager.playMusic();

        // Background color (MS-DOS blue)
        this.cameras.main.setBackgroundColor(COLORS.DARK_BLUE);

        // Game title
        this.add.text(width / 2, height / 3, 'CREDIBLE MACHINE', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(width / 2, height / 3 + 60, 'A Rube Goldberg Puzzle Game', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '20px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // Play button
        this.playButton = this.add.text(width / 2, height / 2 + 50, '[ PLAY ]', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '48px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on('pointerdown', () => {
            this.audioManager.playSound(SFX.CLICK);
            this.scene.start('LevelSelectScene');
        });

        // Mute toggle button (top-right corner)
        this.muteButton = this.add.text(width - 20, 20, this.getMuteText(gameState.isAudioMuted()), {
            fontFamily: FONTS.PRIMARY,
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(1, 0);

        this.muteButton.setInteractive({ useHandCursor: true });
        this.muteButton.on('pointerdown', () => {
            const muted = this.audioManager.toggleMute();
            this.muteButton.setText(this.getMuteText(muted));
        });

        // Version / credits text
        this.add.text(width / 2, height - 30, 'Inspired by The Incredible Machine (1993)', {
            fontFamily: FONTS.PRIMARY,
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
    }

    private getMuteText(muted: boolean): string {
        return muted ? '[ SOUND: OFF ]' : '[ SOUND: ON ]';
    }
}
