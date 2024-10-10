import { Sound, sound } from '@pixi/sound';
import { Assets } from 'pixi.js';
import { EventHandle } from '../eventhandle/eventhandle';
export class SoundManager {
    private soundSprite: Sound;

    constructor() {
        this.Init();

        EventHandle.on('JumpSound', () => this.playJumpSound());
        EventHandle.on('DeadSound', () => this.playDeadSound());
        EventHandle.on('WinSound', () => this.playWinSound());
        EventHandle.on('SavePointSound', () => this.playSavePointSound());
        EventHandle.on('PunchSound', () => this.playPunchSound());
    }

    Init(){
        const soundData = Assets.get('soundpackjson');
        this.soundSprite = Sound.from(soundData.soundpack);
        this.soundSprite = sound.find('soundpackmp3');
        this.soundSprite.addSprites(soundData.spritemap);
        // this.soundSprite.play({sprite: 'gamebackgroundmusic',  loop: true});
    }

    playBackgroundSound(){
        this.soundSprite.play({sprite:'menusound', loop: true});
    }

    playJumpSound(){
        this.soundSprite.play('jump');
    }

    playDeadSound(){
        this.soundSprite.play('gameover');
    }

    playWinSound(){
        this.soundSprite.play('win');
    }

    playSavePointSound(){
        this.soundSprite.play('coincollect');
    }

    playPunchSound(){
        this.soundSprite.play('punch');
    }
}