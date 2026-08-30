import { Updatable } from "../../animation/Updatable";
import { Camera } from "../../scene/Camera";

export interface CameraControllerInterface extends Updatable {
    cameras: Camera[];
    inputBuffer: String[];

    addControls(camera: Camera): void;
    update(dt: number): void;
    addEventListeners(): void;
}