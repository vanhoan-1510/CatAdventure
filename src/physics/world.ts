import { Body } from "./body";
import { Gravity } from "./gravity";
import { Collision } from "./collision";

export class World {
    public bodyA: Body[] = [];
    public bodyB: Body[] = [];
    public gravity: Gravity;

    constructor(gravity: Gravity) {
        this.gravity = gravity;
        this.bodyA = [];
        this.bodyB = [];
    }

    addBodyA(body: Body) {
        this.bodyA.push(body);
    }

    addBodyB(body: Body) {
        this.bodyB.push(body);
    }

    removeBodyA(bodyToRemove: Body) {
        this.bodyA = this.bodyA.filter(body => body !== bodyToRemove);
    }

    removeBodyB(bodyToRemove: Body) {
        this.bodyB = this.bodyB.filter(body => body !== bodyToRemove);
    }

    public update(delta: number) {
        const subSteps = 10;
        const subDelta = delta / subSteps;

        for (let step = 0; step < subSteps; step++) {
            for (let i = 0; i < this.bodyA.length; i++) {
                const bodyA = this.bodyA[i];
                for (let j = 0; j < this.bodyB.length; j++) {
                    const bodyB = this.bodyB[j];
                    if (Collision.checkCollision(bodyA, bodyB)) {
                        Collision.resolveCollision(bodyA, bodyB);
                    }
                }
            }

            for (const body of this.bodyA) {
                if (!body.isStatic) {
                    this.gravity.applyGravity(body, subDelta);
                    body.update(subDelta);
                }
            }

            for (const body of this.bodyB) {
                if (!body.isStatic) {
                    this.gravity.applyGravity(body, subDelta);
                    body.update(subDelta);
                }
            }
        }
    }
}
