import { Application, Assets, Container, Sprite, TilingSprite } from "pixi.js";
import { TileMap } from "../tile_map/tilemap";
import { Character } from "../character/character";
import { World } from "../physics/world";
import { Gravity } from "../physics/gravity";
import { Trap } from '../trap/trapsetup';
import { Viewport } from "pixi-viewport";
import { GameConfig } from "./gameconfig";

export class GameBoard {
    private app: Application;
    private gameContainer: Container; // Contains both tileMap and characterContainer
    private tileMapContainer: Container; // Separate container for tileMap
    private characterContainer: Container; // Separate container for character
    private character: Character;
    private tileMap: TileMap; 
    private world: World;
    private trap: Trap;
    private isTrap1Activated: boolean = false;
    private isFootIconShow: boolean = false;
    private isFootTrapActivated: boolean = false;
    
    private viewport: Viewport;

    constructor(app: Application) {
        this.app = app;
        this.Init();
    }

    Init() {
        this.world = new World(GameConfig.GRAVITY);

        // Initialize containers
        this.gameContainer = new Container();
        this.tileMapContainer = new Container();
        this.characterContainer = new Container();

        // Initialize and add tileMap to its container
        this.tileMap = new TileMap(this.world); 
        this.tileMapContainer.addChild(this.tileMap); 
        this.tileMap.DrawTileMap();

        // Initialize and add character to its container
        this.character = new Character(this.world); 
        this.characterContainer.addChild(this.character);
        this.character.Init();

        // Initialize and add trap to its container
        this.trap = new Trap(this.world);
        this.trap.addChild(this.trap);

        // Add both tileMapContainer and characterContainer to gameContainer
        this.gameContainer.addChild(this.tileMapContainer);
        this.gameContainer.addChild(this.characterContainer);
        this.gameContainer.addChild(this.trap);

        // Initialize and set up the viewport
        this.viewport = new Viewport({
            screenWidth: this.app.screen.width,
            screenHeight: this.app.screen.height,
            worldWidth: GameConfig.WORLD_WIDTH,
            worldHeight: GameConfig.WORLD_HEIGHT,
            events: this.app.renderer.events
        });

        this.app.stage.addChild(this.viewport);
        this.viewport.addChild(this.gameContainer);

        // Clamp the viewport within world boundaries
        this.viewport.clamp({
            left: 0,
            right: GameConfig.WORLD_WIDTH,
            top: 0,
            bottom: GameConfig.WORLD_HEIGHT,
        });

        // Set the character in the center of the viewport initially
        this.viewport.moveCenter(this.character.x, this.character.y);

        // Follow the character
        this.viewport.follow(this.character);
    }

    Trap1Resolve() {
        if (!this.isTrap1Activated && 
            this.character.position.x >= this.trap.trap1.position.x - 50 && this.character.position.x <= this.trap.trap1.position.x + 50 &&
            this.character.position.y >= this.trap.trap1.position.y - 50 && this.character.position.y <= this.trap.trap1.position.y + 50
        ) {
            this.trap.Resolvetrap1();
            this.isTrap1Activated = true; // Set flag to true to ensure it only activates once
        }
    }

    Trap2Resolve() {
        if (this.character.position.x >= this.trap.footIcon.position.x - 20 && this.character.position.x <= this.trap.footIcon.position.x + 20 &&
            this.character.position.y >= this.trap.footIcon.position.y - 20 && this.character.position.y <= this.trap.footIcon.position.y + 100 &&
            !this.isFootIconShow
        ) {
            this.isFootIconShow = true; // Set flag to true to ensure it only activates once
        }

        if(this.character.position.x >= 1740 && !this.isFootTrapActivated
        ) {
            this.isFootTrapActivated = true; // Set flag to true to ensure it only activates once
        }
    }


    public Update(delta: number) {
        this.character.Update(delta);
        this.viewport.update(delta);
        this.Trap1Resolve();
        this.Trap2Resolve();
        if (this.isFootIconShow) {
            this.trap.ShowFootIcon(delta);
        }
        if (this.isFootTrapActivated) {
            this.trap.ShowFootTrap(delta);
        }
    }
}