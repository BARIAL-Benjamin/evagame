/**
 * @type { HTMLDivElement | null }
 */
const bestiary = document.getElementById('bestiary');

if (!bestiary) throw new Error("Impossible de trouver l'élément 'bestiary'");

/**
 * @type { HTMLDivElement | null }
 */
const eva01 = bestiary.querySelector('#eva01');
/**
 * @type { HTMLDivElement | null }
 */
const eva02 = bestiary.querySelector('#eva02');
/**
 * @type { HTMLDivElement | null }
 */
const ange = bestiary.querySelector('#ange');

/**
 * @typedef { Object } Size
 * @property { number } width
 * @property { number } height
 */

/**
 * @param { HTMLElement } element Elément ou afficher
 * @param { Size } size Taille des sprites
 * @param { string } lien Lien vers les sprites
 * @param { number } currentSprite Sprite courrant
 */
function displaySprite(element, size, lien, currentSprite) {
    if (!element) throw new Error(`Elément "${id}" n'existe pas`);
    element.style.backgroundImage = `url("${lien}")`;
    element.style.backgroundSize = `${size.width} ${size.height}`;
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = `-${(currentSprite - 1) * size.width}px 0`;
    element.style.imageRendering = 'pixelated';
    element.style.transition = "none";
    element.style.transform = "scaleX(-1)";
}

/**
 * @param { number } count Nombre de sprites aux total
 * @param { number } currentSprite Sprite à afficher
 * @param { number } [start=0] Point de départ des sprites
 * @param { number } [end=count] Point de fin des sprites
 * @returns { number } Sprite courant
 */
function updateCurrentSprite(count, currentSprite, start = 1) {
    let res = currentSprite > start ? currentSprite % count : start % count;
    return !res && currentSprite === count ? start : ++res;
}

const tps = 1000 / 10;

let currentSpriteEva01Move = 0;
let currentSpriteEva01Jump = 0;
if (eva01) {
    setInterval(() => {
        currentSpriteEva01Move = updateCurrentSprite(23, currentSpriteEva01Move, 11);
        currentSpriteEva01Jump = updateCurrentSprite(10, currentSpriteEva01Jump);
        displaySprite(
            eva01.querySelector('ul>li.move'),
            {
                width: 83,
                height: 73
            },
            '/sprites/eva/01/run/run.png',
            currentSpriteEva01Move
        );
        displaySprite(
            eva01.querySelector('ul>li.jump'),
            {
                width: 72,
                height: 74
            },
            '/sprites/eva/01/jump/jump.png',
            currentSpriteEva01Jump
        );
    }, tps);
}

let currentSpriteEva02Move = 0;
let currentSpriteEva02Jump = 0;
if (eva02) {
    setInterval(() => {
        currentSpriteEva02Move = updateCurrentSprite(23, currentSpriteEva02Move, 11);
        currentSpriteEva02Jump = updateCurrentSprite(11, currentSpriteEva02Jump);
        displaySprite(
            eva02.querySelector('ul>li.move'),
            {
                width: 72,
                height: 73
            },
            '/sprites/eva/02/run/run.png',
            currentSpriteEva02Move
        );
        displaySprite(
            eva02.querySelector('ul>li.jump'),
            {
                width: 74,
                height: 78
            },
            '/sprites/eva/02/jump/jump.png',
            currentSpriteEva02Jump
        );
    }, tps);
}

let currentSpriteAnge = 0;
if (ange) {
    setInterval(() => {
        currentSpriteAnge = updateCurrentSprite(4, currentSpriteAnge);
        displaySprite(
            ange.querySelector('ul>li'),
            {
                width: 64,
                height: 98
            },
            '/sprites/ange/ange.png',
            currentSpriteAnge
        );
    }, tps);
}