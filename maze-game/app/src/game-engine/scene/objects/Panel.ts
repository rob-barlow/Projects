import { Transform, Vec3 } from "../../maths";
import { GameObject } from "./GameObject";

export class Panel implements GameObject {
    transform: Transform

    triangles: [Vec3, Vec3, Vec3][] = [
        [{x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: 1},
        {x: 1, y: 0, z: 1}],
        [{x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 1},
        {x: 1, y: 0, z: 0},]
    ];

    constructor(transform: Transform){
        this.transform = transform;
    }
}