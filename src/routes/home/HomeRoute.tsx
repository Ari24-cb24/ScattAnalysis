import styles from "./homeroute.module.css"
import {IconUser, IconFile, IconFolderFilled} from "@tabler/icons-react"
import {Link, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {getShotDuration} from "../../utills/shotcanvas/methods.ts";
import {ITrace} from "../../types/analyzer/scatt_document_types.ts";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require("electron");

interface IpcMainEvent {}

const modifyShot = (shot: any, trace: Array<ITrace>) => {
    shot = {
        ...shot,
        rings: Math.floor(shot.result),
        rings_fraction: shot.result,
        duration_millis: getShotDuration(trace) * 1000,
        ave_speed: 0,
        ave_speed_250ms: 0,
        best_result_before: {
            delta_time: 0,
            abs_time: 0,
            result: 0,
        }
    };
    return shot;
}

const saveShotToLocalStorage = (shot: any) => {
    const trace = shot.data.trace;
    localStorage.setItem("shot-trace-" + shot.idx, JSON.stringify(trace))

    let shotData = {...shot.data};
    delete shotData.trace;

    while (localStorage.getItem("shot-list") === null) {
        console.log("Waiting for shot-list to be initialized");
    }

    shotData = modifyShot(shotData, trace);

    const shotList = JSON.parse(localStorage.getItem("shot-list")!);
    shotList[shot.idx] = shotData;
    localStorage.setItem("shot-list", JSON.stringify(shotList));
}

const HomeRoute = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localstorage
        localStorage.clear();

        ipcRenderer.on("new-workspace", (_event: IpcMainEvent, args: any) => {
           switch (args.type) {
               case "start-tile-request":
                   console.log("Starting tile request");
                   setLoading(true);

                   localStorage.setItem("shot-list", JSON.stringify(Array(args.length).fill(null)));
                   localStorage.setItem("shot-meta", JSON.stringify(args.meta));

                   ipcRenderer.send("new-workspace", {
                       type: "tile-request"
                   });
                   break;
               case "tile-response":
                   console.log("Tile-response received");
                   saveShotToLocalStorage(args);

                   ipcRenderer.send("new-workspace", {
                       type: "tile-request"
                   });
                   break;
               case "end-tile-request":
                   console.log("Ending tile request");

                   setTimeout(() => {
                       setLoading(false);
                       navigate("/analyzer");
                   }, 1000);
                   break;
           }
        });
    }, []);

    const openFileDialog = useCallback(() => {
        ipcRenderer.send("new-workspace", {
            "type": "request-file-dialog"
        })
    }, []);

    return (
        <>
            {loading ? (
                <div className={styles.loading}>
                    <p>Loading...</p>
                </div>
            ) : (
                <div className={styles.wrapper}>
                    <header className={styles.header}>
                        <IconUser size={60} />
                        <h3>Willkommen, Ari</h3>
                    </header>
                    <div className={styles.separator} />
                    <main className={styles.main}>
                        <div className={styles.group}>
                            <p className={styles.group__title}>START</p>
                            <div className={styles.subgroup}>
                                <IconFile />
                                <p onClick={openFileDialog}>New Workspace</p>
                            </div>
                            <div className={styles.subgroup}>
                                <IconFolderFilled />
                                <Link to="/">Open Workspace</Link>
                            </div>
                        </div>
                        <div className={styles.group}>
                            <p className={styles.group__title}>RECENT</p>
                            <div className={styles.recent_grid}>
                                <div className={styles.recent_element}>
                                    <IconFolderFilled size={60} />
                                    <p>tinus-shooty-cup</p>
                                </div>
                                <div className={styles.recent_element}>
                                    <IconFolderFilled size={60} />
                                    <p>tinus-shooty-cup</p>
                                </div>
                                <div className={styles.recent_element}>
                                    <IconFolderFilled size={60} />
                                    <p>tinus-shooty-cup</p>
                                </div>
                                <div className={styles.recent_element}>
                                    <IconFolderFilled size={60} />
                                    <p>tinus-shooty-cup</p>
                                </div>
                                <div className={styles.recent_element}>
                                    <IconFolderFilled size={60} />
                                    <p>tinus-shooty-cup</p>
                                </div>
                                <div className={styles.recent_element}>
                                    <IconFolderFilled size={60} />
                                    <p>tinus-shooty-cup</p>
                                </div>
                                <div className={styles.separator} />
                                <div className={styles.separator} />
                                <div className={styles.separator} />
                            </div>
                        </div>
                    </main>
                </div>
            )}
        </>
    )
}

export default HomeRoute;
