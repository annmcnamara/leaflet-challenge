
// Store our API endpoint inside queryUrl
var queryUrl   = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var circleMarkers = []; 

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});


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
      "</h3><hr><p>" + new Date(feature.properties.time) +
      "<br><br> <strong> Magnitude: " + feature.properties.mag + "</p>");
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

//Return the color for the circle markers and the legend
function getColor(d) {
  return d > 5  ? 'crimson' :
         d > 4  ? 'salmon' :
         d > 3  ? 'lightsalmon' :
         d > 2  ? 'gold' :
         d > 1  ? 'greenyellow' :
         d >= 0  ? 'lime' :
                  'Blue';  //shouldnt get here
}


//Create the actual map 
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

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes, 
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
    layers: [streetmap, earthquakes], 
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false, 
    style:style
  }).addTo(myMap);

  //create the legend
  var legend = L.control({position: 'bottomright'});

  //Add the legend to the map
  legend.onAdd = function (myMap) {

   var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};
//add the legend to the map
legend.addTo(myMap);

}