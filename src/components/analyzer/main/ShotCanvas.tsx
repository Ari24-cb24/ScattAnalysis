import {useEffect, useMemo, useRef, useState} from "react";
import {
    drawFrame,
    getMaxFrames,
    redrawAllFrames,
    resetCanvas,
    TIME_PER_FRAME
} from "../../../utills/shotcanvas/methods.ts";
import {useAnalyzerStore, useReplayStore} from "../../../stores/analyzerstore.ts";
import styles from "./shotcanvas.module.css"
import {useCurrentShot} from "../../../hooks/useCurrentShot.ts";

const ShotCanvas = () => {
    const [replayPercentage, isReplayPlaying, setReplayPercentage] = useReplayStore((state) => [
        state.replayPercentage, state.isReplayPlaying, state.setReplayPercentage]);
    const [currentShotIdx] = useAnalyzerStore((state) =>
        [state.currentShotIdx]);
    const [currentShot, trace] = useCurrentShot();

    const interval = useRef<NodeJS.Timeout | null>(null);
    const ctx = useRef<CanvasRenderingContext2D | null>(null);
    const ref = useRef<HTMLCanvasElement>(null);

    const oldPercentageRef = useRef<number>(replayPercentage);
    const [frameIdx, setFrameIdx] = useState(0);
    const MAX_FRAMES = useMemo(() => trace ? getMaxFrames(trace) : -1, [trace]);

    // Reset the canvas whenever the current shot changes
    useEffect(() => {
        if (!ref.current || currentShotIdx === -1) return;
        setFrameIdx(0);
        ctx.current = ref.current.getContext("2d");

        if (ctx.current === null) return;
        resetCanvas(ctx.current, ref.current.width, ref.current.height);
    }, [currentShotIdx]);

    // Draw the current frame when autoplaying is active
    useEffect(() => {
        if (ref.current === null || ctx.current === null || currentShot === null || !isReplayPlaying) return;
        drawFrame(ctx.current, currentShot, trace, ref.current.width, ref.current.height, frameIdx);
    }, [currentShot, trace, frameIdx, isReplayPlaying]);

    // Draw the current frame when the user is dragging the slider
    useEffect(() => {
        if (ref.current === null || ctx.current === null || currentShot === null) return;
        const isGoingBackwards = oldPercentageRef.current > replayPercentage;
        oldPercentageRef.current = replayPercentage;

        const frameIdx = Math.floor(replayPercentage / 100 * MAX_FRAMES);
        setFrameIdx(frameIdx);
        redrawAllFrames(ctx.current, currentShot, trace, ref.current.width, ref.current.height, frameIdx, isGoingBackwards);
    }, [replayPercentage, currentShot, MAX_FRAMES, trace]);

    // Autoplay the replay
    useEffect(() => {
        if (interval.current !== null) clearInterval(interval.current);
        if (currentShot === null || !isReplayPlaying) return;

        interval.current = setInterval(() => {
            if (frameIdx >= MAX_FRAMES) {
                clearInterval(interval.current!);
                return;
            }

            // Recalculating the percentage
            const milliseconds = (frameIdx + 1) * TIME_PER_FRAME;
            const percentage = milliseconds / currentShot.duration_millis * 100;
            setReplayPercentage(percentage);

            setFrameIdx((prev) => prev + 1);
        }, TIME_PER_FRAME);
    }, [MAX_FRAMES, currentShot, frameIdx, isReplayPlaying, setReplayPercentage]);

    return (
        <div className={styles.wrapper}>
            <img className={styles.image} src="src/assets/air_rifle_target.png" alt="target" />
            <canvas className={styles.canvas} width="2000" height="2000" ref={ref}></canvas>
        </div>
    )
}

export default ShotCanvas;
