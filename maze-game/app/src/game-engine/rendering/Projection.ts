import { LineSegment3, Matrix3, Matrix4, Transform, Vec2, Vec3, Vec4 } from "../maths/index";
import { CanvasSize } from "../utils/types";

export const Projection = {
    projectTriangles(triangles: [Vec3, Vec3, Vec3][], transform: Transform, cameraTransform: Transform, canvasSize: CanvasSize): 
    ([Vec3, Vec3, Vec3] | null)[] {
        const {pwvMatrix, viewportMatrix} = this.getMatrices(transform, cameraTransform, canvasSize)

        return triangles.map(triangle => this.projectTriangle(triangle, pwvMatrix, viewportMatrix))
    },

    projectTriangle(triangle: [Vec3, Vec3, Vec3], pwvMatrix: Matrix4, viewportMatrix: Matrix4): [Vec3, Vec3, Vec3] | null {
        const vec4Points = triangle.map(p => Vec3.toVec4(p, 1))
        const worldViewPoints = vec4Points.map(p => Matrix4.apply(pwvMatrix, p))

        const ndcPoints = worldViewPoints.map(p => {
            return Vec4.scale(p, 1/p.w)
        })

        // clip points
        const xOrderedPoints = ndcPoints.sort((a, b) => a.x - b.x)
        if (xOrderedPoints[0].x > 1){
            return null
        }
        
        if (xOrderedPoints[0].x > 1){
            return null
        }

        if (xOrderedPoints[0].x > 1){
            return null
        }

        // clip
        if (ndcPoints.filter(p => (Math.abs(p.x) > 1 || Math.abs(p.y) > 1 || Math.abs(p.z) > 1) ).length > 0){

            return null;
        }

        const canvasPoints = ndcPoints.map(p => Vec4.toVec3(Matrix4.apply(viewportMatrix, p)))

        return canvasPoints as [Vec3, Vec3, Vec3];
    },

    // projectLine(line: LineSegment3, transform: Transform, cameraTransform: Transform, canvasSize: CanvasSize): LineSegment3 | null {
    //     const worldMatrix: Matrix4 = Transform.getWorldMatrix(transform);
    //     const cameraMatrix = Transform.getInverseWorldMatrix(cameraTransform);
    //     const worldViewMatrix = Matrix4.multiply(cameraMatrix, worldMatrix)

    //     // object view
    //     const v1: Vec4 = Vec3.toVec4(line.startPoint);
    //     const v2: Vec4 = Vec3.toVec4(line.endPoint);
        
    //     // // to world
    //     // const wp1: Vec4 = this.toWorldView(v1, transform);
    //     // const wp2: Vec4 = this.toWorldView(v2, transform);

    //     // // to camera
    //     // let c1: Vec4 = this.toCameraView(wp1, cameraTransform);
    //     // let c2: Vec4 = this.toCameraView(wp2, cameraTransform);

    //     let c1: Vec4 = Matrix4.apply(worldViewMatrix, v1)
    //     let c2: Vec4 = Matrix4.apply(worldViewMatrix, v2)

    //     let lineSeg: LineSegment3 | null = {
    //         startPoint: Vec4.toVec3(c1),
    //         endPoint: Vec4.toVec3(c2)
    //     }
        
    //     lineSeg = LineSegment3.getViewableSegment(lineSeg)
        
    //     if (!lineSeg) return null

    //     c1 = Vec3.toVec4(lineSeg.startPoint)
    //     c2 = Vec3.toVec4(lineSeg.endPoint)

    //     // to clipped coords
    //     const cp1: Vec4 = this.applyProjectionMatrix(c1, canvasSize);
    //     const cp2: Vec4 = this.applyProjectionMatrix(c2, canvasSize);

    //     // to ndc space
    //     const ndc1: Vec4 = Vec4.scale(cp1, 1/cp1.w)
    //     const ndc2: Vec4 = Vec4.scale(cp2, 1/cp2.w)

    //     if ((Math.abs(ndc1.x) > 1 && Math.abs(ndc2.x) > 1) || (Math.abs(ndc1.y) > 1 && Math.abs(ndc2.y) > 1)){
    //         return null
    //     }

    //     //to canvas
    //     const canvasPoint1: Vec2 = Vec2.toCanvas({x: ndc1.x, y: ndc1.y}, canvasSize)
    //     const canvasPoint2: Vec2 = Vec2.toCanvas({x: ndc2.x, y: ndc2.y}, canvasSize)

    //     return {startPoint: {x: canvasPoint1.x, y: canvasPoint1.y, z: ndc1.z}, endPoint: {x: canvasPoint2.x, y: canvasPoint2.y, z: ndc2.z}}
    // },

    getMatrices(transform: Transform, cameraTransform: Transform, canvasSize: CanvasSize):  
    {pwvMatrix: Matrix4, viewportMatrix: Matrix4} {
        const worldMatrix: Matrix4 = Transform.getWorldMatrix(transform);
        const cameraMatrix = Transform.getInverseWorldMatrix(cameraTransform);
        const worldViewMatrix = Matrix4.multiply(cameraMatrix, worldMatrix)
        const projectionMatrix = Transform.getProjectionMatrix(canvasSize)
        const pwvMatrix = Matrix4.multiply(projectionMatrix, worldViewMatrix)
        
        const viewportMatrix = Transform.getViewportMatrix(canvasSize)

        return {pwvMatrix, viewportMatrix}
    }
}