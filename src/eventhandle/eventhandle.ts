import { EventEmitter } from "pixi.js";

export class EventHandle {
    private static _eventEmitter: EventEmitter<string> = new EventEmitter();   

    //Kích hoạt một sự kiện event
    public static emit(eventName: string, ...args: any[]): boolean {
        return this._eventEmitter.emit(eventName, ...args);
    }
 
    //Đăng ký funtion callback khi có sự kiện event được kích hoạt
    public static on(event: string, fn: EventEmitter.ListenerFn, context?: any): EventHandle {
        this._eventEmitter.on(event, fn, context);
        return this;
    }
}