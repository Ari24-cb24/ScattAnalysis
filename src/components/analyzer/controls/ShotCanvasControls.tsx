import styles from "./shotcanvascontrols.module.css";
import {
    IconCameraFilled,
    IconDotsVertical, IconFileExport,
    IconPlayerPauseFilled,
    IconPlayerPlayFilled,
    IconSettingsFilled
} from "@tabler/icons-react";
import {useReplayStore} from "../../../stores/analyzerstore.ts";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {formatMillisToMinSec, formatMillisToMinSecMillis} from "../../../utills/jsutils.ts";
import {useCurrentShot} from "../../../hooks/useCurrentShot.ts";
import DropUpChoice from "../../common/dropupchoice/DropUpChoice.tsx";
import DropUpActions from "../../common/dropupactions/DropUpActions.tsx";

const REPLAY_SPEEDS = {
    "0.25x": 0.25,
    "0.5x": 0.5,
    "1x": 1,
    "2x": 2,
    "4x": 4,
}
const REPLAY_SPEEDS_KEYS = Object.keys(REPLAY_SPEEDS);
const REPLAY_SPEEDS_VALUES = Object.values(REPLAY_SPEEDS);

const inlineFlexStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
}

const ShotCanvasControls = () => {
    const [replayPercentage, isReplayPlaying, replaySpeed, setReplayPlaying, setReplayPercentage, setReplaySpeed] = useReplayStore((state) =>
        [state.replayPercentage, state.isReplayPlaying, state.replaySpeed, state.setReplayPlaying, state.setReplayPercentage, state.setReplaySpeed]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [shot, _trace] = useCurrentShot();
    const maxTimeFormatted = useMemo(() => shot ? formatMillisToMinSec(shot.duration_millis) : null, [shot]);
    const currentTimeFormatted = useMemo(() => {
        if (!shot) return ["00", "00"];
        return formatMillisToMinSecMillis(shot.duration_millis * replayPercentage / 100);
    }, [replayPercentage, shot]);

    const toggleReplayPlaying = useCallback((value: boolean) => {
        if (value && Math.ceil(replayPercentage) === 100) {
            setReplayPercentage(0);
        }

        setReplayPlaying(value);
    }, [replayPercentage, setReplayPercentage, setReplayPlaying]);

    if (!shot) return null;

    return (
        <footer className={styles.wrapper}>
            <div className={styles.media_control}>
                <div className={styles.media_control__play}>
                    {!isReplayPlaying ? (
                        <IconPlayerPlayFilled className={styles.media_control__play_button} onClick={() => toggleReplayPlaying(true)} />
                    ) : (
                        <IconPlayerPauseFilled className={styles.media_control__play_button} onClick={() => toggleReplayPlaying(false)} />
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
            <div className={styles.media_utils}>
                <DropUpChoice
                    options={REPLAY_SPEEDS_KEYS}
                    selectedOption={REPLAY_SPEEDS_KEYS[REPLAY_SPEEDS_VALUES.indexOf(replaySpeed)]}
                    setSelectedOption={(value: string) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        setReplaySpeed(REPLAY_SPEEDS[value]);
                    }} />
                <IconSettingsFilled />
                <DropUpActions
                    options={{
                        "Take Screenshot": <div style={inlineFlexStyle}><IconCameraFilled /> <p>Take Screenshot</p></div>,
                        "Export...": <div style={inlineFlexStyle}><IconFileExport /> <p>Export...</p></div>,
                    }}
                    setSelectedOption={(value: string) => {
                        console.log(value);
                    }}
                >
                    <IconDotsVertical />
                </DropUpActions>
            </div>
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
