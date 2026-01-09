import { Scene } from 'phaser';

export class Boot extends Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // Load minimal assets needed for the preloader
        // We'll add more assets here later
    }

    create() {
        this.scene.start('Preloader');
    }
}
