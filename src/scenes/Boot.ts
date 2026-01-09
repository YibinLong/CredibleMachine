import { Scene } from 'phaser';
import { GameState } from '../utils/GameState';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load minimal assets needed for the preloader
        // We'll add more assets here later
    }

    create() {
        // Initialize GameState singleton (loads from localStorage)
        GameState.getInstance();

        this.scene.start('Preloader');
    }
}
