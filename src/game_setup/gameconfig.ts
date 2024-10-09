import { Gravity } from "../physics/gravity";

export class GameConfig {
    public static readonly WORLD_WIDTH = 10600;
    public static readonly WORLD_HEIGHT = 2500;
    public static readonly SCREEN_WIDTH = 1600;
    public static readonly SCREEN_HEIGHT = 900;
    public static readonly GRAVITY: Gravity = new Gravity(1);

    public static readonly TILE_SIZE = 32;

    public static readonly CHARACTER_DEFAULT_POSISION = { x: 100, y: 200 };
    public static readonly SAVE_POINT_DEFAULT_POSISION = { x: 5000, y: this.SCREEN_HEIGHT / 2 + this.TILE_SIZE * 7 };

    public static readonly TILE_MAP1 = [
        [1, ...Array(35).fill(2), 3],
        ...Array(5).fill([4, ...Array(35).fill(5), 6])
    ];

    public static readonly TILE_MAP2 = [
        [1, ...Array(70).fill(2), 3],
        ...Array(5).fill([4, ...Array(70).fill(5), 6])
    ];

    public static readonly TILE_MAP3 = [
        [1, ...Array(65).fill(2), 2],
        ...Array(5).fill([4, ...Array(65).fill(5), 5])
    ];

    public static readonly TILE_MAP4 = [
        [1, ...Array(4).fill(2), 3],
        ...Array(5).fill([4, ...Array(4).fill(5), 6])
    ];

    public static readonly TILE_MAP5 = [
        [2, ...Array(30).fill(2), 3]
    ];

    public static readonly TILE_MAP6 = [
        ...Array(5).fill([...Array(50).fill(5)])
    ];

    public static readonly TILE_MAP7 = [
        [1, ...Array(4).fill(2)]
    ];

    public static readonly TILE_MAP8 = [
        [2, ...Array(20).fill(2)],
        ...Array(6).fill([5, ...Array(20).fill(5)])
    ];

    public static readonly TILE_MAP9 = [
        [1, ...Array(40).fill(2)],
        ...Array(26).fill([4, ...Array(40).fill(5)])
    ];


    //Trap Config
    public static readonly SUN_DEFAULT_POSISION = { x: 2500, y: 100 };
    public static readonly MUSHROOM_SIZE = 49;
    public static readonly SPIKE_WIDTH = 64;
    public static readonly ENEMY_POSITION = {x: 8100, y: this.SCREEN_HEIGHT / 2 + 30}
}