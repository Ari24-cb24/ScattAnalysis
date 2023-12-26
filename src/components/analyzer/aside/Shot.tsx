import styles from "./shot.module.css"
import {IScattShot} from "../../../types/analyzer/scatt_document_types.ts";
import {IconBrandSpeedtest, IconClock, IconStarFilled, IconViewfinder} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import {useAnalyzerStore} from "../../../stores/analyzerstore.ts";

const Shot = (props: {
    shot: IScattShot,
    shotIdx: number,
}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentShotIdx, setCurrentShot] = useAnalyzerStore((state) => [state.currentShotIdx, state.setCurrentShot]);

    useEffect(() => {
        if (currentShotIdx === props.shotIdx) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [currentShotIdx]);

    return (
        <div className={styles.wrapper}>
            <header className={styles.shot} onClick={() => {
                setCurrentShot(props.shotIdx, props.shot);
            }}>
                <p>#{props.shot.number}</p>
                <div className={styles.subgroup}>
                    <IconViewfinder />
                    <p>{props.shot.result}</p>
                </div>
                <div className={styles.subgroup}>
                    <IconClock />
                    <p>40s</p>
                </div>
            </header>
            {collapsed && (
                <div className={styles.details}>
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
            )}
        </div>
    )
}

export default Shot;