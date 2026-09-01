import { generateMaze } from "@/maze-generator/generateMaze";
import { Updatable } from "../animation/Updatable";
import { ArrowCameraController } from "../controls/CameraControllers/ArrowCameraController";
import { WasdCameraController } from "../controls/CameraControllers/WasdCameraController";
import { Matrix3, Transform, Vec3 } from "../maths/index";
import { Camera } from "../scene/Camera";
import { Panel } from "../scene/objects/Panel";
import { Scene } from "../scene/Scene";

export function createMazeScene(): {scene: Scene, controllers: Updatable[]} {
    const mazeWidth = 2;
    const mazeHeight = 2;

    const scene = new Scene();

    const cameraControllers = addCamera(scene);

    addMaze(scene, mazeWidth, mazeHeight);

    return {scene: scene, controllers: cameraControllers};
}

function addCamera(scene: Scene){
    const cameraTransform: Transform = {
        position: {x: 0, y: 1.5, z: 0},
        orientation: Matrix3.identity(),
        scale: {x: 1, y: 1, z: 1}
    }

    const camera = new Camera(cameraTransform);

    scene.addCamera(camera);
    scene.setActive(camera);

    
    const wasdCameraController = new WasdCameraController();
    const arrowKeyController = new ArrowCameraController();
    
    const cameraControllers = [wasdCameraController, arrowKeyController];
    
    cameraControllers.forEach(controller => {
        controller.addControls(scene.activeCamera);
    })

    return [wasdCameraController, arrowKeyController]
}

function addFloor(scene: Scene, xRange: [number, number], y: number, zRange: [number, number]){
    const orientation = Matrix3.identity()

    for (let x = xRange[0]; x < xRange[1]; x++){
        for (let z = zRange[0]; z < zRange[1]; z++){
            const panelTransform: Transform = {
                position: {x: x, y: y, z: z},
                orientation: orientation,
                scale: {x: 1, y: 1, z: 1}
            }
        
            const panel = new Panel(panelTransform);
            scene.add(panel);

        }
    }
}

function addWalls(scene: Scene, x: number, yRange: [number, number], zRange: [number, number]){
    const orientation: Matrix3 = [
        [0,-1,0],
        [1,0,0],
        [0,0,1]
    ]

    for (let y = yRange[0]; y < yRange[1]; y++){
        for (let z = zRange[0]; z < zRange[1]; z++){
            const panelTransform: Transform = {
                position: {x: x, y: y, z: z},
                orientation: orientation,
                scale: {x: 1, y: 1, z: 1}
            }
                
            const panel = new Panel(panelTransform);
            scene.add(panel);
        }
    }
}

function addCorridor(scene: Scene, xRange: [number, number], yRange: [number, number], zRange: [number, number]){
    addFloor(scene, xRange, yRange[0], zRange);
    addFloor(scene, xRange, yRange[1], zRange);
    addWalls(scene, xRange[0], yRange, zRange);
    addWalls(scene, xRange[1], yRange, zRange);
}

function addMaze(scene: Scene, mazeWidth: number, mazeHeight: number){
    const {seed, maze} = generateMaze(mazeWidth, mazeHeight);

    for (let rowIndex = 0; rowIndex < maze.length; rowIndex++){
        for (let columnIndex = 0; columnIndex < maze[rowIndex].length; columnIndex++){
            // x = row, z = column
            if (maze[rowIndex][columnIndex] == 0){
                addFloor(scene, [rowIndex, rowIndex + 1], 0, [columnIndex, columnIndex + 1])
                // addWalls(scene, 0, [0,1], [columnIndex, columnIndex + 1])
                //addFloor(scene, [rowIndex, rowIndex + 1], 1, [columnIndex, columnIndex + 1])
                //addCorridor(scene, [rowIndex, rowIndex + 1], [0,4], [columnIndex, columnIndex + 1])
            }
        }
    }

    //return {startPoint: maze.}
}