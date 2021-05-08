let { ipcRenderer } = require("electron");

let selectFile = document.getElementById("selectFile");

let arr = ["Audio.mp3"];
let arr1 = localStorage.getItem("arr");
let arr2 = JSON.parse(arr1);
if (arr2 === null) {
  arr2 = arr;
}

let arrPath = ["Audio.mp3"];
let arr1Path = localStorage.getItem("arrPath");
let arr2Path = JSON.parse(arr1Path);

if (arr2Path === null) {
  arr2Path = arrPath;
}

var list = document.getElementById("music");

function Delete(value) {
  let index = -1;
  for (let i = 0; i < arr2.length; i++) {
    if (arr2[i] === value) {
      index = i;
      break;
    }
  }

  if (index !== -1) {
    list.removeChild(list.childNodes[index]);

    arr2.splice(index, 1);
    arr2Path.splice(index, 1);
    localStorage.setItem("arr", JSON.stringify(arr2));
    localStorage.setItem("arrPath", JSON.stringify(arr2Path));
    // mainWindow.reload();
  }
}

function showMusic() {
  for (let i = 0; i < arr2.length; i++) {
    let tmp = document.createElement("div");
    // tmp.style.border = "2px solid white";
    tmp.style.padding = "0rem 5rem";
    tmp.style.textAlign = "center";
    tmp.style.margin = "2rem 0rem";
    tmp.style.borderTop = "1px solid white";
    //tmp.setAttribute('onclick', `fadeOutEffect(${i})`);
    let nm = document.createElement("h3");
    nm.innerHTML = arr2[i];

    nm.style.color = "white";
    nm.style.fontSize = "2.0rem";
    nm.style.margin = "0.9rem 0rem";
    nm.style.fontWeight = "400";

    tmp.appendChild(nm);

    let temp = document.createElement("audio");
    temp.id = arr2[i];
    temp.controls = "controls";
    temp.style.width = "30rem";
    temp.style.height = "4rem";
    temp.style.display = "inline-block";
    temp.style.marginRight = "5rem";
    //temp.setAttribute('onclick', `fadeOutEffect(${i})`);
    let temp1 = document.createElement("source");
    temp1.src = arr2Path[i];
    temp.appendChild(temp1);
    tmp.appendChild(temp);

    let but = document.createElement("button");
    but.id = arr2[i];

    but.style.padding = "0.8rem 1rem";
    but.style.margin = "0rem";
    but.innerHTML = "X";
    // but.style.display = "inline-block";
    but.style.position = "relative";
    but.style.top = "-1.2rem";

    but.type = "button";
    but.className = "btn btn-danger";
    but.setAttribute("onclick", `Delete(` + `'` + `${arr2[i]}` + `')`);

    tmp.appendChild(but);

    // document.getElementsByTagName('div')[1].appendChild(tmp);
    list.appendChild(tmp);
  }
}

selectFile.onclick = async () => {
  let msg = "Choose File";
  ipcRenderer.send("message-on-music-channel", msg);
};

ipcRenderer.on("piggy-back-from-main", (event, arg) => {
  arr2 = JSON.parse(localStorage.getItem("arr"));
  arr2Path = JSON.parse(localStorage.getItem("arrPath"));
  let tmp = document.createElement("div");
  tmp.id = "music_row";
  tmp.style.padding = "0rem 5rem";
  tmp.style.textAlign = "center";
  tmp.style.margin = "2rem 0rem";
  tmp.style.borderTop = "1px solid white";

  let nm = document.createElement("h3");
  nm.style.color = "white";
  nm.style.fontSize = "2.0rem";
  nm.style.margin = "0.9rem 0rem";
  nm.style.fontWeight = "400";
  nm.innerHTML = arr2[arr2.length - 1];
  tmp.appendChild(nm);

  let temp = document.createElement("audio");
  temp.id = arr2[arr2.length - 1];
  temp.controls = "controls";
  let temp1 = document.createElement("source");
  temp1.src = arr2Path[arr2Path.length - 1];
  temp.appendChild(temp1);
  tmp.appendChild(temp);
  temp.style.width = "30rem";
  temp.style.height = "4rem";
  temp.style.display = "inline-block";
  temp.style.marginRight = "5rem";

  let but = document.createElement("button");
  but.id = arr2[arr2.length - 1];

  but.style.padding = "0.8rem 1rem";
  but.style.margin = "0rem";
  but.innerHTML = "X";
  // but.style.display = "inline-block";
  but.style.position = "relative";
  but.style.top = "-1.2rem";

  but.type = "button";
  but.className = "btn btn-danger";
  but.setAttribute(
    "onclick",
    `Delete(` + `'` + `${arr2[arr2.length - 1]}` + `')`
  );
  but.innerHTML = "X";
  tmp.appendChild(but);
  // document.getElementsByTagName('div')[1].appendChild(tmp);
  list.appendChild(tmp);
});

showMusic();
