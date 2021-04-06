let { remote } = require('electron')
let dialog = remote.dialog;
let mainWindow = remote.getCurrentWindow();

let selectFile = document.getElementById("selectFile");
let audio = null;
let arr = ['Audio.mp3'];

/*
arr = ['dskdm', 'ksas', 'scsc'];
*/


selectFile.onclick = async() => {
    let file = await dialog.showOpenDialog(mainWindow, {
        filters: [{
            name: "Music files",
            extensions: ["mp3", "wav", "mp4"],
        }, ],
    });
    //console.log(file);
    //console.log(file.filePaths[0]);
    arr.push(file.filePaths[0])
    console.log(arr.length);
    console.log(arr);
    document.getElementById('manan').href = file.filePaths[0];
    document.getElementById('playlist').innerHTML = arr.join('<br>');
    let temp = document.createElement('a')
    temp.href = file.filePaths[0]
    temp.innerHTML = 'xyz';
    console.log(temp);
    document.getElementsByTagName('body')[0].appendChild(temp);
    //document.getElementById('playlist').href = arr.join('<br>');
    //document.getElementById('playlist').href = file.filePaths[0];
    // audio = new Audio(file.filePaths[0]);
    // audio.play();
}
