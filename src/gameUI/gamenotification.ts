import { Assets, Container, Sprite, Texture, Text } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { EventHandle } from "../eventhandle/eventhandle";

export class GameNotification extends Container {
    public boardTexture: Texture;
    public gameOverIconTexture: Texture;

    public board: Sprite;
    public gameOverIcon: Sprite;

    private isSliding: boolean = false;
    private targetY: number;
    private viewport: Viewport;

    public gameStatusText: Text; // Renamed from youLoseText
    public _PlayerScore: number = 0;
    public playerScoreText: Text;
    public textScore: Text;

    private initialBoardPosition: { x: number, y: number };
    private initialGameStatusTextPosition: { x: number, y: number };
    private initialTextScorePosition: { x: number, y: number };
    private initialPlayerScoreTextPosition: { x: number, y: number };
    private initialGameOverIconPosition: { x: number, y: number };

    constructor(viewport: Viewport) {
        super();
        this.viewport = viewport;
        this.Init();

        EventHandle.on('UpdateScore', (score: number) => this.UpdateScore(score));
        EventHandle.on('PlayerWin', () => this.updateGameStatus(true));
        EventHandle.on('PlayerLose', () => this.updateGameStatus(false));
        EventHandle.on('ShowGameNotification', () => this.NotificationBoard());
        EventHandle.on('ResetGame', () => this.reset());
    }

    Init() {
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

        // Store initial positions
        this.initialBoardPosition = { x: this.board.position.x, y: this.board.position.y };
        this.initialGameOverIconPosition = { x: this.gameOverIcon.position.x, y: this.gameOverIcon.position.y };
        this.initialGameStatusTextPosition = { x: this.gameStatusText.position.x, y: this.gameStatusText.position.y };
        this.initialTextScorePosition = { x: this.textScore.position.x, y: this.textScore.position.y };
        this.initialPlayerScoreTextPosition = { x: this.playerScoreText.position.x, y: this.playerScoreText.position.y };
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
        this.isSliding = true;
        this.targetY = this.viewport.screenHeight / 2;
    }

    UpdateScore(score: number) {
        if (this.playerScoreText) {
            this._PlayerScore += score;
            this.playerScoreText.text = this._PlayerScore.toString();
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
            this.gameOverIcon.position.set(this.board.position.x - 150, this.board.position.y); // Update icon position dynamically
        }
    }

    updateTextPositions() {
        if (this.board) {
            this.gameStatusText.position.set(this.board.position.x + 100, this.board.position.y - 50);
            this.textScore.position.set(this.board.position.x + 100, this.board.position.y);
            this.playerScoreText.position.set(this.board.position.x + 100, this.board.position.y + 50);
        }
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

    // Add updateGameStatus method
    updateGameStatus(isWin: boolean) {
        if (this.gameStatusText) {
            this.gameStatusText.text = isWin ? 'YOU WIN!' : 'YOU LOSE!';
        }
        // Update textScore based on game status
        if (this.textScore) {
            this.textScore.text = isWin ? 'Handsome Point(+1000)' : 'Handsome Point(-100)'; // Set score based on win/lose status
        }
    }
}
