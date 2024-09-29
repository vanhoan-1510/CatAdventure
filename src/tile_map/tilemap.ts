import { Application, Assets, Texture, TilingSprite } from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
import { Body } from '../physics/body';
import { World } from '../physics/world';

export class TileMap {
    private app: Application;
    private tilemap: CompositeTilemap;
    private tileTextures: Texture[] = [];
    public tileSize = 32; // Kích thước mỗi ô
    public world: World;

    // Mảng đại diện cho tilemap
    public map: number[][]; 

    constructor(app: Application, world: World) {
        this.app = app;
        this.tilemap = new CompositeTilemap();
        this.map = []; // Khởi tạo mảng tilemap
        this.world = world; // Khởi tạo world từ tham số truyền vào
        this.Init();
    }

    async SetBackground() {
        const bgTexture = await Assets.get('background');
        const bgSprite = TilingSprite.from(bgTexture, {
            width: this.app.screen.width,
            height: this.app.screen.height,
        });
        this.app.stage.addChild(bgSprite);
    }

    async DrawTileMap() {
        const textures: Texture[] = [];
        
        for (let i = 1; i <= 18; i++) {
            const texture = await Assets.get(`tile${i}`);
            textures.push(texture);
        }

        // Mảng đại diện cho tilemap
        this.map = [
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6],
            [8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10]
        ];

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const tileType = this.map[y][x];
                const texture = textures[tileType - 1];
                const startY = this.app.screen.height / 2 + 50;
                this.tilemap.tile(texture, x * this.tileSize, startY + y * this.tileSize);
                const tileBody = new Body(x * this.tileSize, startY + y * this.tileSize + this.tileSize, this.tileSize/2, 0, true, 0);
                this.world.addBodyB(tileBody);
            }
        }
        this.app.stage.addChild(this.tilemap);
    }

    getTileSize() {
        return this.tileSize;
    }

    Init() {
        this.tileTextures = [];
        this.SetBackground();
        this.DrawTileMap();
    }

    update(delta: number) {
        this.world.update(delta);
    }
}