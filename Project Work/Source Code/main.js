const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { localStorage, sessionStorage } = require('electron-browser-storage');
const electron = require('electron')
const path = require('path');
const { restart } = require('nodemon');
const { doesNotMatch } = require('assert');
const { type } = require('os');
const Tray = electron.Tray
const iconPath = path.join(__dirname, 'images/App_logo.png')
const Menu = electron.Menu
const powerMonitor = electron.powerMonitor;

let win, worker = null, menu, tray = null, breakWin = null, flg, lockScreen

app.on('ready', () => {
    win = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 800,
        minHeight: 700,
        icon: __dirname + '/images/App_logo.png',
        webPreferences: {
            nodeIntegration:true,
            contextIsolation:false,
            devTools:true,
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('home/home.html');
    win.on('close',(e)=>{
        if (worker) {
            e.preventDefault();
            win.hide();
        }
    })
    win.removeMenu()

    ipcMain.on('Start The Session', () => {

            worker = new BrowserWindow({
                show: false,//updated
                width: 800,
                height: 600,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                }
            })
            worker.loadFile('Timer/worker.html')

            ipcMain.on('End The Session', () => {
                if (worker) {
                    worker.close()
                    tray.destroy()
                    tray = null
                    worker = null
                }
            })
            
            worker.on('closed',async ()=>{

                console.log("worker closing");
                    await localStorage.setItem('running_session',false);
                    
                    let prev_short_skipped = 0;
                    if(await localStorage.getItem('short_skipped'))
                    {
                        prev_short_skipped = parseInt(await localStorage.getItem('short_skipped')); 
                    }
                    let prev_long_skipped =  0;
                    if(await localStorage.getItem('long_skipped'))
                    {
                      prev_long_skipped = parseInt(await localStorage.getItem('long_skipped'));
                
                    }
                    let prev_startSession = Date.now();
                    if(await  localStorage.getItem('currstarttime'))
                    {
                        prev_startSession = parseInt(await localStorage.getItem('currstarttime'));
                    }
                    let prev_endSession = Date.now();
                    
                    let prev_totalshortbreak = 0;
                    if(await localStorage.getItem('currtotalshortbreak'))
                    {
                        prev_totalshortbreak = parseInt(await localStorage.getItem('currtotalshortbreak'));
                    }

                    let prev_totallongbreak = 0;
                    if(await localStorage.getItem('currtotallongbreak'))
                    {
                        prev_totallongbreak = parseInt(await localStorage.getItem('currtotallongbreak'));
                    }

                    await localStorage.setItem('prev_short_skipped',prev_short_skipped);
                    await localStorage.setItem('prev_long_skipped', prev_long_skipped);
                    await localStorage.setItem('prev_starttime',prev_startSession);
                    await localStorage.setItem('prev_endtime',prev_endSession);
                    await localStorage.setItem('prev_totalshortbreak',prev_totalshortbreak);
                    await localStorage.setItem('prev_totallongbreak',prev_totallongbreak);
                });
            

        ipcMain.on('your short break starts', (event, strict_flg)=>{
            if (breakWin) {
                breakWin.close()
                breakWin = null
            }
            breakWin = new BrowserWindow({
                // show: false,
                width: 1000,
                height: 600,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                },
                icon: null
            })
            breakWin.loadFile('breaks/shortBreak.html')
            breakWin.setFullScreen(true);
            breakWin.setSkipTaskbar(true);
        })
        ipcMain.on('Break-has-been-skipped', (event)=>{
            worker.webContents.send('Break-skipped-Main-to-worker');
        })
        ipcMain.on('your short break ends', ()=>{
            console.log("Window termination proc has been arrived in main");
            if (breakWin) {
                breakWin.close()
                breakWin = null
            }
        })

        ipcMain.on('your long break starts', (event, strict_flg)=>{
            if (breakWin) {
                breakWin.close()
                breakWin = null
            }
            breakWin = new BrowserWindow({
                // show: false,
                width: 1000,
                height: 600,
                frame: false,
                alwaysOnTop: true,
                webPreferences: {
                    nodeIntegration:true,
                    contextIsolation:false,
                    devTools:true,
                    preload: path.join(__dirname, 'preload.js')
                },
                icon: null
            })
            breakWin.loadFile('breaks/longBreak.html')
            breakWin.setFullScreen(true);
            breakWin.setSkipTaskbar(true);
        })
        ipcMain.on('your long break ends', ()=>{
            if (breakWin) {
                breakWin.close()
                breakWin = null
            }
        })
    })
})