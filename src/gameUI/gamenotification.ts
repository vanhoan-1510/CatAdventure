import { Assets, Container, Sprite, Texture, Text } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { EventHandle } from "../eventhandle/eventhandle";

export class GameNotification extends Container {
    public boardTexture: Texture;
    public gameOverIconTexture: Texture;
    public pauseButtonTexture: Texture[];
    public pauseMenuTexture: Texture;
    public soundButtonTexture: Texture[];
    public musicButtonTexture: Texture[];
    public homeButtonTexture: Texture[];
    public resumeButtonTexture: Texture[];
    public buttonTexture: Texture[];

    public board: Sprite;
    public gameOverIcon: Sprite;
    public pauseButton: Sprite;
    public pauseMenu: Sprite;
    public soundButton: Sprite;
    public musicButton: Sprite;
    public homeButton: Sprite;
    public resumeButton: Sprite;
    public playAgainButton: Sprite;
    public mainMenuButton: Sprite;

    private isSliding: boolean = false;
    private targetY: number;
    private viewport: Viewport;
    private soundState: boolean;
    private musicState: boolean;

    public gameStatusText: Text;
    public _PlayerScore: number = 0;
    public playerScoreText: Text;
    public textScore: Text;
    private pauseGameText: Text;

    private initialBoardPosition: { x: number, y: number };
    private initialGameStatusTextPosition: { x: number, y: number };
    private initialTextScorePosition: { x: number, y: number };
    private initialPlayerScoreTextPosition: { x: number, y: number };
    private initialGameOverIconPosition: { x: number, y: number };
    private initialplayAgainButtonPosition: { x: number, y: number };
    private initialMainMenuButtonPosition: { x: number, y: number };

    constructor(viewport: Viewport) {
        super();
        this.soundState = this.getSoundStateFromLocalStorage();
        this.musicState = this.getMusicStateFromLocalStorage();
        this.viewport = viewport;
        this.Init();
    
        EventHandle.on('UpdateScore', (score: number, isWin: boolean) => {
            this.UpdateScore(score, isWin);
        });
        EventHandle.on('ShowGameNotification', () => this.NotificationBoard());
        EventHandle.on('ResetGame', () => this.reset());
        EventHandle.on('MuteSound', () => this.updateSoundState(false));
        EventHandle.on('UnmuteSound', () => this.updateSoundState(true));
        EventHandle.on('MuteMusic', () => this.updateMusicState(false));
        EventHandle.on('UnmuteMusic', () => this.updateMusicState(true));
    }

    Init() {
        this.pauseButtonTexture = [];
        this.soundButtonTexture = [];
        this.musicButtonTexture = [];
        this.homeButtonTexture = [];
        this.resumeButtonTexture = [];
        this.buttonTexture = [];
        this.GamePause();

        this.boardTexture = Assets.get('board');
        this.board = new Sprite(this.boardTexture);
        this.gameOverIconTexture = Assets.get('weak');
        this.gameOverIcon = new Sprite(this.gameOverIconTexture);


        this.board.anchor.set(0.5, 0.5);
        this.board.position.set(this.viewport.screenWidth / 2, -this.viewport.screenHeight / 2);
        this.board.scale.set(0.6);
        this.addChild(this.board);

        this.gameOverIcon.anchor.set(0.5, 0.5);
        this.gameOverIcon.scale.set(0.7);
        this.gameOverIcon.position.set(this.board.position.x - 150, this.board.position.y); // Set initial position based on the board
        this.addChild(this.gameOverIcon);

        // Create text elements only once
        this.createTextElements();
        this.GameButton();
        this.MainMenuButton();

        // Store initial positions
        this.initialBoardPosition = { x: this.board.position.x, y: this.board.position.y };
        this.initialGameOverIconPosition = { x: this.gameOverIcon.position.x, y: this.gameOverIcon.position.y };
        this.initialGameStatusTextPosition = { x: this.gameStatusText.position.x, y: this.gameStatusText.position.y };
        this.initialTextScorePosition = { x: this.textScore.position.x, y: this.textScore.position.y };
        this.initialPlayerScoreTextPosition = { x: this.playerScoreText.position.x, y: this.playerScoreText.position.y };
        this.initialplayAgainButtonPosition = { x: this.playAgainButton.position.x, y: this.playAgainButton.position.y };
        this.initialMainMenuButtonPosition = { x: this.mainMenuButton.position.x, y: this.mainMenuButton.position.y };
    }

    createTextElements() {
        this.gameStatusText = new Text({
            text: 'YOU LOSE!',
            style: {
                fontFamily: 'Fancake',
                fontSize: 50,
                fill: '0xb44f3c',
            }
        });
        this.gameStatusText.anchor.set(0.5, 0.5);
        this.gameStatusText.position.set(this.board.position.x, this.board.position.y - 150);
        this.addChild(this.gameStatusText);

        this.textScore = new Text({
            text: '(-100)',
            style: {
                fontFamily: 'Fancake',
                fontSize: 25,
                fill: '0xb44f3c'
            }
        });
        this.textScore.anchor.set(0.5, 0.5);
        this.textScore.position.set(this.board.position.x, this.board.position.y - 100);
        this.addChild(this.textScore);

        this.playerScoreText = new Text({
            text: this._PlayerScore.toString(),
            style: {
                fontFamily: 'Fancake',
                fontSize: 50,
                fill: '0xb44f3c'
            }
        });
        this.playerScoreText.anchor.set(0.5, 0.5);
        this.playerScoreText.position.set(this.board.position.x, this.board.position.y);
        this.addChild(this.playerScoreText);
    }

    NotificationBoard() {
        if(this._PlayerScore % 500 == 0){
            EventHandle.emit('MainLaughtSound');
        }
        this.isSliding = true;
        this.targetY = this.viewport.screenHeight / 2;

    }

    GameButton(){
        for (let i = 1; i <= 3; i++) {
            this.buttonTexture.push(Assets.get('restart' + i));
        }
        this.playAgainButton = new Sprite(this.buttonTexture[0]);

        this.playAgainButton.anchor.set(0.5);
        this.playAgainButton.scale.set(0.4);
        this.playAgainButton.position.set(this.board.position.x , this.board.position.y + 150);
        this.addChild(this.playAgainButton);

        let playAgainButtonClicked = false;

        this.playAgainButton.interactive = true;
        this.playAgainButton.cursor = 'pointer';

        this.playAgainButton.on('mouseover', () => {
            if (!playAgainButtonClicked) {
                this.playAgainButton.texture = this.buttonTexture[1];
            }
        });

        this.playAgainButton.on('mouseout', () => {
            if (!playAgainButtonClicked) {
                this.playAgainButton.texture = this.buttonTexture[0];
            }
        });

        this.playAgainButton.on('mousedown', () => {
            if (!playAgainButtonClicked) {
                this.playAgainButton.texture = this.buttonTexture[2];
            }
        });

        this.playAgainButton.on('mouseup', () => {
            if (!playAgainButtonClicked) {
                this.playAgainButton.texture = this.buttonTexture[1];
            }
        });

        this.playAgainButton.on('click', () => {
            playAgainButtonClicked = !playAgainButtonClicked;
            if (playAgainButtonClicked) {
                EventHandle.emit('PlayButtonClickSound');
                EventHandle.emit('ResetGame');
            }
        });
    }

    MainMenuButton(){
        for(let i = 1; i <= 3; i++){
            this.buttonTexture.push(Assets.get('home' + i));
        }

        this.mainMenuButton = new Sprite(this.buttonTexture[0]);
        this.mainMenuButton.anchor.set(0.5);
        this.mainMenuButton.scale.set(0.4);
        this.mainMenuButton.position.set(this.board.position.x, this.board.position.y + 150);
        this.addChild(this.mainMenuButton);

        let mainMenuButtonClicked = false;

        this.mainMenuButton.interactive = true;
        this.mainMenuButton.cursor = 'pointer';

        this.mainMenuButton.on('mouseover', () => {
            if (!mainMenuButtonClicked) {
                this.mainMenuButton.texture = this.buttonTexture[1];
            }
        });

        this.mainMenuButton.on('mouseout', () => {
            if (!mainMenuButtonClicked) {
                this.mainMenuButton.texture = this.buttonTexture[0];
            }
        });

        this.mainMenuButton.on('mousedown', () => {
            if (!mainMenuButtonClicked) {
                this.mainMenuButton.texture = this.buttonTexture[2];
            }
        });

        this.mainMenuButton.on('mouseup', () => {
            if (!mainMenuButtonClicked) {
                this.mainMenuButton.texture = this.buttonTexture[1];
            }
        });

        this.mainMenuButton.on('click', () => {
            mainMenuButtonClicked = !mainMenuButtonClicked;
            if (mainMenuButtonClicked) {
                EventHandle.emit('PlayButtonClickSound');
                EventHandle.emit('GoToMenu');
            }
        });
    }

    UpdateScore(score: number, isWin: boolean) {
        if (this.playerScoreText) {
            this._PlayerScore += score;
            this.playerScoreText.text = this._PlayerScore.toString();
        }

        if (this.gameStatusText) {
            this.gameStatusText.text = isWin ? 'YOU WIN!' : 'YOU LOSE!';
        }
        // Update textScore based on game status
        if (this.textScore) {
            this.textScore.text = isWin ? 'Handsome Point(+1000)' : 'Handsome Point(-100)';
        }

        if(isWin == true){
            this.playAgainButton.visible = false;
            this.mainMenuButton.visible = true;
        }
        else{
            this.playAgainButton.visible = true;
            this.mainMenuButton.visible = false ;
        }
    }

    update(delta: number) {
        if (this.isSliding) {
            const speed = 0.5;
            this.board.position.y += speed * delta;

            if (this.board.position.y >= this.targetY) {
                this.board.position.y = this.targetY;
                this.isSliding = false;
            }

            // Update positions based on board's position
            this.updateTextPositions();
            this.playAgainButton.position.set(this.board.position.x, this.board.position.y + 150);
            this.mainMenuButton.position.set(this.board.position.x, this.board.position.y + 150);
            this.gameOverIcon.position.set(this.board.position.x - 150, this.board.position.y);
        }
    }

    updateTextPositions() {
        if (this.board) {
            this.gameStatusText.position.set(this.board.position.x + 100, this.board.position.y - 50);
            this.textScore.position.set(this.board.position.x + 100, this.board.position.y);
            this.playerScoreText.position.set(this.board.position.x + 100, this.board.position.y + 50);
        }
    }

    GamePause(){
        for (let i = 1; i <= 3; i++) {
            this.pauseButtonTexture.push(Assets.get('setting' + i));
        }

        this.pauseButton = new Sprite(this.pauseButtonTexture[0]);
        this.pauseButton.anchor.set(0.5);
        this.pauseButton.scale.set(0.4);
        this.pauseButton.position.set(this.viewport.screenWidth - 50, 50);
        this.addChild(this.pauseButton);

        let pauseButtonClicked = false;

        this.pauseButton.interactive = true;
        this.pauseButton.cursor = 'pointer';

        this.pauseButton.on('mouseover', () => {
            if (!pauseButtonClicked) {
                this.pauseButton.texture = this.pauseButtonTexture[1];
            }
        });

        this.pauseButton.on('mouseout', () => {
            if (!pauseButtonClicked) {
                this.pauseButton.texture = this.pauseButtonTexture[0];
            }
        });

        this.pauseButton.on('mousedown', () => {
            if (!pauseButtonClicked) {
                this.pauseButton.texture = this.pauseButtonTexture[2];
            }
        });

        this.pauseButton.on('mouseup', () => {
            if (!pauseButtonClicked) {
                this.pauseButton.texture = this.pauseButtonTexture[1];
            }
        });

        this.pauseButton.on('click', () => {
            pauseButtonClicked = !pauseButtonClicked;
            if (pauseButtonClicked) {
                this.ShowPauseMenu();
                this.pauseMenu.visible = true;
                this.soundButton.visible = true;
                this.musicButton.visible = true;
                this.homeButton.visible = true;
                this.resumeButton.visible = true;
                this.pauseGameText.visible = true;

                this.pauseMenu.interactive = true;
                this.soundButton.interactive = true;
                this.musicButton.interactive = true;
                this.homeButton.interactive = true;
                this.resumeButton.interactive = true;
                this.pauseGameText.interactive = true;

                this.pauseButton.visible = false;  
            }
        }); 
    }

    ShowPauseMenu(){
        this.soundState = this.getSoundStateFromLocalStorage();
        this.musicState = this.getMusicStateFromLocalStorage();
        this.pauseMenuTexture = Assets.get('pause');
        this.pauseMenu = new Sprite(this.pauseMenuTexture);
        this.pauseMenu.anchor.set(0.5);
        this.pauseMenu.position.set(this.viewport.screenWidth / 2, this.viewport.screenHeight / 2);
        this.pauseMenu.visible = false;
        this.pauseMenu.scale.set(0.8);
        this.addChild(this.pauseMenu);

        this.pauseGameText = new Text({
            text: 'Pause',
            style: {
                fontFamily: 'Fancake',
                fontSize: 50,
                fill: 'ffffff',
            }
        });
        this.pauseGameText.anchor.set(0.5, 0.5);
        this.pauseGameText.position.set(this.pauseMenu.position.x, this.pauseMenu.position.y - 220);
        this.pauseGameText.visible = false;
        this.addChild(this.pauseGameText);

        for (let i = 1; i <= 4; i++) {
            this.soundButtonTexture.push(Assets.get('sound' + i));
        }

        this.soundButton = new Sprite(this.soundButtonTexture[0]);
        this.soundButton.anchor.set(0.5);
        this.soundButton.scale.set(0.4);
        this.soundButton.visible = false;
        this.soundButton.position.set(this.pauseMenu.position.x - 50, this.pauseMenu.position.y - 50);
        this.addChild(this.soundButton);

        let soundButtonClicked = false;

        this.soundButton.interactive = false;
        this.soundButton.cursor = 'pointer';

        this.soundButton.on('mouseover', () => {
            this.soundButton.texture = this.soundState ? this.soundButtonTexture[1] : this.soundButtonTexture[3];
        });

        this.soundButton.on('mouseout', () => {
            this.soundButton.texture = this.soundState ? this.soundButtonTexture[0] : this.soundButtonTexture[3];
        });

        this.soundButton.on('mousedown', () => {
            this.soundButton.texture = this.soundState ? this.soundButtonTexture[2] : this.soundButtonTexture[3];
        });

        this.soundButton.on('mouseup', () => {
            this.soundButton.texture = this.soundState ? this.soundButtonTexture[1] : this.soundButtonTexture[3];
        });

        this.soundButton.on('click', () => {
            this.soundState = !this.soundState;
            this.soundButton.texture = this.soundState ? this.soundButtonTexture[0] : this.soundButtonTexture[3];
            EventHandle.emit(this.soundState ? 'UnmuteSound' : 'MuteSound');
            this.setSoundStateToLocalStorage(this.soundState);
            EventHandle.emit('PlayButtonClickSound');
        });

        for (let i = 1; i <= 4; i++) {
            this.musicButtonTexture.push(Assets.get('fx' + i));
        }

        this.musicButton = new Sprite(this.musicButtonTexture[0]);
        this.musicButton.anchor.set(0.5);
        this.musicButton.scale.set(0.4);
        this.musicButton.visible = false;
        this.musicButton.position.set(this.pauseMenu.position.x + 50, this.pauseMenu.position.y - 50);
        this.addChild(this.musicButton);

        let musicButtonClicked = false;

        this.musicButton.interactive = false;
        this.musicButton.cursor = 'pointer';

        this.musicButton.on('mouseover', () => {
            this.musicButton.texture = this.musicState ? this.musicButtonTexture[1] : this.musicButtonTexture[3];
        });

        this.musicButton.on('mouseout', () => {
            this.musicButton.texture = this.musicState ? this.musicButtonTexture[0] : this.musicButtonTexture[3];
        });

        this.musicButton.on('mousedown', () => {
            this.musicButton.texture = this.musicState ? this.musicButtonTexture[2] : this.musicButtonTexture[3];
        });

        this.musicButton.on('mouseup', () => {
            this.musicButton.texture = this.musicState ? this.musicButtonTexture[1] : this.musicButtonTexture[3];
        });

        this.musicButton.on('click', () => {
            this.musicState = !this.musicState;
            this.musicButton.texture = this.musicState ? this.musicButtonTexture[0] : this.musicButtonTexture[3];
            EventHandle.emit(this.musicState ? 'UnmuteMusic' : 'MuteMusic');
            this.setMusicStateToLocalStorage(this.musicState);
            EventHandle.emit('PlayButtonClickSound');
        });

        for (let i = 1; i <= 4; i++) {
            this.homeButtonTexture.push(Assets.get('home' + i));
        }

        this.homeButton = new Sprite(this.homeButtonTexture[0]);
        this.homeButton.anchor.set(0.5);
        this.homeButton.scale.set(0.4);
        this.homeButton.visible = false;
        this.homeButton.position.set(this.pauseMenu.position.x - 50, this.pauseMenu.position.y + 50);
        this.addChild(this.homeButton);

        let homeButtonClicked = false;

        this.homeButton.interactive = false;
        this.homeButton.cursor = 'pointer';

        this.homeButton.on('mouseover', () => {
            if (!homeButtonClicked) {
                this.homeButton.texture = this.homeButtonTexture[1];
            }
        });

        this.homeButton.on('mouseout', () => {
            if (!homeButtonClicked) {
                this.homeButton.texture = this.homeButtonTexture[0];
            }
        });

        this.homeButton.on('mousedown', () => {
            if (!homeButtonClicked) {
                this.homeButton.texture = this.homeButtonTexture[2];
            }
        });

        this.homeButton.on('mouseup', () => {
            if (!homeButtonClicked) {
                this.homeButton.texture = this.homeButtonTexture[1];
            }
        });

        this.homeButton.on('click', () => {
            EventHandle.emit('PlayButtonClickSound');
            EventHandle.emit('GoToMenu');
        });

        for (let i = 1; i <= 4; i++) {
            this.resumeButtonTexture.push(Assets.get('play' + i));
        }

        this.resumeButton = new Sprite(this.resumeButtonTexture[0]);
        this.resumeButton.anchor.set(0.5);
        this.resumeButton.scale.set(0.4);
        this.resumeButton.visible = false
        this.resumeButton.position.set(this.pauseMenu.position.x + 50, this.pauseMenu.position.y + 50);
        this.addChild(this.resumeButton);

        let resumeButtonClicked = false;

        this.resumeButton.interactive = false;
        this.resumeButton.cursor = 'pointer';

        this.resumeButton.on('mouseover', () => {
            if (!resumeButtonClicked) {
                this.resumeButton.texture = this.resumeButtonTexture[1];
            }
        });

        this.resumeButton.on('mouseout', () => {
            if (!resumeButtonClicked) {
                this.resumeButton.texture = this.resumeButtonTexture[0];
            }
        });

        this.resumeButton.on('mousedown', () => {
            if (!resumeButtonClicked) {
                this.resumeButton.texture = this.resumeButtonTexture[2];
            }
        });

        this.resumeButton.on('mouseup', () => {
            if (!resumeButtonClicked) {
                this.resumeButton.texture = this.resumeButtonTexture[1];
            }
        });

        this.resumeButton.on('click', () => {
            resumeButtonClicked = !resumeButtonClicked;
            if (resumeButtonClicked) {
                this.pauseMenu.visible = false;
                this.soundButton.visible = false;
                this.musicButton.visible = false;
                this.homeButton.visible = false;
                this.resumeButton.visible = false;
                this.pauseGameText.visible = false;

                this.pauseMenu.interactive = false;
                this.soundButton.interactive = false;
                this.musicButton.interactive = false;
                this.homeButton.interactive = false;
                this.resumeButton.interactive = false;
                this.pauseGameText.interactive = false;

                this.pauseButton.visible = true;
            } 
        });
    }

    reset() {
        // Reset board position
        if (this.board) {
            this.board.position.set(this.initialBoardPosition.x, this.initialBoardPosition.y);
        }

        // Reset text positions
        this.gameStatusText.position.set(this.initialGameStatusTextPosition.x, this.initialGameStatusTextPosition.y);
        this.textScore.position.set(this.initialTextScorePosition.x, this.initialTextScorePosition.y);
        this.playerScoreText.position.set(this.initialPlayerScoreTextPosition.x, this.initialPlayerScoreTextPosition.y);
        this.playAgainButton.position.set(this.initialplayAgainButtonPosition.x, this.initialplayAgainButtonPosition.y);
        this.mainMenuButton.position.set(this.initialMainMenuButtonPosition.x, this.initialMainMenuButtonPosition.y);

        // Reset game over icon position
        if (this.gameOverIcon) {
            this.gameOverIcon.position.set(this.initialGameOverIconPosition.x, this.initialGameOverIconPosition.y);
        }

        // Reset sliding state
        this.isSliding = false;
        this.targetY = this.viewport.screenHeight / 2;


        // Reset the text score to default
        if (this.textScore) {
            this.textScore.text = 'Handsome Point'; // Reset to lose score default
        }
    }

    private updateSoundState(state: boolean) {
        this.setSoundStateToLocalStorage(state);
        this.soundButton.texture = state ? this.soundButtonTexture[0] : this.soundButtonTexture[3];
    }
    
    private updateMusicState(state: boolean) {
        this.setMusicStateToLocalStorage(state);
        this.musicButton.texture = state ? this.musicButtonTexture[0] : this.musicButtonTexture[3];
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
