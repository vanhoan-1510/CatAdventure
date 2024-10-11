import { Assets, Container, Sprite, Texture, TilingSprite, Text, TextStyle } from "pixi.js";
import { GameConfig } from "../game_setup/gameconfig";
import { EventHandle } from "../eventhandle/eventhandle";

export class GameMenu extends Container {
    private menuBackgroundTexture: Texture;
    private buttonTextures: Texture[][];
    private soundButtonTexture: Texture[];
    private musicButtonTexture: Texture[];
    private boardTexture: Texture;
    private backButtonTexture: Texture[];

    private menuBackground: TilingSprite;
    private buttons: Sprite[];
    private buttonText: Text[];
    private gameTitle: Text;
    private settingBoard: Sprite;

    private settingText: Text;

    private soundState: boolean;
    private musicState: boolean;

    constructor() {
        super();
        this.soundState = this.getSoundStateFromLocalStorage();
        this.musicState = this.getMusicStateFromLocalStorage();
        this.Init();
        this.MainMenu();
    }

    Init() {
        this.menuBackgroundTexture = Assets.get('background');
        this.menuBackground = TilingSprite.from(this.menuBackgroundTexture, {
            width: GameConfig.WORLD_WIDTH,
            height: GameConfig.WORLD_HEIGHT
        });
        this.menuBackground.position.y = -800;
        this.menuBackground.scale.set(1);
        this.addChild(this.menuBackground);

        this.buttonTextures = [];
        this.buttons = [];
        this.buttonText = [];
        this.soundButtonTexture = [];
        this.musicButtonTexture = [];
        this.backButtonTexture = [];

        for (let i = 0; i < 2; i++) {
            const textures: Texture[] = [];
            for (let j = 1; j <= 3; j++) {
                const texture = Assets.get(`button${j}`);
                textures.push(texture);
            }
            this.buttonTextures.push(textures);
        }

        for (let i = 1; i <= 4; i++) {
            const texture = Assets.get(`sound${i}`);
            this.soundButtonTexture.push(texture);
        }

        for (let i = 1; i <= 4; i++) {
            const texture = Assets.get(`fx${i}`);
            this.musicButtonTexture.push(texture);
        }

        for (let i = 1; i <= 3; i++) {
            const texture = Assets.get(`back${i}`);
            this.backButtonTexture.push(texture);
        }

        this.boardTexture = Assets.get('pause');
        EventHandle.emit('PlayMenuMusic');
        EventHandle.emit('ChangeState', 'menu');
    }

    MainMenu() {
        const titleStyle = new TextStyle({
            fontFamily: "grobold",
            fontSize: 100, // Large font size
            fill: "#e36255", // White color
            align: "center"
        });

        this.gameTitle = new Text({
            text: "Cat Adventure", 
            style: titleStyle});
        this.gameTitle.anchor.set(0.5);
        this.gameTitle.position.set(GameConfig.SCREEN_WIDTH / 2, 100); // Position at the top center
        this.addChild(this.gameTitle);

        const buttonLabels = ["Start", "Settings"];
        const textStyle = new TextStyle({
            fontFamily: "Fancake",
            fontSize: 80,
            fill: "#ffffff",
            align: "center"
        });

        for (let i = 0; i < buttonLabels.length; i++) {
            const button = new Sprite(this.buttonTextures[i][0]);
            button.position.set(GameConfig.SCREEN_WIDTH / 2, GameConfig.SCREEN_HEIGHT / 2 + i * 200);
            button.anchor.set(0.5);
            button.scale.set(0.5);
            this.addChild(button);

            const text = new Text({
                text: buttonLabels[i],
                style: textStyle});
            text.anchor.set(0.5);
            button.addChild(text);
            this.buttonText.push(text);

            // Add event listeners for hover and click
            button.interactive = true;
            button.cursor = 'pointer'; // Set cursor style

            button.on('mouseover', () => {
                button.texture = this.buttonTextures[i][1];
            });

            button.on('mouseout', () => {
                button.texture = this.buttonTextures[i][0];
            });

            button.on('mousedown', () => {
                button.texture = this.buttonTextures[i][2];
            });

            button.on('mouseup', () => {
                button.texture = this.buttonTextures[i][1];
            });

            // Add event listener for the settings button
            if (buttonLabels[i] === "Settings") {
                button.on('click', () => {
                    this.SettingMenu();
                    this.soundState = this.getSoundStateFromLocalStorage();
                    this.musicState = this.getMusicStateFromLocalStorage();
                    EventHandle.emit('PlayButtonClickSound');
                });
            }

            if (buttonLabels[i] === "Start") {
                button.on('click', () => {
                    EventHandle.emit("StartGame");
                    EventHandle.emit('PlayButtonClickSound');
                });
            }

            this.buttons.push(button);
        }
    }

    SettingMenu() {
        this.settingBoard = new Sprite(this.boardTexture);
        this.settingBoard.anchor.set(0.5);
        this.settingBoard.position.set(GameConfig.SCREEN_WIDTH / 2, GameConfig.SCREEN_HEIGHT / 2);
        this.settingBoard.scale.set(0.8);
        this.addChild(this.settingBoard);

        this.settingText = new Text({
            text:"Settings",
            style:{
                fontFamily: "Fancake",
                fontSize: 50,
                fill: "#ffffff",
                align: "center"
            }
        });

        this.settingText.anchor.set(0.5);
        this.settingText.position.set(0, -this.settingBoard.height / 2 - 20);
        this.settingBoard.addChild(this.settingText);

        // Sound Button
        const soundButton = new Sprite(this.soundState ? this.soundButtonTexture[0] : this.soundButtonTexture[3]);
        soundButton.anchor.set(0.5);
        soundButton.scale.set(0.5);
        soundButton.position.set(0, -this.settingBoard.height / 4);
        this.settingBoard.addChild(soundButton);

        soundButton.interactive = true;
        soundButton.cursor = 'pointer';

        soundButton.on('mouseover', () => {
            soundButton.texture = this.soundState ? this.soundButtonTexture[1] : this.soundButtonTexture[3];
        });

        soundButton.on('mouseout', () => {
            soundButton.texture = this.soundState ? this.soundButtonTexture[0] : this.soundButtonTexture[3];
        });

        soundButton.on('mousedown', () => {
            soundButton.texture = this.soundState ? this.soundButtonTexture[2] : this.soundButtonTexture[3];
        });

        soundButton.on('mouseup', () => {
            soundButton.texture = this.soundState ? this.soundButtonTexture[1] : this.soundButtonTexture[3];
        });

        soundButton.on('click', () => {
            this.soundState = !this.soundState;
            soundButton.texture = this.soundState ? this.soundButtonTexture[0] : this.soundButtonTexture[3];
            EventHandle.emit(this.soundState ? 'UnmuteSound' : 'MuteSound');
            this.setSoundStateToLocalStorage(this.soundState);
            EventHandle.emit('PlayButtonClickSound');
        });

        // FX Button
        const musicButton = new Sprite(this.musicState ? this.musicButtonTexture[0] : this.musicButtonTexture[3]);
        musicButton.anchor.set(0.5);
        musicButton.scale.set(0.5);
        musicButton.position.set(0, this.settingBoard.height / 4 - 50);
        this.settingBoard.addChild(musicButton);

        musicButton.interactive = true;
        musicButton.cursor = 'pointer';

        musicButton.on('mouseover', () => {
            musicButton.texture = this.musicState ? this.musicButtonTexture[1] : this.musicButtonTexture[3];
        });

        musicButton.on('mouseout', () => {
            musicButton.texture = this.musicState ? this.musicButtonTexture[0] : this.musicButtonTexture[3];
        });

        musicButton.on('mousedown', () => {
            musicButton.texture = this.musicState ? this.musicButtonTexture[2] : this.musicButtonTexture[3];
        });

        musicButton.on('mouseup', () => {
            musicButton.texture = this.musicState ? this.musicButtonTexture[1] : this.musicButtonTexture[3];
        });

        musicButton.on('click', () => {
            this.musicState = !this.musicState;
            musicButton.texture = this.musicState ? this.musicButtonTexture[0] : this.musicButtonTexture[3];
            EventHandle.emit(this.musicState ? 'UnmuteMusic' : 'MuteMusic');
            this.setMusicStateToLocalStorage(this.musicState);
            EventHandle.emit('PlayButtonClickSound');
        });

        // Back Button
        const backButton = new Sprite(this.buttonTextures[0][0]);
        backButton.anchor.set(0.5);
        backButton.scale.set(0.5);
        backButton.position.set(0, this.settingBoard.height / 2 - 50);
        this.settingBoard.addChild(backButton);

        const backButtonText = new Text({
            text: "Back", 
            style: {
            fontFamily: "Fancake",
            fontSize: 80,
            fill: "#ffffff",
            align: "center"
            }
        });
        backButtonText.anchor.set(0.5);
        backButton.addChild(backButtonText);

        backButton.interactive = true;
        backButton.cursor = 'pointer';

        backButton.on('mouseover', () => {
            backButton.texture = this.buttonTextures[0][1];
        });

        backButton.on('mouseout', () => {
            backButton.texture = this.buttonTextures[0][0];
        });

        backButton.on('mousedown', () => {
            backButton.texture = this.buttonTextures[0][2];
        });

        backButton.on('mouseup', () => {
            backButton.texture = this.buttonTextures[0][1];
        });

        backButton.on('click', () => {
            this.removeChild(this.settingBoard);
            this.MainMenu();
            EventHandle.emit('PlayButtonClickSound');
        });
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
}