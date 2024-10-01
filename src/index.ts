import { Application, Assets, Graphics, Sprite } from 'pixi.js';
import { AssetsLoader } from './assets_handle/assetsloader';
import { GameBoard } from './game_setup/gameboard';
import { GameConfig } from './game_setup/gameconfig';


// Asynchronous IIFE
(async () => {
    const app = new Application();
    // Lấy canvas element từ HTML
    const canvas = <HTMLCanvasElement>document.getElementById('GameCanvas');
    // Cài đặt app với canvas.
    await app.init({ background: '#cccccc', canvas: canvas, width: GameConfig.SCREEN_WIDTH, height: GameConfig.SCREEN_HEIGHT });

    // Load assets
    const assetsLoader = new AssetsLoader();
    await assetsLoader.loadAssets();

    const gameBoard = new GameBoard(app);


    app.ticker.add((sticker) => {
        gameBoard.Update(sticker.deltaMS);
    });
})();