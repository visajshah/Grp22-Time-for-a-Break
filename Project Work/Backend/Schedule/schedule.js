const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

function sendItem()
{
    scheduleForm = document.forms["scheduleForm"];
    shortduration = scheduleForm["shortduration"].value;
    longduration = scheduleForm["longduration"].value;
    shortfrequency = scheduleForm["shortfrequency"].value;
    strictmode =document.getElementById("checkbox").checked;
    longfrequency = scheduleForm["longfrequency"].value;
    postduration = scheduleForm["postduration"].value;
    postlimit = scheduleForm["postlimit"].value;

    const data={
        shortduration ,
        longduration ,
        shortfrequency ,
        longfrequency ,
        strictmode,
        postduration ,
        postlimit   
    }
    ipcRenderer.send('message-from-scheduler',data);
}
