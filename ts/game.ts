import Engine from './engine';
import type { EngineOptions } from './types/engine.d.ts';

window.addEventListener('load', () => {
    const canvasGame = document.querySelector<HTMLCanvasElement>('#evagame');
    if (!canvasGame) throw new Error("Impossible d'initialiser le jeu, canvas manquant");
    
    const options: EngineOptions = { debug: true };
    
    new Engine(canvasGame, options);
})