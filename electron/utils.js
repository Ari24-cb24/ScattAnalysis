import * as electron from "electron";

export const throwError = (message) => {
    electron.dialog.showErrorBox("Error", message);
}