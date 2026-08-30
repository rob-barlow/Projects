import { Vec3 } from "./Vec3"

export type Vec4 = {
    x: number,
    y: number,
    z: number,
    w: number
}

export const Vec4 = {
    scale(v: Vec4, s: number): Vec4 {
        return {x: v.x * s, y: v.y * s, z: v.z * s, w: v.w * s}
    },

    toVec3(v: Vec4): Vec3 {
        return {x: v.x, y: v.y, z: v.z};
    }
}