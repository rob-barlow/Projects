import { Maze } from "./maze.ts";
import { type Position } from "./Position.ts";
import { Converter } from "./renderer.ts";


function generateMaze(width: number = 10, height: number = 10): {seed: number, maze: number[][]}{
    const startPoint: Position = { x: 0, y: height/2 };
    const endPoint: Position = { x:width - 1, y: height/2 };
    
    const maze = new Maze(width,height, startPoint, endPoint);
    
    let mazeNotGenerated = true
    
    while (mazeNotGenerated) {
        mazeNotGenerated = maze.iterate();
    }
    
    const binaryInfo = Converter.toBinaryArray(maze);
    
    return {seed: maze.seed, maze: binaryInfo}
}

const {seed, maze} = generateMaze(10,10)
// console.log(maze)


const str = maze.map(row => {
    return row.map(value => {
        if (value == 0) return " "
        if (value == 2) return "A"
        if (value == 3) return "Z"
        return "#"
    }).join(" ")
}).join("\n")

console.log(str)
