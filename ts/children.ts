import Engine from './engine';
import Bullet from './bullet';
import type { ChildrenInterface, ChildrenStates, StateType } from './types/children.d.ts';
import type { Direction, Position, Sprite, Size } from './types/entity.d.ts';

export default class Children implements ChildrenInterface {
    static readonly maxSpeed = 10;
    static readonly jumpHeight = 100;
    static readonly maxHealth = 200;

    readonly id: string = Engine.createUID();
    readonly shootCountdown: number = 1500;
    readonly acceleration: number = .5;

    hitbox: Size = {
        width: 10,
        height: 10
    };
    sprite: Sprite = {
        url: "./sprites/eva/Eva01_run.png",
        count: 23,
        size: {
            width: 10,
            height: 10
        },
        currentSprite: 0
    };
    speed: number = 0;
    health: number = 200;
    direction: Direction = 1;
    states: ChildrenStates = [];
    lastShootTime: number = 0;

    position: Position;

    constructor(position: Position = { x: 10, y: 0 }) {
        this.position = position;
    }

    /** Applique un état au joueur
     * @param state État à ajouter
     * @returns Tableau à jour des états
     */
    private setState(state: StateType) {
        let newStates = [...this.states];
        if (this.states.includes(state)) {
            newStates = [...this.states, state];
        }
        return newStates;
    }

    /** Retire un état au joueur
     * @param state État à retirer
     * @returns Tableau à jour des états
     */
    private removeState(state: StateType): ChildrenStates {
        let newStates = [...this.states];
        if (this.states.includes(state)) {
            newStates = this.states.filter(s => s !== state);
        }
        return newStates;
    }

    jump = () => {
        if (this.states.includes('jump')) return;
        this.states = this.setState('jump');
        const initialY = this.position.y;
        let currentJumpSprite = 0;

        const jumpInterval = setInterval(() => {
            if (currentJumpSprite < this.sprite.count) {
                this.sprite.currentSprite = currentJumpSprite;
                this.position.y = initialY + Children.jumpHeight * Math.sin((Math.PI / this.sprite.count) * currentJumpSprite);
                currentJumpSprite++;
            } else {
                clearInterval(jumpInterval);
                this.position.y = initialY;
                this.states = this.removeState('jump');
            }
        }, 100);
    }

    move = () => {
        this.position.x +=
            this.states.includes('crouch')
                ? (this.speed / 2) * this.direction
                : this.speed * this.direction;

        this.states = this.setState('run');
    }

    crouch = () => {
        this.sprite = {
            url: "./sprites/eva/Eva01_crouch.png",
            count: 1,
            currentSprite: 0,
            size: {
                width: 91,
                height: 53
            }
        };
        this.hitbox = {
            width: this.sprite.size.width,
            height: this.sprite.size.height
        };
        this.states = this.setState('crouch');
    }

    standUp = () => {
        this.sprite = {
            url: "./sprites/eva/Eva01_run.png",
            count: 1,
            currentSprite: 0,
            size: {
                width: 83,
                height: 73
            }
        }
        this.states = [];
    }

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
        this.updateSprite(11, 23);
        Engine.displayEntity(context, this);
    }

    /** Met à jour le sprite du joueur
     * @param start Début de la loop sur les sprites (Défaut: 0)
     * @param end Fin de la loop sur les sprites (Défaut: this.sprite.count)
     */
    updateSprite(start?: number, end?: number) {
        start = start ?? 0;
        end = end ?? this.sprite.count;
        if (this.states.includes('run')) {
            this.sprite.currentSprite = start + ((this.sprite.currentSprite - start + 1) % (end - start));
        } else if (this.states.includes('crouch')) {
            this.sprite.currentSprite = 0;
        }
    }
}