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
}

function hidethumbnail(elem) {
  // remove child element from table cell
  elem.removeChild(elem.childNodes[elem.childNodes.length - 1]);
}

function Entry(names,address) {
  this.Names = names;
  this.Address = address;
}

function initMap() {
  //make map
  var myLatLng = {lat: 44.977276, lng:-93.232266};
  map = new google.maps.Map(document.getElementById('map'), {
  center: myLatLng,
  zoom: 14
  });
  var addresslist = getMarkersText();
  var geocoder = new google.maps.Geocoder();
  
  for (var i = 0; i < addresslist.length; i++) {
    createClassMarker(addresslist[i].Names,addresslist[i].Address, map, geocoder);
  }

  //get user location
  var userloc = null; //= new google.maps.LatLng(44.977276,-93.232266);
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
          userloc = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
          };
      }, function () {
          handleLocationError(true, infoWindow, map.getCenter());
      });
  }
  //safeguard for when google craps out, which it often does
  if (userloc == null) {
    userloc = map.center;
  }

  //option for local search
  var togglein = document.getElementById('mapform').getElementsByTagName('SELECT')[0].selectedIndex;
  if( document.getElementById('mapform').getElementsByTagName('SELECT')[0].options[togglein].innerHTML == "on"){
    var crit = document.getElementById('mapform').getElementsByTagName('SELECT')[1].selectedIndex;
    var typetag = document.getElementById('mapform').getElementsByTagName('SELECT')[1].options[crit].innerHTML;
    //add search elements
    var request = {
      location: userloc,
      radius: '1000',
      type: [typetag]
    };
  
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, loccallback);
  }

  //getting directions
  if(document.getElementById('mapform').getElementsByTagName('INPUT')[1].value !== ""){
    
  }
}

function loccallback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        var place = results[i];
        createMarker(results[i],map);
      }
    }
  }

function getMarkersText(){
  var calendar = document.getElementById('calendar');
  var placelist = [];
  for (var i = 0; i < calendar.rows.length; i++){
    for (var j = 1; j < calendar.rows[i].cells.length; j++){
      if (calendar.rows[i].cells[j].getElementsByTagName('p')[0].innerHTML !== " - "){
        var classname;
        var address;
        classname = calendar.rows[i].cells[j].getElementsByTagName('p')[1].innerHTML;
        address = calendar.rows[i].cells[j].getElementsByTagName('p')[3].innerHTML;
        insert(classname,address,placelist);
      }
    }
  }
  return placelist;
}

function insert(classname,address,list){
  var obj = new Entry([classname],address);
  var foundadd = false;
  var foundname = false;
  if(list.length == 0){
    list.push(obj);
  }
  else{
    for(var i = 0 ; i < list.length ; i++){
      if (address == list[i].Address){
        foundadd = true;
        for(var j = 0 ; j < list[i].Names.length ; j++){
          if(classname == list[i].Names[j]){
            foundname = true;
          }
        }
        if(!foundname){
          list[i].Names.push(classname);
        }
      }
    }
    if(!foundadd){
      list.push(obj);
    }
  }
}

function createMarker(entity,resultsMap){
  var marker = new google.maps.Marker({
    map: resultsMap,
    position: entity.geometry.location
  });
  var infowindow = new google.maps.InfoWindow({content: entity.name});
  marker.addListener('mouseover', function() 
        { infowindow.open(map, this); });
  marker.addListener('mouseout', function() {setTimeout(() => 
        infowindow.close(),100)})
}

function createClassMarker(names, address, resultsMap, geocoder){
  geocoder.geocode({'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var marker = new google.maps.Marker({map: resultsMap,
                                        position: results[0].geometry.location,
                                        title:address,
                                        icon: "smugboi.png"
                                       });

    var classstring = "Classes: <p>";
    for(var i = 0 ; i < names.length ; i++){
      classstring = classstring + names[i] + '<p>';
    }
    var contentString = '<div id="content">' +
      '<div id="bodyContent">' +
      address +
      '<p> ' + classstring + ' <p>' +
      '</div>' +
      '</div>';    


      var infowindow2 = new google.maps.InfoWindow({content: contentString});
      marker.addListener('mouseover', function() 
        { infowindow2.open(map, this); });
      marker.addListener('mouseout', function() {setTimeout(() => 
        infowindow2.close(),100)})
    }
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    } 
  });

  
}



//-----------------------------------------------Widgets----------------------------------------------
function updateBoard() {
  var game = document.getElementById('tictactoe');
  var index = game.getElementsByTagName('SELECT')[1].selectedIndex;
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
