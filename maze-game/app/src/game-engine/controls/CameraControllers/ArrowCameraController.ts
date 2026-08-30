import { CameraRotationSpeed } from "@/game-engine/utils/constants";
import { Line3 } from "../../maths/Line3";
import { Matrix3 } from "../../maths/Matrix3";
import { Vec3 } from "../../maths/Vec3";
import { Camera } from "../../scene/Camera";
import { CameraControllerInterface } from "./CameraControllerInterface";

export class ArrowCameraController implements CameraControllerInterface {
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
            this.inputBuffer.forEach(key => {
                let axis: string = "";
                let angle: number = dt;

                switch (key){
                    case "ArrowUp":
                        axis = "x";
                        angle *= -1;
                        break;
                    case "ArrowDown":
                        axis = "x";
                        break;
                    case "ArrowLeft":
                        axis = "y";
                        angle *= -1;
                        break;
                    case "ArrowRight":
                        axis = "y";
                        break;
                }

                // rotate around the local x
                angle *= CameraRotationSpeed;

                if (axis == "y"){
                    const rotationMatrix: Matrix3 = Matrix3.getRotationMatrix(axis, angle);
                    camera.transform.orientation= Matrix3.multiply(rotationMatrix, camera.transform.orientation);
                }
                else{
                    let xLocalVector: Vec3 = Matrix3.getColumn(camera.transform.orientation, 0);
                    xLocalVector = Vec3.normalise(xLocalVector);

                    const xLocalAxis: Line3 = {
                        direction: xLocalVector,
                        pointOnLine: Vec3.empty()
                    } 

                    const yLocalVector: Vec3 = Matrix3.getColumn(camera.transform.orientation, 1);
                    const zLocalVector: Vec3 = Matrix3.getColumn(camera.transform.orientation, 2);

                    let yNewVector = Vec3.rotate(xLocalAxis, yLocalVector, angle)
                    yNewVector = Vec3.normalise(yNewVector);

                    let zNewVector = Vec3.rotate(xLocalAxis, zLocalVector, angle)
                    zNewVector = Vec3.normalise(zNewVector);

                    if (yNewVector.y < 0) {
                        yNewVector.y = 0;
                        zNewVector = zLocalVector
                    }

                    camera.transform.orientation = [
                        [xLocalVector.x, yNewVector.x, zNewVector.x],
                        [xLocalVector.y, yNewVector.y, zNewVector.y],
                        [xLocalVector.z, yNewVector.z, zNewVector.z]
                ]
                }
            })
        })
    }

    addEventListeners(){
        document.addEventListener('keydown', key => {
            switch (key.key){
                case 'ArrowUp':
                case 'ArrowLeft':
                case 'ArrowDown':
                case 'ArrowRight':
                    if (!this.inputBuffer.includes(key.key)){
                        this.inputBuffer.push(key.key);
                    }
                    break;
            }
        })

        document.addEventListener('keyup', key => {
            switch (key.key){
                case 'ArrowUp':
                case 'ArrowLeft':
                case 'ArrowDown':
                case 'ArrowRight':
                    this.inputBuffer = this.inputBuffer.filter(button => button != key.key);
                    break;
            }
        })
    }
}