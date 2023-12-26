import styles from "./homeroute.module.css"
import {IconUser, IconFile, IconFolderFilled} from "@tabler/icons-react"
import {Link, useNavigate} from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { ipcRenderer } = require("electron");

interface IpcMainEvent {}

const saveShotToLocalStorage = (shot: any) => {
    localStorage.setItem("shot-" + shot.idx, JSON.stringify(shot.data));
}

const HomeRoute = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear localstorage
        localStorage.clear();

        ipcRenderer.on("new-workspace", (event: IpcMainEvent, args) => {
           switch (args.type) {
               case "start-tile-request":
                   console.log("Starting tile request");
                   setLoading(true);

                   localStorage.setItem("shot-count", args.length);
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
                   setLoading(false);
                   navigate("/analyzer");
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