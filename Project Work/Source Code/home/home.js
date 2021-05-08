const {ipcRenderer, Notification} = require("electron");

const startBtn = document.getElementById('startBtn')
const endBtn = document.getElementById("endBtn")

let tmp_runningSession = localStorage.getItem('running_session');
let running_session = false;
if(tmp_runningSession)
{
    if(tmp_runningSession==="true")
    {
        running_session=true;
    }
    else
    {
        running_session = false;
    }
}
localStorage.setItem('running_session',running_session);
if(running_session)
{
    startBtn.disabled = true;
    endBtn.disabled = false;
    startBtn.style.display = 'none';
    endBtn.style.display = 'block';
    // startBtn.innerText = "Session started";
}
else
{
    startBtn.disabled = false;
    endBtn.disabled = true;
    endBtn.style.display = 'none';
    startBtn.style.display = 'block';
}

startBtn.addEventListener('click', () => {
    startBtn.disabled = true;
    endBtn.disabled = false; 
    startBtn.style.display = 'none';
    endBtn.style.display = 'block';
    localStorage.setItem('running_session',true);
    ipcRenderer.send('Start The Session');
})

endBtn.addEventListener('click', () => {
    endBtn.disabled = true;
    startBtn.disabled =false; 
    endBtn.style.display = 'none';
    startBtn.style.display = 'block';
    localStorage.setItem('running_session',false);
    
    let prev_short_skipped = 0;
    if(localStorage.getItem('short_skipped'))
    {
        prev_short_skipped = parseInt(localStorage.getItem('short_skipped')); 
    }
    let prev_long_skipped =  0;
    if(localStorage.getItem('long_skipped'))
    {
      prev_long_skipped = parseInt(localStorage.getItem('long_skipped'));

    }
    let prev_startSession = Date.now();
    if(localStorage.getItem('currstarttime'))
    {
        prev_startSession = parseInt(localStorage.getItem('currstarttime'));
    }
    let prev_endSession = Date.now();

    let prev_totalshortbreak = 0;
    if(localStorage.getItem('currtotalshortbreak'))
    {
        prev_totalshortbreak = parseInt(localStorage.getItem('currtotalshortbreak'));
    }

    let prev_totallongbreak = 0;
    if(localStorage.getItem('currtotallongbreak'))
    {
        prev_totallongbreak = parseInt(localStorage.getItem('currtotallongbreak'));
    }

    
    localStorage.setItem('prev_short_skipped',prev_short_skipped);
    localStorage.setItem('prev_long_skipped', prev_long_skipped);
    localStorage.setItem('prev_starttime',prev_startSession);
    localStorage.setItem('prev_endtime',prev_endSession);
    localStorage.setItem('prev_totalshortbreak',prev_totalshortbreak);
    localStorage.setItem('prev_totallongbreak',prev_totallongbreak);
    

    ipcRenderer.send('End The Session');
})