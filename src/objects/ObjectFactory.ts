/**
 * ObjectFactory - Factory for creating game objects
 *
 * Provides a centralized way to create game objects by type,
 * handling instantiation and initialization.
 */

import { Scene } from 'phaser';
import { GridPosition, ObjectType, GameObjectOptions } from '../types';
import { Grid } from '../utils/Grid';
import { GameObject } from './GameObject';
import { Ball } from './Ball';
import { Ramp } from './Ramp';
import { Platform } from './Platform';
import { Basket } from './Basket';
import { Seesaw } from './Seesaw';
import { Trampoline } from './Trampoline';
import { Domino } from './Domino';
import { Fan } from './Fan';
import { PressurePlate } from './PressurePlate';
import { getObjectConfig } from './ObjectRegistry';

/**
 * Create a game object of the specified type
 */
export function createObject(
    scene: Scene,
    grid: Grid,
    type: ObjectType,
    gridPosition: GridPosition,
    options: GameObjectOptions = {}
): GameObject | null {
    const config = getObjectConfig(type);

    // Validate placement
    if (!grid.canPlaceObject(gridPosition, config.size)) {
        console.warn(`Cannot place ${type} at (${gridPosition.col}, ${gridPosition.row}): cells occupied or out of bounds`);
        return null;
    }

    let object: GameObject | null = null;

    switch (type) {
        case ObjectType.BALL:
            object = new Ball(scene, grid, gridPosition, options);
            break;
        case ObjectType.RAMP:
            object = new Ramp(scene, grid, gridPosition, options);
            break;
        case ObjectType.PLATFORM:
            object = new Platform(scene, grid, gridPosition, options);
            break;
        case ObjectType.BASKET:
            object = new Basket(scene, grid, gridPosition, options);
            break;
        case ObjectType.SEESAW:
            object = new Seesaw(scene, grid, gridPosition, options);
            break;
        case ObjectType.TRAMPOLINE:
            object = new Trampoline(scene, grid, gridPosition, options);
            break;
        case ObjectType.DOMINO:
            object = new Domino(scene, grid, gridPosition, options);
            break;
        case ObjectType.FAN:
            object = new Fan(scene, grid, gridPosition, options);
            break;
        case ObjectType.PRESSURE_PLATE:
            object = new PressurePlate(scene, grid, gridPosition, options);
            break;
        default:
            console.error(`Unknown object type: ${type}`);
            return null;
    }

    if (object) {
        object.init();
    }

    return object;
}

/**
 * Helper to create multiple objects at once
 */
export function createObjects(
    scene: Scene,
    grid: Grid,
    objects: Array<{
        type: ObjectType;
        gridPosition: GridPosition;
        options?: GameObjectOptions;
    }>
): GameObject[] {
    const created: GameObject[] = [];

    for (const obj of objects) {
        const gameObj = createObject(scene, grid, obj.type, obj.gridPosition, obj.options);
        if (gameObj) {
            created.push(gameObj);
        }
    }

    return created;
}
