import Children from './children';
import Bullet from './bullet';
import { GroundAnge, FlyingAnge } from './ange';
import type { EngineInterface, EngineOptions, EngineState, Inputs, KeyPressed, TextOptions, SliderOptions } from './types/engine.d.ts';
import type { Entity, SpawnEntity, Size, StageNumber, Sound, Position, Clickable, Clickables, Slider, Sliders, InteractiveElement, Spatial2DObject } from './types/entity.d.ts';

//  TODO: 
//  - Choisir entre deux personnages qui représentes deux niveaux de difficulté
//      - Eva01 : Facile et peut s'allonger
//      - Eva02 : Difficile et ne peut pas s'allonger

export default class Engine implements EngineInterface {
    private static readonly NO_ACTION = () => { };
    static readonly DEFAULT_INPUTS: Inputs = {
        jump: "z",
        left: "q",
        right: "f",
        crouch: "s",
        pause: "Escape"
    };

    readonly player: Children = new Children();
    readonly size: Size = { width: Math.round(window.innerWidth / 2), height: Math.round(window.innerHeight / 2) };
    readonly audioContext: AudioContext = new AudioContext();
    readonly gain: GainNode = this.audioContext.createGain();

    readonly canvas: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;
    readonly debug: boolean;

    keyPressed: KeyPressed = {};
    engine: number | NodeJS.Timeout = 0;
    entities: Spatial2DObject = {
        [this.player.id]: {
            position: this.player.position,
            size: this.player.hitbox,
            update: this.player.update,
        }
    }; // Par défaut le joueur est présent

    //TODO : à définir
    clickableElements: Clickables = {};
    slidersElements: Sliders = {};
    isMuted: boolean = false;
    lastTimeCheckPerformance: number = performance.now();
    frameCount: number = 0;
    fps: number = 0;
    dragging: Slider | null = null;

    inputs: Inputs;
    state: EngineState;
    stage: StageNumber;
    tps: number;
    backgroundSound: Sound = {
        url: "./sounds/backgrounds/main.mp3",
        loop: true
    };

    constructor(canvas: HTMLCanvasElement, options: EngineOptions = {}) {
        if (!canvas) throw new Error("Impossible d'initialiser le jeu, canvas manquant");
        this.canvas = canvas;
        const context = this.canvas.getContext('2d');
        if (!context) throw new Error("Impossible d'initialiser le context");
        this.context = context;

        this.gain.connect(this.audioContext.destination);

        this.canvas.width = this.size.width;
        this.canvas.height = this.size.height;

        this.inputs = options.inputs ?? Engine.DEFAULT_INPUTS;
        this.debug = options.debug ?? false;
        this.state = options.state ?? 'lobby';
        this.stage = options.stage ?? 0;
        this.tps = 1000 / (options.tps ?? 20);

        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        this.addEventListeners();

        if (this.debug) this.showDebug();
        this.init();
    }

    showDebug() {
        requestAnimationFrame(this.drawFPS);
    }

    /** Affiche une entité dans la fenêtre de jeu
     * @param context Context du jeu
     * @param entity Entité à afficher
     */
    static displayEntity(context: CanvasRenderingContext2D, entity: Entity): void {
        const img = new Image();
        img.src = entity.sprite.url;
        img.onload = () => {
            context.clearRect(entity.position.x, entity.position.y, entity.sprite.size.width, entity.sprite.size.height);
            context.drawImage(
                img,
                entity.sprite.currentSprite * entity.sprite.size.width,
                0,
                entity.sprite.size.width,
                entity.sprite.size.height,
                entity.position.x,
                entity.position.y,
                entity.sprite.size.width,
                entity.sprite.size.width
            );
        };
    }

    /** Génère un identifiant (supposé) unique
     * @example const uid = Engine.createUID() // 1741543170-5464
     */
    static createUID() {
        return `${Date.now()}-${Math.floor(Math.random() * Date.now())}`;
    }

    private init() {
        this.loadCSS('/css/game.min.css');
        this.prepareEngine({
            width: `${this.canvas.width}px`,
            height: `${this.canvas.height}px`,
            backgroundImage: 'url("/sprites/backgrounds/main-large.png")'
        });
        this.statement();
    }

    private async loadCSS(url: string) {
        await new Promise(_ => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = url;

            // Ajouter l'élément <link> au <head>
            document.head.appendChild(link);
        });
    }

    /** Remet à 0 le moteur du jeu */
    private resetEngine() {
        clearInterval(this.engine);
        this.engine = 0;
    }

    private updateDOMEngine(css: Partial<CSSStyleDeclaration>, element: HTMLElement = this.canvas) {
        Object.keys(css).forEach(key => {
            key !== "length" && key !== "parentRule" && key in element.style
                //@ts-ignore
                ? element.style[key] = `${css[key]}`
                : console.warn(`La propriété "${key}" n'est pas valide`);
        });
    }

    private clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const elements = { ...this.clickableElements, ...this.slidersElements };
        for (const el of Object.values(elements)) {
            this.clearElement(el);
        }
    }

    private clearElement(element: InteractiveElement) {
        if (!element.value) {
            this.context.clearRect(element.position.x, element.position.y, element.size.width, element.size.height);
            delete this.clickableElements[element.id];
        } else if (element.id in this.slidersElements) {
            this.context.clearRect(element.position.x, element.position.y, element.size.width, element.radius && element.radius > element.size.height ? element.radius : element.size.height);
            delete this.slidersElements[element.id];
        }

    }

    private statement() {
        switch (this.state) {
            case "lobby":
                this.lobby();
                break;
            case 'settings':
                this.settings();
                break;
            case 'play':
                this.start();
                break;
            case 'win':
                this.win();
                break;
            case 'defeat':
                this.defeat();
                break;
            default:
                this.lobby();
                break;
        }
    }

    private handleCanvasClick(e: MouseEvent) {
        const r = this.canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        for (const el of Object.values(this.clickableElements)) {
            if (
                x >= el.position.x &&
                x <= el.position.x + el.size.width &&
                y >= el.position.y &&
                y <= el.position.y + el.size.height
            ) {
                el.action();
                break;
            }
        }
    }

    private lobby() {
        this.prepareEngine({ backgroundImage: 'url("/sprites/backgrounds/main-large.png")' });

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.playSound(this.backgroundSound);

        const img = new Image();
        img.src = '/sprites/logo.png';
        img.onload = () => {
            const sizeImage: Size = {
                width: img.width,
                height: img.height
            };

            const ImagePosOnCanvas: Position = {
                x: (this.canvas.width / 2) - (sizeImage.width / 2),
                y: (this.canvas.height / 2) - (sizeImage.height / 2) - 100
            };

            this.drawImage(
                img,
                { x: 0, y: 0 },
                sizeImage,
                ImagePosOnCanvas,
                sizeImage,
                () => {
                    this.stage = 0;
                    this.lobby();
                }
            );

            const text = 'Jouer';

            const TextPosOnCanvas: Position = {
                x: (this.canvas.width / 2) - (sizeImage.width / 2) - (this.context.measureText(text).width / 2),
                y: (this.canvas.height / 2) - (sizeImage.height / 2)
            };

            this.drawText(text, TextPosOnCanvas, {
                actionOnClick: () => {
                    this.stage = 1;
                    this.start();
                }
            });
        }
    }

    private settings() {
        this.prepareEngine({
            backgroundImage: "url('/sprites/backgrounds/settings.webp')"
        });
    }

    private prepareEngine(css: Partial<CSSStyleDeclaration> = {}) {
        this.resetEngine();
        this.clearScreen();
        this.updateDOMEngine(css);
    }

    private start() {
        if (this.stage) {
            this.prepareEngine({
                backgroundImage: `url("/sprites/backgrounds/stage_${this.stage}.webp")`
            });
            this.engine = setInterval(() => {
                this.update();
            }, this.tps);
        } else {
            this.lobby();
        }
    }

    private win() {
        this.prepareEngine({
            backgroundImage: "url('/sprites/backgrounds/win.webp')"
        });
    }

    private defeat() {
        this.prepareEngine({
            backgroundImage: "url('/sprites/backgrounds/defeat.webp')"
        });
    }

    checkCollision(entity1: Entity, entity2: Entity) {
        return entity1.position.x < entity2.position.x + entity2.hitbox.width &&
            entity1.position.x + entity1.hitbox.width > entity2.position.x &&
            entity1.position.y < entity2.position.y + entity2.hitbox.height &&
            entity1.position.y + entity1.hitbox.height > entity2.position.y;
    }

    destroyEntity(entity: Entity) {
        document.getElementById(entity.id)?.remove();
        delete this.entities[entity.id];
    }

    applyDamage(entity: Entity, amount: number) {
        const newHealth = entity.health - amount;
        const isDead = !this.checkHealth({ ...entity, health: newHealth })
        entity.health = isDead ? 0 : newHealth;
        return isDead;
    }

    giveHealthToPlayer(amount: number) {
        const newHealth = this.player.health + amount;
        this.player.health = newHealth >= Children.maxHealth ? Children.maxHealth : newHealth;
    }

    giveHealthToEntity(entity: Entity, amount: number) { entity.health += amount; }

    spawnEntity(entity: SpawnEntity<"ange" | "bullet" | "children">) {
        let e: Entity;

        if ('type' in entity && entity.type) {
            // Spawn un Ange
            if (entity.type === "ground") {
                e = new GroundAnge(entity.position);
            } else if (entity.type === "flying") {
                e = new FlyingAnge(entity.position);
            } else {
                throw new Error(`Type d'ange non supporté : ${entity.type}`);
            }
        } else if ('origin' in entity && entity.origin) {
            // Spawn une Bullet
            e = new Bullet(entity.origin, entity.position, entity.vector, entity.angle);
        } else {
            // Spawn un Children
            e = new Children(entity.position);
        }

        this.entities[e.id] = {
            position: e.position,
            size: e.hitbox,
            update: e.update,
        };
    }

    checkInputsEntries() {
        Object.keys(this.inputs).forEach(key => {
            if (this.inputs[key as keyof Inputs] === '') throw new Error("Impossible d'assigner une touche vide");
        });
    }

    update() {
        Object.keys(this.entities).forEach(key => {
            this.entities[key].update(this.context);
        });
    }

    checkHealth(entity: Entity) {
        return entity.health > 0; // Si la vie est 0 à zéro ou négatif alors on considère que l'entité est "mort"
    }

    private toggleSoundIcon(sound: Sound, isSoundOn: boolean) {
        const img = new Image();
        img.src = isSoundOn ? '/sprites/soundOn-small.png' : '/sprites/soundOff-small.png';

        img.onload = () => {
            const Element: Clickable = {
                id: Engine.createUID(),
                position: { x: 10, y: 10 },
                size: { width: img.width, height: img.height },
                action: () => {
                    isSoundOn ? this.setAudioVolume(1) : this.setAudioVolume(0);
                    this.playAudio(sound);
                    this.clearElement(Element);
                    this.toggleSoundIcon(sound, !isSoundOn);
                }
            };

            this.drawImage(
                img,
                { x: 0, y: 0 },
                Element.size,
                Element.position,
                Element.size,
                Element.action
            );
        };
    }

    playSound(sound: Sound): void {
        if (this.audioContext.state === 'suspended') {
            this.drawSlider({ x: 10, y: 10 }, .5, {
                actionOnDrag: (v: number) => this.setAudioVolume(v)
            });
            this.toggleSoundIcon(sound, false);
        } else {
            this.playAudio(sound);
        }
    }

    setAudioVolume(value: number): void {
        if (0 <= value && value <= 1) {
            this.gain.gain.value = value;
        }
    }

    private playAudio(sound: Sound) {
        fetch(sound.url)
            .then(res => {
                if (!res.ok) throw new Error("Impossible de récupérer le son");
                return res.arrayBuffer();
            })
            .then(buffer => this.audioContext.decodeAudioData(buffer))
            .then(buffer => {
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.gain);
                source.start();
                source.loop = sound.loop;
            })
            .catch(err => console.error(`Oups ! Un problème est survenu ! : ${err}`));
    }

    drawSlider(
        position: Position,
        value: number,
        options: SliderOptions = {}
    ) {
        const sliderColor = options.sliderColor ?? "gray";
        const sliderHeight = options.size?.height ?? 5;
        const sliderWidth = options.size?.width ?? 200;
        const cursorColor = options.cursorColor ?? "blue";
        const cursorRadius = options.cursorRadius ?? 8;

        this.context.clearRect(position.x, position.y, sliderWidth, sliderHeight > cursorRadius ? sliderHeight : cursorRadius);

        // Dessiner la ligne du curseur
        this.context.fillStyle = sliderColor;
        this.context.fillRect(position.x, position.y, sliderWidth, sliderHeight);

        // Dessiner le bouton
        const knobX = position.x + value * sliderWidth;
        this.context.beginPath();
        this.context.arc(knobX, position.y + (sliderHeight / 2), cursorRadius, 0, Math.PI * 2);
        this.context.fillStyle = cursorColor;
        this.context.fill();

        const id = Engine.createUID();

        this.slidersElements[id] = {
            id: id,
            position: position,
            size: {
                width: sliderWidth,
                height: sliderHeight
            },
            sliderColor: sliderColor,
            cursorColor: cursorColor,
            radius: cursorRadius,
            value: value,
            action: options.actionOnDrag ?? Engine.NO_ACTION
        }
    }

    drawImage(
        source: CanvasImageSource,
        posImage: Position,
        sizeImage: Size,
        posOnCanvas: Position,
        printedSize: Size,
        actionOnClick: () => void = Engine.NO_ACTION
    ) {
        const id = Engine.createUID();
        this.context.clearRect(posOnCanvas.x, posOnCanvas.y, sizeImage.width, sizeImage.height);
        this.context.drawImage(
            source,
            posImage.x,
            posImage.y,
            sizeImage.width,
            sizeImage.height,
            posOnCanvas.x,
            posOnCanvas.y,
            printedSize.width,
            printedSize.height
        )
        this.clickableElements[id] = {
            id: id,
            position: {
                x: posOnCanvas.x,
                y: posOnCanvas.y
            },
            size: {
                width: sizeImage.width,
                height: sizeImage.height
            },
            action: actionOnClick
        };
    }

    drawText(
        text: string,
        posText: Position,
        options: TextOptions = {
            fontName: "Jersey",
            fontSize: 24,
            color: "#fff",
            actionOnClick: Engine.NO_ACTION
        }
    ) {
        const fontSize = options.fontSize ?? 24;
        const id = Engine.createUID();

        this.context.font = `${fontSize}px ${options.fontName ?? "Jersey"}`;
        this.context.fillStyle = options.color ?? "#fff";
        this.context.fillText(text, posText.x, posText.y);
        this.clickableElements[id] = {
            id: id,
            position: {
                x: posText.x,
                y: posText.y
            },
            size: {
                width: this.context.measureText(text).width,
                height: fontSize
            },
            action: options.actionOnClick ?? Engine.NO_ACTION
        };
    }

    drawFPS = () => {
        const now = performance.now();
        this.frameCount++;

        if (now - this.lastTimeCheckPerformance >= 1000) { // Vérifie chaque seconde
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastTimeCheckPerformance = now;
        }

        const text = `FPS: ${this.fps}`;

        const textWidth = this.context.measureText(text).width;
        const posText: Position = {
            x: this.canvas.width - textWidth - 50,
            y: 32
        };
        this.context.clearRect(posText.x - 10, 0, textWidth + 50, 40)

        this.drawText(text, posText);
        requestAnimationFrame(this.drawFPS);
    }

    addEventListeners() {
        this.canvas.addEventListener("mousedown", (e) => {
            for (const slider of Object.values(this.slidersElements)) {
                const knobX = slider.position.x + slider.value * slider.size.width;
                if (Math.abs(e.offsetX - knobX) < slider.radius && Math.abs(e.offsetY - slider.position.y) < slider.radius) this.dragging = slider;
            }
        });

        this.canvas.addEventListener("mousemove", (e) => {
            if (this.dragging) {
                const volume = Math.max(0, Math.min(1, (e.offsetX - this.dragging.position.x) / this.dragging.size.width));
                this.dragging.value = volume;
                this.dragging.action(volume);
                this.drawSlider(this.dragging.position, this.dragging.value);
            }
        });

        this.canvas.addEventListener("mouseup", () => {
            this.dragging = null;
        });

        this.canvas.addEventListener("mouseleave", () => {
            this.dragging = null;
        });
    }
}

// this.cursor.currentSprite += this.cursor.direction;
// if (this.cursor.currentSprite >= this.cursor.spriteCount - 1) {
//     this.cursor.direction = -1;
// } else if (this.cursor.currentSprite <= 0) {
//     this.cursor.direction = 1;
// }