/**
 * InventoryPanel - Container for inventory items
 *
 * Features:
 * - Displays vertical list of available objects
 * - Scrollable when items exceed visible area
 * - Tracks inventory counts
 * - VGA retro aesthetic styling
 */

import { Scene, GameObjects } from 'phaser';
import { ObjectType, InventoryItemData } from '../types';
import { GRID, UI, FONTS } from '../utils/Constants';
import { InventoryItem } from './InventoryItem';

export class InventoryPanel extends GameObjects.Container {
    private items: Map<ObjectType, InventoryItem> = new Map();
    private itemsContainer: GameObjects.Container;

    // Layout constants
    private static readonly HEADER_HEIGHT = 50;
    private static readonly ITEM_SPACING = 70;
    private static readonly PADDING = 20;

    constructor(scene: Scene) {
        // Position at right side of screen
        const x = GRID.PLAY_AREA_WIDTH + UI.INVENTORY_WIDTH / 2;
        const y = UI.GAME_HEIGHT / 2;
        super(scene, x, y);

        // Create header
        const header = scene.add.text(
            0,
            -UI.GAME_HEIGHT / 2 + 30,
            'INVENTORY',
            {
                fontFamily: FONTS.PRIMARY,
                fontSize: '20px',
                color: '#ffffff',
            }
        ).setOrigin(0.5);
        this.add(header);

        // Create container for items (allows for scroll offset later)
        this.itemsContainer = scene.add.container(0, 0);
        this.add(this.itemsContainer);
    }

    /**
     * Load inventory from level data
     */
    loadInventory(inventoryData: InventoryItemData[]): void {
        // Clear existing items
        this.clearItems();

        // Create items starting below header
        const startY = -UI.GAME_HEIGHT / 2 + InventoryPanel.HEADER_HEIGHT + InventoryPanel.PADDING + 30;

        inventoryData.forEach((data, index) => {
            const y = startY + index * InventoryPanel.ITEM_SPACING;

            const item = new InventoryItem(
                this.scene,
                0,
                y,
                data.type,
                data.count
            );

            this.items.set(data.type, item);
            this.itemsContainer.add(item);
        });
    }

    /**
     * Clear all inventory items
     */
    clearItems(): void {
        this.items.forEach((item) => {
            item.destroy();
        });
        this.items.clear();
    }

    /**
     * Get an inventory item by type
     */
    getItem(type: ObjectType): InventoryItem | undefined {
        return this.items.get(type);
    }

    /**
     * Decrement count for an object type
     */
    decrementCount(type: ObjectType): void {
        const item = this.items.get(type);
        if (item) {
            item.decrementCount();
        }
    }

    /**
     * Increment count for an object type (when object is picked up)
     */
    incrementCount(type: ObjectType): void {
        const item = this.items.get(type);
        if (item) {
            item.incrementCount();
        }
    }

    /**
     * Get count for an object type
     */
    getCount(type: ObjectType): number {
        const item = this.items.get(type);
        return item ? item.getCount() : 0;
    }

    /**
     * Check if object type has stock
     */
    hasStock(type: ObjectType): boolean {
        const item = this.items.get(type);
        return item ? item.hasStock() : false;
    }

    /**
     * Get all current inventory counts
     */
    getAllCounts(): Map<ObjectType, number> {
        const counts = new Map<ObjectType, number>();
        this.items.forEach((item, type) => {
            counts.set(type, item.getCount());
        });
        return counts;
    }

    /**
     * Restore inventory counts from snapshot
     */
    restoreCounts(counts: Map<ObjectType, number>): void {
        counts.forEach((count, type) => {
            const item = this.items.get(type);
            if (item) {
                item.setCount(count);
            }
        });
    }

    /**
     * Get all items (for iteration)
     */
    getAllItems(): InventoryItem[] {
        return Array.from(this.items.values());
    }

    /**
     * Destroy panel and all items
     */
    destroy(fromScene?: boolean): void {
        this.clearItems();
        super.destroy(fromScene);
    }
}
