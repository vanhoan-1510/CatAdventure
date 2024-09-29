import { Body } from "./body";

export class Gravity {
    gravityForce: number;

    constructor(gravityForce: number) {
        this.gravityForce = gravityForce;
    }

    applyGravity(body: Body, delta: number) {
        body.velocity.y += this.gravityForce * delta /1000;
    }
}