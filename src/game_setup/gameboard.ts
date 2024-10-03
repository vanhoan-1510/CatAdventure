import { Application, Assets, Container, Sprite, TilingSprite } from "pixi.js";
import { TileMap } from "../tile_map/tilemap";
import { Character } from "../character/character";
import { World } from "../physics/world";
import { Trap } from '../trap/trapsetup';
import { Viewport } from "pixi-viewport";
import { GameConfig } from "./gameconfig";
import { EventHandle } from "../eventhandle/eventhandle";

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
    private farthestPointReached: number = 0;

    constructor(app: Application) {
        this.app = app;
        this.Init();

        EventHandle.on('ResetGame', () => this.ResetGame());
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
            this.character.position.x >= this.trap.questionBlock.position.x - 50 && this.character.position.x <= this.trap.questionBlock.position.x + 50 &&
            this.character.position.y >= this.trap.questionBlock.position.y - 70 && this.character.position.y <= this.trap.questionBlock.position.y + 70
        ) {
            this.trap.Resolvetrap1();
            this.isTrap1Activated = true;
        }
    }

    Trap2Resolve() {
        if (this.character.position.x >= this.trap.footIcon.position.x - 20 && this.character.position.x <= this.trap.footIcon.position.x + 30 &&
            this.character.position.y >= this.trap.footIcon.position.y - 30 && this.character.position.y <= this.trap.footIcon.position.y + 100 &&
            !this.isFootIconShow
        ) {
            this.isFootIconShow = true;
        }

        if(this.isFootIconShow
            && this.character.position.x >= this.trap.footIcon.position.x - 30 && this.character.position.x <= this.trap.footIcon.position.x + 30
            && this.character.position.y >= this.trap.footIcon.position.y - 100&& this.character.position.y <= this.trap.footIcon.position.y 
        ) {
            this.isFootTrapActivated = true;
            EventHandle.emit('Dead');
        }
    }

    Trap3Resolve() {
        if (this.character.position.x >= this.trap.sun.position.x - 70
        ) {
            this.trap.Trap3Resolve();
        }
    }


    public Update(delta: number) {
        this.character.Update(delta);
        this.trap.update(delta);
        this.viewport.update(delta);
        this.Trap1Resolve();
        this.Trap2Resolve();
        this.Trap3Resolve();
        this.trap.Trap4Resolve(this.character.position, this.character.characterBody);
        if (this.isFootIconShow) {
            this.trap.ShowFootIcon(delta);
        }
        if (this.isFootTrapActivated) {
            this.trap.ShowFootTrap(delta);
        }
    
        // Update the farthest point reached by the character
        if (this.character.x > this.farthestPointReached) {
            this.farthestPointReached = this.character.x;
        }
    
        // Clamp the viewport position to prevent moving left beyond the farthest point reached
        if (this.viewport.left < this.farthestPointReached - this.app.screen.width / 2) {
            this.viewport.left = this.farthestPointReached - this.app.screen.width / 2;
        }
    
        // Allow the character to move left only if they are not beyond the allowed left boundary
        if (this.character.x < this.farthestPointReached - this.app.screen.width / 2) {
            // Stop the character's velocity and update the body position
            this.character.x = this.farthestPointReached - this.app.screen.width / 2;
            this.character.characterBody.position.x = this.character.x;
            this.character.characterBody.velocity.x = 0;
        }
    }

    ResetGame(){
        this.isTrap1Activated = false;

        this.isFootIconShow = false;
        this.isFootTrapActivated = false;

        this.farthestPointReached = 0;

        // Reset the character's position and velocity
        this.character.position.set(100, 100);
        this.character.characterBody.position.x = GameConfig.CHARACTER_DEFAULT_POSISION.x;
        this.character.characterBody.position.y = GameConfig.CHARACTER_DEFAULT_POSISION.y;
        this.character.characterBody.velocity.x = 0;
        this.character.characterBody.velocity.y = 0;
        this.character.isDead = false;
        this.character.GetIdleAnimation();

        // Reset the traps
        this.trap.questionBlock.visible = false;
        this.trap.footIcon.position.set(1840, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.trap.footIcon.visible = false;
        this.trap.foot.position.set(-500, GameConfig.SCREEN_HEIGHT / 2);
        this.trap.footBody.position.x = -500;
        this.trap.sun.position = GameConfig.SUN_DEFAULT_POSISION;
        this.trap.sunBody.position.y = GameConfig.SUN_DEFAULT_POSISION.y;
        this.trap.sunBody.velocity.y = 0;
        this.trap.sunBody.isStatic = true;

        this.viewport.moveCenter(this.character.x, this.character.y);
        this.viewport.follow(this.character);
    }
}