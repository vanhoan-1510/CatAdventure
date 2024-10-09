import { Assets } from 'pixi.js';
import bundles from './assetsbundle.json';

export class AssetsLoader{
    async loadAssets(){
        // Cập nhật manifest cho Assets
        await Assets.init({ manifest: bundles });
    
        // Hoặc tải tài nguyên trước khi sử dụng với await
        await Assets.loadBundle('load-scence');
    };
}