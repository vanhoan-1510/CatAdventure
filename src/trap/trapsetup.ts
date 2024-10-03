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
    public footTexture: Texture;
    public sunTexture: Texture;
    public tubeTexture: Texture;
    public spikeTexture: Texture;

    public footIcon: Sprite;
    public foot: Sprite;
    public blockBody: Body;
    public footBody: Body;
    public sun: Sprite;
    public sunBody: Body;
    public tube: Sprite;
    public spike: Sprite;

    private footPositionX: number;

    public isSunTrapEnabled: boolean = false;

    constructor(world: World) {
        super();
        this.world = world;
        this.gravity = GameConfig.GRAVITY;
        this.Init().then(() => {
            this._Trap1();
            this._Trap2();
            this._Trap3();
            this._Trap4();
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
        this.tubeTexture = await Assets.get('tube');
        this.spikeTexture = await Assets.get('spike4');
        }

    _Trap1() {
        if (this.blockTextures.length === 4) {
            this.questionBlock = new AnimatedSprite(this.blockTextures);
            this.questionBlock.animationSpeed = 0.1; // Adjust the speed as needed
            this.questionBlock.loop = true;
            this.questionBlock.play();
            this.questionBlock.visible = false;
            this.addChild(this.questionBlock);

            this.questionBlock.position.set(GameConfig.SCREEN_WIDTH - 380, GameConfig.SCREEN_HEIGHT / 2 + 100);
            this.questionBlock.anchor.set(0.5, 0.5);
        } else {
            console.error('Not all block textures were loaded successfully.');
        }
    }

    Resolvetrap1() {
        this.questionBlock.visible = true;
        this.blockBody = new Body(this.questionBlock.position.x + 10, this.questionBlock.position.y + 10, this.questionBlock.width, this.questionBlock.height, 1, true, 0, 'block');
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
            const wallBody = new Body(wall.position.x + 10, wall.position.y + 10, wall.width, wall.height, 1, true, 0, 'wall');
            this.world.addBodyB(wallBody);
        });

        this.footIcon = new Sprite(this.footIconTexture);
        this.footIcon.position.set(1840, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.footIcon.anchor.set(0.5, 0.5);
        this.footIcon.visible = false;
        const footIconBody = new Body(this.footIcon.position.x + 10, this.footIcon.position.y + 10, this.footIcon.width, this.footIcon.height, 1, true, 0.5, 'trapIcon');
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
        this.footBody = new Body(this.footPositionX + 10, GameConfig.SCREEN_HEIGHT / 2 + 10, this.foot.width / 2, this.foot.height * 2, 1, true, 5, 'trap');
        this.world.addBodyB(this.footBody);
        this.addChild(this.foot);
    }

    ShowFootIcon(delta: number) {
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

    _Trap3() {
        this.sun = new Sprite(this.sunTexture);
        this.sun.position = GameConfig.SUN_DEFAULT_POSISION;
        this.sun.anchor.set(0.5, 0.5);
        this.sun.scale.set(0.5);
        this.sunBody = new Body(this.sun.position.x - 50, this.sun.position.y, this.sun.width, this.sun.height / 2, 0.5, true, 0.1, 'trap');
        this.world.addBodyB(this.sunBody);
        this.sunBody.velocity.y = 0.5;
        this.addChild(this.sun);
    }

    Trap3Resolve() {
        this.sunBody.isStatic = false;
        if (this.sunBody.velocity.y > 2) {
            this.sunBody.velocity.y = 2;
        }
        this.isSunTrapEnabled = true;
    }

    _Trap4() {
        this.tube = new Sprite(this.tubeTexture);
        this.tube.position.set(2900, GameConfig.SCREEN_HEIGHT / 2 + 300);
        this.tube.scale.set(1.3);
        this.tube.anchor.set(0.5, 0.5);
        const tubeBody1 = new Body(this.tube.position.x - 20, this.tube.position.y -165, this.tube.width / 20 , this.tube.height, 1, true, 0, 'tube');
        this.world.addBodyB(tubeBody1);
        const tubeBody2 = new Body(this.tube.position.x + 70, this.tube.position.y -165, this.tube.width / 20 , this.tube.height, 1, true, 0, 'tube');
        this.world.addBodyB(tubeBody2);
        const tubeBody3 = new Body(this.tube.position.x, this.tube.position.y -50, this.tube.width/ 1.3 , this.tube.height, 1, true, 0, 'trap');
        this.world.addBodyB(tubeBody3);
        this.addChild(this.tube);

        const tube2 = new Sprite(this.tubeTexture);
        tube2.position.set(3350, GameConfig.SCREEN_HEIGHT / 2 + 300);
        tube2.scale.set(1.3);
        tube2.anchor.set(0.5, 0.5);
        const tube2Body = new Body(tube2.position.x - 20, tube2.position.y -165, tube2.width / 1  , tube2.height, 1, true, 0, 'tube');
        this.world.addBodyB(tube2Body);
        this.addChild(tube2);

        this.spike = new Sprite(this.spikeTexture);
        this.spike.position.set(3100, GameConfig.SCREEN_HEIGHT / 2 + 250);
        this.spike.visible = false;
        this.spike.anchor.set(0.5, 0.5);
        this.spike.rotation = Math.PI
        const spikeBody = new Body(this.spike.position.x, this.spike.position.y, this.spike.width, this.spike.height, 1, true, 0, 'trap');
        this.world.addBodyB(spikeBody);
        this.addChild(this.spike);

        const blockPositions = [
            { x: 3100, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 3140, y: GameConfig.SCREEN_HEIGHT / 2 + 100 }
        ];

        if (this.blockTextures.length === 4) {
            blockPositions.forEach(position => {
                const block = new AnimatedSprite(this.blockTextures);
                block.animationSpeed = 0.1; // Adjust the speed as needed
                block.loop = true;
                block.play();
                block.position.set(position.x, position.y);
                block.anchor.set(0.5, 0.5);
                const blockBody = new Body(position.x + 10, position.y + 10, block.width, block.height, 1, true, 0, 'block');
                this.world.addBodyB(blockBody);
                this.addChild(block);
            });
        } else {
            console.error('Not all block textures were loaded successfully.');
        }
    }

    Trap4Resolve(characterPosition: { x: number, y: number }, characterBody: Body) {
        if(characterBody.position.x < this.spike.position.x + 50 && characterBody.position.x > this.spike.position.x - 50) {
            this.spike.visible = true;
        }
    }

    public update(delta: number) {
        this.gravity.applyGravity(this.sunBody, delta);
        this.sun.position.x = this.sunBody.position.x;
        this.sun.position.y = this.sunBody.position.y;
        if(this.sunBody.position.y > GameConfig.SCREEN_HEIGHT + 100) {
            this.sunBody.position.y = GameConfig.SCREEN_HEIGHT + 100;
            this.sunBody.velocity.y = 0
            this.sunBody.isStatic = true; 
        }

        this.world.update(delta);
    }
}
