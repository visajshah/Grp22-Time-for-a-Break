var notifi = localStorage.getItem('notifi');
var donot = localStorage.getItem('donot');
var strict = localStorage.getItem('strict');

function byDefault() {

    if (notifi == "true") {
        document.getElementById("notification").setAttribute('checked', 'checked');
    } else {
        document.getElementById("notification").removeAttribute('checked');
    }

    if (donot == "true") {
        document.getElementById("doNot").setAttribute('checked', 'checked');
    } else {
        document.getElementById("doNot").removeAttribute('checked');
    }

    if (strict == "true") {
        document.getElementById("strictMode").setAttribute('checked', 'checked');
    } else {
        document.getElementById("strictMode").removeAttribute('checked');
    }

}
byDefault();

function Notifi() {
    notifi = !notifi;
    localStorage.setItem('notifi', notifi);
}

function doNot() {
    donot = !donot;
    localStorage.setItem('donot', donot);
}

function SM() {
    strict = !strict;
    localStorage.setItem('strict', strict);
}