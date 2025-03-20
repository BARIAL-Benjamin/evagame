import type { Entity } from './entity.d.ts';

export declare interface BulletInterface extends Entity {
    /** Identifiant de l'entité originaire du tir */
    origin: string;
    /** Angle de la bullet */
    angle: number;
}