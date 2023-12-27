import {useEffect, useMemo, useRef, useState} from "react";
import {
    drawFrame,
    FPS,
    getMaxFrames,
    redrawAllFrames,
    resetCanvas,
    TIME_PER_FRAME
} from "../../../utills/shotcanvas/methods.ts";
import {useAnalyzerStore} from "../../../stores/analyzerstore.ts";
import styles from "./shotcanvas.module.css"

const ShotCanvas = () => {
    const ref = useRef<HTMLCanvasElement>(null);
    const [
        currentShot,
        currentShotIdx,
        shotExtras,
        isReplayPlaying,
        percentage,
        setPercentage,
    ] = useAnalyzerStore((state) => [
        state.currentShot,
        state.currentShotIdx,
        state.shotExtras,
        state.isReplayPlaying,
        state.replayPercentage,
        state.setReplayPercentage,
    ]);
    const [frameIdx, setFrameIdx] = useState(0);
    const MAX_FRAMES = useMemo(() => currentShot ? getMaxFrames(currentShot) : -1, [currentShot]);
    const interval = useRef<NodeJS.Timeout | null>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const oldPercentageRef = useRef<number>(percentage);

    useEffect(() => {
        if (!ref.current || !currentShot) return;
        setFrameIdx(0);
        ctx.current = ref.current.getContext("2d");

        if (ctx.current === null) return;
        resetCanvas(ctx.current, ref.current.width, ref.current.height);
    }, [currentShot]);

    useEffect(() => {
        if (ref.current === null || ctx.current === null || currentShot === null || !isReplayPlaying) return;
        drawFrame(ctx.current, currentShot, ref.current.width, ref.current.height, frameIdx);
    }, [currentShot, frameIdx]);

    useEffect(() => {
        if (ref.current === null || ctx.current === null || currentShot === null) return;
        // convert percentage to frame index
        const isGoingBackwards = oldPercentageRef.current > percentage;
        oldPercentageRef.current = percentage;

        const frameIdx = Math.floor(percentage / 100 * MAX_FRAMES);
        setFrameIdx(frameIdx);
        redrawAllFrames(ctx.current, currentShot, ref.current.width, ref.current.height, frameIdx, isGoingBackwards);
    }, [percentage, currentShot]);

    useEffect(() => {
        if (!isReplayPlaying) {
            if (interval.current !== null) clearInterval(interval.current);
            return;
        }
        if (interval.current !== null) clearInterval(interval.current);

        interval.current = setInterval(() => {
            if (frameIdx >= MAX_FRAMES) {
                clearInterval(interval.current!);
                return;
            }

            const milliseconds = (frameIdx + 1) * TIME_PER_FRAME;
            const percentage = milliseconds / shotExtras[currentShotIdx].durationMillis * 100;
            setPercentage(percentage);

            setFrameIdx((prev) => prev + 1);
        }, TIME_PER_FRAME);
    }, [MAX_FRAMES, currentShot, currentShotIdx, frameIdx, isReplayPlaying, setPercentage, shotExtras]);

    return (
        <div className={styles.wrapper}>
            <img className={styles.image} src="src/assets/air_rifle_target.png" alt="target" />
            <canvas className={styles.canvas} width="2000" height="2000" ref={ref}></canvas>
        </div>
    )
}

export default ShotCanvas;