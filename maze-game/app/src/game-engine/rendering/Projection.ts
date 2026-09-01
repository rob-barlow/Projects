import { LineSegment3, Matrix3, Matrix4, Transform, Vec2, Vec3, Vec4 } from "../maths/index";
import { CanvasSize } from "../utils/types";

export const Projection = {
    projectTriangles(triangles: [Vec3, Vec3, Vec3][], transform: Transform, cameraTransform: Transform, canvasSize: CanvasSize): 
    ([Vec3, Vec3, Vec3])[] {
        const {pwvMatrix, viewportMatrix} = this.getMatrices(transform, cameraTransform, canvasSize)

        const projectedTriangles: [Vec3, Vec3, Vec3][] = []

        triangles.forEach(triangle => {
            const currentProjectedTriangles = this.projectTriangle(triangle, pwvMatrix, viewportMatrix) 
            projectedTriangles.push(...currentProjectedTriangles)
        });

        return projectedTriangles;
    },

    projectTriangle(triangle: [Vec3, Vec3, Vec3], pwvMatrix: Matrix4, viewportMatrix: Matrix4): [Vec3, Vec3, Vec3][] {
        const vec4Points = triangle.map(p => Vec3.toVec4(p, 1))
        const worldViewPoints = vec4Points.map(p => Matrix4.apply(pwvMatrix, p)) as [Vec4, Vec4, Vec4]

        const trianglesAfterClipping: [Vec4, Vec4, Vec4][] = this.clipTriangle(worldViewPoints)

        const canvasTriangles: [Vec3, Vec3, Vec3][] = []

        trianglesAfterClipping.forEach(triangle => {
            const ndcPoints = triangle.map(p => {
                return Vec4.scale(p, 1/p.w)
            })

            const canvasPoints = ndcPoints.map(p => Vec4.toVec3(Matrix4.apply(viewportMatrix, p)))

            canvasTriangles.push(canvasPoints as [Vec3, Vec3, Vec3])
        })


        return canvasTriangles;
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
    },

    clipTriangle(triangle: [Vec4, Vec4, Vec4]): [Vec4, Vec4, Vec4][]{
        const returnTriangles: [Vec4, Vec4, Vec4][] = []

        // first clip x = w
        let polygonVertices: Vec4[] = [...triangle]
        const planes = [
            "x = w",
            "x = -w",
            "y = w",
            "y = -w",
            "z = w",
            "z = -w"]

        for (let planeIndex = 0; planeIndex < planes.length; planeIndex++){
            const plane = planes[planeIndex]
            const lastVertices = [...polygonVertices]
            polygonVertices = []

            for (let i = 0; i < lastVertices.length; i++){
                const v1 = triangle[i]
                const v2 = triangle[(i + 1) % lastVertices.length]

                const newEdge = this.clipEdgeOnPlane(v1, v2, plane)
                
                if (newEdge == null){
                    continue
                }

                if (!polygonVertices.includes(newEdge[0])){
                    polygonVertices.push(newEdge[0])
                }

                polygonVertices.push(newEdge[1])
            }

            if (polygonVertices.length == 0){
                break;
            }
        }

        if (polygonVertices.length < 3){
            return []
        }

        const startPoint = polygonVertices[0]

        for (let i = 0; i < polygonVertices.length - 2; i++){
            const newTriangle = [
                startPoint,
                polygonVertices[(i + 1) % polygonVertices.length],
                polygonVertices[(i + 2) % polygonVertices.length]] as [Vec4, Vec4, Vec4]

            returnTriangles.push(newTriangle)
        }

        return returnTriangles;
    },

    // interpolate
    // p = t * p1 + (1 - t) * p2 for 0 <= t <= 1
    // where is p.x = p.w

    // p.x = t * p1.x + (1 - t) * p2.x = t * p1.w + (1 - t) * p2.w
    // t * (p1.x - p2.x) + p2.x = wMultiplier * (t * (p1.w - p2.w) + p2.w)
    // t * (p1.x - p2.x) + p2.x = wMultiplier * t * (p1.w - p2.w) + wMultiplier * p2.w
    // t * (p1.x - p2.x) = t * wMultiplier * (p1.w - p2.w) + (wMultiplier * p2.w - p2.x)
    // t * (p1.x + p2.w - p2.x - p1.w) = p2.w - p2.x
    // t = (p2.w - p2.x)/(p1.x + p2.w - p2.x - p1.w)
    clipEdgeOnPlane(a: Vec4, b: Vec4, plane: string): [Vec4, Vec4] | null {
        try {
            let t = 0
            let wMultiplier = 1
            let axisA = 0
            let axisB = 0
            
            switch (plane){
                case "x = w":
                    axisA = a.x
                    axisB = b.x
                case "x = -w":
                    axisA = a.x
                    axisB = b.x
                    wMultiplier = -1
                case "y = w":
                    axisA = a.y
                    axisB = b.y
                case "y = -w":
                    axisA = a.y
                    axisB = b.y
                    wMultiplier = -1
                case "z = w":
                    axisA = a.z
                    axisB = b.z
                    break;
                case "z = -w":
                    axisA = a.z
                    axisB = b.z
                    wMultiplier = -1
                    break;
            }

            const aInside = wMultiplier == 1 ? axisA < a.w :  axisA > -a.w
            const bInside = wMultiplier == 1 ? axisB < b.w :  axisB > -b.w

            // maintain the order
            if (aInside && bInside){
                return [a, b]
            }
            else {
                t = ((wMultiplier * b.w) - axisB)/(axisA + (wMultiplier * b.w) - axisB - (wMultiplier * a.w))
                if (aInside){
                    const newPoint = Vec4.add(Vec4.scale(a, t), Vec4.scale(b, 1 - t))
                    if (!Vec4.isInViewport(newPoint)){
                        console.log("failing")
                    }
                    return [a, newPoint]
                }
                if (bInside){
                    const newPoint = Vec4.add(Vec4.scale(a, t), Vec4.scale(b, 1 - t))
                    
                    if (!Vec4.isInViewport(newPoint)){
                        console.log("failing")
                    }
                    
                    return [newPoint, b]
                }
            }
        }
        catch (error) {
            //console.log("couldnt create new edge\n" + error)
        }
        return null
    }
}