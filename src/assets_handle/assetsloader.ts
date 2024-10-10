import { Assets } from 'pixi.js';
import bundles from './assetsbundle.json';

export class AssetsLoader{
    async loadAssets(){
        await Assets.init({ manifest: bundles });

        await Assets.loadBundle('load-scence');
    };
}