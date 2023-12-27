import styles from "./shotcanvascontrols.module.css";
import {IconPlayerPauseFilled, IconPlayerPlayFilled} from "@tabler/icons-react";
import {useAnalyzerStore} from "../../../stores/analyzerstore.ts";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {formatMillisToMinSec, formatMillisToMinSecMillis} from "../../../utills/jsutils.ts";

const ShotCanvasControls = () => {
    const [currentShot,
        currentShotIdx,
        shotExtras,
        percentage,
        isReplayPlaying,
        setPercentage,
        setReplayPlaying
    ] = useAnalyzerStore((state) => [state.currentShot,
        state.currentShotIdx,
        state.shotExtras,
        state.replayPercentage,
        state.isReplayPlaying,
        state.setReplayPercentage,
        state.setReplayPlaying
    ]);
    const shotExtra = useMemo(() => shotExtras ? shotExtras[currentShotIdx] : null, [currentShotIdx, shotExtras]);
    const maxTimeFormatted = useMemo(() => shotExtra ? formatMillisToMinSec(shotExtra.durationMillis) : null, [shotExtra]);

    const [currentTimeFormatted, setCurrentTimeFormatted] = useState(formatMillisToMinSecMillis(0));

    useEffect(() => {
        setCurrentTimeFormatted(formatMillisToMinSecMillis(shotExtra ? shotExtra.durationMillis * percentage / 100 : 0));
    }, [percentage, shotExtra]);

    useEffect(() => {
        setReplayPlaying(false);
        setPercentage(0);
    }, [currentShotIdx, setPercentage, setReplayPlaying]);

    if (currentShot === null || shotExtra === null) return null;

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
                <ProgressBar percentage={percentage} setPercentage={setPercentage} />
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
}) => {
    const [isDragging, setDragging] = useState(false);
    const [setReplayPlaying] = useAnalyzerStore((state) => [state.setReplayPlaying]);
    const barRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    const onMouseDown = () => {
        setReplayPlaying(false);
        setDragging(true);
    }

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

            if (handleLeft >= 0 && handleRight >= 0) {
                handleRef.current.style.left = handleLeft - handleRect.width / 2 + "px";
            }

            if (handleLeft < 0) {
                handleRef.current.style.left = -handleRect.width / 2 + "px";
            }

            if (handleRight < 0) {
                handleRef.current.style.left = barRect.width - handleRect.width / 2 + "px";
            }

            props.setPercentage(Math.max(0, Math.min(100, handleLeft / barRect.width * 100)));
        }
    }, [isDragging]);

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