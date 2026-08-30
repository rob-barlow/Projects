'use client'

import { Vec2, Vec3 } from "../maths/index";
import { Camera } from "../scene/Camera";
import { Scene } from "../scene/Scene";
import { CanvasSize } from "../utils/types";
import { Projection } from "./Projection";
import { ScreenBuffer } from "./ScreenBuffer";

export class CanvasRenderer {
    screenBuffer: ScreenBuffer

    ctx: CanvasRenderingContext2D;
    size: CanvasSize;

    constructor(){
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        this.size = {
            width: canvas.width,
            height: canvas.height
        };

        this.screenBuffer = new ScreenBuffer(this.size.width, this.size.height, 128)
    }

    public render(scene: Scene, camera: Camera, fps: number | undefined = undefined){
        this.screenBuffer.resetBuffer();

        const gameObjects = scene.sceneObjects;

        gameObjects.forEach(gameObject => {
            const triangles: ([Vec3, Vec3, Vec3] | null)[] = 
                Projection.projectTriangles(gameObject.triangles, gameObject.transform, camera.transform, this.size)

            triangles.forEach(triangle => {
                if (triangle != null) {

                let colour: [number, number, number] = [0,0,255]
                // if (gameObject.transform.position.y == 0){
                //     colour = [255, 0, 0]
                // }

                this.drawTriangle(triangle[0], triangle[1], triangle[2], colour)

            }})    
        });

        this.drawBuffer();

        if (fps) this.ctx.fillText(fps.toString(), 5, 10)
    }

    private drawTriangle(p1: Vec3, p2: Vec3, p3: Vec3, colour: [number, number, number] = [0, 0, 255]){
        let c1 = Vec3.toVec2(p1);
        let c2 = Vec3.toVec2(p2);
        let c3 = Vec3.toVec2(p3);

        let minX = Math.trunc(Math.min(c1.x, c2.x, c3.x));
        minX = Math.max(minX, 0)

        let maxX = Math.trunc(Math.max(c1.x, c2.x, c3.x));
        maxX = Math.min(maxX, this.size.width - 1)

        let minY = Math.trunc(Math.min(c1.y, c2.y, c3.y));
        minY = Math.max(minY, 0)

        let maxY = Math.trunc(Math.max(c1.y, c2.y, c3.y));
        maxY = Math.min(maxY, this.size.height - 1)

        let v0 = c1
        let v1 = Vec2.subtract(c2, c1);
        let v2 = Vec2.subtract(c3, c1);

        let detV0V1 = Vec2.cross(v0, v1)
        let detV0V2 = Vec2.cross(v0, v2)
        let detV1V2 = Vec2.cross(v1, v2)

        for (let xPixel = minX; xPixel <= maxX; xPixel++){
            for (let yPixel = minY; yPixel <= maxY; yPixel++){
                let v = {x: xPixel, y: yPixel}

                let a = (Vec2.cross(v, v2) - detV0V2) / detV1V2
                let b = (detV0V1 - Vec2.cross(v, v1)) / detV1V2
                
                if (a > 0 && b > 0 && (a + b) < 1) {

                    const depth = ((1 - a - b) * p1.z) + (a * p2.z) + (b * p3.z)
                    
                    //let colour: [number, number, number] = [0,0,255]
                    
                    // if (a < 0.01 || b < 0.01){
                    //     colour[0] = 255
                    // }
                    this.screenBuffer.updatePixelColour(yPixel, xPixel, depth, colour)
                }
            }
        }
    }

    private async drawBuffer(): Promise<void> {
        const imageDataArray: ImageDataArray = new Uint8ClampedArray(this.screenBuffer.screenBuffer)
        const imageData: ImageData = new ImageData(imageDataArray, this.size.width, this.size.height)
        this.ctx.putImageData(imageData, 0, 0)
    }
}