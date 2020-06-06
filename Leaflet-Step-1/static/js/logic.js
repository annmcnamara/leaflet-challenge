
// Store our API endpoint inside queryUrl
var queryUrl   = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
var platesJSON = "./Data/PB2002_plates.json"
var circleMarkers = []; 

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


// // Perform a GET request to the query URL
// d3.json(platesJSON, function(data) {
//   // Once we get a response, send the data.features object to the createFeatures function
//   createFeatures(data.features);
// });

// Our style object


function createFeatures(earthquakeData) {

  function createCircleMarker(feature,latlng){
    var options = {
        radius:feature.properties.mag*4,
        fillColor: getColor(feature.properties.mag),
        color: "black",
        weight: 0.2,
        opacity: 1,
        fillOpacity: 0.9
    }
    return L.circleMarker( latlng, options );
}




  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) { 
    //console.log(feature.geometry.coordinates)
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }    
 

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(earthquakeData, {    
    onEachFeature: onEachFeature, 
    pointToLayer : createCircleMarker
  });

  // Sending our earthquakes layer to the createMap function
  //console.log(earthquakes)
  createMap(earthquakes);
}

function getColor(d) {
  return d > 5  ? '#D83223' :
         d > 4  ? '#F28F57' :
         d > 3  ? '#FBDE8D' :
         d > 2  ? '#93CC62' :
         d > 1  ? '#D9ED8F' :
         d > 0  ? '#93CC62' :
                  'Blue';
}

function createMap(earthquakes) {
  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: "pk.eyJ1IjoiYW5ubWNuYW1hcmEiLCJhIjoiY2s5YTNiOXI0MDNvOTNlbDdwOXdtejRiYSJ9.W1SBSUR6jrI3YgWdhDV2sA"
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/dark-v10",
    accessToken: "pk.eyJ1IjoiYW5ubWNuYW1hcmEiLCJhIjoiY2s5YTNiOXI0MDNvOTNlbDdwOXdtejRiYSJ9.W1SBSUR6jrI3YgWdhDV2sA"
  });

  var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/outdoors-v11",
    accessToken: "pk.eyJ1IjoiYW5ubWNuYW1hcmEiLCJhIjoiY2s5YTNiOXI0MDNvOTNlbDdwOXdtejRiYSJ9.W1SBSUR6jrI3YgWdhDV2sA"
  });

  var satstreetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-streets-v11",
    accessToken: "pk.eyJ1IjoiYW5ubWNuYW1hcmEiLCJhIjoiY2s5YTNiOXI0MDNvOTNlbDdwOXdtejRiYSJ9.W1SBSUR6jrI3YgWdhDV2sA"
  });



  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map"       : streetmap,
    "Dark Map"         : darkmap,
    "Outdoor Map"      : outdoormap,
    "Satellite Streets": satstreetmap
  };

var redCircle = new L.layerGroup();
circleMarkers.push (L.circle([37.09, -95.71], 500, {radius: 10000, color:"blue",weight: 5, opacity: 0.65})); //.addTo(redCircle));
circleMarkers.push (L.circle([37.09, -94.71], 500, {radius: 10000, color:"green",weight: 5, opacity: 0.65})); //.addTo(redCircle));



var circles = L.layerGroup(circleMarkers);
circles.addTo(redCircle);
//console.log(circleMarkers)

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes, 
    //Plates: plates,
  };

  function style(feature) {
    return {
        fillColor: getColor(feature.properties.mag),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap], //, redCircle], 
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false, 
    style:style
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

   var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);


//   var myLines = [{
//     "type": "LineString",
//     "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
// }, {
//     "type": "LineString",
//     "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
// }];

// var myStyle = {
//   "color": "red",
//   "weight": 5,
//   "opacity": 0.65
// };

// L.geoJSON(myLines, {
//   style: myStyle
// }).addTo(myMap);


}