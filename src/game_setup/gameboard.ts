import { Application, Assets, Container, Sprite, TilingSprite } from "pixi.js";
import { TileMap } from "../tile_map/tilemap";
import { Character } from "../character/character";
import { World } from "../physics/world";
import { Trap } from '../trap/trapsetup';
import { Viewport } from "pixi-viewport";
import { GameConfig } from "./gameconfig";
import { EventHandle } from "../eventhandle/eventhandle";
import { Collision } from '../physics/collision';
import { GameNotification } from '../gameUI/gamenotification';
import { GameMenu } from "../gameUI/gamemenu";

export class GameBoard {
    private app: Application;
    private gameContainer: Container; // Contains both tileMap and characterContainer
    private menuContainer: Container; // Contains menu elements
    private gameUIContainer: Container; // Contains UI elements
    private tileMapContainer: Container; // Separate container for tileMap
    private characterContainer: Container; // Separate container for character
    private gameMenu: GameMenu;
    private gameNotification: GameNotification;
    private character: Character;
    private tileMap: TileMap; 
    private world: World;
    private trap: Trap;
    private isPlaySavePointSound: boolean = false;

    private _SavePoint: { x: number, y: number } = GameConfig.CHARACTER_DEFAULT_POSISION;
    
    private viewport: Viewport;
    private farthestPointReached: number = 0;
    private targetTop: number = 0;
    private targetBottom: number = GameConfig.SCREEN_HEIGHT;

    constructor(app: Application) {
        this.app = app;
        this.Init();
        EventHandle.on('StartGame', () => this.StartGame());
        EventHandle.on('ResetGame', () => this.ResetGame());
    }

    Init() {
        this.world = new World(GameConfig.GRAVITY);
    
        // Initialize containers
        this.gameContainer = new Container();
        this.menuContainer = new Container();
        this.gameUIContainer = new Container();
        this.tileMapContainer = new Container();
        this.characterContainer = new Container();
    
        // Initialize and set up the viewport
        this.viewport = new Viewport({
            screenWidth: GameConfig.SCREEN_WIDTH,
            screenHeight: GameConfig.SCREEN_HEIGHT,
            worldWidth: GameConfig.WORLD_WIDTH,
            worldHeight: GameConfig.WORLD_HEIGHT,
            events: this.app.renderer.events
        });
    
        this.app.stage.addChild(this.viewport);
        this.viewport.addChild(this.gameContainer);
    
        // Add both tileMapContainer and characterContainer to gameContainer
        this.gameContainer.addChild(this.menuContainer);
    
        // Clamp the viewport within world boundaries
        this.viewport.clamp({
            left: 0,
            right: GameConfig.WORLD_WIDTH,
            top: 0,
            bottom: GameConfig.SCREEN_HEIGHT,
        });

        this.gameMenu = new GameMenu();
        this.menuContainer.addChild(this.gameMenu);


        // Initialize and add trap to its container
        this.trap = new Trap(this.world);
        this.trap.addChild(this.trap);
    }

    StartGame(){
        EventHandle.emit('ChangeState', 'game');
        EventHandle.emit('PlayGameMusic');
        this.gameNotification = new GameNotification(this.viewport);
        this.gameUIContainer.addChild(this.gameNotification);
    
        // Initialize and add tileMap to its container
        this.tileMap = new TileMap(this.world); 
        this.tileMapContainer.addChild(this.tileMap); 
        this.tileMap.DrawTileMap();

        // Initialize and add character to its container
        this.character = new Character(this.world); 
        this.characterContainer.addChild(this.character);

        // Set the character in the center of the viewport initially
        this.viewport.moveCenter(this.character.x, this.character.y);

        // Follow the character
        this.viewport.follow(this.character);

        this.gameContainer.addChild(this.tileMapContainer);
        this.gameContainer.addChild(this.characterContainer);
        this.gameContainer.addChild(this.trap);
        this.gameContainer.addChild(this.gameUIContainer);
    }
    

    public Update(delta: number) {
        if(this.character){
            this.character.Update(delta);
            // Update the farthest point reached by the character
            if (this.character.x > this.farthestPointReached) {
                this.farthestPointReached = this.character.x;
            }

            if(this.character.position.x > GameConfig.SAVE_POINT_DEFAULT_POSISION.x && !this.isPlaySavePointSound){
                this._SavePoint = { x: GameConfig.SAVE_POINT_DEFAULT_POSISION.x, y: 200 };
                EventHandle.emit('SavePointSound');
                this.isPlaySavePointSound = true;
            }
        }
        if(this.trap){
            this.trap.update(delta);
        }
        this.viewport.update(delta);

        if(this.character && this.trap){
            this.trap.Trap1Resolve(this.character.position);
            this.trap.Trap2Resolve(this.character.position, delta);
            this.trap.Trap3Resolve(this.character.position);
            this.trap.Trap4Resolve(this.character.position);
            this.trap.Trap5Resolve(this.character.position);
            this.trap.Trap6Resolve(this.character.position, this.character.characterBody);
            this.trap.Trap7Resolve(this.character.position, this.character.characterBody);
            this.trap.MushRoomRoadBounce(this.character.position, this.character.characterBody);
            this.trap.SpikeRoadBounce(this.character.position, this.character.characterBody);
            this.trap.Trap8Resolve(this.character.position);
            this.trap.Trap9Resolve(this.character.position);
            this.trap.Trap10Resolve(this.character.position);
            this.trap.Trap11Resolve(this.character.position);
            this.trap.Trap12Resolve(this.character.position, this.character.characterBody);
        }

        this.HandleCamera();

        if(this.gameNotification){
            this.gameNotification.update(delta);
        }

        if(this.gameNotification){
            this.gameNotification.x = this.viewport.left
            this.gameNotification.y = this.viewport.top
        }
    }
    
    private HandleCamera() {
        // Clamp the viewport position to prevent moving left beyond the farthest point reached
        if (this.viewport.left < this.farthestPointReached - this.app.screen.width / 2) {
            this.viewport.left = this.farthestPointReached - this.app.screen.width / 2;
        }
        if(this.character){
            // Allow the character to move left only if they are not beyond the allowed left boundary
            if (this.character.x < this.farthestPointReached - this.app.screen.width / 2) {
                this.character.x = this.farthestPointReached - this.app.screen.width / 2;
                this.character.characterBody.position.x = this.character.x;
                this.character.characterBody.velocity.x = 0;
            }
            // Check if the character is at the end of the map
            if (this.character.position.x >= GameConfig.WORLD_WIDTH - this.app.screen.width / 2) {
                this.farthestPointReached = GameConfig.WORLD_WIDTH - this.app.screen.width / 2;
            } else {
                if (this.character.position.x > this.farthestPointReached) {
                    this.farthestPointReached = this.character.position.x;
                }
            }
        
            // Handle camera target positions based on character's position
            if (this.character.position.x > 2850 && this.character.position.x <= 3850) {
                this.targetTop = -170;
                this.targetBottom = GameConfig.SCREEN_HEIGHT - 170;
            }
            else{
                this.targetTop = 0;
                this.targetBottom = GameConfig.SCREEN_HEIGHT;
            }
        
            if (this.character.position.x > 3875 && this.character.position.x <= 5300) {
                this.targetTop = 0;
                this.targetBottom = GameConfig.SCREEN_HEIGHT;
            }
        
            if (this.character.position.x >= 5480 && this.character.position.x <= 5530 && this.character.position.y >= GameConfig.SCREEN_HEIGHT / 2 + 240) {
                this.targetTop = 500;
                this.targetBottom = GameConfig.SCREEN_HEIGHT + 500;
            }
        
            if (this.character.position.x >= 9000 && this.character.position.y < GameConfig.SCREEN_HEIGHT / 2 - 200) {
                this.targetTop = -400;
                this.targetBottom = GameConfig.SCREEN_HEIGHT - 400;
            } else if (this.character.position.x >= 9000 && this.character.position.y >= GameConfig.SCREEN_HEIGHT / 2 - 100) {
                this.targetTop = 0;
                this.targetBottom = GameConfig.SCREEN_HEIGHT;
            }
        }
        // Smooth transition for camera movement
        const lerpFactor = 0.05;
        const currentTop = this.viewport.top;
        const currentBottom = this.viewport.bottom;
    
        const newTop = currentTop + (this.targetTop - currentTop) * lerpFactor;
        const newBottom = currentBottom + (this.targetBottom - currentBottom) * lerpFactor;
    
        // Clamp the viewport within the world boundaries
        this.viewport.clamp({
            left: 0,
            right: GameConfig.WORLD_WIDTH,
            top: newTop,
            bottom: newBottom,
        });
    }
    

    ResetGame(){
        this.character.characterBody.velocity.x = 0;
        this.character.characterBody.velocity.y = 0;
        Collision.hasEmittedDead = false;
        this.character.isJumping = false;
        this.character.canJump = true;

        this.farthestPointReached = 0;

        // Reset the character's position and velocity
        this.character.characterBody.position.x = this._SavePoint.x;
        this.character.characterBody.position.y = this._SavePoint.y;
        this.character.isDead = false;
        this.character.GetIdleAnimation();

        // Reset the traps
        this.trap.reset();

        this.viewport.moveCenter(this.character.x, this.character.y);
        this.viewport.follow(this.character);
    }
}