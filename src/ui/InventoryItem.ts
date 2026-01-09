/**
 * InventoryItem - Single draggable item in the inventory panel
 *
 * Features:
 * - Displays object icon, name, and count
 * - Draggable for object placement
 * - Updates count as objects are placed/removed
 * - VGA retro aesthetic styling
 */

import { Scene, GameObjects } from 'phaser';
import { ObjectType } from '../types';
import { OBJECT_CONFIGS } from '../objects/ObjectRegistry';
import { FONTS, OBJECT_COLORS } from '../utils/Constants';

export class InventoryItem extends GameObjects.Container {
    public readonly objectType: ObjectType;
    private _count: number;

    private background: GameObjects.Rectangle;
    private icon: GameObjects.Graphics;
    private nameText: GameObjects.Text;
    private countText: GameObjects.Text;

    // Dimensions
    private static readonly WIDTH = 280;
    private static readonly HEIGHT = 60;
    private static readonly ICON_SIZE = 40;

    constructor(scene: Scene, x: number, y: number, objectType: ObjectType, count: number) {
        super(scene, x, y);
        this.objectType = objectType;
        this._count = count;

        const config = OBJECT_CONFIGS[objectType];
        const color = this.getObjectColor(objectType);

        // Background panel
        this.background = scene.add.rectangle(
            0, 0,
            InventoryItem.WIDTH,
            InventoryItem.HEIGHT,
            0x333355,
            0.8
        );
        this.background.setStrokeStyle(1, 0x555577);

        // Object icon (simplified preview)
        this.icon = scene.add.graphics();
        this.drawIcon(color, config.size);

        // Object name
        this.nameText = scene.add.text(
            -InventoryItem.WIDTH / 2 + InventoryItem.ICON_SIZE + 20,
            -10,
            this.getDisplayName(objectType),
            {
                fontFamily: FONTS.PRIMARY,
                fontSize: '16px',
                color: '#ffffff',
            }
        ).setOrigin(0, 0.5);

        // Count display
        this.countText = scene.add.text(
            InventoryItem.WIDTH / 2 - 20,
            0,
            `x${count}`,
            {
                fontFamily: FONTS.PRIMARY,
                fontSize: '18px',
                color: '#00ff00',
            }
        ).setOrigin(1, 0.5);

        // Add all elements
        this.add([this.background, this.icon, this.nameText, this.countText]);

        // Make interactive and draggable
        this.setSize(InventoryItem.WIDTH, InventoryItem.HEIGHT);
        this.setInteractive({ draggable: true, useHandCursor: true });

        // Update appearance based on count
        this.updateAppearance();
    }

    /**
     * Get current count
     */
    getCount(): number {
        return this._count;
    }

    /**
     * Set count and update display
     */
    setCount(count: number): void {
        this._count = Math.max(0, count);
        this.countText.setText(`x${this._count}`);
        this.updateAppearance();
    }

    /**
     * Decrement count by 1
     */
    decrementCount(): void {
        this.setCount(this._count - 1);
    }

    /**
     * Increment count by 1
     */
    incrementCount(): void {
        this.setCount(this._count + 1);
    }

    /**
     * Check if item has any count remaining
     */
    hasStock(): boolean {
        return this._count > 0;
    }

    /**
     * Update visual appearance based on count
     */
    private updateAppearance(): void {
        if (this._count > 0) {
            this.setAlpha(1);
            this.countText.setColor('#00ff00');
            this.input!.enabled = true;
        } else {
            this.setAlpha(0.4);
            this.countText.setColor('#666666');
            this.input!.enabled = false;
        }
    }

    /**
     * Draw simplified object icon
     */
    private drawIcon(color: number, size: { cols: number; rows: number }): void {
        const iconX = -InventoryItem.WIDTH / 2 + InventoryItem.ICON_SIZE / 2 + 10;
        const iconY = 0;

        this.icon.clear();

        // Scale to fit icon area while maintaining aspect ratio
        const maxSize = InventoryItem.ICON_SIZE - 8;
        const cellSize = Math.min(
            maxSize / size.cols,
            maxSize / size.rows
        );

        const width = size.cols * cellSize;
        const height = size.rows * cellSize;

        // Draw filled rectangle representing the object
        this.icon.fillStyle(color, 1);
        this.icon.fillRect(
            iconX - width / 2,
            iconY - height / 2,
            width,
            height
        );

        // Draw border
        this.icon.lineStyle(1, 0xffffff, 0.5);
        this.icon.strokeRect(
            iconX - width / 2,
            iconY - height / 2,
            width,
            height
        );
    }

    /**
     * Get display name for object type
     */
    private getDisplayName(type: ObjectType): string {
        const names: Record<ObjectType, string> = {
            [ObjectType.BALL]: 'Ball',
            [ObjectType.RAMP]: 'Ramp',
            [ObjectType.PLATFORM]: 'Platform',
            [ObjectType.BASKET]: 'Basket',
            [ObjectType.SEESAW]: 'Seesaw',
            [ObjectType.TRAMPOLINE]: 'Trampoline',
            [ObjectType.DOMINO]: 'Domino',
            [ObjectType.FAN]: 'Fan',
            [ObjectType.PRESSURE_PLATE]: 'Pressure Plate',
        };
        return names[type] || type;
    }

    /**
     * Get color for object type
     */
    private getObjectColor(type: ObjectType): number {
        const colors: Record<ObjectType, number> = {
            [ObjectType.BALL]: OBJECT_COLORS.BALL,
            [ObjectType.RAMP]: OBJECT_COLORS.RAMP,
            [ObjectType.PLATFORM]: OBJECT_COLORS.PLATFORM,
            [ObjectType.BASKET]: OBJECT_COLORS.BASKET,
            [ObjectType.SEESAW]: OBJECT_COLORS.SEESAW,
            [ObjectType.TRAMPOLINE]: OBJECT_COLORS.TRAMPOLINE,
            [ObjectType.DOMINO]: OBJECT_COLORS.DOMINO,
            [ObjectType.FAN]: OBJECT_COLORS.FAN,
            [ObjectType.PRESSURE_PLATE]: OBJECT_COLORS.PRESSURE_PLATE,
        };
        return colors[type] || 0xffffff;
    }
}
