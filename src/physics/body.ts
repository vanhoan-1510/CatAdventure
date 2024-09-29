export class Body {
    public position: { x: number, y: number };
    public velocity: { x: number, y: number };
    public mass: number;
    public radius: number;
    public isStatic: boolean;
    public restitution: number;

    constructor(x: number, y: number, radius: number, mass: number, isStatic: boolean, restitution: number) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.mass = mass;
        this.radius = radius;
        this.isStatic = isStatic;
        this.restitution = restitution;
    }

    public update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
}