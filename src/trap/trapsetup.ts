import { Assets, Container, Sprite, Texture } from "pixi.js";
import { GameConfig } from "../game_setup/gameconfig";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { Character } from "../character/character";

export class Trap extends Container {
    private world: World;
    public trap1: Sprite;
    public blockTexture: Texture;
    public wallTexture: Texture;
    public footIconTexture: Texture;
    public footIcon: Sprite;
    public footTexture: Texture;
    public foot: Sprite;
    public blockBody: Body;

    constructor(world: World) {
        super();
        this.world = world;
        this.Init();
        this._Trap1();
        this._Trap2();
    }

    Init() {
        this.blockTexture = Assets.get('question1');
        this.wallTexture = Assets.get('wall');
        this.footIconTexture = Assets.get('footicon');
        this.footTexture = Assets.get('foot');
    }

    _Trap1() {
        this.trap1 = Sprite.from(this.blockTexture);
        this.trap1.visible = false;
        this.addChild(this.trap1);

        this.trap1.position.set(GameConfig.SCREEN_WIDTH - 380 , GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.trap1.anchor.set(0.5, 0.5);
    }

    Resolvetrap1(){
        this.trap1.visible = true;
        this.blockBody = new Body(this.trap1.position.x + 10, this.trap1.position.y + 10, this.trap1.width , this.trap1.height, 1, true, 0.5);
        this.world.addBodyB(this.blockBody);
    }

    _Trap2() {
        
        const wallPositions = [
            { x: 1760, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 1800, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 1880, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 1920, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 2000, y: GameConfig.SCREEN_HEIGHT / 2 + 100 }
        ];

        const blockPositions = [
            { x: 1840, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 1960, y: GameConfig.SCREEN_HEIGHT / 2 + 100 }
        ];

        wallPositions.forEach(position => {
            const wall = Sprite.from(this.wallTexture);
            wall.position.set(position.x, position.y);
            wall.anchor.set(0.5, 0.5);
            this.addChild(wall);
            const wallBody = new Body(wall.position.x + 10, wall.position.y + 10, wall.width, wall.height, 1, true, 0.5);
            this.world.addBodyB(wallBody);
        });

        this.footIcon = Sprite.from(this.footIconTexture);
        this.footIcon.position.set(1840, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.footIcon.anchor.set(0.5, 0.5);
        const footIconBody = new Body(this.footIcon.position.x + 10, this.footIcon.position.y + 10, this.footIcon.width, this.footIcon.height, 1, true, 0.5);
        this.world.addBodyB(footIconBody);
        this.addChild(this.footIcon);

        blockPositions.forEach(position => {
            const wall = Sprite.from(this.blockTexture);
            wall.position.set(position.x, position.y);
            wall.anchor.set(0.5, 0.5);
            this.addChild(wall);
        });

        this.foot = Sprite.from(this.footTexture);
        this.foot.position.set(-500, GameConfig.SCREEN_HEIGHT / 2);
        this.foot.anchor.set(0.5, 0.5);
        const footBody = new Body(this.foot.position.x + 10, this.foot.position.y + 10, this.foot.width, this.foot.height, 1, true, 1);
        // this.world.addBodyB(footBody);
        this.addChild(this.foot);
    }

    ShowFootIcon(delta: number) {
        // Move footIcon towards target position
        const footIconTargetPosition = { x: 1840, y: GameConfig.SCREEN_HEIGHT / 2 + 50 };
        const footIconSpeed = 0.1;

        const dy = footIconTargetPosition.y - this.footIcon.position.y;
        const distance = Math.abs(dy);

        if (distance > 1) {
            const moveY = (dy / distance) * footIconSpeed * delta;
            this.footIcon.position.y += moveY;
        }
    }

    ShowFootTrap(delta: number) {
        // Move foot towards target position
        const footTargetPosition = { x: 1500, y: GameConfig.SCREEN_HEIGHT / 2 + 100 };
        const footSpeed = 10;
    
        const dx = footTargetPosition.x - this.foot.position.x;
        const distance = Math.abs(dx);
    
        if (distance > 1) {
            const moveX = (dx / distance) * footSpeed * delta;
            this.foot.position.x += moveX;
        }
    }

    public update(delta: number) {
        this.ShowFootIcon(delta);
    }
}