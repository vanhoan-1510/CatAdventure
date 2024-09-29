import { Application, Assets, Sprite, TilingSprite } from "pixi.js";
import { TileMap } from "../tile_map/tilemap";
import { Character } from "../character/character";
import { World } from "../physics/world";
import { Gravity } from "../physics/gravity";

export class GameBoard {
    private app: Application;
    private character: Character;
    private tileMap: TileMap; // Add tileMap property
    private world: World;
    private gravity: Gravity;

    constructor(app: Application) {
        this.app = app;
        this.Init();
    }

    async Init() {
        this.gravity = new Gravity(2);
        this.world = new World(this.gravity);
        this.tileMap = new TileMap(this.app, this.world); // Initialize tileMap
        await this.tileMap.DrawTileMap();

        this.character = new Character(this.app, this.world); // Pass world to character
        this.character.Init();
    }

    public Update(delta: number) {
        this.character.Update(delta); // Update character
    }
}