/**
 * AudioManager - Singleton audio manager for Credible Machine
 *
 * Manages:
 * - Sound effects (bounce, click, rotate, place, victory)
 * - Background music with seamless looping
 * - Mute state synchronization with GameState
 * - Phaser audio system integration
 */

import { Scene } from 'phaser';
import { GameState } from './GameState';

// Sound effect keys
export const SFX = {
    BOUNCE: 'bounce',
    CLICK: 'click',
    ROTATE: 'rotate',
    PLACE: 'place',
    VICTORY: 'victory',
} as const;

export const MUSIC = {
    BGM: 'bgm',
} as const;

export class AudioManager {
    private static instance: AudioManager | null = null;
    private scene: Scene | null = null;
    private bgm: Phaser.Sound.BaseSound | null = null;
    private initialized: boolean = false;

    private constructor() {
        // Private constructor for singleton
    }

    /**
     * Get the singleton instance
     */
    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * Initialize the audio manager with a scene
     * Should be called once when the first scene with audio starts
     */
    init(scene: Scene): void {
        this.scene = scene;
        this.initialized = true;
        this.updateMuteState();
    }

    /**
     * Update the scene reference (for when switching scenes)
     */
    setScene(scene: Scene): void {
        this.scene = scene;
        // Re-apply mute state to new scene's sound manager
        this.updateMuteState();
    }

    /**
     * Load all audio assets (call in Preloader.preload())
     */
    static preloadAudio(scene: Scene): void {
        // Sound effects (WAV format from sfxr.me)
        scene.load.audio(SFX.BOUNCE, 'assets/audio/bounce.wav');
        scene.load.audio(SFX.CLICK, 'assets/audio/click.wav');
        scene.load.audio(SFX.ROTATE, 'assets/audio/rotate.wav');
        scene.load.audio(SFX.PLACE, 'assets/audio/place.wav');
        scene.load.audio(SFX.VICTORY, 'assets/audio/victory.wav');

        // Background music (WAV or MP3 format - try both for compatibility)
        scene.load.audio(MUSIC.BGM, ['assets/audio/bgm.wav', 'assets/audio/bgm.mp3']);
    }

    /**
     * Play a sound effect
     */
    playSound(key: string): void {
        if (!this.scene || !this.initialized) return;
        if (GameState.getInstance().isAudioMuted()) return;

        // Check if the audio exists in cache before playing
        if (this.scene.cache.audio.exists(key)) {
            this.scene.sound.play(key, { volume: 0.5 });
        }
    }

    /**
     * Start background music with seamless loop
     */
    playMusic(): void {
        if (!this.scene || !this.initialized) return;

        // Don't start if already playing
        if (this.bgm && this.bgm.isPlaying) return;

        // Check if music exists in cache
        if (!this.scene.cache.audio.exists(MUSIC.BGM)) return;

        // Create and play background music
        this.bgm = this.scene.sound.add(MUSIC.BGM, {
            loop: true,
            volume: 0.3,
        });

        // Only play if not muted
        if (!GameState.getInstance().isAudioMuted()) {
            this.bgm.play();
        }
    }

    /**
     * Stop background music
     */
    stopMusic(): void {
        if (this.bgm) {
            this.bgm.stop();
            this.bgm.destroy();
            this.bgm = null;
        }
    }

    /**
     * Pause background music
     */
    pauseMusic(): void {
        if (this.bgm && this.bgm.isPlaying) {
            this.bgm.pause();
        }
    }

    /**
     * Resume background music
     */
    resumeMusic(): void {
        if (this.bgm && this.bgm.isPaused && !GameState.getInstance().isAudioMuted()) {
            this.bgm.resume();
        }
    }

    /**
     * Check if music is currently playing
     */
    isMusicPlaying(): boolean {
        return this.bgm !== null && this.bgm.isPlaying;
    }

    /**
     * Update mute state - sync with GameState and apply to Phaser sound system
     */
    updateMuteState(): void {
        if (!this.scene) return;

        const isMuted = GameState.getInstance().isAudioMuted();

        // Mute/unmute all sounds in the scene
        this.scene.sound.mute = isMuted;

        // Handle background music specifically
        if (this.bgm) {
            if (isMuted) {
                if (this.bgm.isPlaying) {
                    this.bgm.pause();
                }
            } else {
                if (this.bgm.isPaused) {
                    this.bgm.resume();
                } else if (!this.bgm.isPlaying) {
                    this.bgm.play();
                }
            }
        }
    }

    /**
     * Toggle mute state and update audio system
     * Returns the new mute state
     */
    toggleMute(): boolean {
        const newState = GameState.getInstance().toggleAudioMuted();
        this.updateMuteState();
        return newState;
    }

    /**
     * Set mute state and update audio system
     */
    setMuted(muted: boolean): void {
        GameState.getInstance().setAudioMuted(muted);
        this.updateMuteState();
    }

    /**
     * Check if audio is muted
     */
    isMuted(): boolean {
        return GameState.getInstance().isAudioMuted();
    }
}
