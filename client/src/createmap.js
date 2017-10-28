/*
Dependencies:
OpenLayers is required (ideally 4.1.1 or later).
Also, there should be an array loaded somewhere 
    called configuredWMSLayers, in the following format:

    [
    {url: 'http://localhost:8080/geoserver/wms',
     params: {'Layers':'NewMexico:launcharealandsat','TILED':true}}
     , (next entry, and so on...)
    ];

Currently, this is in the file config/configWMS.js
*/


// Create the map =================================================

var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({  
        source: new ol.source.OSM()
      })
    ],
    view: view
});

// Add all configured WMS layers ==================================
configuredWMSLayers.forEach(function(layerInfo){
    var newLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS(layerInfo)
    });
    map.addLayer(newLayer);
});


// Create the rocket icon layer ===================================
var iconFeatures = [];
var currentPositionSource = new ol.source.Vector({features:iconFeatures});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon( ({
    anchor: [0.5,0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1.0,
    scale: 0.05,
    src: 'images/arrow.png'
  }))
});

var currentPositionLayer = new ol.layer.Vector({
  source: currentPositionSource,
  style: iconStyle
});


// Create the "trail" layer ========================================
var rocketTrail = new ol.geom.LineString([]);

var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({color: 'rgba(210,38,48,1)', width:3})
});

var trailSource = new ol.source.Vector({
    features: [new ol.Feature({ geometry: rocketTrail,
                                name: "Trail"
                              })]
    });

var pathLayer = new ol.layer.Vector({
    source:trailSource,
    style: lineStyle
});

// Add those layers to the map ====================================
map.addLayer(pathLayer);
map.addLayer(currentPositionLayer);




//panning utility function
function doPan(location) {
    // pan from the current center
    var pan = ol.animation.pan({
      source: map.getView().getCenter()
    });
    map.beforeRender(pan);
    // when we set the new location, the map will pan smoothly to it
    map.getView().setCenter(location);
}

//center map on rocket
function setnewCenter() {  
    console.log("entered centering function");
    console.log(centerlat + " lat ");
    console.log(centerlon + " lon ");
    var target = ol.proj.fromLonLat([centerlon,centerlat]);
    doPan(target);
   /* Not in Open Layers 3, is in 4
    view.animate({
        center: target,
        duration: 10
    });
    */
}

