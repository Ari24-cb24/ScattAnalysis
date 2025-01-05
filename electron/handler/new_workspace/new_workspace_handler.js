import {ipcMain} from "electron";
import * as electron from "electron";
import {convert} from "../../converter/converter.js";
import fs from "fs"
import {throwError} from "../../utils.js";
import {calculate_velocities} from "./velocities_calculator.js";


let data = null;
let velocities = null;
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

    // Create the workspace files
    create_workspace(workspace, path);
    // Convert the scatt file into a json file
    data = convert(workspace, `${workspace}/data.scatt`);
    // Create the json file containing velocities
    velocities = calculate_velocities(data.shots);
    fs.writeFileSync(`${workspace}/velocities.json`, JSON.stringify(velocities));

    // meta is data without shots
    const meta = {...data};
    delete meta.shots;

    console.log("Starting tile request")

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
        velocities: velocities[idx],
        idx
    });
    idx += 1;
}

const load_new_workspace_handler = () => {
    ipcMain.on("new-workspace", (event, args) => {
        switch (args.type) {
            case "request-file-dialog":
                request_file_dialog(event);
                break;
            case "tile-request":
                respond_to_tile_request(event);
                break;
        }
    })
}

export default load_new_workspace_handler;
