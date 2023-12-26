import {ipcMain} from "electron";
import * as electron from "electron";
import {convert} from "./converter/converter.js";
import fs from "fs"
import {throwError} from "./utils.js";


let data = null;
let idx = 0;

const create_workspace = (workspace, scatt_file) => {
    // 1. check if workspace exists
    if (!fs.existsSync(workspace)) {
        throwError("Workspace folder does not exist!");
        throw new Error("Workspace folder does not exist!");
    }

    // 2. Copy the scatt file
    fs.copyFileSync(scatt_file, workspace + "/data.scatt");
}

const request_file_dialog = (event) => {
    const paths = electron.dialog.showOpenDialogSync({
        title: "Choose Scatt Pro File",
        properties: ["openFile"],
        filters: [
            {
                name: "ScattPro File",
                extensions: ["scatt"]
            }
        ]
    });

    if (paths === undefined) return;
    const path = paths[0];
    const workspaces = electron.dialog.showOpenDialogSync({
        title: "Choose Workspace location (in which files will be stored)",
        properties: ["openDirectory"]
    })

    if (workspaces === undefined) return;
    const workspace = workspaces[0];

    create_workspace(workspace, path);
    data = convert(workspace, `${workspace}/data.scatt`);

    // meta is data without shots
    const meta = {...data};
    delete meta.shots;

    event.reply("new-workspace", {
        type: "start-tile-request",
        length: data.shots.length,
        meta,
    })
}

const respond_to_tile_request = (event) => {
    if (idx >= data.shots.length) {
        event.reply("new-workspace", {
            type: "end-tile-request"
        });
        return;
    }

    event.reply("new-workspace", {
        type: "tile-response",
        data: data.shots[idx],
        idx
    });
    idx += 1;
}

const load_new_workspace_handler = () => {
    ipcMain.on("new-workspace", (event, args) => {
        switch (args.type) {
            case "request-file-dialog":
                request_file_dialog(event);
            case "tile-request":
                respond_to_tile_request(event);
        }
    })
}

export default load_new_workspace_handler;