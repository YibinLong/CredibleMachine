import { Scene } from 'phaser';
import { GameState } from '../utils/GameState';
import { isMobileDevice } from '../utils/MobileDetector';
import { MobileWarning } from '../ui/MobileWarning';

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

        // Check for mobile device and show warning if detected
        if (isMobileDevice()) {
            this.showMobileWarning();
        } else {
            this.proceedToPreloader();
        }
    }

    /**
     * Show mobile warning overlay
     */
    private showMobileWarning(): void {
        const warning = new MobileWarning(this, () => {
            this.proceedToPreloader();
        });
        this.add.existing(warning);
    }

    /**
     * Continue to the Preloader scene
     */
    private proceedToPreloader(): void {
        this.scene.start('Preloader');
    }
}
