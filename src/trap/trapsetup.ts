import { Application, Assets, Container, Sprite } from "pixi.js";

export class Trap extends Container{

    constructor() {
        super();
        this._Trap1();
    }

    async _Trap1() {
        const trapTexture = Assets.get('question1');
        const trap1 = Sprite.from(trapTexture);
        this.addChild(trap1);
    }
}