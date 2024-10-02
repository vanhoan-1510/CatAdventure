import { Assets, Container, AnimatedSprite, Texture, Sprite } from "pixi.js";
import { GameConfig } from "../game_setup/gameconfig";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { Gravity } from "../physics/gravity";

export class Trap extends Container {
    private world: World;
    private gravity: Gravity;

    public questionBlock: AnimatedSprite;
    public blockTextures: Texture[];
    public wallTexture: Texture;
    public footIconTexture: Texture;
    public footIcon: Sprite;
    public footTexture: Texture;
    public foot: Sprite;
    private footPositionX: number;
    public blockBody: Body;
    public footBody: Body;
    public sunTexture: Texture;
    public sun: Sprite;
    public sunBody: Body;

    constructor(world: World) {
        super();
        this.world = world;
        this.gravity = GameConfig.GRAVITY;
        this.Init().then(() => {
            this._Trap1();
            this._Trap2();
            this._Trap3();
        });
    }

    async Init() {
        this.blockTextures = [];
        for (let i = 1; i <= 4; i++) {
            const texture = await Assets.get(`question${i}`);
            if (texture) {
                this.blockTextures.push(texture);
            } else {
                console.error(`Failed to load texture: question${i}`);
            }
        }
        this.wallTexture = await Assets.get('wall');
        this.footIconTexture = await Assets.get('footicon');
        this.footTexture = await Assets.get('foot');
        this.sunTexture = await Assets.get('smilesun');
    }

    _Trap1() {
        if (this.blockTextures.length === 4) {
            this.questionBlock = new AnimatedSprite(this.blockTextures);
            this.questionBlock.animationSpeed = 0.1; // Adjust the speed as needed
            this.questionBlock.loop = true;
            this.questionBlock.play();
            this.questionBlock.visible = false;
            this.addChild(this.questionBlock);

            this.questionBlock.position.set(GameConfig.SCREEN_WIDTH - 380 , GameConfig.SCREEN_HEIGHT / 2 + 100);
            this.questionBlock.anchor.set(0.5, 0.5);
        } else {
            console.error('Not all block textures were loaded successfully.');
        }
    }

    Resolvetrap1(){
        this.questionBlock.visible = true;
        this.blockBody = new Body(this.questionBlock.position.x + 10, this.questionBlock.position.y + 10, this.questionBlock.width , this.questionBlock.height, 1, true, 0);
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
            const wall = new Sprite(this.wallTexture);
            wall.position.set(position.x, position.y);
            wall.anchor.set(0.5, 0.5);
            this.addChild(wall);
            const wallBody = new Body(wall.position.x + 10, wall.position.y + 10, wall.width, wall.height, 1, true, 0);
            this.world.addBodyB(wallBody);
        });

        this.footIcon = new Sprite(this.footIconTexture);
        this.footIcon.position.set(1840, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.footIcon.anchor.set(0.5, 0.5);
        this.footIcon.visible = false;
        const footIconBody = new Body(this.footIcon.position.x + 10, this.footIcon.position.y + 10, this.footIcon.width, this.footIcon.height, 1, true, 0.5);
        this.world.addBodyB(footIconBody);
        this.addChild(this.footIcon);

        if (this.blockTextures.length === 4) {
            blockPositions.forEach(position => {
                const block = new AnimatedSprite(this.blockTextures);
                block.animationSpeed = 0.1; // Adjust the speed as needed
                block.loop = true;
                block.play();
                block.position.set(position.x, position.y);
                block.anchor.set(0.5, 0.5);
                this.addChild(block);
            });
        } else {
            console.error('Not all block textures were loaded successfully.');
        }

        this.foot = new Sprite(this.footTexture);
        this.footPositionX = -500;
        this.foot.position.set(this.footPositionX, GameConfig.SCREEN_HEIGHT / 2);
        this.foot.anchor.set(0.5);
        this.footBody = new Body(this.footPositionX + 10, GameConfig.SCREEN_HEIGHT / 2 + 10, this.foot.width / 2, this.foot.height * 2, 1, true, 5);
        this.world.addBodyB(this.footBody);
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
        this.footIcon.visible = true;
    }

    ShowFootTrap(delta: number) {
        // Move foot towards target position
        const footTargetPosition = { x: 1600, y: GameConfig.SCREEN_HEIGHT / 2 + 100 };
        const footSpeed = 10;
    
        const dx = footTargetPosition.x - this.foot.position.x;
        const distance = Math.abs(dx);
    
        if (distance > 1) {
            const moveX = (dx / distance) * footSpeed * delta;
            this.foot.position.x += moveX;
            this.footPositionX = this.foot.position.x;
            this.footBody.position.x = this.foot.position.x;
        }
        this.footIcon.visible = false;
    }

    _Trap3(){
        this.sun = new Sprite(this.sunTexture);
        this.sun.position.set(2500, 100);
        this.sun.anchor.set(0.5, 0.5);
        this.sun.scale.set(0.7);
        this.sunBody = new Body(this.sun.position.x + 10, this.sun.position.y + 10, this.sun.width, this.sun.height, 1, false, 1);
        this.world.addBodyB(this.sunBody);
        this.addChild(this.sun);
    }

    public update(delta: number) {
        this.gravity.applyGravity(this.sunBody, delta);
        this.sun.position.x = this.sunBody.position.x;
        this.sun.position.y = this.sunBody.position.y;
        this.world.update(delta);
    }
}