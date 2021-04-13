const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

const Break = ipcRenderer.sendSync('want-data');

const dateObj = new Date();
const month = dateObj.getUTCMonth() + 1; 
const day = dateObj.getUTCDate();
const year = dateObj.getUTCFullYear();

const d1 = localStorage.getItem('day');
const m1 = localStorage.getItem('month');
const y1 = localStorage.getItem('year');

localStorage.setItem('day',day);
localStorage.setItem('month',month);
localStorage.setItem('year',year);

function showSkipBreak()
{
    document.getElementById('addTxt1').value = Break.skip;
}
function showPostponedBreak()
{
    document.getElementById('addTxt2').value = Break.postponed;
}
function showBreakTime()
{
    document.getElementById('addTxt3').value = Break.breaktime;
}
function showActiveTime()
{
    document.getElementById('addTxt4').value = Break.activetime;
}
function showPercentageOfBreakTime()
{
    let totalTime = Break.activetime + Break.breaktime;
    let breakTime = Break.breaktime;
    let percentageOfBreakTime = (breakTime/totalTime)*100;
    percentageOfBreakTime = percentageOfBreakTime.toFixed(2);
    document.getElementById('addTxt5').value = `${percentageOfBreakTime}%`;
}


showSkipBreak();
showPostponedBreak();
showBreakTime();
showActiveTime();
showPercentageOfBreakTime();