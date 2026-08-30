import { farPlaneZ, nearPlaneZ } from "../utils/constants";
import { Vec3 } from "./index"

export type LineSegment3 = {
    startPoint: Vec3,
    endPoint: Vec3
}

export const LineSegment3 = {
    empty(): LineSegment3 {
        return {
            startPoint: {x: 0, y: 0, z: 0},
            endPoint: {x: 0, y: 0, z: 0}
        }
    },

    getViewableSegment(l: LineSegment3): LineSegment3 | null {
        // v = v1 + t(v2 - v1) for 0<= t <=1
        let [closePoint, farPoint]: [Vec3, Vec3] = [l.startPoint, l.endPoint].sort((a, b) => a.z - b.z) as [Vec3, Vec3];

        if (farPoint.z < nearPlaneZ || closePoint.z > farPlaneZ){
            return null;
        }

        let tMinRange = Math.max(0, (nearPlaneZ - closePoint.z)/(farPoint.z - closePoint.z))
        let tMaxRange = Math.min(1, (farPlaneZ - closePoint.z)/(farPoint.z - closePoint.z))

        if (tMinRange > tMaxRange){
            return null;
        }
        
        const direction = Vec3.subtract(farPoint, closePoint)
        const start = Vec3.add(closePoint, Vec3.scale(direction, tMinRange))
        const end = Vec3.add(closePoint, Vec3.scale(direction, tMaxRange))

        return {
            startPoint: start,
            endPoint: end
        };
    }
}