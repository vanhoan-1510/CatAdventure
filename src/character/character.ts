import { Assets, AnimatedSprite, Texture, Container } from "pixi.js";
import { Gravity } from "../physics/gravity";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { Viewport } from "pixi-viewport"; 

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

    private isruning: boolean = false;
    private isJumping: boolean = false;

    constructor(world: World) {
        super();
        this.world = world;
        this.gravity = new Gravity(3);

        this.Init();
    }

    Init() {
        // Khởi tạo vị trí của nhân vật
        this.position.set(100, 100);

        // Tạo một texture mặc định để khởi tạo characterSprite
        const defaultTexture = Texture.WHITE;
        this.characterSprite = new AnimatedSprite([defaultTexture]);
        this.characterSprite.width = 53;
        this.characterSprite.height = 78;

        // Khởi tạo characterBody trước khi sử dụng
        this.characterBody = new Body(this.position.x, this.position.y, this.characterSprite.width, this.characterSprite.height, 1, false, 1);
        this.world.addBodyA(this.characterBody);

        this.loadAnimation("idle", 10).then(() => {
            this.playAnimation(this.idleTextures, true);
            this.characterBody.width = this.characterSprite.width;
            this.characterBody.height = this.characterSprite.height;
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

    private playAnimation(textures: Texture[], loop: boolean): void {
        if (this.characterSprite) {
            this.characterSprite.stop();
            this.removeChild(this.characterSprite);
        }

        this.characterSprite = new AnimatedSprite(textures);
        this.characterSprite.anchor.set(0.35, 0.35);
        this.characterSprite.animationSpeed = 0.5;
        this.characterSprite.loop = loop;
        this.characterSprite.scale.x = this.characterDirection;

        this.addChild(this.characterSprite);
        this.characterSprite.play();

        if (!loop) {
            this.characterSprite.onComplete = () => {
                this.isJumping = false;
                if (this.isruning) {
                    this.loadAnimation("run", 8).then(() => this.playAnimation(this.runTextures, true));
                } else {
                    this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true));
                    this.isruning = false;
                }
            };
        }
    }

    private addKeyboardListeners(): void {
        window.addEventListener('keydown', (event: KeyboardEvent): void => {
            if ((event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
            ) && !this.isruning && !this.isJumping) {
                this.isruning = true;
                if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                    this.characterDirection = -1;
                    this.characterBody.velocity.x = -0.3;
                } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                    this.characterDirection = 1;
                    this.characterBody.velocity.x = 0.3;
                }
                this.loadAnimation("run", 8).then(() => this.playAnimation(this.runTextures, true));
            } else if (event.key === ' ' && !this.isJumping) {
                this.isJumping = true;
                this.loadAnimation("jump", 8).then(() => this.playAnimation(this.jumpTextures, false));
                this.characterBody.velocity.y = -1;
            } else {
                this.isJumping = false;
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent): void => {
            if ((event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
            ) && !this.isJumping) {
                this.characterBody.velocity.x = 0;
                this.isruning = false;
                this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true));
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

        // Không cần gọi camera ở đây nếu đã sử dụng viewport
    }
}
