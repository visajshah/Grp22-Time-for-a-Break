const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path')
const url = require('url')
const ipc = electron.ipcMain;
const dialog = require('electron').dialog;

let win;
var Break = {
    skip : 12,
    postponed : 15,
    breaktime : 16,
    activetime : 30
};

function createWindow() {

  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
          nodeIntegration:true,
          contextIsolation:false,
          devTools:true,
          preload: path.join(__dirname, 'preload.js')
      }
  });

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));


  win.on('closed', () => {
    win = null
  });
}
// ipc.on('open-dialog',(event)=>{
//     dialog.showErrorBox('An error message','demo');
//     event.sender.send('opened-dialog','successfully');
// })
ipc.on('want-data',(event)=>{
  // event.sender.send('sent-data',Break);\
  event.returnValue = Break;
})  
app.on('ready', createWindow);



