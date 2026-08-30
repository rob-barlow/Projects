export class ScreenBuffer{
    rowLength: number;
    columnLength: number;

    backgroundColour: number

    screenBuffer: number[] = [];

    depthBuffer: number[] = [];

    constructor(canvasWidth: number, canvasHeight: number, fillValue: number){
        this.rowLength = canvasWidth
        this.columnLength = canvasHeight
        this.backgroundColour = fillValue;
        this.resetBuffer()
    }

    resetBuffer(){
        this.screenBuffer = new Array(this.rowLength * this.columnLength * 4).fill(this.backgroundColour);
        this.depthBuffer = new Array(this.rowLength * this.columnLength).fill(1);
        
        for (let i = 0; i < this.screenBuffer.length / 4; i++){
            //this.screenBuffer[(i * 4) + 3] = 1
            this.screenBuffer[(i * 4) + 3] = 255
        }
    }

    public updatePixelColour(row: number, column: number, depth: number, colour: [number, number, number]){
        try {
            const pixelIndex = ((row * this.rowLength) + column)
            if (depth < this.depthBuffer[pixelIndex]){
                this.depthBuffer[pixelIndex] = depth
                for (let i = 0; i < 3; i++){
                    this.screenBuffer[(pixelIndex * 4) + i] = colour[i]
                }
                this.screenBuffer[(pixelIndex * 4) + 3] = 255
            }
        }
        catch {
            console.error(`Couldnt set row ${row} and column ${column} with depth ${depth} in frame buffer`)
        }
    }

    private setPixelColour(row: number, column: number, colour: [number, number, number]){
        try {
            const startIndex = ((row * this.rowLength) + column) * 4
            for (let i = 0; i < 3; i++){
                this.screenBuffer[startIndex + i] = colour[i]
            }
            this.screenBuffer[startIndex + 3] = 255

        }
        catch {
            console.error(`Couldnt set row ${row} and column ${column} in frame buffer`)
        }
    }
}