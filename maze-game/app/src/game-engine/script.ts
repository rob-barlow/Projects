import { CanvasRenderer } from "./rendering/CanvasRenderer";
import { Engine } from "./app/Engine";
import { createMazeScene } from "./app/MazeScene";

export default async function main() {
    console.log("starting")
    const renderer = new CanvasRenderer();
    const {scene, controllers}  = createMazeScene();

    const engine: Engine = new Engine(renderer, scene, controllers);

    engine.start();
}
