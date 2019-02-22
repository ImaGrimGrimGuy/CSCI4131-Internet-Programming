//------------------------------------------------Form------------------------------------------------
function formValidation() {
  var eventname = document.forms["form"]["eventname"].value;
  var starttime = document.forms["form"]["starttime"].value;
  var endtime = document.forms["form"]["endtime"].value;
  var location = document.forms["form"]["location"].value;
  var day = document.forms["form"]["day"].value;

  if (!isWord(eventname) && !isNumber(eventname)) {
    window.alert("Event name must be alphanumeric.")
    return false;
  }
  if (!isWord(location) && !isNumber(location)){
    window.alert("Event location must be alphanumeric.")
    return false;
  }
};

function isWord(text) {
  var lettr, i;  

  for (i = 0; i < text.length; i++) {
    lettr = text.charCodeAt(i);
    if (!(lettr > 64 && lettr < 91) &&
        !(lettr > 96 && lettr < 123)) {
      return false;
    }
  }
  return true;
};

function isNumber(text) {
  var lettr, i;  

  for (i = 0; i < text.length; i++) {
    lettr = text.charCodeAt(i);
    if (!(lettr > 47 && lettr < 58)) {
      return false;
    }
  }
  return true;
};
//-----------------------------------------------Calendar---------------------------------------------
function showthumbnail(text,elem) {
  // create new element on mouse overjavascript
  var x = document.createElement("IMG");
  x.src = text;
  x.style.width = "50px";
  x.style.height = "50px";
  elem.appendChild(x);
  updateBillboard(text);
}

function hidethumbnail(elem) {
  // remove child element from table cell
  elem.removeChild(elem.childNodes[elem.childNodes.length - 1]);
}

function updateBillboard(text) {
  var x = document.getElementById('billboard');
  x.src = text;
  x.style.visibility = "visible";
}

function ImageCall(){
  var url = "https://localhost:9002"
}

function SoundCall(){
}

function ImageandSoundCall(){
}

//-----------------------------------------------Widgets----------------------------------------------
function updateBoard() {
  var game = document.getElementById('tictactoe');
  var index = game.getElementsByTagName('SELECT')[1].selectedIndex;
  var board = game.getElementsByTagName('TABLE')[0];
  var rowindex = 0;
  var cellindex = 0;


  if (!gameWon()) {
    if (index < 3) {
      cellindex = index;
    }
  
    if (index >= 3) {
      rowindex = 1;
      cellindex = index - 3;
    }
  
    if (index >= 6) {
      rowindex = 2;
      cellindex = index - 6;
    }
  
    board.rows[rowindex].cells[cellindex].innerHTML = "[" + game.getElementsByTagName('SELECT')[0].value + "]";
    
    if (game.getElementsByTagName('SELECT')[0].value == "X"){
      board.rows[rowindex].cells[cellindex].style.backgroundColor = "red";
    } else {
      board.rows[rowindex].cells[cellindex].style.backgroundColor = "blue";  
    }
    if (gameWon()) {
      window.alert("Looks like somebody won.")
    }
  } else {
    window.alert("No more moves can be made.");
  }
}

function gameWon(){
  var grid = document.getElementById('tictactoe').getElementsByTagName('TABLE')[0];
  var row1win = (grid.rows[0].cells[0].innerHTML==grid.rows[0].cells[1].innerHTML)
              &&(grid.rows[0].cells[1].innerHTML==grid.rows[0].cells[2].innerHTML)
              &&(grid.rows[0].cells[0].innerHTML != '[ ]')
              &&(grid.rows[0].cells[1].innerHTML != '[ ]')
              &&(grid.rows[0].cells[2].innerHTML != '[ ]');
  var row2win = (grid.rows[1].cells[0].innerHTML==grid.rows[1].cells[1].innerHTML)
              &&(grid.rows[1].cells[1].innerHTML==grid.rows[1].cells[2].innerHTML)
              &&(grid.rows[1].cells[0].innerHTML != '[ ]')
              &&(grid.rows[1].cells[1].innerHTML != '[ ]')
              &&(grid.rows[1].cells[2].innerHTML != '[ ]');
  var row3win = (grid.rows[2].cells[0].innerHTML==grid.rows[2].cells[1].innerHTML)
              &&(grid.rows[2].cells[1].innerHTML==grid.rows[2].cells[2].innerHTML)
              &&(grid.rows[2].cells[0].innerHTML != '[ ]')
              &&(grid.rows[2].cells[1].innerHTML != '[ ]')
              &&(grid.rows[2].cells[2].innerHTML != '[ ]');
  var col1win = (grid.rows[0].cells[0].innerHTML==grid.rows[1].cells[0].innerHTML)
              &&(grid.rows[1].cells[0].innerHTML==grid.rows[2].cells[0].innerHTML)
              &&(grid.rows[0].cells[0].innerHTML != '[ ]')
              &&(grid.rows[1].cells[0].innerHTML != '[ ]')
              &&(grid.rows[2].cells[0].innerHTML != '[ ]');
  var col2win = (grid.rows[0].cells[1].innerHTML==grid.rows[1].cells[1].innerHTML)
              &&(grid.rows[1].cells[1].innerHTML==grid.rows[2].cells[1].innerHTML)
              &&(grid.rows[0].cells[1].innerHTML != '[ ]')
              &&(grid.rows[1].cells[1].innerHTML != '[ ]')
              &&(grid.rows[2].cells[1].innerHTML != '[ ]');
  var col3win = (grid.rows[0].cells[2].innerHTML==grid.rows[1].cells[2].innerHTML)
              &&(grid.rows[1].cells[2].innerHTML==grid.rows[2].cells[2].innerHTML)
              &&(grid.rows[0].cells[2].innerHTML != '[ ]')
              &&(grid.rows[1].cells[2].innerHTML != '[ ]')
              &&(grid.rows[2].cells[2].innerHTML != '[ ]');;
  var diagforwin = (grid.rows[0].cells[0].innerHTML==grid.rows[1].cells[1].innerHTML)
                 &&(grid.rows[1].cells[1].innerHTML==grid.rows[2].cells[2].innerHTML)
                 &&(grid.rows[0].cells[0].innerHTML != '[ ]')
                 &&(grid.rows[1].cells[1].innerHTML != '[ ]')
                 &&(grid.rows[2].cells[2].innerHTML != '[ ]');
  var diagbackwin = (grid.rows[0].cells[2].innerHTML==grid.rows[1].cells[1].innerHTML)
                  &&(grid.rows[1].cells[1].innerHTML==grid.rows[2].cells[0].innerHTML)
                  &&(grid.rows[0].cells[2].innerHTML != '[ ]')
                  &&(grid.rows[1].cells[1].innerHTML != '[ ]')
                  &&(grid.rows[2].cells[0].innerHTML != '[ ]');

  if (row1win || row2win || row3win || 
      col1win || col2win || col3win ||
      diagforwin || diagbackwin) {
    return true;
  }
    return false;
}

function reset() {
  var board = document.getElementById('tictactoe').getElementsByTagName('TABLE')[0];
  var j = 0;
  var i = 0;
  for (i = 0; i < 3; i++) {
    for (j = 0; j < 3; j++) {
      board.rows[i].cells[j].style.backgroundColor = "#00faff";
      board.rows[i].cells[j].innerHTML = "[ ]";
    }
  }
}

function transate(string) {
  switch(string) {
    case "One":
      return '1';
    case "Two":
      return '2';
    case "Three":
      return '3';
    case "Four":
      return '4';
    case "Five":
      return '5';
    case "Six":
      return '6';
    case "Seven":
      return '7';
    case "Eight":
      return '8';
    case "Nine":
      return '9';
  }
}
