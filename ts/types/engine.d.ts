import type { Entities, Entity, SpawnEntity, Size, StageNumber, Sound } from "./entity.d.ts";
import Children from "../children.ts";

export declare type Inputs = {
    /** Touche pour aller à gauche */
    left: string;
    /** Touche pour aller à droite */
    right: string;
    /** Touche pour sauter */
    jump: string;
    /** Touche pour s'allonger / s'accroupir */
    crouch: string;
    /** Touche pour la pause */
    pause?: string;
};

export declare type KeyPressed = { [K in keyof Inputs]?: boolean; };

export declare type EngineState = "lobby" | "settings" | "play" | "win" | "defeat";

export declare type EngineOptions = {
    /** Mode debug */
    debug?: boolean;
    /** Assignations des touches pour controller le joueur */
    inputs?: Inputs;
    /** État du jeu */
    state?: EngineState;
    /** Choix du stage */
    stage?: StageNumber;
    /** tick per second (horloge) */
    tps?: number;
};

export declare type TextOptions = {
    fontName?: string;
    fontSize?: number;
    color?: string;
    actionOnClick?: (v?, ...v?) => any;
};

export declare type SliderOptions = {
    size?: Size;
    sliderColor?: string;
    cursorColor?: string;
    cursorRadius?: number;
    actionOnDrag?: (v?, ...v?) => any;
};

export declare interface EngineInterface {
    /** Canvas ou le jeu est affiché */
    readonly canvas: HTMLCanvasElement;
    /** Context du jeu */
    readonly context: CanvasRenderingContext2D;
    /** Context audio du jeu */
    readonly audioContext: AudioContext;
    /** Mode debug */
    readonly debug: boolean;
    /** Taille de l'écran de jeu */
    readonly size: Size;
    /** Joueur */
    readonly player: Children;

    /** Assignations des touches pour controller le joueur */
    inputs: Inputs;
    /** Mémo des touches actuellement appuyé */
    keyPressed: KeyPressed;
    /** Objet mémorisant toutes les entités actuellement en jeu grâce à leur identifiant unique
     * @example {
     * .    "1741543170-4568": Children,
     * .    "1741451784-2317": Bullet,
     * .    "1741245448-1584": Bullet,
     * .    "1741241554-8344": Bullet,
     * .    "1741241554-7892": Ange,
     * }
     */
    entities: Entities;
    /** Identifiant généré par la fonction setInterval() qui servira d'horloge (tps ou ticks comme dans Minecraft) pour le jeu */
    engine: number | NodeJS.Timeout;
    /** État de la machine */
    state: EngineState;
    /** Nombres (leur "nom") de stage définie. 0 équivaut à aucun stage */
    stage: StageNumber;
    /** tps ou ticks comme dans Minecraft */
    tps: number;
    /** Lien vers le son d'arrière plan */
    backgroundSound: Sound;

    /** Vérifie si 2 entités données sont en collision
     * @returns Vrai si entrée en collision, sinon faux
     */
    checkCollision(entity1: Entity, entity2: Entity): boolean;

    /** Vérifie la santé d'une entité donnée
     * @param entity Entité à vérifié
     * @returns Vrai si la santé est supérieur à 0, sinon Faux
     */
    checkHealth(entity: Entity): boolean;

    /** Détruit une entité donnée */
    destroyEntity(entity: Entity): void;

    /** Applique un montant de dégât donnée sur une entité donnée
     * @param amount Quantité de point de vie à soustraire
     * @returns Vrai si "mort", sinon Faux
     */
    applyDamage(entity: Entity, amount: number): boolean;

    /** Donne un certain montant de point de vie au joueur plafonné au maximum de point de vie cumulable par le joueur
     * @param amount Quantité de point de vie à donnée
     */
    giveHealthToPlayer(amount: number): void;

    /** Met à jour l'état de toute les entités du jeu */
    update(): void;

    /** Fait apparaître une entité
     * @param entity Objet contenant les informations nécessaire au spawn d'une entité
     * @example ange: SpawnEntity<"ange"> = {
     *  type: "ground",
     *  position: { x: 100, y: 0 }
     * }
     * spawnEntity(ange);
     * //* Avec ces paramètres, le script comprend qu'il faut faire apparaître un ange de type ground en position {100, 0}
     * @example bullet: SpawnEntity<"bullet"> = {
     *  origin: "15464-12156567";
     *  position: { x: 100, y: 0 };
     *  vector: { x: 400, y: 50 };
     *  angle: 10;
     * }
     * spawnEntity(bullet);
     * //* Avec ces paramètres, le script comprend qu'il faut faire apparaître une bullet
     */
    spawnEntity(entity: SpawnEntity<"ange" | "bullet" | "children">): void;

    /** Joue un son
     * @param sound Son à jouer
     */
    playSound(sound: Sound): void;

    drawImage(source: CanvasImageSource, posImage: Position, sizeImage: Size, posOnCanvas: Position, printedSize: Size): void;
    drawText(text: string, posText: Position, options: TextOptions, fontName?: string, fontSize?: number, color?: string): void;
}