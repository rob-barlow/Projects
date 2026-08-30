import { RefObject, useRef } from "react"
import useEngine from "../hooks/useEngine"

export default function MazeCanvas() {
    const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null)
    useEngine(canvasRef)

    return (
        <>
            <canvas ref={canvasRef} id="canvas" />
        </>
    )
}