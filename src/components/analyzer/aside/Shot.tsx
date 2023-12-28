import styles from "./shot.module.css"
import {IScattShot, ITrace} from "../../../types/analyzer/scatt_document_types.ts";
import {IconBrandSpeedtest, IconClock, IconStarFilled, IconViewfinder} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useAnalyzerStore, useReplayStore} from "../../../stores/analyzerstore.ts";

const Shot = (props: {
    shot: IScattShot,
    shotIdx: number,
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentShotIdx, setCurrentShotIdx] = useAnalyzerStore((state) =>
        [state.currentShotIdx, state.setCurrentShotIdx]);
    const [setTrace, setReplayPercentage, setReplayPlaying] = useReplayStore((state) => [
        state.setTrace, state.setReplayPercentage, state.setReplayPlaying]);

    useEffect(() => {
        if (currentShotIdx === props.shotIdx) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [currentShotIdx, props.shotIdx]);

    const selectShot = () => {
        setCurrentShotIdx(props.shotIdx);

        let trace = localStorage.getItem("shot-trace-" + props.shotIdx);

        if (!trace) {
            throw new Error("No trace found for shot " + props.shotIdx);
        }

        trace = JSON.parse(trace);
        
        setTrace(trace as unknown as Array<ITrace>);
        setReplayPercentage(0);
        setReplayPlaying(false);
    }

    return (
        <div className={styles.wrapper}>
            <header className={styles.shot} onClick={selectShot}>
                <p>#{props.shot.number}</p>
                <div className={styles.subgroup}>
                    <IconViewfinder />
                    <p>{props.shot.rings_fraction}</p>
                </div>
                <div className={styles.subgroup}>
                    <IconClock />
                    <p>40s</p>
                </div>
            </header>
            <div className={[styles.details, collapsed ? styles.collapsed : styles.not_collapsed].join(" ")}>
                <div className={styles.subgroup}>
                    <IconBrandSpeedtest />
                    <p>8.2<small className={styles.smol}>mm/sek</small></p>
                </div>
                <div className={styles.subgroup}>
                    <IconBrandSpeedtest />
                    <p>10.1 <small className={styles.smol}>mm/sek/250ms</small></p>
                </div>
                <div className={styles.subgroup}>
                    <IconStarFilled />
                    <p>-0.2s (10.1)</p>
                </div>
            </div>
        </div>
    )
}

export default Shot;
