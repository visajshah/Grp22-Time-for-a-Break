const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { localStorage, sessionStorage } = require("electron-browser-storage");
const electron = require("electron");
const path = require("path");
const { restart } = require("nodemon");
const { doesNotMatch } = require("assert");
const { type } = require("os");
const Tray = electron.Tray;
const iconPath = path.join(__dirname, "images/App_logo.png");
const Menu = electron.Menu;
const powerMonitor = electron.powerMonitor;

let win,
  worker = null,
  menu,
  tray = null,
  breakWin = null,
  flg,
  lockScreen;
let template = [
  {
    label: "Quit The App",
    click: function () {
      worker.close();
      worker = null;
      if (win) {
        win.close();
      }
    },
  },
  {
    label: "show home window",
    click: function () {
      if (win) {
        win.show();
      }
    },
  },
];

app.on("ready", () => {
  win = new BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 800,
    minHeight: 700,
    icon: __dirname + "/images/App_logo.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      devTools: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("home/home.html");
  win.on("close", (e) => {
    if (worker) {
      e.preventDefault();
      win.hide();
    }
  });
  win.removeMenu();

  ipcMain.on("Start The Session", () => {
    if (tray === null) {
      tray = new Tray(iconPath);
      menu = Menu.buildFromTemplate(template);
      tray.setContextMenu(menu);
      tray.setToolTip("Time Break App");
    }

    worker = new BrowserWindow({
      show: false, //updated
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });
    worker.loadFile("Timer/worker.html");

    ipcMain.on("End The Session", () => {
      if (worker) {
        worker.close();
        tray.destroy();
        tray = null;
        worker = null;
      }
    });

    worker.on("closed", async () => {
      await localStorage.setItem("running_session", false);

      let prev_short_skipped = 0;
      if (await localStorage.getItem("short_skipped")) {
        prev_short_skipped = parseInt(
          await localStorage.getItem("short_skipped")
        );
      }
      let prev_long_skipped = 0;
      if (await localStorage.getItem("long_skipped")) {
        prev_long_skipped = parseInt(
          await localStorage.getItem("long_skipped")
        );
      }
      let prev_startSession = Date.now();
      if (await localStorage.getItem("currstarttime")) {
        prev_startSession = parseInt(
          await localStorage.getItem("currstarttime")
        );
      }
      let prev_endSession = Date.now();

      let prev_totalshortbreak = 0;
      if (await localStorage.getItem("currtotalshortbreak")) {
        prev_totalshortbreak = parseInt(
          await localStorage.getItem("currtotalshortbreak")
        );
      }

      let prev_totallongbreak = 0;
      if (await localStorage.getItem("currtotallongbreak")) {
        prev_totallongbreak = parseInt(
          await localStorage.getItem("currtotallongbreak")
        );
      }

      await localStorage.setItem("prev_short_skipped", prev_short_skipped);
      await localStorage.setItem("prev_long_skipped", prev_long_skipped);
      await localStorage.setItem("prev_starttime", prev_startSession);
      await localStorage.setItem("prev_endtime", prev_endSession);
      await localStorage.setItem("prev_totalshortbreak", prev_totalshortbreak);
      await localStorage.setItem("prev_totallongbreak", prev_totallongbreak);
    });

    ipcMain.on("your short break starts", (event, strict_flg) => {
      if (breakWin) {
        breakWin.close();
        breakWin = null;
      }
      breakWin = new BrowserWindow({
        // show: false,
        width: 1000,
        height: 600,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          devTools: true,
          preload: path.join(__dirname, "preload.js"),
        },
        icon: null,
      });
      breakWin.loadFile("breaks/shortBreak.html");
      breakWin.setFullScreen(true);
      breakWin.setSkipTaskbar(true);
    });
    ipcMain.on("Break-has-been-skipped", (event) => {
      worker.webContents.send("Break-skipped-Main-to-worker");
    });
    ipcMain.on("your short break ends", () => {
      if (breakWin) {
        breakWin.close();
        breakWin = null;
      }
    });

    ipcMain.on("your long break starts", (event, strict_flg) => {
      if (breakWin) {
        breakWin.close();
        breakWin = null;
      }
      breakWin = new BrowserWindow({
        // show: false,
        width: 1000,
        height: 600,
        frame: false,
        alwaysOnTop: true,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          devTools: true,
          preload: path.join(__dirname, "preload.js"),
        },
        icon: null,
      });
      breakWin.loadFile("breaks/longBreak.html");
      breakWin.setFullScreen(true);
      breakWin.setSkipTaskbar(true);
    });
    ipcMain.on("your long break ends", () => {
      if (breakWin) {
        breakWin.close();
        breakWin = null;
      }
    });
  });

  powerMonitor.on("suspend", () => {
    worker.close();
    // tray.destroy()
  });

  powerMonitor.on("lock-screen", () => {
    lockScreen = 0;
    worker.webContents.send("system-lock");

    while (lockScreen === 0) {}
    ipcMain.on("u-may-procedd-with-lock", () => {
      lockScreen = 1;
    });
    if (worker) {
      worker.close();
      worker = null;
    }

    // tray.destroy()
  });
});
ipcMain.on("message-from-scheduler", (event, arg) => {
  if (worker) {
    worker.webContents.send("scheduler-to-timer", arg);
  }
});

ipcMain.on("settings has been changed to Main", (event) => {
  if (worker) {
    worker.webContents.send("settings-has-been-changed-to-worker");
  }
});

ipcMain.on("message-on-music-channel", (event, arg) => {
  dialog
    .showOpenDialog({
      filters: [
        {
          name: "Music files",
          extensions: ["mp3", "wav"],
        },
      ],
    })
    .then((results) => {
      if (results.filePaths[0] === undefined) {
      } else {
        saveFile(results);
      }
    });
});

async function saveFile(results) {
  let arr1 = await localStorage.getItem("arr");
  arr2 = JSON.parse(arr1);
  let arr1Path = await localStorage.getItem("arrPath");
  let arr2Path = JSON.parse(arr1Path);

  if (arr2 === null) {
    arr2 = ["Audio.mp3"];
  }
  if (arr2Path === null) {
    arr2Path = ["Audio.mp3"];
  }

  var fileName = results.filePaths[0].replace(/^.*[\\\/]/, "");
  var filePath = results.filePaths[0].replace(/\\/g, "/");

  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === fileName) {
      return;
    }
  }
  arr2.push(fileName);
  arr2Path.push(filePath);
  await localStorage.setItem("arr", JSON.stringify(arr2));
  await localStorage.setItem("arrPath", JSON.stringify(arr2Path));
  win.webContents.send("piggy-back-from-main", 123);
}
