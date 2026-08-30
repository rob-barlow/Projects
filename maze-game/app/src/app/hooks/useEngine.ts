import main from "@/game-engine/script";
import { RefObject, useEffect, useState } from "react"

const useEngine = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        main()
    }, [])
}


export default useEngine