import type { ActionEntity } from './entity.d.ts';

type AngeType = 'ground' | 'flying';

export declare interface AngeInterface extends ActionEntity {
    /** Type de l'ange */
    type: AngeType;
    /** Angle de l'ange */
    angle: number;
}