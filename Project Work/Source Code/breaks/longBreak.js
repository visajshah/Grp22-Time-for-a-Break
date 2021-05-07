const {ipcRenderer, remote} = require("electron")

const skipBtn = document.getElementById("skipBtn")

skipBtn.addEventListener('click', () => {
    ipcRenderer.send('Break-has-been-skipped')
})