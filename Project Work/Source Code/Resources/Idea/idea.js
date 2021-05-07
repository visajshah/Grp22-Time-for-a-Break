let{remote}=require('electron')
let mainWindow = remote.getCurrentWindow();
const fs = require('fs');
const { inherits } = require('util');



var ideas_index = 0;
var ideasArray = new Array();
function checkInputText(value,msg) {
    if(value == null || value == ""){
        alert(msg);
        return true;
    }
    return false;
}
function init () {
    fs.readFileSync('./ideas.json',fileData =>{
        ideasArray = JSON.parse(fileData);
    })
    console.log(ideasArray);
    for(var i=0;i<ideasArray.length;i++){
        preoloadaddIdeasToPage(ideasArray[i].idea);
    }
}
function saveJSON() {
    var IdeasJSON = JSON.stringify(ideasArray);
    fs.writeFile('./ideas.json', IdeasJSON, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}
function removeItemOnce(value) {
    const index = ideasArray.findIndex(x => x.idea === value);
    if (index !== undefined) ideasArray.splice(index, 1);
    saveJSON();
}
function preoloadaddIdeasToPage(idea) {
    var table = document.getElementById("ideaList");
    var tr = document.createElement("tr");

    ideas_index++;

    tr.id = "idea-" + ideas_index;
    console.log(ideas_index);
    //var idea = document.getElementById("htmlIdea").value;

    tr.innerHTML = "\
    <td><input name='select-row' type='checkbox' value ='"+ ideas_index +"'></td>\
    <td>"+ idea + "<td>\
    <td><button onclick = 'removeIdea("+ideas_index+");'>X</button></td>";
    table.appendChild(tr);
}

function addIdeasToPage() {
    var table = document.getElementById("ideaList");
    var tr = document.createElement("tr");

    ideas_index++;

    tr.id = "idea-" + ideas_index;
    //console.log(ideas_index);
    var idea = document.getElementById("htmlIdea").value;

    tr.innerHTML = "\
    <td><input name='select-row' type='checkbox' value ='"+ ideas_index +"'></td>\
    <td>"+ idea + "<td>\
    <td><button onclick = 'removeIdea("+ideas_index+");'>X</button></td>";
    table.appendChild(tr);
    ideasArray.push({"idea":idea});
    saveJSON();
}

function removeIdea(index) {
    // Get the element.
    var row = document.getElementById('idea-' + index);
    var value = row.cells[1].innerText;
    console.log(value);
    //var value = document.querySelector('#idea'+index).value;

    // If we were able to find a row matching that id.
    if (row) {
        // Access row's parent node (tbody) and remove the row.
        row.parentNode.removeChild(row);
        removeItemOnce(value);
        
    }
}

function removeSelectedIdeas(params) {
    var rowsToRemove = document.querySelectorAll('input[name=select-row]:checked');

    for (var i = 0; i < rowsToRemove.length; i++) {
        // Delete the row.
        removeIdea(rowsToRemove[i].value);
    }
}

function toggleSelection(checkbox) {
    // Get our rows.
    var rowsToSelect = document.querySelectorAll('input[name=select-row]');

    for (var i = 0; i < rowsToSelect.length; i++) {
        // Check or uncheck boxes if the 'master' checkbox is checked.
        rowsToSelect[i].checked = checkbox.checked;
    }
}



