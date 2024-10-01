import { Assets, Texture, TilingSprite, Point, Container } from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
import { Body } from '../physics/body';
import { World } from '../physics/world';
import { GameConfig } from '../game_setup/gameconfig';

export class TileMap extends Container{
    private tilemap: CompositeTilemap;
    private textures: Texture[] = [];

    public world: World;
    private bgSprite: TilingSprite;

    constructor(world: World){
        super();
        this.world = world;
        this.Init();
    }

    SetBackground() {
        const bgTexture = Assets.get('background');
        this.bgSprite = TilingSprite.from(bgTexture, {
            width: GameConfig.WORLD_WIDTH
        });
        this.bgSprite.scale.set(1.2);
        this.addChild(this.bgSprite);
    }

    DrawTileMap() {
        for (let i = 1; i <= 18; i++) {
            const texture = Assets.get(`tile${i}`);
            this.textures.push(texture);
        }

        this.DrawMapLoop(GameConfig.TILE_MAP1, 0, GameConfig.SCREEN_HEIGHT / 1.5 + GameConfig.TILE_SIZE * 4);
        this.DrawMapLoop(GameConfig.TILE_MAP2, GameConfig.SCREEN_WIDTH, GameConfig.SCREEN_HEIGHT / 1.5 + GameConfig.TILE_SIZE * 4 );

        
        this.addChild(this.tilemap);
    }

    DrawMapLoop(map: number[][], startX: number, startY: number) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tileType = map[y][x];
                const texture = this.textures[tileType - 1];
                this.tilemap.tile(texture, startX + x * GameConfig.TILE_SIZE, startY + y * GameConfig.TILE_SIZE);
                const tileBody = new Body(startX + x * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE, startY + y * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE, GameConfig.TILE_SIZE / 2, GameConfig.TILE_SIZE / 2, 0, true, 0);
                this.world.addBodyB(tileBody);
            }
        }
    }

    Init() {
        this.tilemap = new CompositeTilemap();
        this.SetBackground();
        this.DrawTileMap();
    }
}
