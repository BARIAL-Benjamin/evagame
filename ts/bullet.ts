import Engine from './engine';
import type { BulletInterface } from './types/bullet.d.ts';
import type { Direction, Position, Sprite, Size } from './types/entity.d.ts';

export default class Bullet implements BulletInterface {
    readonly id: string = Engine.createUID();
    readonly hitbox: Size = {
        width: 10,
        height: 10
    };
    readonly speed: number = 5;
    readonly acceleration: number = 0;

    readonly origin: string;
    readonly vector: Position;
    readonly angle: number;

    sprite: Sprite = {
        url: "./sprites/bullet/Bullet.png",
        count: 3,
        size: {
            width: 64,
            height: 16
        },
        currentSprite: 0
    };
    position: Position;
    health: number = 1000;
    direction: Direction = 1;

    constructor(origin: string, position: Position, vector: Position, angle: number) {
        this.origin = origin;
        this.position = position;
        this.vector = vector;
        this.angle = angle;
    }

    update(context: CanvasRenderingContext2D) {
        this.updateSprite();
        Engine.displayEntity(context, this);
    }

    /** Met à jour le sprite de la bullet */
    updateSprite() {
        if (this.sprite.currentSprite === this.sprite.count - 1) return; // Reste figé sur le dernier sprite
        this.sprite.currentSprite = this.sprite.currentSprite + 1;
    }
}