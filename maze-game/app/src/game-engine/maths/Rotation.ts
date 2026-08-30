import { FPS } from "../utils/constants"
import { Line3 } from "./index"

export type Rotation = {
    line: Line3,
    rotationsPerSec: number
}

export const Rotation = {
    getAngle(rotation: Rotation, dt: number): number {
        return 2 * Math.PI * (dt) * (rotation.rotationsPerSec)
    }
}