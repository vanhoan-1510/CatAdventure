import { Application, Assets, Container, Sprite, TilingSprite } from "pixi.js";
import { TileMap } from "../tile_map/tilemap";
import { Character } from "../character/character";
import { World } from "../physics/world";
import { Gravity } from "../physics/gravity";
import { Trap } from '../trap/trapsetup';
import { Viewport } from "pixi-viewport"; // Nhập Viewport từ PIXI

export class GameBoard {
    private app: Application;
    private gameContainer: Container;
    private character: Character;
    private tileMap: TileMap; 
    private world: World;
    private gravity: Gravity;
    private trap: Trap;
    private viewport: Viewport; // Khai báo viewport

    constructor(app: Application) {
        this.app = app;
        this.Init();
    }

    Init() {
        this.gameContainer = new Container();
        this.gravity = new Gravity(2);
        this.world = new World(this.gravity);
        this.tileMap = new TileMap(this.world); // Initialize tileMap
        this.gameContainer.addChild(this.tileMap); // Add tileMap to gameContainer
        this.tileMap.DrawTileMap();

        this.character = new Character(this.world); // Pass world to character
        this.gameContainer.addChild(this.character);
        this.character.Init();

        // Khởi tạo viewport và thêm vào ứng dụng
        this.viewport = new Viewport({
            screenWidth: this.app.screen.width,
            screenHeight: this.app.screen.height,
            worldWidth: 800, // Thay đổi kích thước thế giới nếu cần
            worldHeight: 600,
            events: this.app.renderer.events // Sử dụng this.app.renderer.events
        });

        this.app.stage.addChild(this.viewport);
        this.viewport.addChild(this.gameContainer); // Thêm gameContainer vào viewport

        // Đặt nhân vật vào giữa viewport ban đầu
        this.viewport.moveCenter(this.character.x, this.character.y);

        // Theo dõi nhân vật
        this.viewport.follow(this.character); // Theo dõi nhân vật
    }

    public Update(delta: number) {
        this.character.Update(delta);
        this.viewport.update(delta); // Cập nhật viewport

        // Cập nhật vị trí viewport theo nhân vật để tạo hiệu ứng theo dõi mượt mà
        const lerpFactor = 0.1; // Điều chỉnh giá trị này để thay đổi độ mượt mà
        this.viewport.x += (this.character.x - this.viewport.center.x) * lerpFactor;
        this.viewport.y += (this.character.y - this.viewport.center.y) * lerpFactor;
    }
}