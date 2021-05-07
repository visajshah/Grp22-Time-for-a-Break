const { ipcRenderer } = require('electron');
var shortduration = 10;    // time of Short break duration 
var longduration = 10;     // time of long break duration
var shortfrequency = 10;   // time of short break frequency
var longfrequency = 10;    // time of long break frequency

const micTosec = 1000;  // convert microsecond to second 
var skip = 0;           // intialize skip with zero 
let updated = false;    // intialize updated varibale to false
let noOfSkips = 0;     // Total number of skip during this session

let t1 = 5*micTosec, t2 = 2*micTosec;

var notifi_flg = true, strict_flg = false;

function updateSetting() {


    if (window.localStorage.getItem('notifi')) {
        var notifi_tmp = window.localStorage.getItem('notifi');    
        if(notifi_tmp)
        {
            console.log("condition",notifi_tmp === "true");
            console.log(notifi_tmp,typeof(notifi_tmp))
            if(notifi_tmp === "true")
            {
                notifi_flg = true;
            }
            else{
                notifi_flg = false;
            }
        }
    }
    if (window.localStorage.getItem('strict')) {
        var strict_tmp = window.localStorage.getItem('strict');
        if(strict_tmp)
        {
            if(strict_tmp === "true")
            {
                strict_flg= true;
            }
            else{
                strict_flg = false;
            }
        }
    }    
}

function sendMessage(message) {
    console.log("type of strict flg =>", typeof(strict_flg), strict_flg);
	ipcRenderer.send(message,strict_flg);
}

function mytimer(message, duration) {

    let startTime = Date.now();
    let endTime  = startTime + duration;
    let flg = ((message==="your short break ends") || (message==="your long break ends"));
    let flg1 = (message==="your short break starts") || (message==="your long break starts");
    let notif_done = false, terminated = false;
    skip=0;

    console.log("From Timmer")
    console.log(startTime,endTime,duration,t1,t2);

    return new Promise((resolve) => {
        let tmp = setInterval(()=>{
            let notification;
                if (Date.now()>=endTime-t1 && flg1 && !notif_done)
                {
                    console.log("notification start")
                    // let msg = "Start Notif";
                    notif_done = true;
                    // resolve(sendMessage(msg));
                    console.log("notifiction timer flag",notifi_flg);
                    if (notifi_flg) {
                        notification = new Notification('Break Reminder', {
                            body: 'Your Next break will start in 5 seconds',
                        })
                    }
                }

                if (Date.now()>=endTime-t2 && flg1 && notif_done && !terminated)
                {
                    terminated = true;
                }


                if(Date.now()>=endTime || updated || skip==1)
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