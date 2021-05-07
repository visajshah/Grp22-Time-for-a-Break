const {ipcRenderer, remote} = require("electron")

const skipBtn = document.getElementById("skipBtn")

function randomidea() {
    let defaultIdeas = ["Go grab a glass of water.",
        "Slowly look all the way left, then right.",
        "Slowly look all the way up, then down.",
        "Close your eyes and take few deep breaths.",
        "Stand from your chair and stretch.",
        "Close your eyes and count your breaths.",
        "Take a moment to smile at being alive."
    ];
    let IdeasArray = new Array();
    IdeasArray = JSON.parse(localStorage.getItem('Ideas'));

    if (IdeasArray === null) {
        IdeasArray = defaultIdeas;
    }
    let index = Math.floor(Math.random() * IdeasArray.length);
    return IdeasArray[index];
}

let msg = document.getElementById('Idea')
let idea = randomidea();
msg.innerHTML = idea;

skipBtn.addEventListener('click', () => {
    ipcRenderer.send('Break-has-been-skipped')
})