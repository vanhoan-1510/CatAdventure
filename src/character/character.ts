import { Application, Assets, AnimatedSprite, Texture } from "pixi.js";
import { Gravity } from "../physics/gravity";
import { World } from "../physics/world";
import { Body } from "../physics/body";
import { Collision } from "../physics/collision";

export class Character {
    private app: Application;
    private idleTextures: Texture[] = [];
    private walkTextures: Texture[] = [];
    private jumpTextures: Texture[] = [];
    private deadTextures: Texture[] = [];
    private characterSprite: AnimatedSprite;
    private characterDirection: number = 1;
    private characterBody: Body;

    private gravity: Gravity;
    private world: World;

    private isWalking: boolean = false;
    private isJumping: boolean = false;

    // Thêm thuộc tính position để biểu thị vị trí của nhân vật
    public position: { x: number, y: number };

    constructor(app: Application, world: World) {
        this.app = app;
        this.world = world;

        this.gravity = new Gravity(2);

        this.Init();
    }

    Init() {
        // Khởi tạo vị trí của nhân vật
        this.position = { x: 100, y: 100 };
        this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true));

        this.characterBody = new Body(this.position.x, this.position.y, 50, 1, false, 0);
        this.world.addBodyA(this.characterBody);

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
            case "walk":
                this.walkTextures = textures;
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
            this.app.stage.removeChild(this.characterSprite);
        }

        this.characterSprite = new AnimatedSprite(textures);
        this.characterSprite.anchor.set(0.5, 0.5);
        this.characterSprite.animationSpeed = 0.5;
        this.characterSprite.loop = loop;
        this.characterSprite.scale.x = this.characterDirection;
        this.characterSprite.position.set(this.position.x, this.position.y);

        this.app.stage.addChild(this.characterSprite);
        this.characterSprite.play();

        if (!loop) {
            this.characterSprite.onComplete = () => {
                this.isJumping = false;
                if (this.isWalking) {
                    this.loadAnimation("walk", 10).then(() => this.playAnimation(this.walkTextures, true));
                } else {
                    this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true));
                    this.isWalking = false;
                }
            };
        }
    }

    private addKeyboardListeners(): void {
        window.addEventListener('keydown', (event: KeyboardEvent): void => {
            if ((event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
            ) && !this.isWalking && !this.isJumping) {
                this.isWalking = true;
                if (event.key === 'a' || event.key === 'A' || event.key === 'ArrowLeft') {
                    this.characterDirection = -1;
                } else if (event.key === 'd' || event.key === 'D' || event.key === 'ArrowRight') {
                    this.characterDirection = 1;
                }
                this.loadAnimation("walk", 10).then(() => this.playAnimation(this.walkTextures, true));
            } else if (event.key === ' ' && !this.isJumping) {
                this.isJumping = true;
                this.loadAnimation("jump", 8).then(() => this.playAnimation(this.jumpTextures, false));
            } else if (event.key === 'x' && !this.isJumping) {
                this.loadAnimation("dead", 10).then(() => this.playAnimation(this.deadTextures, false));
            }
        });

        window.addEventListener('keyup', (event: KeyboardEvent): void => {
            if ((event.key === 'a' || event.key === 'd'
                || event.key === 'A' || event.key === 'D'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight'
            ) && !this.isJumping) {
                this.isWalking = false;
                this.loadAnimation("idle", 10).then(() => this.playAnimation(this.idleTextures, true));
            }
        });
    }

    public Update(delta: number) {
        // Áp dụng lực hấp dẫn lên nhân vật
        this.gravity.applyGravity(this.characterBody, delta);

        // Cập nhật thế giới vật lý
        this.world.update(delta);

        // Cập nhật vị trí của nhân vật dựa trên vị trí của body
        this.position.x = this.characterBody.position.x;
        this.position.y = this.characterBody.position.y;

        // Cập nhật vị trí của sprite
        if (this.characterSprite) {
            this.characterSprite.position.set(this.position.x, this.position.y);
        }
    }
}