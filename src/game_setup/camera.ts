import { Application, Container, Point } from "pixi.js";
import { GameConfig } from "./gameconfig";

export class Camera extends Container{
    private mapWidth: number;
    private mapHeight: number;

    constructor(mapWidth: number, mapHeight: number) {
        super();
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;
    }

    public update(targetPosition: { x: number; y: number }) {
        const screenCenter = new Point(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2);
        const newMapPos = new Point(-targetPosition.x + screenCenter.x, -targetPosition.y + screenCenter.y);
    
        // Giới hạn vị trí camera
        if (newMapPos.x < -this.mapWidth + GameConfig.WIDTH) {
            newMapPos.x = -this.mapWidth + GameConfig.WIDTH;
        }
        if (newMapPos.x > 0) {
            newMapPos.x = 0;
        }
        if (newMapPos.y < -this.mapHeight + GameConfig.HEIGHT) {
            newMapPos.y = -this.mapHeight + GameConfig.HEIGHT;
        }
        if (newMapPos.y > 0) {
            newMapPos.y = 0;
        }
    
        this.position.set(newMapPos.x, newMapPos.y);
    }
}