import { Assets } from 'pixi.js';
import bundles from './assetsbundle.json';

export class AssetsLoader{
    async loadAssets(){
        // Cập nhật manifest cho Assets
        await Assets.init({ manifest: bundles });
    
        // Có thể thực hiện tải ngầm cho bundle!
        await Assets.backgroundLoadBundle(['load-tile-map']);
    
        // Hoặc tải tài nguyên trước khi sử dụng với await
        await Assets.loadBundle('load-tile-map');
    };
}