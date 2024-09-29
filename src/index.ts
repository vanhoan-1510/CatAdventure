import { Application, Assets, Graphics, Sprite } from 'pixi.js';
import { AssetsLoader } from './assets_handle/assetsloader';
import { GameBoard } from './game_setup/gameboard';


// Asynchronous IIFE
(async () => {
    const app = new Application();
    // Lấy canvas element từ HTML
    const canvas = <HTMLCanvasElement>document.getElementById('GameCanvas');
    // Cài đặt app với canvas.
    await app.init({ background: '#cccccc', canvas: canvas, width: 1280, height: 720 });

    // Load assets
    const assetsLoader = new AssetsLoader();
    await assetsLoader.loadAssets();

    const gameBoard = new GameBoard(app);


    app.ticker.add((sticker) => {
        gameBoard.Update(sticker.deltaMS);
    });
})();