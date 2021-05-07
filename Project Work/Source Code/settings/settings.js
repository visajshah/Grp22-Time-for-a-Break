const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

var notifi_tmp = localStorage.getItem('notifi');
var strict_tmp = localStorage.getItem('strict');

var notifi=true, strict=false;

if(notifi_tmp)
{
    if(notifi_tmp === "true")
    {
        notifi= true;
    }
    else{
        notifi = false;
    }
}
if(strict_tmp)
{
    if(strict_tmp === "true")
    {
        strict= true;
    }
    else{
        strict = false;
    }
}

function byDefault() {

    if (notifi === true) {
        document.getElementById("notification").setAttribute('checked', 'checked');
    } else {
        document.getElementById("notification").removeAttribute('checked');
    }

    if (strict === true) {
        document.getElementById("strictMode").setAttribute('checked', 'checked');
    } else {
        document.getElementById("strictMode").removeAttribute('checked');
    }

}
byDefault();

var notifBtn = document.getElementById("notification");
var strictBtn = document.getElementById("strictMode");

notifBtn.addEventListener('click', () => {
    notifi = !notifi;
    localStorage.setItem('notifi', notifi);
    ipcRenderer.send('settings has been changed to Main');
})

strictBtn.addEventListener('click', () => {
    strict = !strict;
    localStorage.setItem('strict', strict);
    ipcRenderer.send('settings has been changed to Main');
})