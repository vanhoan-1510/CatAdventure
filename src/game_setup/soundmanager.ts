import { Sound, sound } from '@pixi/sound';
import { Assets } from 'pixi.js';
import { EventHandle } from '../eventhandle/eventhandle';

export class SoundManager {
    private soundSprite: Sound;
    public isSoundOn: boolean = true;
    public isMusicOn: boolean = true;

    public isPlayMenuMusic: boolean = true;
    public isPlayGameMusic: boolean = true;

    private gameState: 'menu' | 'game' = 'menu'; // Thêm thuộc tính trạng thái

    constructor() {
        this.LoadStage();
        this.Init();

        EventHandle.on('PlayMenuMusic', () => this.playBackgroundSound());
        EventHandle.on('PlayGameMusic', () => this.playGameBackgroundSound());
        EventHandle.on('JumpSound', () => this.playJumpSound());
        EventHandle.on('DeadSound', () => this.playDeadSound());
        EventHandle.on('PlayWinSound', () => this.playWinSound());
        EventHandle.on('SavePointSound', () => this.playSavePointSound());
        EventHandle.on('ExplosionSound', () => this.playExplosionSound());
        EventHandle.on('MainLaughtSound', () => this.playManLaughtSound());
        EventHandle.on('PunchSound', () => this.playPunchSound());
        EventHandle.on('MuteSound', () => this.setSoundState(false));
        EventHandle.on('UnmuteSound', () => this.setSoundState(true));
        EventHandle.on('MuteMusic', () => this.setMusicState(false));
        EventHandle.on('UnmuteMusic', () => this.setMusicState(true));
        EventHandle.on('PlayButtonClickSound', () => this.playButtonClickedSound());
        EventHandle.on('ChangeState', (state: 'menu' | 'game') => this.changeState(state)); // Thêm sự kiện thay đổi trạng thái
    }

    Init() {
        const soundData = Assets.get('soundpackjson');
        
        // Initialize sound sprite
        this.soundSprite = Sound.from(soundData.soundpack);
        this.soundSprite = sound.find('soundpackmp3');
        this.soundSprite.addSprites(soundData.spritemap);

        this.checkMusicState();
        this.checkSoundState();
    }

    playBackgroundSound() {
        if (this.isMusicOn && this.gameState === 'menu') {
            this.isPlayMenuMusic = true;
            this.soundSprite.stop();
            this.soundSprite.play({ sprite: 'menusound', loop: true });
            this.isPlayGameMusic = false;
        }
    }

    playGameBackgroundSound() {
        if (this.isMusicOn && this.gameState === 'game') {
            this.isPlayGameMusic = true;
            this.soundSprite.stop();
            this.soundSprite.play({ sprite: 'gamebackgroundmusic', loop: true });
            this.isPlayMenuMusic = false;
        }
    }

    checkMusicState() {
        if (!this.isMusicOn) {
            this.soundSprite.stop();
        } else {
            // Phát nhạc nền dựa trên trạng thái hiện tại
            if (this.gameState === 'menu') {
                this.playBackgroundSound();
            } else if (this.gameState === 'game') {
                this.playGameBackgroundSound();
            }
        }
    }

    checkSoundState() {
        if (!this.isSoundOn) {
            this.soundSprite.stop();
        }
    }

    playJumpSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('jump');
        }
    }

    playDeadSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('gameover');
        }
    }

    playWinSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('win');
        }
    }

    playExplosionSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('explosion');
        }
    }

    playManLaughtSound(){
        if (this.isSoundOn) {
            this.soundSprite.play('manlaught');
        }
    }

    playSavePointSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('coincollect');
        }
    }

    playPunchSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('punch');
        }
    }

    playButtonClickedSound() {
        if (this.isSoundOn) {
            this.soundSprite.play('buttonclick');
        }
    }

    setSoundState(state: boolean) {
        this.isSoundOn = state;
        this.checkSoundState();
        this.setSoundStateToLocalStorage(state);
    }

    setMusicState(state: boolean) {
        this.isMusicOn = state;
        this.checkMusicState();
        this.setMusicStateToLocalStorage(state);
    }

    SaveStage() {
        const saveData = {
            soundStage: this.isSoundOn,
            musicStage: this.isMusicOn
        };
        localStorage.setItem('saveData', JSON.stringify(saveData));
    }

    LoadStage() {
        this.isSoundOn = this.getSoundStateFromLocalStorage();
        this.isMusicOn = this.getMusicStateFromLocalStorage();
    }

    getSoundStateFromLocalStorage(): boolean {
        const state = localStorage.getItem('soundState');
        return state ? JSON.parse(state) : true;
    }

    setSoundStateToLocalStorage(state: boolean) {
        localStorage.setItem('soundState', JSON.stringify(state));
    }

    getMusicStateFromLocalStorage(): boolean {
        const state = localStorage.getItem('musicState');
        return state ? JSON.parse(state) : true;
    }

    setMusicStateToLocalStorage(state: boolean) {
        localStorage.setItem('musicState', JSON.stringify(state));
    }

    changeState(state: 'menu' | 'game') {
        this.gameState = state;
        this.checkMusicState(); // Kiểm tra và phát nhạc nền dựa trên trạng thái mới
    }
}