let { remote } = require('electron')
let dialog = remote.dialog;
let mainWindow = remote.getCurrentWindow();

let selectFile = document.getElementById("selectFile");
let audio = null;

selectFile.onclick = async() => {
    let file = await dialog.showOpenDialog(mainWindow, {
        filters: [{
            name: "Music files",
            extensions: ["mp3", "wav", "mp4"],
        }, ],
    });
    console.log(file);
    console.log(file.filePaths[0]);
    document.getElementById('manan').href = file.filePaths[0];
    // audio = new Audio(file.filePaths[0]);
    // audio.play();
}

//const URL = require('url');

/*function handleFiles(event) {
    var files = event.target.files;
    console.log(URL.createObjectURL(files[0]))
    document.getElementById("#src").attr("src", URL.createObjectURL(files[0]));
    document.getElementById("audio").load();
}

document.getElementById("upload").addEventListener("change", handleFiles, false);*/