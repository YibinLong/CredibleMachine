import { AUTO, Game, Scale } from 'phaser';
import { Boot } from '../scenes/Boot';
import { Preloader } from '../scenes/Preloader';
import { TitleScene } from '../scenes/TitleScene';
import { LevelSelectScene } from '../scenes/LevelSelectScene';
import { GameScene } from '../scenes/GameScene';
import { VictoryScene } from '../scenes/VictoryScene';
import { FinalVictoryScene } from '../scenes/FinalVictoryScene';

/**
 * Phaser Game Configuration for Credible Machine
 *
 * Requirements (from PRD):
 * - 1280x720 minimum resolution
 * - WebGL with Canvas fallback
 * - Matter.js physics enabled
 * - Pixel-perfect rendering (no anti-aliasing)
 * - Responsive scaling
 */
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO, // WebGL with Canvas fallback
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#000000',

    // Pixel-perfect rendering for retro MS-DOS aesthetic
    render: {
        pixelArt: true,
        antialias: false,
        roundPixels: true
    },

    // Matter.js physics configuration
    physics: {
        default: 'matter',
        matter: {
            gravity: { x: 0, y: 1 },
            debug: false, // Set to true during development to see physics bodies
            // Additional Matter.js settings for realistic ball physics
            enableSleeping: false
        }
    },

    // Responsive canvas scaling
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        min: {
            width: 1280,
            height: 720
        },
        max: {
            width: 1920,
            height: 1080
        }
    },

    // Scene registration
    scene: [
        Boot,
        Preloader,
        TitleScene,
        LevelSelectScene,
        GameScene,
        VictoryScene,
        FinalVictoryScene
    ]
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
