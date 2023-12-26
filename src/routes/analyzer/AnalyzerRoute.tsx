import styles from "./analyzerroute.module.css"
import Aside from "../../components/analyzer/aside/Aside.tsx";
import {IScattDocumentMeta, IScattShot} from "../../types/analyzer/scatt_document_types.ts";
import {useEffect, useMemo, useState} from "react";
import ShotCanvas from "../../components/analyzer/main/ShotCanvas.tsx";
import ShotCanvasControls from "../../components/analyzer/controls/ShotCanvasControls.tsx";
import {IShotExtra} from "../../types/scattshotextras.ts";
import {getShotDuration} from "../../utills/shotcanvas/methods.ts";
import {useAnalyzerStore} from "../../stores/analyzerstore.ts";

const loadMeta = () => {
    const meta: IScattDocumentMeta = JSON.parse(localStorage.getItem("shot-meta")!);
    const shotCount = parseInt(localStorage.getItem("shot-count")!);
    const shots: Array<IScattShot> = [];

    for (let i = 0; i < shotCount; i++) {
        shots.push(JSON.parse(localStorage.getItem("shot-" + i)!));
    }

    const shotExtras: Array<IShotExtra> = [];

    for (let i = 0; i < shotCount; i++) {
        const shotExtra: IShotExtra = {
            durationMillis: getShotDuration(shots[i]) * 1000,
            aveSpeed: 0,
            aveSpeed250ms: 0,
            bestResultBefore: {
                deltaTime: 0,
                absTime: 0,
                result: 0,
            }
        }

        shotExtras.push(shotExtra);
    }

    return {
        meta,
        shots,
        shotExtras,
    }
}

const AnalyzerRoute = () => {
    const {meta, shots, shotExtras} = useMemo(loadMeta, []);
    const [currentShot, setCurrentShot] = useState<IScattShot | null>(shots ? shots[0] : null);
    const [setShotExtras] = useAnalyzerStore((state) => [state.setShotExtras]);

    useEffect(() => {
        setShotExtras(shotExtras);
    }, [setShotExtras, shotExtras]);

    return (
        <div className={styles.wrapper}>
            <Aside meta={meta} shots={shots} onSelectShot={(shot: IScattShot) => setCurrentShot(shot)} />
            <div className={styles.main__wrapper}>
                {currentShot && (
                    <>
                        <ShotCanvas />
                        <ShotCanvasControls />
                    </>
                )}
            </div>
        </div>
    )
}

export default AnalyzerRoute;