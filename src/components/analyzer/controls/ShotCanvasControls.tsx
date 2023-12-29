import styles from "./shotcanvascontrols.module.css";
import {IconPlayerPauseFilled, IconPlayerPlayFilled} from "@tabler/icons-react";
import {useReplayStore} from "../../../stores/analyzerstore.ts";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {formatMillisToMinSec, formatMillisToMinSecMillis} from "../../../utills/jsutils.ts";
import {useCurrentShot} from "../../../hooks/useCurrentShot.ts";

const ShotCanvasControls = () => {
    const [replayPercentage, isReplayPlaying, setReplayPlaying, setReplayPercentage] = useReplayStore((state) =>
        [state.replayPercentage, state.isReplayPlaying, state.setReplayPlaying, state.setReplayPercentage]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [shot, _trace] = useCurrentShot();
    const maxTimeFormatted = useMemo(() => shot ? formatMillisToMinSec(shot.duration_millis) : null, [shot]);
    const currentTimeFormatted = useMemo(() =>
        formatMillisToMinSecMillis(shot ? (shot.duration_millis * replayPercentage / 100) : 0), [replayPercentage, shot]);

    if (!shot) return null;

    return (
        <footer className={styles.wrapper}>
            <div className={styles.media_control}>
                <div className={styles.media_control__play}>
                    {!isReplayPlaying ? (
                        <IconPlayerPlayFilled className={styles.media_control__play_button} onClick={() => setReplayPlaying(true)} />
                    ) : (
                        <IconPlayerPauseFilled className={styles.media_control__play_button} onClick={() => setReplayPlaying(false)} />
                    )}
                    <p className={styles.playback_time}>{currentTimeFormatted[0]}<span className={styles.playback_time__millis}>:{currentTimeFormatted[1]}</span></p>
                </div>
                <ProgressBar
                    percentage={replayPercentage}
                    setPercentage={setReplayPercentage}
                    setReplayPlaying={setReplayPlaying}
                />
                <p className={styles.max_time}>{maxTimeFormatted}</p>
            </div>
            <div className={styles.separator} />
            <div className={styles.media_utils}></div>
        </footer>
    )
}

const ProgressBar = (props: {
    percentage: number;
    setPercentage: (percentage: number) => void;
    setReplayPlaying: (isPlaying: boolean) => void;
}) => {
    const [isDragging, setDragging] = useState(false);
    const barRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    const onMouseDown = () => {
        props.setReplayPlaying(false);
        setDragging(true);
    }

    // Update the handle position when the percentage changes
    useEffect(() => {
        if (barRef.current && handleRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const handleRect = handleRef.current.getBoundingClientRect();

            handleRef.current.style.left = barRect.width * props.percentage / 100 - handleRect.width / 2 + "px";
        }
    }, [props.percentage]);

    const onMouseMove = useCallback((event: MouseEvent) => {
        if (isDragging && handleRef.current && barRef.current) {
            const barRect = barRef.current.getBoundingClientRect();
            const handleRect = handleRef.current.getBoundingClientRect();

            const handleLeft = event.clientX - barRect.left;
            const handleRight = barRect.right - event.clientX;

            // Account for the width of the handle
            if (handleLeft >= 0 && handleRight >= 0) {
                handleRef.current.style.left = handleLeft - handleRect.width / 2 + "px";
            }

            if (handleLeft < 0) {
                handleRef.current.style.left = -handleRect.width / 2 + "px";
            }

            if (handleRight < 0) {
                handleRef.current.style.left = barRect.width - handleRect.width / 2 + "px";
            }

            console.log(Math.max(0, Math.min(100, handleLeft / barRect.width * 100)))

            props.setPercentage(Math.max(0, Math.min(100, handleLeft / barRect.width * 100)));
        }
    }, [isDragging, props]);

    const onMouseUp = () => {
        setDragging(false);
    }

    useEffect(() => {
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMouseMove)

        return () => {
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mousemove", onMouseMove);
        }
    }, [onMouseMove]);

    return (
        <div className={styles.progress_wrapper}>
            <div className={styles.progress_bar} ref={barRef}></div>
            <div className={styles.progress_handle} ref={handleRef} onMouseDown={onMouseDown}></div>
        </div>
    )
}

export default ShotCanvasControls;
