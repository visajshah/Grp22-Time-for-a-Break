const { ipcRenderer, electron } = require("electron");
const path = require("path");
var shortduration = 10; // time of Short break duration
var longduration = 10; // time of long break duration
var shortfrequency = 10; // time of short break frequency
var longfrequency = 10; // time of long break frequency

const secToMin = 60;
const micTosec = 1000; // convert microsecond to second
var skip = 0; // intialize skip with zero
let updated = false; // intialize updated varibale to false
let noOfSkips = 0; // Total number of skip during this session

var startSession = -1;
var endSession = -1;

let t1 = 5 * micTosec,
  t2 = 2 * micTosec;

var notifi_flg = true,
  strict_flg = false;

function updateSetting() {
  if (window.localStorage.getItem("notifi")) {
    var notifi_tmp = window.localStorage.getItem("notifi");
    if (notifi_tmp) {
      if (notifi_tmp === "true") {
        notifi_flg = true;
      } else {
        notifi_flg = false;
      }
    }
  }
  if (window.localStorage.getItem("strict")) {
    var strict_tmp = window.localStorage.getItem("strict");
    if (strict_tmp) {
      if (strict_tmp === "true") {
        strict_flg = true;
      } else {
        strict_flg = false;
      }
    }
  }
}

function sendMessage(message) {
  ipcRenderer.send(message, strict_flg);
}

function mytimer(message, duration) {
  let startTime = Date.now();
  let endTime = startTime + duration;
  let flg =
    message === "your short break ends" || message === "your long break ends";
  let flg1 =
    message === "your short break starts" ||
    message === "your long break starts";
  let notif_done = false,
    terminated = false;
  skip = 0;

  return new Promise((resolve) => {
    let tmp = setInterval(() => {
      let notification;
      if (Date.now() >= endTime - t1 && flg1 && !notif_done) {
        // let msg = "Start Notif";
        notif_done = true;
        // resolve(sendMessage(msg));

        if (notifi_flg) {
          notification = new Notification("Break Reminder", {
            body: "Your Next break will start in 5 seconds",
          });
        }
      }

      if (Date.now() >= endTime - t2 && flg1 && notif_done && !terminated) {
        terminated = true;
      }

      if (Date.now() >= endTime || updated || skip == 1) {
        resolve(sendMessage(message));
        clearInterval(tmp);
      }
    }, 100);
  });
}
function checkForUpdate() {
  return updated;
}
function updateSchedule() {
  if (localStorage.getItem("shortfrequency")) {
    shortfrequency = parseInt(localStorage.getItem("shortfrequency"));
  } else {
    shortfrequency = 10;
  }
  if (localStorage.getItem("shortduration")) {
    shortduration = parseInt(localStorage.getItem("shortduration"));
  } else {
    shortduration = 10;
  }
  if (localStorage.getItem("longduration")) {
    longduration = parseInt(localStorage.getItem("longduration"));
  } else {
    longduration = 10;
  }
  if (localStorage.getItem("longfrequency")) {
    longfrequency = parseInt(localStorage.getItem("longfrequency"));
  } else {
    longfrequency = 10;
  }
  // console.log(shortduration,shortfrequency,longduration,longfrequency);
}

// Timer function which generate one long break after every two short break
async function createTimer() {
  // Set duration and frequency value from local storage
  updateSchedule();
  updated = false;
  while (1) {
    await mytimer(
      "your short break starts",
      shortfrequency * micTosec * secToMin
    );
    if (checkForUpdate()) {
      sendMessage("your short break ends");
      updated = false;
      break;
    }

    await mytimer("your short break ends", shortduration * micTosec * secToMin);
    if (checkForUpdate()) {
      updated = false;
      break;
    }

    await mytimer(
      "your short break starts",
      shortfrequency * micTosec * secToMin
    );
    if (checkForUpdate()) {
      sendMessage("your short break ends");
      updated = false;
      break;
    }

    await mytimer("your short break ends", shortduration * micTosec * secToMin);
    if (checkForUpdate()) {
      updated = false;
      break;
    }
    await mytimer(
      "your long break starts",
      longfrequency * micTosec * secToMin
    );
    if (checkForUpdate()) {
      sendMessage("your long break ends");
      updated = false;
      break;
    }
    await mytimer("your long break ends", longduration * micTosec * secToMin);
    if (checkForUpdate()) {
      updated = false;
      break;
    }
  }
  // console.log("Timer Exited *********************************************************************");
  createTimer();
}
ipcRenderer.on("Break-skipped-Main-to-worker", () => {
  // breakWin.hide()

  noOfSkips = noOfSkips + 1;
  skip = 1;
});
function closing() {
  // Skip the current break and update no of skip variable;
  noOfSkips = noOfSkips + 1;
  skip = 1;
}
window.onload = function () {
  // Initialize variable with default value

  noOfSkips = 0;
  skip = 0;
  updated = false;
  updateSetting();
  startSession = Date.now();

  localStorage.setItem("short_skipped", 0);
  localStorage.setItem("long_skipped", 0);
  localStorage.setItem("currstarttime", startSession);
  localStorage.setItem("currtotalshortbreak", 0);
  localStorage.setItem("currtotallongbreak", 0);

  // create Timer function on load of the window
  createTimer();
};
// Update message from the scheduler to update frequency and duration of short and long break
ipcRenderer.on("scheduler-to-timer", (event, arg) => {
  // window.localStorage.setItem('shortfrequency' , arg.shortfrequency);
  // window.localStorage.setItem('shortduration' , arg.shortduration);
  // window.localStorage.setItem('longduration' , arg.longduration);
  // window.localStorage.setItem('longfrequency' , arg.longfrequency);

  skip = 1; // to break the current running timer
  updated = true; // Set update variable to true

  // update all duration and frequency with new values
});

ipcRenderer.on("settings-has-been-changed-to-worker", () => {
  // console.log("updated settings has arrived");
  updateSetting();
});
