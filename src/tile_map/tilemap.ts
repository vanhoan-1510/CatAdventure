import { Assets, Texture, TilingSprite, Point, Container } from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
import { Body } from '../physics/body';
import { World } from '../physics/world';
import { GameConfig } from '../game_setup/gameconfig';

export class TileMap extends Container{
    private tilemap: CompositeTilemap;
    public world: World;
    private bgSprite: TilingSprite; // Thêm biến cho TilingSprite

    // Mảng đại diện cho tilemap
    public map: number[][]; 

    constructor(world: World){
        super();
        this.tilemap = new CompositeTilemap();
        this.map = []; // Khởi tạo mảng tilemap
        this.world = world; // Khởi tạo world từ tham số truyền vào
        this.Init();
    }

    SetBackground() {
        const bgTexture = Assets.get('background');
        this.bgSprite = TilingSprite.from(bgTexture, {
            width: 90000,
            height: GameConfig.HEIGHT,
        });
        this.addChild(this.bgSprite);
    }

    DrawTileMap() {
        const textures: Texture[] = [];
        
        for (let i = 1; i <= 18; i++) {
            const texture = Assets.get(`tile${i}`);
            textures.push(texture);
        }

        this.map = GameConfig.TILE_MAP; // Gán giá trị từ GameConfig.TILE_MAP cho map

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                const tileType = this.map[y][x];
                const texture = textures[tileType - 1];
                const startY = GameConfig.HEIGHT / 2 + GameConfig.TILE_SIZE * 2;
                this.tilemap.tile(texture, x * GameConfig.TILE_SIZE, startY + y * GameConfig.TILE_SIZE);
                const tileBody = new Body(x * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE / 2, startY + y * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE, GameConfig.TILE_SIZE / 2, GameConfig.TILE_SIZE / 2, 0, true, 0);
                this.world.addBodyB(tileBody);
            }
        }
        this.addChild(this.tilemap);
    }

    getTileSize() {
        return GameConfig.TILE_SIZE;
    }

    Init() {
        this.SetBackground();
        this.DrawTileMap();
    }
}
