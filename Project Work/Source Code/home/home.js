const {ipcRenderer} = require("electron");

const startBtn = document.getElementById('startBtn')
const endBtn = document.getElementById("endBtn")

startBtn.addEventListener('click', () => {
    ipcRenderer.send('Start The Session');
})

endBtn.addEventListener('click', () => {
    ipcRenderer.send('End The Session');
})