import type { ActionEntity } from './entity.d.ts';

export declare type StateType = "jump" | "run" | "crouch";
export declare type ChildrenStates = StateType[]; // Si vide alors on considère l'état "standby"

export declare interface ChildrenInterface extends ActionEntity {
    /** État(s) simultané du joueur */
    states: ChildrenStates;

    /** Réalise l'action de saut */
    jump(): void;

    /** Met en mode allonger / accroupi le joueur */
    crouch(): void;

    /** Remet le joueur en position debout */
    standUp(): void;
}