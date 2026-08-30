import { Transform, Vec3 } from "../maths/index";
import { GameObject } from "./objects/GameObject";

export class Camera implements GameObject {
    transform: Transform;

    triangles: [Vec3, Vec3, Vec3][] = []

    constructor(transform: Transform){
        this.transform = transform;
    }
}