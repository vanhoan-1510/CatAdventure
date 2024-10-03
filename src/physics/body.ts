export class Body {
    public position: { x: number, y: number };
    public velocity: { x: number, y: number };
    public mass: number;
    public width: number;
    public height: number;
    public isStatic: boolean;
    public restitution: number;
    public type: string;

    constructor(x: number, y: number, width: number, height: number, mass: number, isStatic: boolean, restitution: number, type: string) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.mass = mass;
        this.width = width;
        this.height = height;
        this.isStatic = isStatic;
        this.restitution = restitution;
        this.type = type;
    }

    public update(deltaTime: number) {
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
    }
}