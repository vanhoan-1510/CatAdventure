import { Assets, Container, AnimatedSprite, Texture, Sprite, Graphics } from "pixi.js";
import { GameConfig } from "../game_setup/gameconfig";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { Gravity } from "../physics/gravity";
import { EventHandle } from "../eventhandle/eventhandle";

export class Trap extends Container {
    private world: World;
    private gravity: Gravity;

    //#region "Textures"
    public blockTextures: Texture[];
    public wallTexture: Texture;
    public footIconTexture: Texture;
    public footTexture: Texture;
    public sunTexture: Texture;
    public tubeTexture: Texture;
    public spikeTexture: Texture;
    public longSpikeTexture: Texture;
    public mushroomTexture: Texture[];
    public spikeAnimTexture: Texture[];
    public leftGroundTexture: Texture;
    public centerGroundTexture: Texture;
    public rightGroundTexture: Texture;
    public arrowTexture: Texture;
    public bBlockTexture: Texture;
    public yBlockTexture: Texture;
    public eBlockTexture: Texture;
    public bombTexture: Texture[];
    public explosionTexture: Texture[];
    public enemyTexture: Texture;
    public deadMessageTexture: Texture;
    public groundSplitTexture: Texture;
    public woodTexture: Texture;
    public fakeCatTexture1: Texture;
    public catTexture: Texture;
    public fistTexture: Texture;

    //#endregion 'Textures'

    //#region "Sprites"
    public questionBlock: AnimatedSprite;
    public footIcon: Sprite;
    public foot: Sprite;
    public sun: Sprite;
    public tube: Sprite;
    public spike1: Sprite[];
    public spike2: Sprite[];
    public wallTrap: Sprite[];
    public longSpike: Sprite;
    public mushroom1: AnimatedSprite;
    public mushroom2: AnimatedSprite;
    public mushroomRoad: AnimatedSprite[];
    public spikeAnim: AnimatedSprite[];
    public centerGround: Sprite;
    public leftGround: Sprite;
    public rightGround: Sprite;
    public bBlock: Sprite;
    public yBlock: Sprite;
    public eBlock: Sprite;
    public bomb: AnimatedSprite;
    public explosion: AnimatedSprite;
    public enemy: Sprite;
    public deadMessage: Sprite;
    public groundSplit: Sprite;
    public wood: Sprite;
    public woodTrap: Sprite;
    public fakeCat1: Sprite;
    public fakeCat2: Sprite;
    public fist: Sprite;
    public realCat: Sprite;
    //#endregion "Sprites"

    //#region "Bodies"
    public blockBody: Body;
    public footBody: Body;
    public sunBody: Body;
    public wallTrapBodies: Body[];
    public leftGroundBody: Body;
    public rightGroundBody: Body;
    public bBlockBody: Body;
    public enemyBody: Body;
    public groundSplitBody: Body;
    public woodBody: Body;
    public fistBody: Body;
    public catBody: Body;

    //#endregion "Bodies"

    private footPositionX: number;
    private woodDirection: number = -1;
    private woodSpeed = 0;
    private woodTrapRotationSpeed: number = 0.2;
    private fistRotationSpeed: number = 0.5; 

    private isTrap1Activated: boolean = false;
    private isFootIconShow: boolean = false;
    private isFootTrapActivated: boolean = false;
    public isSunTrapEnabled: boolean = false;
    private bombActivated: boolean = false;
    private isGroundSplit: boolean = false;
    private isCollideWithFist: boolean = false;
    private isPlayPuchSound: boolean = false;

    constructor(world: World) {
        super();
        this.world = world;
        this.gravity = GameConfig.GRAVITY;
        this.Init().then(() => {
            this._Trap1();
            this._Trap2();
            this._Trap3();
            this._Trap4();
            this._Trap5();
            this._Trap6();
            this._Trap7();
            this.MushRoomRoad();
            this.SpikeRoad();
            this._Trap8();
            this._Trap9();
            this._Trap10();
            this._Trap11();
            this._Trap12();
            this.GameWin();
        });
    }

    async Init() {
        this.blockTextures = [];
        this.spike1 = [];
        this.spike2 = [];
        this.wallTrap = [];
        this.wallTrapBodies = [];
        this.mushroomTexture = [];
        this.mushroomRoad = [];
        this.spikeAnimTexture = [];
        this.spikeAnim = [];
        this.bombTexture = [];
        this.explosionTexture = [];

        for (let i = 1; i <= 4; i++) {
            const texture = await Assets.get(`question${i}`);
            if (texture) {
                this.blockTextures.push(texture);
            } else {
                console.error(`Failed to load texture: question${i}`);
            }
        }

        for (let i = 1; i <= 6; i++) {
            const texture = await Assets.get(`mushroom_${i}`);
            if (texture) {
                this.mushroomTexture.push(texture);
            } else {
                console.error(`Failed to load texture: mushroom_${i}`);
            }
        }

        for(let i = 1; i <= 7; i++) {
            const texture = await Assets.get(`spike${i}`);
            if(texture) {
                this.spikeAnimTexture.push(texture);
            } else {
                console.error(`Failed to load texture: spike${i}`);
            }
        }

        for (let i = 1; i <= 30; i++) {
            const texture = await Assets.get(`bomb${i}`);
            if (texture) {
                this.bombTexture.push(texture);
            } else {
                console.error(`Failed to load texture: bomb${i}`);
            }
        }

        for (let i = 1; i <= 25; i++) {
            const texture = await Assets.get(`explosion${i}`);
            if (texture) {
                this.explosionTexture.push(texture);
            } else {
                console.error(`Failed to load texture: explosion${i}`);
            }
        }

        this.wallTexture = Assets.get('wall');
        this.footIconTexture = Assets.get('footicon');
        this.footTexture = Assets.get('foot');
        this.sunTexture = Assets.get('smilesun');
        this.tubeTexture = Assets.get('tube');
        this.spikeTexture = Assets.get('spike1');
        this.longSpikeTexture = Assets.get('longspike');
        this.leftGroundTexture = Assets.get('leftground');
        this.centerGroundTexture = Assets.get('centerground');
        this.rightGroundTexture = Assets.get('rightground');
        this.arrowTexture = Assets.get('arrow');
        this.bBlockTexture = Assets.get('bblock');
        this.yBlockTexture = Assets.get('yblock');
        this.eBlockTexture = Assets.get('eblock');
        this.enemyTexture = Assets.get('enemy');
        this.deadMessage = Assets.get('deadmessage');
        this.groundSplitTexture = Assets.get('groundsplit');
        this.woodTexture = Assets.get('woodline');
        this.fakeCatTexture1 = Assets.get('catfake');
        this.catTexture = Assets.get('idle1');
        this.fistTexture = Assets.get('strongfist');
    }

    //#region "Trap"
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
        }
    }

    Trap1Resolve(characterPosition: { x: number, y: number }) {

        if (!this.isTrap1Activated && 
            characterPosition.x >= this.questionBlock.position.x - 50 && characterPosition.x <= this.questionBlock.position.x + 50 &&
            characterPosition.y >= this.questionBlock.position.y - 70 && characterPosition.y <= this.questionBlock.position.y + 70
        ) {
            this.questionBlock.visible = true;
            this.blockBody = new Body(this.questionBlock.position.x + 10, this.questionBlock.position.y + 10, 
                this.questionBlock.width, this.questionBlock.height, 1, true, 0, 'ground');
            this.world.addBodyB(this.blockBody);
            this.isTrap1Activated = true;
        }
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
            const wallTrapBodies = new Body(wall.position.x + 10, wall.position.y + 10, wall.width, wall.height, 1, true, 0, 'ground');
            this.world.addBodyB(wallTrapBodies);
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
    
        if (distance > 20) {
            const moveX = (dx / distance) * footSpeed * delta;
            this.foot.position.x += moveX;
            this.footPositionX = this.foot.position.x;
            this.footBody.position.x = this.foot.position.x;
        }

        if(!this.isPlayPuchSound){
            EventHandle.emit('PunchSound');
            this.isPlayPuchSound = true;
        }
        this.footIcon.visible = false;
    }

    Trap2Resolve(characterPosition: { x: number, y: number }, delta: number) {
        if (characterPosition.x >= this.footIcon.position.x - 20 && characterPosition.x <= this.footIcon.position.x + 30 &&
            characterPosition.y >= this.footIcon.position.y - 30 && characterPosition.y <= this.footIcon.position.y + 100 &&
            !this.isFootIconShow
        ) {
            this.isFootIconShow = true;
        }

        if(this.isFootIconShow
            && characterPosition.x >= this.footIcon.position.x - 30 && characterPosition.x <= this.footIcon.position.x + 30
            && characterPosition.y >= this.footIcon.position.y - 100&& characterPosition.y <= this.footIcon.position.y 
        ) {
            this.isFootTrapActivated = true;
            EventHandle.emit('Dead');
        }
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


    Trap3Resolve(characterPosition: { x: number, y: number }) {
        if (characterPosition.x >= this.sun.position.x - 70
        ) {
            this.sunBody.isStatic = false;
        if (this.sunBody.velocity.y > 2) {
            this.sunBody.velocity.y = 2;
        }
        this.isSunTrapEnabled = true;
        }
    }

    _Trap4() {
        const spikePositions = [
            { x: 2980, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3045, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3110, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3175, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3240, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3305, y: GameConfig.SCREEN_HEIGHT / 2 + 260 }
        ];

        for (let i = 0; i < spikePositions.length; i++) {
            const spike = new Sprite(this.spikeTexture);
            spike.position.set(spikePositions[i].x, spikePositions[i].y);
            spike.anchor.set(0.5, 0.5);
            this.addChild(spike);
            spike.visible = false;
            const spikeBody = new Body(spike.position.x, spike.position.y + 10, spike.width, spike.height, 1, true, 0, 'trap');
            this.world.addBodyB(spikeBody);
            this.spike1.push(spike);
        }

        this.tube = new Sprite(this.tubeTexture);
        this.tube.position.set(2900, GameConfig.SCREEN_HEIGHT / 2 + 500);
        this.tube.scale.set(1.3);
        this.tube.anchor.set(0.5, 0.5);
        const tubeBody1 = new Body(this.tube.position.x - 20, this.tube.position.y -360, this.tube.width , this.tube.height, 1, true, 0, 'ground');
        this.world.addBodyB(tubeBody1);
        this.addChild(this.tube);

        const tube2 = new Sprite(this.tubeTexture);
        tube2.position.set(3350, GameConfig.SCREEN_HEIGHT / 2 + 450);
        tube2.scale.set(1.3);
        tube2.anchor.set(0.5, 0.5);
        const tube2Body = new Body(tube2.position.x - 20, tube2.position.y -360, tube2.width / 1  , tube2.height, 1, true, 0, 'ground');
        this.world.addBodyB(tube2Body);
        this.addChild(tube2);

        const blockPositions = [
            { x: 3100, y: GameConfig.SCREEN_HEIGHT / 2 + 100 },
            { x: 3140, y: GameConfig.SCREEN_HEIGHT / 2 + 100 }
        ];

        if (this.blockTextures.length === 4) {
            blockPositions.forEach(position => {
                const block = new AnimatedSprite(this.blockTextures);
                block.animationSpeed = 0.1;
                block.loop = true;
                block.play();
                block.position.set(position.x, position.y);
                block.anchor.set(0.5, 0.5);
                const blockBody = new Body(position.x + 10, position.y + 10, block.width, block.height, 1, true, 0, 'ground');
                this.world.addBodyB(blockBody);
                this.addChild(block);
            });
        } else {
            console.error('Not all block textures were loaded successfully.');
        }
    }

    Trap4Resolve(characterPosition: { x: number, y: number }) {
        if (!this.spike1 || this.spike1.length === 0) {
            console.error('Spike array is not initialized or empty.');
            return;
        }

        for (let i = 0; i < this.spike1.length; i++) {
            if (characterPosition.x >= this.spike1[i].position.x - 50 && characterPosition.x <= this.spike1[i].position.x + 50 &&
                characterPosition.y >= this.spike1[i].position.y - 100 && characterPosition.y <= this.spike1[i].position.y + 50
            ) {
                for (let j = 0; j < this.spike1.length; j++) {
                    this.spike1[j].visible = true;
                }

            }
        }
    }

    _Trap5() {
        const spikePositions = [
            { x: 3430, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3495, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3560, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3625, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3690, y: GameConfig.SCREEN_HEIGHT / 2 + 260 },
            { x: 3755, y: GameConfig.SCREEN_HEIGHT / 2 + 260 }
        ];

        for (let i = 0; i < spikePositions.length; i++) {
            const spike = new Sprite(this.spikeTexture);
            spike.position.set(spikePositions[i].x, spikePositions[i].y);
            spike.anchor.set(0.5, 0.5);
            this.addChild(spike);
            spike.visible = false;
            const spikeBody = new Body(spike.position.x, spike.position.y + 10, spike.width, spike.height, 1, true, 0, 'trap');
            this.world.addBodyB(spikeBody);
            this.spike2.push(spike);
        }

        const wallPositions = [
            { x: 3560, y: GameConfig.SCREEN_HEIGHT / 2},
            { x: 3600, y: GameConfig.SCREEN_HEIGHT / 2}
        ];

        wallPositions.forEach(position => {
            const wall = new Sprite(this.wallTexture);
            wall.position.set(position.x, position.y);
            wall.anchor.set(0.5, 0.5);
            this.addChild(wall);
            this.wallTrap.push(wall);
        
            // Tạo body cho wallTrap ở vị trí thứ nhất
            const wallTrapBody1 = new Body(wall.position.x - 70, wall.position.y + 10, wall.width / 2, wall.height, 1, true, 0, 'ground');
            this.world.addBodyB(wallTrapBody1);
            this.wallTrapBodies.push(wallTrapBody1);
        
            // Tạo body cho wallTrap ở vị trí thứ hai
            const wallTrapBody2 = new Body(wall.position.x + 100, wall.position.y + 10, wall.width / 2, wall.height, 1, true, 0, 'ground');
            this.world.addBodyB(wallTrapBody2);
            this.wallTrapBodies.push(wallTrapBody2);
        });

        const tube3 = new Sprite(this.tubeTexture);
        tube3.position.set(3800, GameConfig.SCREEN_HEIGHT / 2 + 300);
        tube3.scale.set(1.3);
        tube3.anchor.set(0.5, 0.5);
        const tube3Body = new Body(tube3.position.x - 20, tube3.position.y -360, tube3.width , tube3.height, 1, true, 0, 'ground');
        this.world.addBodyB(tube3Body);
        this.addChild(tube3);

    }

    Trap5Resolve(characterPosition: { x: number, y: number }) {
    
        for (let i = 0; i < this.spike2.length; i++) {
            if (characterPosition.x >= this.spike2[i].position.x - 50 && characterPosition.x <= this.spike2[i].position.x + 50 &&
                characterPosition.y >= this.spike2[i].position.y - 100 && characterPosition.y <= this.spike2[i].position.y + 50
            ) {
                for (let j = 0; j < this.spike2.length; j++) {
                    this.spike2[j].visible = true;
                }
            }
        }
    
        if (characterPosition.x >= 3430 && characterPosition.x <= 3700 && characterPosition.y > GameConfig.SCREEN_HEIGHT / 2 - 100  
            && characterPosition.y <= GameConfig.SCREEN_HEIGHT / 2 + 200
        ) {
            this.wallTrap[0].position.x = this.wallTrapBodies[0].position.x;
            this.wallTrap[1].position.x = this.wallTrapBodies[1].position.x;    
        }
    }

    _Trap6(){
        this.longSpike = new Sprite(this.longSpikeTexture);
        this.longSpike.position.set(4700, 100);
        this.longSpike.anchor.set(0.5, 0.5);
        this.addChild(this.longSpike);
        this.longSpike.rotation = Math.PI ;
        const longSpikeBody = new Body(this.longSpike.position.x -200, this.longSpike.position.y + 10, this.longSpike.width* 4, this.longSpike.height, 1, true, 0, 'trap');
        this.world.addBodyB(longSpikeBody);

        const remindBanner = new Sprite(Assets.get('becarefulfbanner'));
        remindBanner.position.set(4450, 150);
        remindBanner.anchor.set(0.5, 0.5);
        this.addChild(remindBanner);

        if (this.mushroomTexture.length === 6) {
            for (let i = 1; i <= 6; i++) {
                this.mushroom1 = new AnimatedSprite(this.mushroomTexture);
                this.mushroom1.position.set(4390, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 9);
                this.mushroom1.anchor.set(0.5, 0.5);
                this.mushroom1.animationSpeed = 0.5;
                this.mushroom1.rotation = - Math.PI / 2;
                this.mushroom1.loop = false;
                this.mushroom1.visible = false;
                this.addChild(this.mushroom1);
            }
        }

        if (this.mushroomTexture.length === 6) {
            for (let i = 1; i <= 6; i++) {
                this.mushroom2 = new AnimatedSprite(this.mushroomTexture);
                this.mushroom2.position.set(4650, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 8);
                this.mushroom2.anchor.set(0.5, 0.5);
                this.mushroom2.animationSpeed = 0.5;
                this.mushroom2.loop = false;
                this.mushroom2.visible = false;
                this.addChild(this.mushroom2);
            }
        }
    }

    Trap6Resolve(characterPosition: { x: number, y: number }, characterBody: Body) {

        if (characterPosition.x >= 4350 && characterPosition.x <= 4450 && characterPosition.y >= GameConfig.SCREEN_HEIGHT/2 + GameConfig.TILE_SIZE * 8) {
            characterBody.velocity.x = -2;
            this.mushroom1.visible = true;
        }
        if (characterPosition.x >= 4600 && characterPosition.x <= 4650 && characterPosition.y >= GameConfig.SCREEN_HEIGHT/2 + GameConfig.TILE_SIZE * 6 ) {
            characterBody.velocity.y = -1.5;
            this.mushroom2.visible = true;
            this.mushroom2.gotoAndStop(0);
            this.mushroom2.play();
        }
    }

    _Trap7(){
        const tube = new Sprite(Assets.get('shorttube'));
        tube.position.set(5500, GameConfig.SCREEN_HEIGHT / 2 + 300);
        tube.scale.set(1.5);
        tube.anchor.set(0.5, 0.5);
        const tubeBody1 = new Body(tube.position.x - 20, tube.position.y - 195, tube.width /30, tube.height, 1, true, 0, 'ground');
        this.world.addBodyB(tubeBody1);
        const tubeBody2 = new Body(tube.position.x + 70, tube.position.y - 195, tube.width /30, tube.height, 1, true, 0, 'ground');
        this.world.addBodyB(tubeBody2);

        const tube2 = new Sprite(Assets.get('shorttuberotate'));
        tube2.position.set(5500, GameConfig.SCREEN_HEIGHT / 2 + 500);
        tube2.scale.set(1.5);
        tube2.anchor.set(0.5, 0.5);
        this.addChild(tube2);
        this.addChild(tube);
    }

    Trap7Resolve(characterPosition: { x: number, y: number }, characterBody: Body) {
        if(characterPosition.x >= 5480 && characterPosition.x <= 5530 && characterPosition.y >= GameConfig.SCREEN_HEIGHT / 2 + 240) {
            setTimeout(() => {
                characterBody.position.y = GameConfig.SCREEN_HEIGHT + 50;
                characterBody.velocity.y += 0.5;
            }, 500);
        }
    }

    MushRoomRoad() {
        let mushRoomPositions: { x: number, y: number }[] = [];
        for (let i = 0; i < 20; i++) {
            mushRoomPositions.push({
                x: 5580 + GameConfig.MUSHROOM_SIZE * i,
                y: GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 8
            });
        }
    
        mushRoomPositions.forEach(position => {
            const mushroom = new AnimatedSprite(this.mushroomTexture);
            mushroom.position.set(position.x, position.y);
            mushroom.anchor.set(0.5, 0.5);
            mushroom.animationSpeed = 1;
            mushroom.loop = false;
            this.mushroomRoad.push(mushroom);
    
            this.addChild(mushroom);
        });
    }

    MushRoomRoadBounce(characterPosition: { x: number, y: number }, characterBody: Body) {
        for(let i = 0; i < this.mushroomRoad.length; i++) {
            if(characterPosition.x >= 5550 + GameConfig.MUSHROOM_SIZE * i && characterPosition.x < 5550 + GameConfig.MUSHROOM_SIZE
                 * (i+1) && characterPosition.y >= GameConfig.SCREEN_HEIGHT/2 + GameConfig.TILE_SIZE * 6) {
                characterBody.velocity.y = -0.7;
                this.mushroomRoad[i].gotoAndStop(0);
                this.mushroomRoad[i].play();
                EventHandle.emit('JumpSound');
            }
        }
    }

    SpikeRoad(){
        let spikePositions: { x: number, y: number }[] = [];
        for (let i = 0; i < 25; i++) {
            spikePositions.push({
                x: 6575 + GameConfig.SPIKE_WIDTH * i,
                y: GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 10 + 10
            });
        }

        spikePositions.forEach(position => {
            const spike = new AnimatedSprite(this.spikeAnimTexture);
            spike.position.set(position.x, position.y);
            spike.anchor.set(0.5, 0.5);
            spike.animationSpeed = 1;
            spike.loop = false;
            this.spikeAnim.push(spike);

            this.addChild(spike);
        });
    }

    SpikeRoadBounce(characterPosition: { x: number, y: number }, characterBody: Body) {
        for(let i = 0; i < this.spikeAnim.length; i++) {
            if(characterPosition.x >= 6550 + GameConfig.SPIKE_WIDTH * i && characterPosition.x <  6580 + GameConfig.SPIKE_WIDTH * (i+1) 
                && characterPosition.y >= GameConfig.SCREEN_HEIGHT/2 + GameConfig.TILE_SIZE * 8) {
                characterBody.velocity.y = -0.5;
                this.spikeAnim[i].gotoAndStop(0);
                this.spikeAnim[i].play();
                EventHandle.emit('JumpSound');
            }
        }
    }

    _Trap8() {
        const arrow = new Sprite(this.arrowTexture);
        arrow.position.set(6600, GameConfig.SCREEN_HEIGHT / 2 +40);
        arrow.anchor.set(0.5, 0.5);
        this.addChild(arrow);


        this.centerGround = new Sprite(this.rightGroundTexture);
        this.centerGround.position.set(6850, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2);
        // centerGround.anchor.set(0.5, 0.5);
        const centerGroundBody = new Body(this.centerGround.position.x - 100, this.centerGround.position.y + GameConfig.TILE_SIZE, 
            this.centerGround.width * 2, this.centerGround.height / 2, 1, true, 0, 'ground');
        this.world.addBodyB(centerGroundBody);
        this.addChild(this.centerGround);

        this.leftGround = new Sprite(this.rightGroundTexture);
        this.leftGround.position.set(6850, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2);
        this.leftGround.anchor.set(1, 0);
        this.leftGroundBody = new Body(this.leftGround.position.x, this.leftGround.position.y - 100, this.leftGround.height, this.leftGround.width, 1, true, 0, 'ground');
        // this.leftGround.rotation = Math.PI / 2;
        this.addChild(this.leftGround);

        this.rightGround = new Sprite(this.rightGroundTexture);
        this.rightGround.position.set(this.centerGround.position.x + this.centerGround.width, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2);
        this.rightGroundBody = new Body(this.rightGround.position.x + 20, this.rightGround.position.y - 100, 
            this.rightGround.height, this.rightGround.width, 1, true, 0, 'ground');
        this.rightGround.anchor.set(0, 0);
        // this.rightGround.rotation = - Math.PI / 2;
        const rightGroundBody = new Body(this.rightGround.position.x, this.rightGround.position.y + GameConfig.TILE_SIZE, 
            this.rightGround.width, this.rightGround.height / 2, 1, true, 0, 'ground');
        this.world.addBodyB(rightGroundBody);
        this.addChild(this.rightGround);

        this.bBlock = new Sprite(this.bBlockTexture);
        this.bBlock.position.set(6880, GameConfig.SCREEN_HEIGHT / 2 - 100);
        this.bBlock.anchor.set(0.5, 0.5);
        this.bBlock.visible = false;
        const bBlockBody = new Body(this.bBlock.position.x, this.bBlock.position.y + 10, this.bBlock.width, this.bBlock.height, 1, true, 0, 'ground');
        this.world.addBodyB(bBlockBody);
        this.addChild(this.bBlock);

        this.yBlock = new Sprite(this.yBlockTexture);
        this.yBlock.position.set(6880 + 40, GameConfig.SCREEN_HEIGHT / 2 - 100);
        this.yBlock.anchor.set(0.5, 0.5);
        this.yBlock.visible = false;
        const yBlockBody = new Body(this.yBlock.position.x, this.yBlock.position.y + 10, this.yBlock.width, this.yBlock.height, 1, true, 0, 'ground');
        this.world.addBodyB(yBlockBody);
        this.addChild(this.yBlock);

        this.eBlock = new Sprite(this.eBlockTexture);
        this.eBlock.position.set(6880 + 80, GameConfig.SCREEN_HEIGHT / 2 - 100);
        this.eBlock.anchor.set(0.5, 0.5);
        this.eBlock.visible = false;
        const eBlockBody = new Body(this.eBlock.position.x, this.eBlock.position.y + 10, this.eBlock.width, this.eBlock.height, 1, true, 0, 'ground');
        this.world.addBodyB(eBlockBody);
        this.addChild(this.eBlock);

        this.bomb = new AnimatedSprite(this.bombTexture);
        this.bomb.position.set(6800 + 120, GameConfig.SCREEN_HEIGHT / 2 + 10);
        this.bomb.anchor.set(0.5, 0.5);
        this.bomb.animationSpeed = 0.3;
        this.bomb.loop = false;
        this.bomb.visible = false;
        this.addChild(this.bomb);

        this.explosion = new AnimatedSprite(this.explosionTexture);
        this.explosion.position.set(6800 + 120, GameConfig.SCREEN_HEIGHT / 2 + 10);
        this.explosion.anchor.set(0.5, 0.5);
        this.explosion.animationSpeed = 0.3;
        this.explosion.scale.set(4);
        this.explosion.loop = false;
        this.explosion.visible = false;
        this.addChild(this.explosion);
    }

    Trap8Resolve(characterPosition: { x: number, y: number }) {
        if (characterPosition.x >= this.centerGround.position.x && characterPosition.x <= this.centerGround.position.x + this.centerGround.width
            && characterPosition.y >= GameConfig.SCREEN_HEIGHT / 2 && characterPosition.y <= GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 2) {
    
            if (!this.bombActivated) {
                this.leftGround.rotation = Math.PI / 2;
                this.rightGround.rotation = -Math.PI / 2;
    
                this.world.addBodyB(this.leftGroundBody);
                this.world.addBodyB(this.rightGroundBody);
    
                this.bomb.visible = true;
                setTimeout(() => {
                    this.bomb.play();
                    this.bombActivated = true;
                    this.bomb.onComplete = () => {
                        this.bomb.visible = false;
                        this.explosion.visible = true;
                        this.explosion.play();
                        EventHandle.emit('ExplosionSound');
                        EventHandle.emit('Dead');
                    };
                }, 2000);
            }
        }

        if(characterPosition.x >= this.bBlock.position.x - 30 
            && characterPosition.y >= this.bBlock.position.y - 100 && characterPosition.y <= this.bBlock.position.y + 60) {
            this.bBlock.visible = true;
        }

        if(characterPosition.x >= this.yBlock.position.x - 30 
            && characterPosition.y >= this.yBlock.position.y - 100 && characterPosition.y <= this.yBlock.position.y + 60) {
            this.yBlock.visible = true;
        }

        if(characterPosition.x >= this.eBlock.position.x - 30 
            && characterPosition.y >= this.eBlock.position.y - 100 && characterPosition.y <= this.eBlock.position.y + 60) {
            this.eBlock.visible = true;
        }
    }

    _Trap9(){
        this.enemy = new Sprite(this.enemyTexture);
        this.enemy.position = GameConfig.ENEMY_POSITION;
        this.enemy.anchor.set(0.5, 0.5);
        this.enemy.scale.set(0.7);
        this.addChild(this.enemy);
        this.enemyBody = new Body(this.enemy.position.x, this.enemy.position.y, this.enemy.width, this.enemy.height / 2, 1, true, 0.1, 'trap');
        this.world.addBodyB(this.enemyBody);

        this.deadMessage = new Sprite(this.deadMessage);
        this.deadMessage.position.set(8250, GameConfig.SCREEN_HEIGHT / 2 - 40);
        this.deadMessage.anchor.set(0.5, 0.5);
        this.deadMessage.scale.set(0.5);
        this.deadMessage.visible = false;
        this.addChild(this.deadMessage);

    }

    Trap9Resolve(characterPosition: { x: number, y: number }) {
        const distanceX = characterPosition.x - this.enemy.position.x;
        const distanceY = characterPosition.y - this.enemy.position.y;
        const speed = 0.5;
        if (Math.abs(distanceX) > 48 && Math.abs(distanceX) < 400 && characterPosition.x < this.enemy.position.x &&characterPosition.y <= GameConfig.SCREEN_HEIGHT / 2 + 100) {
            this.enemy.position.x += (distanceX / Math.abs(distanceX)) * speed;
            this.enemyBody.position.x = this.enemy.position.x;
            this.enemy.position.y += distanceY;
            this.enemyBody.position.y = this.enemy.position.y;
        }

        if (Math.abs(distanceX) < 400 && characterPosition.y > GameConfig.SCREEN_HEIGHT / 2 + 100) {
            this.deadMessage.visible = true;
        }
    }

    _Trap10() {
        this.groundSplit = new Sprite(this.groundSplitTexture);
        this.groundSplit.position.set(8840, GameConfig.SCREEN_HEIGHT / 2 + GameConfig.TILE_SIZE * 12 - GameConfig.TILE_SIZE/2 );
        this.groundSplit.anchor.set(0.5, 0.5);
        this.addChild(this.groundSplit);
        this.groundSplitBody = new Body(this.groundSplit.position.x - 20, this.groundSplit.position.y - GameConfig.TILE_SIZE * 5 /2, this.groundSplit.width, this.groundSplit.height, 1, true, 0, 'ground');
        this.world.addBodyB(this.groundSplitBody);
    }

    Trap10Resolve(characterPosition: { x: number, y: number }) {
        if (characterPosition.x >= 8780 && characterPosition.x <= 8864 && !this.isGroundSplit){
            setTimeout(() => {
            this.groundSplit.position.x = 8950;
            this.groundSplitBody.position.x = 8950;
            this.isGroundSplit = true;
            }, 3000);
        }
    }

    _Trap11() {
        this.wood = new Sprite(this.woodTexture);
        this.wood.position.set(9100, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.wood.anchor.set(0.5, 0.5);
        this.wood.scale.set(0.3);
        this.addChild(this.wood);
        this.woodBody = new Body(this.wood.position.x - 25, this.wood.position.y + 15, this.wood.width* 0.7, this.wood.height, 1, true, 0, 'ground');
        this.world.addBodyB(this.woodBody);

        this.woodTrap = new Sprite(this.woodTexture);
        this.woodTrap.position.set(9400, GameConfig.TILE_SIZE * 3);
        this.woodTrap.anchor.set(1, 1);
        this.woodTrap.scale.set(0.3);
        this.addChild(this.woodTrap);

    }   

    MoveWoodUpDown() {
        const maxHeight = GameConfig.SCREEN_HEIGHT;
        const minHeight = 0;

        this.wood.position.y += this.woodDirection * this.woodSpeed;
        this.woodBody.position.y = this.wood.position.y + 15;

        if (this.wood.position.y >= maxHeight || this.wood.position.y <= minHeight) {
            this.woodDirection *= -1;
        }
    }

    Trap11Resolve(characterPosition: { x: number, y: number }) {
        if (characterPosition.x >= 8200) {
            this.woodSpeed = 0.5;
        }

        if(characterPosition.x >= 9250 && characterPosition.x <= 9420 && characterPosition.y > 20) {
            if (this.woodTrap.rotation > -Math.PI/2) {
                this.woodTrap.rotation -= this.woodTrapRotationSpeed;
            } else {
                this.woodTrap.rotation = - Math.PI /2;
            }
        }
    }

    _Trap12(){
        this.fakeCat1 = new Sprite(this.fakeCatTexture1);
        this.fakeCat1.position.set(10300, GameConfig.TILE_SIZE - 5);
        this.fakeCat1.anchor.set(0.5, 0.5);
        this.fakeCat1.scale.x = -1;
        this.fakeCat1.visible = false;
        this.addChild(this.fakeCat1);

        this.fakeCat2 = new Sprite(this.catTexture);
        this.fakeCat2.position.set(10300, GameConfig.TILE_SIZE - 5);
        this.fakeCat2.anchor.set(0.5, 0.5);
        this.fakeCat2.scale.x = -1;
        // this.fakeCat2.visible = false;
        this.addChild(this.fakeCat2);

        this.fist = new Sprite(this.fistTexture);
        this.fist.position.set(10290, 70);
        this.fist.anchor.set(0.5,1);
        this.fist.scale.set(0.5);
        this.fist.visible = false;
        this.fist.rotation = -Math.PI;
        this.addChild(this.fist);
    }

    Trap12Resolve(characterPosition: { x: number, y: number }, characterBody: Body) {
        if(characterPosition.x >= 10260 && characterPosition.x <= 10300 && characterPosition.y >= 0 && !this.isPlayPuchSound) {
            this.isCollideWithFist = true;
            this.fakeCat1.visible = true;
            this.fakeCat2.visible = false;
            this.fist.visible = true;
            characterBody.velocity.y = -2;
            characterBody.velocity.x = -2;
            EventHandle.emit('PunchSound');
            EventHandle.emit('Dead');
            this.isPlayPuchSound = true;
        }
    }

    RotateFist() {
        if (this.fist.rotation > 0) {
            this.fist.rotation -= this.fistRotationSpeed;
            if (this.fist.rotation < 0) {
                this.fist.rotation = 0;
            }
        } else if (this.fist.rotation < 0) {
            this.fist.rotation += this.fistRotationSpeed;
            if (this.fist.rotation > 0) {
                this.fist.rotation = 0;
            }
        }
    }

    //#endregion 'Trap'

    GameWin(){
        this.realCat = new Sprite(this.catTexture);
        this.realCat.position.set(10450, - GameConfig.TILE_SIZE * 8);
        this.realCat.anchor.set(0.5, 0.5);
        this.realCat.scale.x = -1;
        this.addChild(this.realCat);

        this.catBody = new Body(this.realCat.position.x, this.realCat.position.y + 20, this.realCat.width, this.realCat.height / 2, 1, true, 0.1, 'gamewin');
        this.world.addBodyB(this.catBody);
    }

    public update(delta: number) {
        this.gravity.applyGravity(this.sunBody, delta);
        this.sun.position.x = this.sunBody.position.x;
        this.sun.position.y = this.sunBody.position.y;
        if(this.sunBody.position.y > GameConfig.SCREEN_HEIGHT + 100) {
            this.sunBody.position.y = GameConfig.SCREEN_HEIGHT + 100;
            this.sunBody.velocity.y = 0;
            this.sunBody.isStatic = true;
        }

        if(this.isFootIconShow){
            this.ShowFootIcon(delta);
        }

        if(this.isFootTrapActivated){
            this.ShowFootTrap(delta);
        }

        this.world.update(delta);
        this.MoveWoodUpDown();

        if(this.isCollideWithFist) {
            this.RotateFist();
        }
    }


    public reset() {
        this.questionBlock.visible = false;
        this.isTrap1Activated = false;
        this.isFootIconShow = false;
        this.isFootTrapActivated = false;
        this.isPlayPuchSound = false;
        this.footIcon.position.set(1840, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.footIcon.visible = false;
        this.foot.position.set(-500, GameConfig.SCREEN_HEIGHT / 2);
        this.footBody.position.x = -500;
        this.sun.position = GameConfig.SUN_DEFAULT_POSISION;
        this.sunBody.position.y = GameConfig.SUN_DEFAULT_POSISION.y;
        this.sunBody.velocity.y = 0;
        this.sunBody.isStatic = true;

        for (let i = 0; i < this.spike1.length; i++) {
            this.spike1[i].visible = false;
        }
        for (let i = 0; i < this.spike2.length; i++) {
            this.spike2[i].visible = false;
        }
        for (let i = 0; i < this.wallTrap.length; i++) {
            this.wallTrap[i].position.x = 3560 + i * 40;
        }
        this.mushroom1.visible = false;
        this.mushroom2.visible = false;
    
        this.leftGround.rotation = 0;
        this.rightGround.rotation = 0;
    
        this.world.removeBodyB(this.leftGroundBody);
        this.world.removeBodyB(this.rightGroundBody);
        this.bombActivated = false;
        this.bomb.visible = false;
        this.bomb.gotoAndStop(0);
        this.explosion.visible = false;
        this.explosion.gotoAndStop(0);

        this.bBlock.visible = false;
        this.yBlock.visible = false;
        this.eBlock.visible = false;

        this.enemy.position = GameConfig.ENEMY_POSITION;
        this.deadMessage.visible = false;

        this.isGroundSplit = false;
        this.groundSplit.position.x = 8840;
        this.groundSplitBody.position.x = 8840;

        this.wood.position.set(9100, GameConfig.SCREEN_HEIGHT / 2 + 100);
        this.woodBody.position.y = GameConfig.SCREEN_HEIGHT / 2 + 100;
        this.woodDirection = -1;
        this.woodSpeed = 0;

        this.woodTrap.rotation = 0;

        this.fakeCat1.visible = false;
        this.fakeCat2.visible = true;
        this.fist.visible = false;
        this.isCollideWithFist = false;
        this.fist.rotation = -Math.PI;
    }
}