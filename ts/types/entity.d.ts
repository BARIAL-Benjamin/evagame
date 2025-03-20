import type { AngeType } from "./ange.d.ts";
import Bullet from "../bullet.ts";
import { Ange } from "../ange.js";
import Children from "../children.js";

/** Position d'un élément */
type Position = {
    /** Position en x */
    x: number;
    /** Position en y */
    y: number;
}

/** Taille d'un élément */
type Size = {
    /** Largeur */
    width: number;
    /** Hauteur */
    height: number;
};

/** 1 = en avant et -1 = en arrière
 * 
 * \- Pourquoi 1 et -1 ?
 * 
 * \- Pour simplifier les calculs par la suite
 */
type Direction = 1 | -1;

type Sprite = {
    /** Lien vers les sprites */
    url: string;
    /** Nombre de sprites */
    count: number;
    /** Visuel, ce n'est pas la hitbox */
    size: Size;
    /** Sprite actuellement affiché */
    currentSprite: number;
};

type Sound = {
    /** Lien vers le son */
    url: string;
    /** Si le son boucle indéfiniment */
    loop: boolean;
};

/** Créer un tableau de nombres entre 0 et `Max` (inclusif).
 * 
 * Ce type d'utilitaire construit récursivement un type d'union
 * de tous les nombres compris dans l'intervalle spécifié.
 * 
 * @param Max - Le nombre maximum dans l'intervalle
 * @template Arr - Un tableau interne utilisé pour la récursivité (par défaut, un tableau vide).
 * 
 * @example
 * //* Type représentant les nombres de 1 à 5
 * type OneToFive = Range<5>; // 1 | 2 | 3 | 4 | 5
 */
type Range<Max extends number, Arr extends number[] = []> =
    Arr['length'] extends Max
    ? Arr[number] | Max
    : Range<Max, [...Arr, Arr['length']]>;

/** Nombres (leur "nom") de stage définie. 0 équivaut à aucun stage */
type StageNumber = Range<3>;

type SpawnChildren = {
    /** Position du joueur */
    position?: Position;
};

type SpawnBullet = {
    /** Identifiant de l'originaire du tire */
    origin: string;
    /** Position de la bullet */
    position: Position;
    /** Position de destination de la bullet */
    vector: Position;
    /** Angle de la bullet */
    angle: number;
};

type SpawnAnge = {
    /** Type d'ange */
    type: AngeType;
    /** Position de l'ange (et pas Delange ptdrr) */
    position: Position;
};

/** Alias de type représentant une fonction qui génère une entité en fonction du type fourni
 * 
 * En gros ça permet de clarifié et d'aider le type d'entité que l'on veut faire apparaître
 *
 * @param T Le type d'entité à engendrer. Il peut s'agir de "ange", "bullet", ou "children"
 * 
 * @example
 * //* Si T est "ange", le type de fonction sera `SpawnAnge`
 * SpawnEntity<"ange">: SpawnAnge
 * //* Si T est "bullet", le type de fonction sera `SpawnBullet`
 * SpawnEntity<"bullet">: SpawnBullet
 * //* Si T est "children", le type de fonction sera `SpawnChildren`
 * SpawnEntity<"children">: SpawnChildren
 */
type SpawnEntity<T extends "ange" | "bullet" | "children"> = (T extends "ange" ? SpawnAnge : (T extends "bullet" ? SpawnBullet : SpawnChildren));

export declare interface Entity {
    /** Identifiant unique */
    readonly id: string;
    /** Accélération de l'entité lors de ces mouvements */
    readonly acceleration: number;

    /** Position de l'entité */
    position: Position;
    /** Hitbox (zone de collision) de l'entité */
    hitbox: Size; // ! La hitbox c'est ici
    /** Vitesse de déplacement de l'entité */
    speed: number;
    /** Point de vie de l'entité */
    health: number;
    /** Sprite l'entité */
    sprite: Sprite;
    /** Direction de l'entité
     * @example
     * //* Si l'entité va vers la droite alors direction = 1 sinon -1 pour la gauche
     */
    direction: Direction;

    /** Met à jour l'état de l'entité sur un contexte donnée
     * @param context Context du canvas de la classe Engine
     */
    update: (context: CanvasRenderingContext2D) => void;
    /** Met à jour le sprite d'une entité */
    updateSprite: (start?: number, end?: number) => void;
}

export declare interface ActionEntity extends Entity {
    /** Compte à rebours avant le prochain tir */
    readonly shootCountdown: number;
    /** Timestamp lors du dernier tir */
    lastShootTime: number;

    /** Déplace l'entité selon son état et la touche appuyé ou un paterne fixe */
    move(): void;

    /** Créer une bullet depuis la position actuel de l'entité réalisant l'action vers une position donnée
     * @returns Créer une bullet si les conditions l'autorise (countdown) sinon null
     */
    shoot(position: Position): Bullet | null;
}

export declare type Clickable = {
    id: string;
    position: Position;
    size: Size;
    action: (v?, ...v?) => any;
}

export declare type Clickables = {
    [id: Clickable["id"]]: Clickable;
}

export declare type Slider = {
    id: string;
    position: Position;
    sliderColor: string;
    size: Size;
    radius: number;
    cursorColor: string;
    value: number;
    action: (v?, ...v?) => any;
}

export declare type Sliders = {
    [id: Slider["id"]]: Slider;
}

export declare type InteractiveElement =
    & {
        // Propriétés communes à Slider et Clickable, rendues obligatoires
        [K in keyof Slider & keyof Clickable]: Slider[K];
    }
    & Partial<Omit<Slider, keyof Clickable>>  // Propriétés spécifiques à Slider, rendues facultatives
    & Partial<Omit<Clickable, keyof Slider>>;  // Propriétés spécifiques à Clickable, rendues facultatives

export declare type Spatial2DObject = {
    [id: Entity["id"]]: {
        position: Position;
        size: Size;
        update: Entity["update"];
    }
}