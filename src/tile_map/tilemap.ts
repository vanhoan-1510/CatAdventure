import { Assets, Texture, TilingSprite, Point, Container, Sprite } from 'pixi.js';
import { CompositeTilemap } from '@pixi/tilemap';
import { Body } from '../physics/body';
import { World } from '../physics/world';
import { GameConfig } from '../game_setup/gameconfig';

export class TileMap extends Container{
    private tilemap: CompositeTilemap;
    private textures: Texture[] = [];
    private savePointTexture: Texture;

    public world: World;
    private bgSprite: TilingSprite;
    private savePoint: Sprite;

    constructor(world: World){
        super();
        this.world = world;
        this.Init();
    }

    SetBackground() {
        const bgTexture = Assets.get('background');
        this.bgSprite = TilingSprite.from(bgTexture, {
            width: GameConfig.WORLD_WIDTH,
            height: GameConfig.WORLD_HEIGHT
        });
        this.bgSprite.position.y = -800
        this.bgSprite.scale.set(1);
        this.addChild(this.bgSprite);
    }

    DrawTileMap() {
        for (let i = 1; i <= 18; i++) {
            const texture = Assets.get(`tile${i}`);
            this.textures.push(texture);
        }

        this.DrawMapLoop(GameConfig.TILE_MAP1, 0, GameConfig.SCREEN_HEIGHT / 1.5 + GameConfig.TILE_SIZE * 4);
        this.DrawMapLoop(GameConfig.TILE_MAP2, GameConfig.SCREEN_WIDTH - 100, GameConfig.SCREEN_HEIGHT / 1.5 + GameConfig.TILE_SIZE * 4 );
        this.DrawMapLoop(GameConfig.TILE_MAP3, GameConfig.SCREEN_WIDTH * 3 - 400 , GameConfig.SCREEN_HEIGHT / 1.5 + GameConfig.TILE_SIZE * 4);
        this.DrawMapLoop(GameConfig.TILE_MAP4, GameConfig.SCREEN_WIDTH * 3 - 585, GameConfig.SCREEN_HEIGHT / 1.5 + GameConfig.TILE_SIZE * 5);
        this.DrawMapLoop(GameConfig.TILE_MAP5, GameConfig.SCREEN_WIDTH * 4 + 700, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2);
        this.DrawMapLoop(GameConfig.TILE_MAP6, GameConfig.SCREEN_WIDTH * 4 + 140, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 11);
        this.DrawMapLoop(GameConfig.TILE_MAP7, GameConfig.SCREEN_WIDTH * 4 + 170, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2);
        this.DrawMapLoop(GameConfig.TILE_MAP8, GameConfig.SCREEN_WIDTH * 5 + 140, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 8);
        this.DrawMapLoop(GameConfig.TILE_MAP9, GameConfig.SCREEN_WIDTH * 6 - 200,  GameConfig.TILE_SIZE * 2);

        
        this.addChild(this.tilemap);
    }

    DrawMapLoop(map: number[][], startX: number, startY: number) {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                const tileType = map[y][x];
                const texture = this.textures[tileType - 1];
                this.tilemap.tile(texture, startX + x * GameConfig.TILE_SIZE, startY + y * GameConfig.TILE_SIZE);
                const tileBody = new Body(startX + x * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE, startY + y * GameConfig.TILE_SIZE + GameConfig.TILE_SIZE, 
                    GameConfig.TILE_SIZE / 2, GameConfig.TILE_SIZE / 2, 0, true, 0, 'ground');
                this.world.addBodyB(tileBody);
            }
        }
    }

    
    TutorialNotification(){
        const tutorialBanner = new Sprite(Assets.get('helpbanner'));
        tutorialBanner.position.set(400, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2 );
        tutorialBanner.anchor.set(0.5, 0.5);
        this.addChild(tutorialBanner);
    }

    WinNotification(){
        const winBanner = new Sprite(Assets.get('winbanner'));
        winBanner.position.set(10300, -GameConfig.TILE_SIZE * 5 );
        winBanner.anchor.set(0.5, 0.5);
        this.addChild(winBanner);
    }

    Init() {
        this.SetBackground();

        this.savePointTexture = Assets.get('savepoint');
        this.savePoint = Sprite.from(this.savePointTexture);
        this.savePoint.anchor.set(0.5, 0.5);
        this.savePoint.position = GameConfig.SAVE_POINT_DEFAULT_POSISION;
        this.addChild(this.savePoint);

        this.tilemap = new CompositeTilemap();
        this.DrawTileMap();
        this.TutorialNotification();
        this.WinNotification();
    }
}
