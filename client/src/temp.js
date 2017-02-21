
var map = new ol.Map({
target: 'map',
layers: [
  new ol.layer.Tile({
    source: new ol.source.OSM()
  })
],
view: new ol.View({
  center: ol.proj.fromLonLat([-123.31,48.463]),
  zoom: 12
})
});

var iconFeatures = [];
var vectorSource = new ol.source.Vector({features:iconFeatures});

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

var vectorLayer = new ol.layer.Vector({
  source: vectorSource,
  style: iconStyle
});

map.addLayer(vectorLayer);
