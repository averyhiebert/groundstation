// Create the map =================================================
var map = new ol.Map({
target: 'map',
layers: [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  })
],
view: new ol.View({
  center: ol.proj.fromLonLat([-123.31,48.463]), //This is centred on Victoria
  zoom: 12
})
});

/*
//Add Victoria openstreetmaps base map.
victoriaLayer = new ol.layer.Vector({
    title: 'Street Centres',
    source: new ol.source.Vector({
        url: 'mapdata/victoria.osm',
        projection:'EPSG:3857',
        format: new ol.format.OSMXML()
    })
})

map.addLayer(victoriaLayer);
*/
victoriaLayer =  new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: {'Layers':'Victoria:victoriaBW','TILED':true},
        projection:'EPSG:3857',
        serverType:'geoserver'
    })
});

map.addLayer(victoriaLayer);


// Create the rocket icon layer ===================================
var iconFeatures = [];
var currentPositionSource = new ol.source.Vector({features:iconFeatures});

var iconStyle = new ol.style.Style({
  image: new ol.style.Icon( ({
    anchor: [0.5,0.5],
    anchorXUnits: 'fraction',
    anchorYUnits: 'fraction',
    opacity: 1.0,
    scale: 0.008,
    src: 'images/rocket.png'
  }))
});

var currentPositionLayer = new ol.layer.Vector({
  source: currentPositionSource,
  style: iconStyle
});


// Create the "trail" layer ========================================
var rocketTrail = new ol.geom.LineString([]);

var lineStyle = new ol.style.Style({
    stroke: new ol.style.Stroke({color: 'rgba(255,0,0,1)', width:3})
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


// Add New Mexico Landsat Layer ================================

// (Change these settings to match how you are hosting the service)
landsatlayer =  new ol.layer.Tile({
    source: new ol.source.TileWMS({
        url: 'http://localhost:8080/geoserver/wms',
        params: {'Layers':'NewMexico:launcharealandsat','TILED':true},
        projection:'EPSG:3857',
        serverType:'geoserver'
    })
});

map.addLayer(landsatlayer);


// For reference: How to add other mapping data ======================

/*
streetsLayer = new ol.layer.Vector({
    title: 'Street Centres',
    source: new ol.source.Vector({
        url: 'mapdata/streetlines.kml',
        format: new ol.format.KML()
    })
})

map.addLayer(streetsLayer);

// Or use e.g. ol.format.GeoJSON()
*/
