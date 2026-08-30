import { CanvasSize } from "../utils/types";
import { Vec2 } from "./index"

export type LineSegment2 = {
    startPoint: Vec2,
    endPoint: Vec2
}

export const LineSegment2 = {
    empty(): LineSegment2 {
        return {
            startPoint: {x: 0, y: 0},
            endPoint: {x: 0, y: 0}
        }
    },

    getCanvasSegment(l: LineSegment2, canvasSize: CanvasSize): LineSegment2 {
        // v = v1 + t(v2 - v1) for 0<= t <=1
        
        let [leftPoint, rightPoint]: [Vec2, Vec2] = [l.startPoint, l.endPoint].sort((a, b) => a.x - b.x) as [Vec2, Vec2];

        if (rightPoint.x < 0 || leftPoint.x > canvasSize.width){
            return this.empty();
        }

        let tMinRange = Math.max(0, (0 - leftPoint.x)/(rightPoint.x - leftPoint.x))
        let tMaxRange = Math.min(1, (canvasSize.width - leftPoint.x)/(rightPoint.x - leftPoint.x))

        if (tMinRange > tMaxRange){
            return this.empty();
        }
        
        const direction = Vec2.subtract(rightPoint, leftPoint)
        const start = Vec2.add(leftPoint, Vec2.scale(direction, tMinRange))
        const end = Vec2.add(leftPoint, Vec2.scale(direction, tMaxRange))

        return {
            startPoint: start,
            endPoint: end
        };
    }
}