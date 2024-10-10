import { Assets, Container, Sprite, Texture, TilingSprite } from "pixi.js";
import { GameConfig } from "../game_setup/gameconfig";

export class GameMenu extends Container {
    private menuBackgroundTexture: Texture;

    private menuBackground: TilingSprite;

    constructor() {
        super();
        this.Init();
    }

    Init() {
        this.menuBackgroundTexture = Assets.get('background');
        this.menuBackground = TilingSprite.from(this.menuBackgroundTexture, {
            width: GameConfig.WORLD_WIDTH,
            height: GameConfig.WORLD_HEIGHT
        });
        this.menuBackground.position.y = -800
        this.menuBackground.scale.set(1);
        this.addChild(this.menuBackground);
    }
}