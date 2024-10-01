import { Assets, AnimatedSprite, Texture, Container } from "pixi.js";
import { Gravity } from "../physics/gravity";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { GameConfig } from "../game_setup/gameconfig";

export class Character extends Container {
    private idleTextures: Texture[] = [];
    private runTextures: Texture[] = [];
    private jumpTextures: Texture[] = [];
    private deadTextures: Texture[] = [];
    private characterSprite: AnimatedSprite;
    private characterDirection: number = 1;
    private characterBody: Body;

    private gravity: Gravity;
    private world: World;

    private isRunning: boolean = false;
    private isJumping: boolean = false;

    constructor(world: World) {
        super();
        this.world = world;
        this.gravity = GameConfig.GRAVITY;

        this.Init();
    }

    Init() {
        // Initialize character position
        this.position.set(1700, 100);

        // Create a default texture to initialize characterSprite
        const defaultTexture = Texture.WHITE;
        this.characterSprite = new AnimatedSprite([defaultTexture]);

        // Initialize characterBody before using it
        this.characterBody = new Body(this.position.x, this.position.y, 5, this.characterSprite.height/2, 1, false, 1);
        this.world.addBodyA(this.characterBody);
        console.log(this.characterBody);

        this.loadAnimation("idle", 10).then(() => {
            this.playAnimation(this.idleTextures, true, 0.5);
            this.characterBody.width = this.characterSprite.width/2;
            this.characterBody.height = this.characterSprite.height - 15;
        });

        this.addKeyboardListeners();
    }

    private async loadAnimation(name: string, frameCount: number): Promise<void> {
        const textures: Texture[] = [];

        for (let i = 1; i <= frameCount; i++) {
            const texture = await Assets.get(`${name}${i}`);
            textures.push(texture);
        }

        switch (name) {
            case "idle":
                this.idleTextures = textures;
                break;
            case "run":
                this.runTextures = textures;
                break;
            case "jump":
                this.jumpTextures = textures;
                break;
            case "dead":
                this.deadTextures = textures;
                break;
        }
    }

    private playAnimation(textures: Texture[], loop: boolean, speed: number): void {
        if (this.characterSprite) {
            this.characterSprite.stop();
            this.removeChild(this.characterSprite);
        }

        this.characterSprite = new AnimatedSprite(textures);
        this.characterSprite.anchor.set(0.5, 0.5);
        this.characterSprite.animationSpeed = speed;
        this.characterSprite.loop = loop;
        this.characterSprite.scale.x = this.characterDirection;

        this.addChild(this.characterSprite);
        this.characterSprite.play();

        if (!loop) {
            this.characterSprite.onComplete = () => {
                this.isJumping = false;
                this.characterBody.velocity.y = 0;

                if (this.isRunning) {
                    this.loadAnimation("run", 8).then(() => this.playAnimation(this.runTextures, true, 0.5));
                } else {
                    this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true, 0.5));
                    this.isRunning = false;
                }
            };
        }
    }

    private addKeyboardListeners(): void {
        window.addEventListener('keydown', (event: KeyboardEvent): void => {
            if ((event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
            )) {
                if (!this.isRunning && !this.isJumping) {
                    this.isRunning = true;
                    this.loadAnimation("run", 8).then(() => this.playAnimation(this.runTextures, true, 0.5));
                }
                if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                    this.characterDirection = -1;
                    this.characterSprite.scale.x = this.characterDirection; // Update character direction visually
                    this.characterBody.velocity.x = -0.3;
                } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                    this.characterDirection = 1;
                    this.characterSprite.scale.x = this.characterDirection; // Update character direction visually
                    this.characterBody.velocity.x = 0.3;
                }
            } else if (event.key === ' ' && !this.isJumping) {
                this.isJumping = true;
                this.loadAnimation("jump", 8).then(() => this.playAnimation(this.jumpTextures, false, 0.25));
                this.characterBody.velocity.y = -1;
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent): void => {
            if (event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
             ) {
                if(!this.isJumping){
                    this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true, 0.5));
                }
                this.characterBody.velocity.x = 0;
                this.isRunning = false;
            }
        });
    }

    public Update(delta: number) {
        this.gravity.applyGravity(this.characterBody, delta);
        this.characterBody.position.x += this.characterBody.velocity.x * delta;
        this.characterBody.position.y += this.characterBody.velocity.y * delta;
        this.world.update(delta);

        this.position.x = this.characterBody.position.x;
        this.position.y = this.characterBody.position.y;

        if (this.characterBody.position.x < 50) {
            this.characterBody.position.x = 50;
        }
    }

    public getBody(): Body {
        return this.characterBody;
    }
}
