import { Updatable } from "../animation/Updatable";
import { CanvasRenderer } from "../rendering/CanvasRenderer";
import { Scene } from "../scene/Scene";

export class Engine{
    renderer: CanvasRenderer;
    scene: Scene;
    updatables: Updatable[] = [] as Updatable[];
    lastFrameTimestamp: number = 0;
    isPaused: boolean = false;

    constructor(renderer: CanvasRenderer, scene: Scene, updatables: Updatable[]){
        this.renderer = renderer;
        this.scene = scene;
        this.updatables = updatables;
    }
    
    start(){
        this.lastFrameTimestamp = performance.now();
        requestAnimationFrame(this.frame);
    }

    togglePause = () => {
        this.isPaused = !this.isPaused;

        if (!this.isPaused){
            this.lastFrameTimestamp = performance.now();
            requestAnimationFrame(this.frame);
        }
    }

    update(dt: number){
        this.scene.update(dt);
        this.updatables.forEach((updatable: Updatable) => {
            updatable.update(dt);
        })
    }

    frame = (now: number) => {
        const dt = Math.min((now - this.lastFrameTimestamp) / 1000, 1);
        // console.log("FPS: " + 1/dt)
        this.lastFrameTimestamp = now;
        
        if (this.isPaused) return;
    
        this.update(dt);
        this.renderer.render(this.scene, this.scene.activeCamera, Math.trunc(1/dt));
        requestAnimationFrame(this.frame);
    }
}