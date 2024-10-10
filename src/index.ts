import { Application, Assets, Graphics, noiseWgsl, Sprite } from 'pixi.js';
import { AssetsLoader } from './assets_handle/assetsloader';
import { GameBoard } from './game_setup/gameboard';
import { GameConfig } from './game_setup/gameconfig';
import { SoundManager } from './game_setup/soundmanager';


// Asynchronous IIFE
(async () => {
    const app = new Application();
    const canvas = <HTMLCanvasElement>document.getElementById('GameCanvas');
    await app.init({ background: '#cccccc', canvas: canvas, width: GameConfig.SCREEN_WIDTH, height: GameConfig.SCREEN_HEIGHT });

    // Load assets
    const assetsLoader = new AssetsLoader();
    await assetsLoader.loadAssets();

    const soundManager = new SoundManager();

    const gameBoard = new GameBoard(app);


    app.ticker.add((sticker) => {
        gameBoard.Update(sticker.deltaMS);
    });
})();