/**
 * Central exports for game objects
 */

// Base class
export { GameObject } from './GameObject';

// Object factory and registry
export { createObject, createObjects } from './ObjectFactory';
export { OBJECT_CONFIGS, getObjectConfig, getRotatedSize, isStaticObject, isSensorObject } from './ObjectRegistry';

// Individual objects
export { Ball } from './Ball';
export { Ramp } from './Ramp';
export { Platform } from './Platform';
export { Basket } from './Basket';
export { Seesaw } from './Seesaw';
export { Trampoline } from './Trampoline';
export { Domino } from './Domino';
export { Fan } from './Fan';
export { PressurePlate } from './PressurePlate';
