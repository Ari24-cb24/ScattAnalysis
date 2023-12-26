import {app, BrowserWindow, ipcMain} from "electron";
import isDev from "electron-is-dev"
import load_new_workspace_handler from "./new_workspace_handler.js";

function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "Scatt Analysis",
        webPreferences: {
            nodeIntegration: true,
            devTools: isDev,
            contextIsolation: false,
        },
    })

    void win.loadURL('http://localhost:5173');
}

app.whenReady().then(createWindow).catch((err) => {
    console.error(err);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on("ping", (event, args) => {
    event.reply("pong", args);
})

load_new_workspace_handler();