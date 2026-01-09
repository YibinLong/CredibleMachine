/**
 * GameState - Singleton state manager for Credible Machine
 *
 * Manages:
 * - Level completion tracking
 * - Level unlock logic (1-3 always unlocked, 4-10 sequential)
 * - Audio mute preference
 * - localStorage persistence
 */

import { SaveData, LevelStatus } from '../types';
import { GAME } from './Constants';

export class GameState {
    private static instance: GameState | null = null;

    private completedLevels: Set<number>;
    private audioMuted: boolean;
    private tutorialShown: boolean;

    private constructor() {
        this.completedLevels = new Set();
        this.audioMuted = false;
        this.tutorialShown = false;
        this.load();
    }

    /**
     * Get the singleton instance
     */
    static getInstance(): GameState {
        if (!GameState.instance) {
            GameState.instance = new GameState();
        }
        return GameState.instance;
    }

    /**
     * Load state from localStorage
     */
    private load(): void {
        try {
            const data = localStorage.getItem(GAME.STORAGE_KEY);
            if (data) {
                const parsed: SaveData = JSON.parse(data);
                this.completedLevels = new Set(parsed.completedLevels || []);
                this.audioMuted = parsed.audioMuted ?? false;
                this.tutorialShown = parsed.tutorialShown ?? false;
            }
        } catch {
            // Handle corrupted data - reset to defaults
            this.completedLevels = new Set();
            this.audioMuted = false;
            this.tutorialShown = false;
        }
    }

    /**
     * Save state to localStorage
     */
    save(): void {
        const data: SaveData = {
            completedLevels: Array.from(this.completedLevels).sort((a, b) => a - b),
            audioMuted: this.audioMuted,
            tutorialShown: this.tutorialShown,
        };
        try {
            localStorage.setItem(GAME.STORAGE_KEY, JSON.stringify(data));
        } catch {
            // localStorage might be full or disabled - ignore
        }
    }

    // ========== Level Completion ==========

    /**
     * Mark a level as completed and auto-save
     */
    completeLevel(levelNum: number): void {
        if (levelNum >= 1 && levelNum <= GAME.TOTAL_LEVELS) {
            this.completedLevels.add(levelNum);
            this.save();
        }
    }

    /**
     * Check if a specific level has been completed
     */
    isLevelCompleted(levelNum: number): boolean {
        return this.completedLevels.has(levelNum);
    }

    /**
     * Get array of all completed level numbers
     */
    getCompletedLevels(): number[] {
        return Array.from(this.completedLevels).sort((a, b) => a - b);
    }

    // ========== Level Unlock Logic ==========

    /**
     * Check if a level is unlocked
     * - Levels 1-3 are always unlocked
     * - Levels 4-10 unlock sequentially (complete N-1 to unlock N)
     */
    isLevelUnlocked(levelNum: number): boolean {
        // Invalid level numbers are not unlocked
        if (levelNum < 1 || levelNum > GAME.TOTAL_LEVELS) {
            return false;
        }

        // Levels 1-3 are always unlocked
        if (GAME.ALWAYS_UNLOCKED_LEVELS.includes(levelNum)) {
            return true;
        }

        // Levels 4-10: must complete previous level
        return this.completedLevels.has(levelNum - 1);
    }

    /**
     * Get the status of a level for UI display
     */
    getLevelStatus(levelNum: number): LevelStatus {
        if (this.isLevelCompleted(levelNum)) {
            return 'completed';
        }
        if (this.isLevelUnlocked(levelNum)) {
            return 'unlocked';
        }
        return 'locked';
    }

    /**
     * Get the next unlocked level that hasn't been completed
     * Returns the first uncompleted unlocked level, or -1 if all completed
     */
    getNextUnlockedLevel(): number {
        for (let i = 1; i <= GAME.TOTAL_LEVELS; i++) {
            if (this.isLevelUnlocked(i) && !this.isLevelCompleted(i)) {
                return i;
            }
        }
        return -1; // All levels completed
    }

    // ========== Audio Preference ==========

    /**
     * Check if audio is muted
     */
    isAudioMuted(): boolean {
        return this.audioMuted;
    }

    /**
     * Set audio mute state and save
     */
    setAudioMuted(muted: boolean): void {
        this.audioMuted = muted;
        this.save();
    }

    /**
     * Toggle audio mute state and save
     * Returns the new mute state
     */
    toggleAudioMuted(): boolean {
        this.audioMuted = !this.audioMuted;
        this.save();
        return this.audioMuted;
    }

    // ========== Progress Management ==========

    /**
     * Reset all progress (completed levels, audio preference, and tutorial state)
     */
    resetProgress(): void {
        this.completedLevels.clear();
        this.audioMuted = false;
        this.tutorialShown = false;
        this.save();
    }

    /**
     * Check if player has any progress (completed at least one level)
     */
    hasAnyProgress(): boolean {
        return this.completedLevels.size > 0;
    }

    /**
     * Check if all levels are completed
     */
    hasCompletedAllLevels(): boolean {
        return this.completedLevels.size === GAME.TOTAL_LEVELS;
    }

    // ========== Tutorial Tracking ==========

    /**
     * Check if tutorial has been shown
     */
    hasTutorialBeenShown(): boolean {
        return this.tutorialShown;
    }

    /**
     * Mark tutorial as shown and persist
     */
    markTutorialShown(): void {
        this.tutorialShown = true;
        this.save();
    }
}
