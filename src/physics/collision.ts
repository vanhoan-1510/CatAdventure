import { EventHandle } from "../eventhandle/eventhandle";
import { Body } from "./body";

export class Collision {
    private static hasEmittedDead: boolean = false;

    static checkCollision(bodyA: Body, bodyB: Body): boolean {
        // Check if bodyA's AABB overlaps with bodyB's AABB
        const aLeft = bodyA.position.x;
        const aRight = bodyA.position.x + bodyA.width;
        const aTop = bodyA.position.y;
        const aBottom = bodyA.position.y + bodyA.height;

        const bLeft = bodyB.position.x;
        const bRight = bodyB.position.x + bodyB.width;
        const bTop = bodyB.position.y;
        const bBottom = bodyB.position.y + bodyB.height;

        return aRight > bLeft && aLeft < bRight && aBottom > bTop && aTop < bBottom;
    }

    static resolveCollision(bodyA: Body, bodyB: Body) {
        if (this.checkCollision(bodyA, bodyB)) {
            // Calculate the overlap in both x and y directions
            const overlapX = Math.min(bodyA.position.x + bodyA.width - bodyB.position.x, bodyB.position.x + bodyB.width - bodyA.position.x);
            const overlapY = Math.min(bodyA.position.y + bodyA.height - bodyB.position.y, bodyB.position.y + bodyB.height - bodyA.position.y);

            // Resolve collision by pushing the bodies apart
            if (overlapX < overlapY) {
                if (bodyA.position.x < bodyB.position.x) {
                    bodyA.position.x -= overlapX;
                } else {
                    bodyA.position.x += overlapX;
                    if (!bodyB.isStatic) bodyB.position.x -= overlapX;
                }
                // Reverse x velocity due to collision
                bodyA.velocity.x = -bodyA.velocity.x * Math.min(bodyA.restitution, bodyB.restitution);
                if (!bodyB.isStatic) {
                    bodyB.velocity.x = -bodyB.velocity.x * Math.min(bodyA.restitution, bodyB.restitution);
                }
            } else {
                if (bodyA.position.y < bodyB.position.y) {
                    bodyA.position.y -= overlapY;
                    if (!bodyB.isStatic) bodyB.position.y += overlapY;
                } else {
                    bodyA.position.y += overlapY;
                    if (!bodyB.isStatic) bodyB.position.y -= overlapY;
                }
                // Reverse y velocity due to collision
                bodyA.velocity.y = -bodyA.velocity.y * Math.min(bodyA.restitution, bodyB.restitution);
                if (!bodyB.isStatic) {
                    bodyB.velocity.y = -bodyB.velocity.y * Math.min(bodyA.restitution, bodyB.restitution);
                }
            }

            // Ensure the character is placed exactly on top of the tile if the collision is from above
            if (overlapY < overlapX && bodyA.position.y < bodyB.position.y) {
                bodyA.position.y = bodyB.position.y - bodyA.height;
                bodyA.velocity.y = 0; // Stop downward movement on the collision
            }

            // Emit 'Dead' event only once during continuous collisions with a trap
            if (bodyB.type === 'trap' && !this.hasEmittedDead) {
                EventHandle.emit('Dead');
                this.hasEmittedDead = true; // Set flag to prevent multiple emissions
            }

        } else {
            // Reset the event flag when no collision is detected
            this.hasEmittedDead = false;
        }
    }
}
