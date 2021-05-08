const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

let scheduleForm = document.forms["scheduleForm"];

function updateSchedule() {
  if (localStorage.getItem("shortfrequency")) {
    scheduleForm["shortfrequency"].value = parseInt(
      localStorage.getItem("shortfrequency")
    );
  } else {
    scheduleForm["shortfrequency"].value = 10;
  }
  if (localStorage.getItem("shortduration")) {
    scheduleForm["shortduration"].value = parseInt(
      localStorage.getItem("shortduration")
    );
  } else {
    scheduleForm["shortduration"].value = 10;
  }
  if (localStorage.getItem("longduration")) {
    scheduleForm["longduration"].value = parseInt(
      localStorage.getItem("longduration")
    );
  } else {
    scheduleForm["longduration"].value = 10;
  }
  if (localStorage.getItem("longfrequency")) {
    scheduleForm["longfrequency"].value = parseInt(
      localStorage.getItem("longfrequency")
    );
  } else {
    scheduleForm["longfrequency"].value = 10;
  }
}
updateSchedule();

// Send Update duration and frequency to timer function
function sendItem() {
  scheduleForm = document.forms["scheduleForm"];
  shortduration = scheduleForm["shortduration"].value;
  longduration = scheduleForm["longduration"].value;
  shortfrequency = scheduleForm["shortfrequency"].value;
  longfrequency = scheduleForm["longfrequency"].value;

  const data = {
    shortduration,
    longduration,
    shortfrequency,
    longfrequency,
  };
  console.log(data);
  localStorage.setItem("shortfrequency", shortfrequency);
  localStorage.setItem("shortduration", shortduration);
  localStorage.setItem("longduration", longduration);
  localStorage.setItem("longfrequency", longfrequency);

  ipcRenderer.send("message-from-scheduler", data);
}
