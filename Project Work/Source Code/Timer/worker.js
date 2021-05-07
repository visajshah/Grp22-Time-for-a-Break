const { ipcRenderer } = require('electron');
var shortduration = 10;    // time of Short break duration 
var longduration = 10;     // time of long break duration
var shortfrequency = 10;   // time of short break frequency
var longfrequency = 10;    // time of long break frequency

const micTosec = 1000;  // convert microsecond to second 
var skip = 0;           // intialize skip with zero 
let updated = false;    // intialize updated varibale to false
let noOfSkips = 0;     // Total number of skip during this session

function sendMessage(message) {
    // Send appropriate break message to main function
	ipcRenderer.send('message-for-break',message);
}
function timer(message, duration) {
	return new Promise((resolve) => {
            let timeVar = setTimeout(() => {
                resolve(sendMessage(message));
            }, duration);
	});
}

function mytimer(message, duration) {

    // create time of specific duration and then it will send messege to main function
    let startTime = Date.now();
    let endTime  = startTime+duration;
    skip=0;  // reinitialize skip variable with zero 
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

// To check there  is update in duration and frequency
function checkForUpdate()
{
    return updated;   
}

// Timer function which generate one long break after every two short break
async function createTimer() {

    // Set duration and frequency value from local storage 
    if(localStorage.getItem('shortfrequency'))
    {
        shortfrequency = localStorage.getItem('shortfrequency');
    }
    else
    {
        shortfrequency = 10;
    }
    if(localStorage.getItem('shortduration'))
    {
        shortduration = localStorage.getItem('shortduration');
    }
    else
    {
        shortduration = 10;
    }
    if(localStorage.getItem('longduration'))
    {
        longduration = localStorage.getItem('longduration');
    }
    else{
        longfrequency = 10;
    }
    if(localStorage.getItem('longfrequency'))
    {
        longfrequency = localStorage.getItem('longfrequency');
    }
    else
    {
        longfrequency = 10;
    }
    console.log(localStorage.getItem('shortfrequency'));
    console.log(localStorage.getItem('shortduration'));
    console.log(localStorage.getItem('longduration'));
    console.log(localStorage.getItem('longfrequency'));
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
    // Skip the current break and update no of skip variable;
    noOfSkips = noOfSkips + 1; 
    skip=1;
}
window.onload = function() {
    // Initialize variable with default value
    noOfSkips = 0;  
    skip = 0 ;
    updated = false;

    // create Timer function on load of the window 
	createTimer();
};

// Update message from the scheduler to update frequency and duration of short and long break
ipcRenderer.on('scheduler-to-timer',(event,arg)=>{
    localStorage.setItem('shortfrequency' , arg.shortfrequency);
    localStorage.setItem('shortduration' , arg.shortduration);
    localStorage.setItem('longduration' , arg.longduration);
    localStorage.setItem('longfrequency' , arg.longfrequency);    
    
    skip=1;          // to break the current running timer  
    updated=true;    // Set update variable to true 

    // update all duration and frequency with new values
    shortfrequency=arg.shortfrequency;
    shortduration=arg.shortduration;
    longduration=arg.longduration;
    longfrequency=arg.longfrequency;

});