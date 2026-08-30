import { Camera } from "./Camera";
import { GameObject } from "./objects/index";

export class Scene {
    private _gameObjects: GameObject[] = [];
    private _cameras: Camera[] = [];
    private _activeCamera?: Camera

    public add(gameObject: GameObject): void {
        this._gameObjects.push(gameObject);
    }

    public addCamera(camera: Camera){
        if (this._cameras.includes(camera)){
            return;
        }

        this._cameras.push(camera);
        if (!this._activeCamera)
        {
            this._activeCamera = camera;
        }
    }

    public update(dt: number){
        this._gameObjects.forEach(gameObject => {
        });
    }

    public get sceneObjects(): GameObject[] {
        return this._gameObjects;
    }
    
    public setActive(camera: Camera){
        if (this._cameras.includes(camera)) this._activeCamera = camera;
    }

    public get activeCamera(): Camera {
        if (!this._activeCamera) throw new Error('No active camera has been set');
        return this._activeCamera;
    }
}