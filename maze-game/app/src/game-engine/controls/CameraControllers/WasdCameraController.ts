import { Matrix3 } from "../../maths/Matrix3";
import { Vec3 } from "../../maths/Vec3";
import { Camera } from "../../scene/Camera";
import { CameraSpeed } from "../../utils/constants";
import { CameraControllerInterface } from "./CameraControllerInterface";

export class WasdCameraController implements CameraControllerInterface {
    cameras: Camera[] = [];

    inputBuffer: String[] = [];

    constructor(){
        this.addEventListeners();
    }

    addControls(camera: Camera){
        this.cameras.push(camera);
    }

    update(dt: number){
        if (this.inputBuffer.length == 0) return;

        this.cameras.forEach(camera => {
            let direction = {x: 0, y: 0, z: 0};

            // build direction first then move the camera
            this.inputBuffer.forEach(key => {
                switch (key){
                    case "w":
                        if (direction.z == 0){
                            direction.z = 1
                        }
                        break;
                    case "a":
                        if (direction.x == 0){
                            direction.x = -1
                        }
                        break;
                    case "s":
                        if (direction.z == 0){
                            direction.z = -1
                        }
                        break;
                    case "d":
                        if (direction.x == 0){
                            direction.x = 1
                        }
                        break;
                }
            })
            
            let rotatedDirection = Matrix3.apply(camera.transform.orientation, direction);
            rotatedDirection.y = 0;

            const distanceMoved = dt * CameraSpeed
            rotatedDirection = Vec3.scale(Vec3.normalise(rotatedDirection), distanceMoved); 
            
            camera.transform.position = Vec3.add(camera.transform.position, rotatedDirection);
        })
    }

    addEventListeners(){
        document.addEventListener('keydown', key => {
            switch (key.key){
                case 'w':
                case 'a':
                case 's':
                case 'd':
                    if (!this.inputBuffer.includes(key.key)){
                        this.inputBuffer.push(key.key);
                    }
                    break;
            }
        })

        document.addEventListener('keyup', key => {
            switch (key.key){
                case 'w':
                case 'a':
                case 's':
                case 'd':
                    this.inputBuffer = this.inputBuffer.filter(button => button != key.key);
                    break;
            }
        })
    }
}