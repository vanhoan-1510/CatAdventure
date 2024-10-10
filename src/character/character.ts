import { Assets, AnimatedSprite, Texture, Container } from "pixi.js";
import { Gravity } from "../physics/gravity";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { GameConfig } from "../game_setup/gameconfig";
import { EventHandle } from "../eventhandle/eventhandle";

export class Character extends Container {
    private animations: Map<string, Texture[]> = new Map();
    private characterSprite: AnimatedSprite;
    private characterDirection: number = 1;
    public characterBody: Body;

    private gravity: Gravity;
    private world: World;

    private isRunning: boolean = false;
    private isJumping: boolean = false;
    public isDead: boolean = false;

    private keysPressed: Set<string> = new Set();

    constructor(world: World) {
        super();
        this.world = world;
        this.gravity = GameConfig.GRAVITY;

        this.Init();
        EventHandle.on('Dead', () => this.Dead());
        EventHandle.on('Win', () => this.GameWin());
    }

    Init() {

        this.position = GameConfig.CHARACTER_DEFAULT_POSISION;

        const defaultTexture = Texture.WHITE;
        this.characterSprite = new AnimatedSprite([defaultTexture]);
        this.characterSprite.anchor.set(0.5, 0.5);
        this.addChild(this.characterSprite);
        

        this.characterBody = new Body(this.position.x, this.position.y, 5, this.characterSprite.height / 2, 1, false, 1, "character");
        this.world.addBodyA(this.characterBody);

        this.preloadAnimations().then(() => {
            this.playAnimation("idle", true, 0.5);
            this.characterBody.width = this.characterSprite.width / 2;
            this.characterBody.height = this.characterSprite.height - 15;
        });

        this.addKeyboardListeners();
    }

    private async preloadAnimations() {
        await this.loadAnimation("idle", 10);
        await this.loadAnimation("run", 8);
        await this.loadAnimation("jump", 8);
        await this.loadAnimation("dead", 10);
    }

    private async loadAnimation(name: string, frameCount: number): Promise<void> {
        const textures: Texture[] = [];
        for (let i = 1; i <= frameCount; i++) {
            const texture = await Assets.get(`${name}${i}`);
            textures.push(texture);
        }
        this.animations.set(name, textures);
    }

    private playAnimation(name: string, loop: boolean, speed: number): void {
        const textures = this.animations.get(name);
        if (!textures) return;

        this.characterSprite.textures = textures;
        this.characterSprite.loop = loop;
        this.characterSprite.animationSpeed = speed;
        this.characterSprite.scale.x = this.characterDirection;
        this.characterSprite.play();

        if (name === "jump" && !loop) {
            this.characterSprite.onComplete = () => {
                this.isJumping = false;
                this.checkRunningState();
            };
        }
    }

    private addKeyboardListeners(): void {
        window.addEventListener('keydown', (event: KeyboardEvent): void => {
            this.keysPressed.add(event.key.toLowerCase());
            if(event.key === 'r') {
                EventHandle.emit('ResetGame');
            }

            if (this.isDead) return;

            if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                this.characterDirection = -1;
                this.characterSprite.scale.x = this.characterDirection;
                this.characterBody.velocity.x = -0.2;
                if (!this.isRunning && !this.isJumping) {
                    this.isRunning = true;
                    this.playAnimation("run", true, 0.5);
                }
            } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                this.characterDirection = 1;
                this.characterSprite.scale.x = this.characterDirection;
                this.characterBody.velocity.x = 0.2;
                if (!this.isRunning && !this.isJumping) {
                    this.isRunning = true;
                    this.playAnimation("run", true, 0.5);
                }
            } else if (event.key === ' ' && !this.isJumping) {
                EventHandle.emit('Jump');
                EventHandle.emit('JumpSound');
                this.isJumping = true;
                this.playAnimation("jump", false, 0.25);
                this.characterBody.velocity.y = -0.7;
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent): void => {
            this.keysPressed.delete(event.key.toLowerCase());
            if (event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                this.characterBody.velocity.x = 0;
                this.isRunning = false;
                if (!this.isJumping && !this.isDead) {
                    this.playAnimation('idle', true, 0.5);
                }
            }
        });
    }

    private checkRunningState(): void {
        if (this.isDead) return;
        if (this.keysPressed.has('a') || this.keysPressed.has('arrowleft')) {
            this.characterDirection = -1;
            this.characterSprite.scale.x = this.characterDirection;
            this.characterBody.velocity.x = -0.3;
            this.isRunning = true;
            this.playAnimation("run", true, 0.5);
        } else if (this.keysPressed.has('d') || this.keysPressed.has('arrowright')) {
            this.characterDirection = 1;
            this.characterSprite.scale.x = this.characterDirection;
            this.characterBody.velocity.x = 0.3;
            this.isRunning = true;
            this.playAnimation("run", true, 0.5);
        } else {
            this.playAnimation("idle", true, 0.5);
        }
    }

    private Dead(): void {
        if (this.isDead) return;
        this.playAnimation("dead", false, 0.5);
        EventHandle.emit('DeadSound');
        EventHandle.emit('UpdateScore', -100);
        EventHandle.emit('ShowGameNotification');
        EventHandle.emit('PlayerLose', false);
        this.characterBody.velocity.x = 0;
        this.isDead = true;
    }

    public Update(delta: number) {
        this.gravity.applyGravity(this.characterBody, delta);
        this.characterBody.position.x += this.characterBody.velocity.x * delta;
        this.characterBody.position.y += this.characterBody.velocity.y * delta;
        this.world.update(delta);

        this.position.x = this.characterBody.position.x;
        this.position.y = this.characterBody.position.y;

        // Check if the character has landed
        if (this.characterBody.velocity.y === 0 && this.isJumping) {
            this.isJumping = false; // Reset jumping state
            this.checkRunningState();
        }

        if (this.characterBody.position.x < 50) {
            this.characterBody.position.x = 50;
        }

        if (this.characterBody.position.x > 10600){
            this.characterBody.position.x = 10600;
        }

        if(this.characterBody.position.x < GameConfig.SAVE_POINT_DEFAULT_POSISION.x && this.characterBody.position.y > GameConfig.SCREEN_HEIGHT && !this.isDead) {
            this.Dead();
            setTimeout(() => {
                this.characterBody.position.x = 100;
            }, 1000);
        }

        if(this.characterBody.position.x >= GameConfig.SAVE_POINT_DEFAULT_POSISION.x && this.characterBody.position.y > GameConfig.SCREEN_HEIGHT && !this.isDead) {
            this.Dead();
            setTimeout(() => {
                this.characterBody.position.x = 5400;
            }, 1000);
        }

        // console.log(this.position.x, this.position.y);
    }

    public GetIdleAnimation(): AnimatedSprite {
        this.playAnimation("idle", true, 0.5);
        return this.characterSprite;
    }

    GameWin(){
        this.characterBody.velocity.x = 0;
        this.isDead = true;
    }
}