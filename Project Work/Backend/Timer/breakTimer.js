const { ipcRenderer } = require('electron');
var shortduration = 10;
var longduration = 10;
var shortfrequency = 10;
var longfrequency = 10;
var strictmode = false;
var postduration = 10;
var postlimit = 10;

const micTosec = 1000;
var skip = 0;
let updated = false;

function sendMessage(message) {
	ipcRenderer.send(message)
}
function timer(message, duration) {
	return new Promise((resolve) => {
            let timeVar = setTimeout(() => {
                resolve(sendMessage(message));
            }, duration);
	});
}

function mytimer(message, duration) {

    let startTime = Date.now();
    let endTime  = startTime+duration;
    skip=0;
    return new Promise((resolve) => {
        let tmp = setInterval(()=>{
            if(Date.now()>=endTime || skip==1 || updated)
            {
                resolve(sendMessage(message));
                clearInterval(tmp);
            }
        },100);
    });
}
function checkForUpdate()
{
    return updated;   
}
async function createTimer() {

    console.log(shortduration,shortfrequency,longduration,longfrequency);
    updated=false;
	while (1) {
		await mytimer('your short break starts', shortfrequency * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your short break ends', shortduration * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your short break starts', shortfrequency * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your short break ends', shortduration * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
        await mytimer('your long break starts', longfrequency * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
		await mytimer('your long break ends', longduration * micTosec);
        if(checkForUpdate())
        {
            updated=false;
            break;
        }
	}
    createTimer();
}
function closing() {
    skip=1;
}
window.onload = function() {
	createTimer();
};
ipcRenderer.on('scheduler-to-timer',(event,arg)=>{
    skip=1;
    updated=true;
    shortfrequency=arg.shortfrequency;
    shortduration=arg.shortduration;
    longduration=arg.longduration;
    longfrequency=arg.longfrequency;
    strictmode=arg.strictmode;
    postduration=arg.postduration;
    postlimit=arg.postlimit;
});