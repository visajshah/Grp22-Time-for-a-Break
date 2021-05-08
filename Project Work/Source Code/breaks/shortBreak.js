const { ipcRenderer } = require("electron")
const skipBtn = document.getElementById("skipBtn")
skipBtn.disabled = false;
skipBtn.style.display = "none";

let tmp_totalshortbreak = localStorage.getItem('currtotalshortbreak');
let currtotalshortbreak = 0;
if(tmp_totalshortbreak)
{
    currtotalshortbreak = parseInt(tmp_totalshortbreak);
}
currtotalshortbreak = currtotalshortbreak +1;
localStorage.setItem('currtotalshortbreak',currtotalshortbreak);

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

// skipBtn.innerHTML = strict_flg;

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
    
    fadeOutEffect();


    function fadeOutEffect() {

        // let audiosnippetId = musicArray[ind];
        // var sound = document.getElementById(audiosnippetId);

        // Set the point in playback that fadeout begins. This is for a 2 second fade out.
        let short_dur_str = localStorage.getItem('shortduration');
        let short_dur = 1;
        if (short_dur_str) {
            short_dur = parseInt(short_dur_str);
        }
        var fadePoint = (short_dur*1000*60) - 5000;

        var fadeAudio = setInterval(function() {
            // console.log(sound.volume);
            // Only fade if past the fade out point or not at zero already
            if ((newMusic.currentTime >= fadePoint) && (newMusic.volume > 0.0)) {
                newMusic.volume -= 0.1;
            }
            // When volume at zero stop all the intervalling
            if (newMusic.volume <= 0.1) {
                
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
    let skip_num = 0;
    if (localStorage.getItem('short_skipped')) {
        let skip_tmp = localStorage.getItem('short_skipped');
        skip_num = parseInt(skip_tmp);
    }
    skip_num = skip_num + 1;
    localStorage.setItem('short_skipped', skip_num);
    ipcRenderer.send('Break-has-been-skipped')
})