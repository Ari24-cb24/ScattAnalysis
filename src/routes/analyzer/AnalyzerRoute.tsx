import styles from "./analyzerroute.module.css"
import Aside from "../../components/analyzer/aside/Aside.tsx";
import {IScattDocumentMeta, IScattShot} from "../../types/analyzer/scatt_document_types.ts";
import React, {useEffect, useMemo} from "react";
import ShotCanvas from "../../components/analyzer/main/ShotCanvas.tsx";
import ShotCanvasControls from "../../components/analyzer/controls/ShotCanvasControls.tsx";
import {useAnalyzerStore} from "../../stores/analyzerstore.ts";
import {createTilePanes, TileBranchSubstance, TileContainer, TileProvider} from "react-tile-pane";
import {theme} from "./container-theme/theme.tsx";
import {IconLayoutSidebar, IconPlayerSkipForwardFilled, IconTarget} from "@tabler/icons-react";

const loadMeta = () => {
    const meta: IScattDocumentMeta = JSON.parse(localStorage.getItem("shot-meta")!);
    const shots: Array<IScattShot> = JSON.parse(localStorage.getItem("shot-list")!);

    return {
        meta,
        shots,
    }
}

const [paneList, names] = createTilePanes({
    aside: <Aside />,
    shotReplay: <ShotCanvas />,
    replayControls: <ShotCanvasControls />
});

const icons: Record<keyof typeof names, React.ReactNode> = {
    aside: <IconLayoutSidebar size={16} />,
    shotReplay: <IconTarget size={16} />,
    replayControls: <IconPlayerSkipForwardFilled size={16} />,
}

const windowNames: Record<keyof typeof names, string> = {
    aside: "Overview",
    shotReplay: "Shot Replay",
    replayControls: "Replay Controls",
}

const rootPane: TileBranchSubstance = {
    isRow: true,
    children: [
        {
            children: names.aside,
            grow: 1,
        },
        {
            children: [
                {
                    children: names.shotReplay,
                    grow: 8,
                },
                {
                    children: names.replayControls,
                    grow: 2,
                }
            ],
            grow: 3,
        },
    ],
}

const AnalyzerRoute = () => {
    const {meta, shots} = useMemo(loadMeta, []);
    const [setShots, setMeta] = useAnalyzerStore((state) =>
        [state.setShots, state.setMeta]);

    useEffect(() => {
        setShots(shots);
        setMeta(meta);
    }, [setShots, setMeta, shots, meta]);

    return (
        <TileProvider rootNode={rootPane} tilePanes={paneList} {...theme(icons, windowNames)}>
            <div className={styles.wrapper}>
                <TileContainer />
            </div>
        </TileProvider>
    )
}

export default AnalyzerRoute;
