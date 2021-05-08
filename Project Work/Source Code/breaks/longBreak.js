const { ipcRenderer } = require("electron")

const skipBtn = document.getElementById("skipBtn")
skipBtn.disabled = false;
skipBtn.style.display = "none";

let tmp_totallongbreak = localStorage.getItem('currtotallongbreak');
let currtotallongbreak = 0;
if(tmp_totallongbreak)
{
    currtotallongbreak = parseInt(tmp_totallongbreak);
}
currtotallongbreak = currtotallongbreak +1;
localStorage.setItem('currtotallongbreak',currtotallongbreak);

skipBtn.style.display = "block";
var strict_flg = false;
if (localStorage.getItem('strict')) {
    let strict_tmp = localStorage.getItem('strict');
    if (strict_tmp === "true") {
        strict_flg = true;
    } else {
        strict_flg = false;
    }
}

if (strict_flg === true) {
    skipBtn.style.display = "none";
}

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

function MusicClicked() {
    document.getElementById("Music").disabled = true;
    let musicStirng = localStorage.getItem('arr');
    let musicArray = JSON.parse(musicStirng);

    let temp = ['Audio.mp3'];
    if (musicArray === null) {
        musicArray = temp;
    }

    if (musicArray.length === 0) {
        alert('No music files are present');
        return;
    }
    let newMusic = document.createElement('audio');
    console.log(musicArray.length);
    // for (let i = 0; i < musicArray.length; i++) {
    //     document.getElementById(musicArray[i]).pause();
    //     document.getElementById(musicArray[i]).load();
    // }
    let ind = Math.floor(Math.random() * musicArray.length);

    newMusic.controls = 'controls';
    //temp.setAttribute('onclick', `fadeOutEffect(${i})`);
    let temp1 = document.createElement('source');
    temp1.src = musicArray[ind];
    newMusic.appendChild(temp1);
    newMusic.play();
    console.log(newMusic);
    fadeOutEffect();


    function fadeOutEffect() {

        // let audiosnippetId = musicArray[ind];
        // var sound = document.getElementById(audiosnippetId);

        // Set the point in playback that fadeout begins. This is for a 2 second fade out.
        let long_dur_str = localStorage.getItem('longduration');
        let long_dur = 1;
        if (long_dur_str) {
            long_dur = parseInt(long_dur_str);
        }
        var fadePoint = (long_dur*1000*60)-5000;

        var fadeAudio = setInterval(function() {
            // console.log(sound.volume);
            // Only fade if past the fade out point or not at zero already
            if ((newMusic.currentTime >= fadePoint) && (newMusic.volume > 0.0)) {
                newMusic.volume -= 0.1;
            }
            // When volume at zero stop all the intervalling
            if (newMusic.volume <= 0.1) {
                console.log("volume is zero");
                sound.pause();
                clearInterval(fadeAudio);
            }
        }, 200);

    }

}

let msg = document.getElementById('Idea')
let idea = randomidea();
msg.innerHTML = idea;

skipBtn.addEventListener('click', () => {
    skipBtn.disabled = true;
    skipBtn.style.display = 'none';
    let long_skip_num = 0;
    if (localStorage.getItem('long_skipped')) {
        let long_skip_tmp = localStorage.getItem('long_skipped');
        long_skip_num = parseInt(long_skip_tmp);
    }
    long_skip_num = long_skip_num + 1;
    localStorage.setItem('long_skipped', long_skip_num);
    ipcRenderer.send('Break-has-been-skipped')
})