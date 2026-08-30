import { Transform, Vec3 } from "../../maths/index";

export interface GameObject {
    transform: Transform;

    triangles: [Vec3, Vec3, Vec3][]
}