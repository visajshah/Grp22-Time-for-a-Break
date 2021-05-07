const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

// Send Update duration and frequency to timer function 
function sendItem()
{
    scheduleForm = document.forms["scheduleForm"];
    shortduration = scheduleForm["shortduration"].value;
    longduration = scheduleForm["longduration"].value;
    shortfrequency = scheduleForm["shortfrequency"].value;
    longfrequency = scheduleForm["longfrequency"].value;

    const data={
        shortduration ,
        longduration ,
        shortfrequency ,
        longfrequency 
    }
    console.log(data);
    ipcRenderer.send('message-from-scheduler',data);
}
