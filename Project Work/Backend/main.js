const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow,ipcMain} = electron;

let scheduleWindow, timerWindow;

function createWindow() {
    scheduleWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
            nodeIntegration:true,
            contextIsolation:false,
            devTools:true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    scheduleWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'Schedule/schedule.html'),
        protocol: 'file:',
        slashes: true
     }));




     // Create hidden window to run timer process
     timerWindow = new BrowserWindow({
        // show: false,
        webPreferences: {
            nodeIntegration:true,
            contextIsolation:false,
            devTools:true,
            preload: path.join(__dirname, 'preload.js')
        }
      });
  
      timerWindow.loadURL(url.format({
          pathname: path.join(__dirname, 'Timer/breakTimer.html'),
          protocol: 'file:',
          slashes: true
       }));
       timerWindow.webContents.openDevTools();
}

app.on('ready', ()=>{
    createWindow();
});

ipcMain.on('message-from-scheduler',(event,arg)=>{
    timerWindow.webContents.send('scheduler-to-timer',arg);
});

