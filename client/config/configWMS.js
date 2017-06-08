//Info should be info for WMS services.
var configuredWMSLayers = [
    {url: 'http://localhost:8080/geoserver/wms',
     params: {'Layers':'NewMexico:launcharealandsat','TILED':true}},
//    {url: 'http://localhost:8080/geoserver/wms',
//     params: {'Layers':'Victoria:victoriaBW','TILED':true}},
    {url:'http://localhost:8080/geoserver/wms',
     params:{'Layers':'NewMexico:launchsite','TILED':true}}
];
