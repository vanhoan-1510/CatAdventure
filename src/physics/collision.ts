import { Body } from "./body";

export class Collision {

    static checkCollision(bodyA: Body, bodyB: Body): boolean {
        const dx = bodyA.position.x - bodyB.position.x;
        const dy = bodyA.position.y - bodyB.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isColliding = distance < (bodyA.radius + bodyB.radius);
        return isColliding;
    }

    static resolveCollision(bodyA: Body, bodyB: Body) {
        if (this.checkCollision(bodyA, bodyB)) {
            const dx = bodyA.position.x - bodyB.position.x;
            const dy = bodyA.position.y - bodyB.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const overlap = bodyA.radius + bodyB.radius - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            bodyA.position.x += nx * overlap / 2;
            bodyA.position.y += ny * overlap / 2;

            if (!bodyB.isStatic) {
                bodyB.position.x -= nx * overlap / 2;
                bodyB.position.y -= ny * overlap / 2;
            }

            const relativeVelocityX = bodyA.velocity.x - bodyB.velocity.x;
            const relativeVelocityY = bodyA.velocity.y - bodyB.velocity.y;
            const velocityAlongNormal = relativeVelocityX * nx + relativeVelocityY * ny;

            if (velocityAlongNormal > 0) {
                return; // Nếu bóng di chuyển ra xa, không xử lý
            }

            // Tính hệ số đàn hồi (restitution)
            const restitution = Math.min(bodyA.restitution, bodyB.restitution);
            const impulse = (-(1 + restitution) * velocityAlongNormal) / (bodyA.mass + bodyB.mass);

            // Cập nhật vận tốc dựa trên va chạm
            bodyA.velocity.x -= impulse * bodyB.mass * nx;
            bodyA.velocity.y -= impulse * bodyB.mass * ny;

            if (!bodyB.isStatic) {
                bodyB.velocity.x += impulse * bodyA.mass * nx;
                bodyB.velocity.y += impulse * bodyA.mass * ny;
            }

            bodyA.velocity.x = -bodyA.velocity.x * restitution;
            bodyA.velocity.y = -bodyA.velocity.y * restitution;

            if (!bodyB.isStatic) {
                bodyB.velocity.x = -bodyB.velocity.x * restitution;
                bodyB.velocity.y = -bodyB.velocity.y * restitution;
            }
        }
    }
}