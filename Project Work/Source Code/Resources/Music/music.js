let { remote } = require('electron')
const fs = require('fs');
const path = require('path');
let dialog = remote.dialog;
let mainWindow = remote.getCurrentWindow();

let selectFile = document.getElementById('selectFile');
let audio = null;

let arr = ['Audio.mp3'];
let arr1 = localStorage.getItem('arr');
let arr2 = JSON.parse(arr1);
if (arr2 === null) {
    arr2 = arr;
}

let arrPath = ['Audio.mp3'];
let arr1Path = localStorage.getItem('arrPath');
let arr2Path = JSON.parse(arr1Path);
if (arr2Path === null) {
    arr2Path = arrPath;
}

var list = document.getElementById('music');

function Delete(index) {
    if (index == 0) {
        alert('YOU CANNOT REMOVE THE DEFAULT FILE');
        return;
    } else {
        // console.log(fileName);
        // console.log(arr2Path[fileName]);
        list.removeChild(list.childNodes[index]);

        arr2.splice(index, 1);
        arr2Path.splice(index, 1);
        localStorage.setItem('arr', JSON.stringify(arr2));
        localStorage.setItem('arrPath', JSON.stringify(arr2Path));
        mainWindow.reload();
    }
}

function showMusic() {
    for (let i = 0; i < arr2.length; i++) {
        let tmp = document.createElement('div');
        tmp.className = "mb-2 mx-3";
        //tmp.setAttribute('onclick', `fadeOutEffect(${i})`);
        let nm = document.createElement('h3');
        nm.innerHTML = arr2[i];
        tmp.appendChild(nm);

        let temp = document.createElement('audio')
        temp.id = arr2[i];
        temp.controls = 'controls';
        //temp.setAttribute('onclick', `fadeOutEffect(${i})`);
        let temp1 = document.createElement('source');
        temp1.src = arr2Path[i];
        temp.appendChild(temp1);
        tmp.appendChild(temp);

        let br = document.createElement('br');
        tmp.appendChild(br);
        let but = document.createElement('button');
        but.id = arr2[i];
        but.type = 'button';
        but.className = 'btn btn-danger';
        but.setAttribute('onclick', `Delete(${i})`);
        but.innerHTML = 'DELETE';
        tmp.appendChild(but);

        if (i != 0) {
            let br = document.createElement('br');
            tmp.appendChild(br);
            let but = document.createElement('button');
            but.id = arr2[i];
            but.type = 'button';
            but.className = 'btn btn-danger';
            but.setAttribute('onclick', `Delete(${i})`);
            but.innerHTML = 'DELETE';
            tmp.appendChild(but);
        }

        document.getElementsByTagName('div')[0].appendChild(tmp);
    }
}


selectFile.onclick = async() => {
    let file = await dialog.showOpenDialog(mainWindow, {
        filters: [{
            name: 'Music files',
            extensions: ['mp3', 'wav'],
        }, ],
    });
    if (file.filePaths[0] == undefined) {
        console.log('File undefined');
    } else {
        console.log('File Defined');

        var fileName = file.filePaths[0].replace(/^.*[\\\/]/, '')

        for (let i = 0; i < arr2.length; i++) {
            if (arr2[i] == fileName) {
                alert('THIS FILE ALREADY EXISTS');
                return;
            }
        }
        arr2.push(fileName);
        arr2Path.push(file.filePaths[0]);


        let tmp = document.createElement('div');

        let nm = document.createElement('h3');
        nm.innerHTML = arr2[arr2.length - 1];
        tmp.appendChild(nm);

        let temp = document.createElement('audio');
        temp.id = arr2[arr2.length - 1];
        //temp.setAttribute('onclick', `fadeOutEffect(${arr2[arr2.length - 1]})`);
        temp.controls = 'controls';
        let temp1 = document.createElement('source');
        temp1.src = file.filePaths[0];
        temp.appendChild(temp1);
        tmp.appendChild(temp);

        let but = document.createElement('button');
        but.id = arr2[arr2.length - 1];
        but.type = 'button';
        but.className = 'btn btn-danger';
        but.setAttribute('onclick', `Delete(${arr2[arr2.length - 1]})`);
        but.innerHTML = 'DELETE';
        tmp.appendChild(but);

        document.getElementsByTagName('div')[0].appendChild(tmp);


        localStorage.setItem('arr', JSON.stringify(arr2));
        localStorage.setItem('arrPath', JSON.stringify(arr2Path));

        mainWindow.reload();
    }
}


showMusic();