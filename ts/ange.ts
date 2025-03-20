import type { Direction, Position, Sprite, Size } from './types/entity.d.ts';
import type { AngeInterface, AngeType } from './types/ange.d.ts';
import Engine from './engine';
import Bullet from './bullet';

export class Ange implements AngeInterface {
    readonly id: string = Engine.createUID();
    readonly acceleration: number = 0;
    readonly shootCountdown: number = 1500;

    readonly type: AngeType;

    angle: number = 0;
    lastShootTime: number = 0;
    hitbox: Size = {
        width: 10,
        height: 10
    };
    health: number = 150;
    sprite: Sprite = {
        url: "./sprites/ange/Ange.png",
        count: 4,
        size: {
            width: 10,
            height: 10
        },
        currentSprite: 0
    };
    direction: Direction = 1;
    speed: number = 5;

    position: Position;


    constructor(position: Position, type: AngeType) {
        this.position = position;
        this.type = type;
    }

    move() { } // Ne bouge pas par défaut

    shoot = (position: Position) => {
        const now = Date.now();
        if (now - this.lastShootTime < this.shootCountdown) return null; // Ne tire pas si le délai de tir n'est pas écoulé
        this.lastShootTime = now; // Met à jour le temps du dernier tir

        const angle = Math.atan2(position.y - this.position.y, position.x - this.position.x);
        const pos = { x: this.position.x + this.sprite.size.width, y: this.position.y + this.sprite.size.height };
        const vector = { x: Math.cos(angle) * this.speed, y: Math.sin(angle) * this.speed };

        return new Bullet(this.id, pos, vector, angle);
    }

    update = (context: CanvasRenderingContext2D) => {
        this.updateSprite();
        Engine.displayEntity(context, this);
    }

    /** Met à jour l'évolution du sprite de l'ange */
    updateSprite = () => {
        this.sprite.currentSprite = (this.sprite.currentSprite + 1) % this.sprite.count;
    }
}

export class GroundAnge extends Ange implements AngeInterface {
    constructor(position: Position) {
        super({ ...position, y: 0 }, 'ground')
    }

    move() {
        this.angle += 0.05;
        this.position.x += Math.cos(this.angle) * this.speed;
        this.position.y += Math.sin(this.angle) * this.speed;
    }
}

export class FlyingAnge extends Ange implements AngeInterface {
    constructor(position: Position) {
        super(position, 'flying')
    }
    move = () => super.move() // Ne bouge pas
}