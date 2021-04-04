const electron = require('electron');
const { app, BrowserWindow } = electron;

let win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    win.loadFile('index.html');
}

app.on('ready', () => {
    createWindow();
})