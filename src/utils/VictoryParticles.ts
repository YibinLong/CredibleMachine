import { Scene, GameObjects } from 'phaser';

/**
 * Simple confetti particle effect for victory screens
 * Uses MS-DOS/VGA aesthetic with chunky pixel rectangles
 */
export class VictoryParticles {
    private scene: Scene;
    private particles: GameObjects.Rectangle[] = [];
    private velocities: { vx: number; vy: number; rotation: number }[] = [];
    private updateEvent?: Phaser.Time.TimerEvent;

    // VGA-style colors for confetti
    private static readonly COLORS = [
        0xff0000, // Red
        0x00ff00, // Green
        0x0000ff, // Blue
        0xffff00, // Yellow
        0xff00ff, // Magenta
        0x00ffff, // Cyan
        0xffa500, // Orange
        0xffffff, // White
    ];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Start the confetti particle effect
     * @param count Number of particles to spawn (default 50)
     */
    start(count: number = 50): void {
        const { width, height } = this.scene.cameras.main;

        // Create confetti particles
        for (let i = 0; i < count; i++) {
            // Random position across the top of the screen
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(-100, 0);

            // Random size (chunky pixel style)
            const size = Phaser.Math.Between(4, 12);

            // Random color from VGA palette
            const color = VictoryParticles.COLORS[
                Phaser.Math.Between(0, VictoryParticles.COLORS.length - 1)
            ];

            // Create rectangle particle
            const particle = this.scene.add.rectangle(x, y, size, size * 1.5, color);
            particle.setDepth(100); // Above other elements

            this.particles.push(particle);

            // Random velocity
            this.velocities.push({
                vx: Phaser.Math.FloatBetween(-1, 1),
                vy: Phaser.Math.FloatBetween(2, 5),
                rotation: Phaser.Math.FloatBetween(-0.1, 0.1)
            });
        }

        // Update particles every frame
        this.updateEvent = this.scene.time.addEvent({
            delay: 16, // ~60fps
            callback: this.updateParticles,
            callbackScope: this,
            loop: true
        });

        // Stop after 5 seconds to prevent memory leaks
        this.scene.time.delayedCall(5000, () => {
            this.stop();
        });
    }

    private updateParticles(): void {
        const { height } = this.scene.cameras.main;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            const vel = this.velocities[i];

            // Apply velocity
            particle.x += vel.vx;
            particle.y += vel.vy;
            particle.rotation += vel.rotation;

            // Add slight wobble
            vel.vx += Phaser.Math.FloatBetween(-0.1, 0.1);
            vel.vx = Phaser.Math.Clamp(vel.vx, -2, 2);

            // Add gravity effect
            vel.vy += 0.05;

            // Fade out when near bottom
            if (particle.y > height - 100) {
                particle.alpha -= 0.02;
            }

            // Remove if off screen or fully faded
            if (particle.y > height + 50 || particle.alpha <= 0) {
                particle.destroy();
                this.particles.splice(i, 1);
                this.velocities.splice(i, 1);
                i--;
            }
        }

        // Stop updating if no particles left
        if (this.particles.length === 0) {
            this.stop();
        }
    }

    /**
     * Stop the particle effect and clean up
     */
    stop(): void {
        if (this.updateEvent) {
            this.updateEvent.destroy();
            this.updateEvent = undefined;
        }

        // Destroy any remaining particles
        for (const particle of this.particles) {
            particle.destroy();
        }
        this.particles = [];
        this.velocities = [];
    }

    /**
     * Clean up resources when scene shuts down
     */
    destroy(): void {
        this.stop();
    }
}
