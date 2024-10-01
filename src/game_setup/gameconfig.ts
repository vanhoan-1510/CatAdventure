import { Gravity } from "../physics/gravity";

export class GameConfig {
    public static readonly WORLD_WIDTH = 50000;
    public static readonly WORLD_HEIGHT = 900;
    public static readonly SCREEN_WIDTH = 1600;
    public static readonly SCREEN_HEIGHT = 900;
    public static readonly GRAVITY: Gravity = new Gravity(2);

    public static readonly TILE_SIZE = 32;
    public static readonly TILE_MAP1 = [
        [1, ...Array(35).fill(2), 3],
        ...Array(8).fill([4, ...Array(35).fill(5), 6]),
        [8, ...Array(35).fill(9), 10]
    ];

    public static readonly TILE_MAP2 = [
        [1, ...Array(35).fill(2), 3],
        ...Array(8).fill([4, ...Array(35).fill(5), 6]),
        [8, ...Array(35).fill(9), 10]
    ];
}