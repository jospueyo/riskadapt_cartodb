var map = L.map('map').setView([42.05,3.07], 10);

L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
        }).addTo(map);

function orto_layer(){
  return   L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains:['mt0','mt1','mt2','mt3']
          }).addTo(map);
};

function map_layer(){
  return L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
          maxZoom: 20,
          subdomains:['mt0','mt1','mt2','mt3']
        }).addTo(map);
};

// Add Data from CARTO using the SQL API
// Declare Variables
// Create Global Variable to hold CARTO points
var cartoDBPoints = null;

// Set your CARTO Username
var cartoDBusername = 'jospueyo';

// Write SQL Selection Query to be Used on CARTO Table
// Name of table is 'data_collector'
var sqlQuery = "SELECT * FROM riskadapt";

// Get CARTO selection as GeoJSON and Add to Map
function getGeoJSON(){
  $.getJSON("https://"+cartoDBusername+".cartodb.com/api/v2/sql?format=GeoJSON&q="+sqlQuery, function(data) {
    cartoDBPoints = L.geoJson(data,{
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng);
        marker.bindPopup(
          'Nom: '+feature.properties.name+
          '<br>Any: '+feature.properties.year+
          '<br>Descripció: '+feature.properties.description+
          '<br>Tipus: '+feature.properties.type+
          '<br>Risc: '+feature.properties.risk+
          '<br>Enllaç:<a href="'+feature.properties.link+'" target="_blank">'+feature.properties.link+'</a>'
        );
        return marker;
      }
    }).addTo(map);
  });
};

// Run showAll function automatically when document loads
$( document ).ready(function() {
  getGeoJSON();
});

// Create Leaflet Draw Control for the draw tools and toolbox
var drawControl = new L.Control.Draw({
  draw : {
    polygon : false,
    polyline : false,
    rectangle : false,
    circle : false,
    circlemarker: false
  },
  edit : false,
  remove: false
});

// Boolean global variable used to control visiblity
var controlOnMap = false;

// Create variable for Leaflet.draw features
var drawnItems = new L.FeatureGroup();

// Function to add the draw control to the map to start editin
function startEdits(){
  if(controlOnMap == true){
    map.removeControl(drawControl);
    controlOnMap = false;
  }
  map.addControl(drawControl);
  controlOnMap = true;
};

// Function to remove the draw control from the map
function stopEdits(){
  if(controlOnMap == true){
    map.removeControl(drawControl);
    controlOnMap = false;
  }else{
    alert("L'edició ja està aturada")
  };
};

// Use the jQuery UI dialog to create a dialog and set options
var dialog = $("#dialog").dialog({
  autoOpen: false,
  height: 600,
  width: 500,
  modal: true,
  position: {
    my: "center center",
    at: "center center",
    of: "#map"
  },
  buttons: {
    "Afegeix": setData,
    "Cancel·la": function() {
      dialog.dialog("close");
      drawnItems.clearLayers();
      map.removeLayer(drawnItems);
    }
  },
  close: function() {
    dialog.dialog("close");
    drawnItems.clearLayers();
    map.removeLayer(drawnItems);
  }
});

// Stops default form submission and ensures that setData or the cancel function run
var form = dialog.find("form").on("submit", function(event) {
  event.preventDefault();
  setData();
});

function setData() {
  if (element.value != '' && creat_per.value != '' && year.value !=''){
    var enteredName = element.value;
    var enteredDescription = description.value;
    var enteredYear = year.value;
    var enteredType = type.value;
    var enteredRisk = risk.value;
    if (link.value.startsWith('http')){
      var enteredLink = link.value;
    } else {
      var enteredLink = 'http://'+link.value;
    };
    var enteredUser = creat_per.value;

    drawnItems.eachLayer(function (layer) {
      var sql = "INSERT INTO riskadapt (the_geom, name, description, year, type, risk, link, creat_per) VALUES (ST_SetSRID(ST_GeomFromGeoJSON('";
      var a = layer.getLatLng();
      //console.log(a);
      var sql2 ='{"type":"Point","coordinates":[' + a.lng + "," + a.lat + "]}'),4326),'" + enteredName + "','" +
        enteredDescription+ "',"+ enteredYear + ",'"  + enteredType+ "','"  + enteredRisk+ "','"  + enteredLink+ "','"  + enteredUser+"')";
      var pURL = sql+sql2;
      //console.log(pURL);
      submitToProxy(pURL);
      console.log("Feature has been submitted to the Proxy");
    });
    drawnItems.clearLayers();
    map.removeLayer(drawnItems);
    drawnItems = new L.FeatureGroup();
    console.log("drawnItems has been cleared");
    dialog.dialog("close");
  }else{
    alert("Cal omplir el camps marcats amb asterisc")
  }
};

  // Function to run when feature is drawn on map
map.on('draw:created', function (e) {
  var layer = e.layer;
  drawnItems.addLayer(layer);
  map.addLayer(drawnItems);
  dialog.dialog("open");
});

// Submit data to the PHP using a jQuery Post method
var submitToProxy = function(q){
  $.post("./php/callProxy.php", {
    qurl:q,
    cache: false,
    timeStamp: new Date().getTime()
  }, function(data) {
    console.log(data);
    refreshLayer();
  });
};

// refresh the layers to show the updated dataset
function refreshLayer() {
  if (map.hasLayer(cartoDBPoints)) {
    map.removeLayer(cartoDBPoints);
  };
  getGeoJSON();
};
