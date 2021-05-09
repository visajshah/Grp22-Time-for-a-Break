//calculate TotalDuration from start time and end time of previous session
let prev_starttime = parseInt(localStorage.getItem("prev_starttime"));
let prev_endtime = parseInt(localStorage.getItem("prev_endtime"));
if (prev_starttime == undefined) {
  prev_starttime = 0;
}
if (prev_endtime == undefined) {
  prev_endtime = 0;
}

//object that fetches variables from local storage
const Break = {
  totalDuration: prev_endtime - prev_starttime,
  shortBreakSkipped: parseInt(localStorage.getItem("prev_short_skipped")),
  totalShortBreak: parseInt(localStorage.getItem("prev_totalshortbreak")),
  shortBreakAttended: 0,
  longBreakSkipped: parseInt(localStorage.getItem("prev_long_skipped")),
  totalLongBreak: parseInt(localStorage.getItem("prev_totallongbreak")),
  longBreakAttended: 0,
};

//set to 0 if not defined already
if (Break.totalDuration == undefined) {
  Break.totalDuration = 0;
}
if (Break.shortBreakSkipped == undefined) {
  Break.shortBreakSkipped = 0;
}
if (Break.totalShortBreak == undefined) {
  Break.shortBreakAttended = 0;
}
if (Break.longBreakSkipped == undefined) {
  Break.longBreakSkipped = 0;
}
if (Break.totalLongBreak == undefined) {
  Break.longBreakAttended = 0;
}

//calculated break attended from required variable stored in local storage
Break.longBreakAttended = Break.totalLongBreak - Break.longBreakSkipped;
Break.shortBreakAttended = Break.totalShortBreak - Break.shortBreakSkipped;

function showTotalDuration() {
  let totSecond = Math.floor(Break.totalDuration / 1000);
  let totMinute = Math.floor(totSecond / 60);
  let totHour = Math.floor(totSecond / 3600);

  if (totHour > 0) {
    document.getElementById(
      "addTxt1"
    ).innerHTML = `${totHour}hr ${totMinute}min`;
  } else if (totMinute > 0) {
    document.getElementById("addTxt1").innerHTML = `${totMinute}min`;
  } else {
    document.getElementById("addTxt1").innerHTML = `${totSecond}sec`;
  }
}
function showShortBreakSkipped() {
  document.getElementById("addTxt2").innerHTML = `${Break.shortBreakSkipped}`;
}
function showShortBreakAttended() {
  document.getElementById("addTxt3").innerHTML = `${Break.shortBreakAttended}`;
}
function showLongBreakSkipped() {
  document.getElementById("addTxt4").innerHTML = `${Break.longBreakSkipped}`;
}
function showLongBreakAttended() {
  document.getElementById("addTxt5").innerHTML = `${Break.longBreakAttended}`;
}

function showPercentageOfShortBreakTime() {
  let totalTime = Break.shortBreakAttended + Break.shortBreakSkipped;
  let breakTime = Break.shortBreakAttended;
  let percentageOfBreakTime = 100;

  if (totalTime !== 0) percentageOfBreakTime = (breakTime / totalTime) * 100;

  percentageOfBreakTime = percentageOfBreakTime.toFixed(2);
  if (percentageOfBreakTime >= 75) {
    document.getElementById(
      "addTxt6"
    ).value = `Congratulation!! You took ${percentageOfBreakTime}% of short break.`;
  } else {
    document.getElementById(
      "addTxt6"
    ).value = `Oops!! You took ${percentageOfBreakTime}% of short break. You should not skip much short break.`;
  }
  document.getElementById("addTxt6").innerHTML = `${percentageOfBreakTime}%`;
}
function showPercentageOfLongBreakTime() {
  let totalTime = Break.longBreakAttended + Break.longBreakSkipped;
  let breakTime = Break.longBreakAttended;
  let percentageOfBreakTime = 100;

  if (totalTime !== 0) percentageOfBreakTime = (breakTime / totalTime) * 100;

  percentageOfBreakTime = percentageOfBreakTime.toFixed(2);
  if (percentageOfBreakTime >= 75) {
    document.getElementById(
      "addTxt7"
    ).value = `Congratulation!! You took ${percentageOfBreakTime}% of long break.`;
  } else {
    document.getElementById(
      "addTxt7"
    ).value = `Oops!! You took ${percentageOfBreakTime}% of long break. You should not skip much long break.`;
  }
  document.getElementById("addTxt7").innerHTML = `${percentageOfBreakTime}%`;
}
function Congrats(percentageOfBreakTime) {
  document.getElementById(
    "addTxt7"
  ).innerHTML = `<div style='text-align: center;margin-top : 25px;color: green;'>Congratulation!! You attended ${percentageOfBreakTime}% of total break.</span>`;
}
function Oops(percentageOfBreakTime) {
  document.getElementById(
    "addTxt7"
  ).innerHTML = `<div style='text-align: center;margin-top : 25px;color: red;'>Oops!! You attended ${percentageOfBreakTime}% of total break.</span>`;
}
function showPercentageOftotalBreakTime() {
  let totalTime =
    Break.longBreakAttended +
    Break.longBreakSkipped +
    Break.shortBreakAttended +
    Break.shortBreakSkipped;
  let breakTime = Break.longBreakAttended + Break.shortBreakAttended;
  let percentageOfBreakTime = 100;

  if (totalTime !== 0) percentageOfBreakTime = (breakTime / totalTime) * 100;

  percentageOfBreakTime = percentageOfBreakTime.toFixed(2);
  document.getElementById("addTxt6").innerHTML = `${percentageOfBreakTime}%`;
  if (percentageOfBreakTime >= 70) {
    console.log("congratulations!!");
    Congrats(percentageOfBreakTime);
  } else {
    console.log("Oops!!");
    Oops(percentageOfBreakTime);
  }
}

// To see the duration of a break
showTotalDuration();

//To see the number of short break skipped
showShortBreakSkipped();

//To see the number of short break attended
showShortBreakAttended();

//To see the number of long break skipped
showLongBreakSkipped();

//To see the number of long break attended
showLongBreakAttended();

//To see the percentage of total breaks attended
showPercentageOftotalBreakTime();
