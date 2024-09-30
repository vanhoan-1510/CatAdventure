export class Body {
    public position: { x: number, y: number };
    public velocity: { x: number, y: number };
    public mass: number;
    public width: number;
    public height: number;
    public isStatic: boolean;
    public restitution: number;

    constructor(x: number, y: number, width: number, height: number, mass: number, isStatic: boolean, restitution: number) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.mass = mass;
        this.width = width;
        this.height = height;
        this.isStatic = isStatic;
        this.restitution = restitution;
    }

    public update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
}