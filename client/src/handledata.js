//Store data for mapping and plotting
var pastLocations = []; //Should be [lon,lat]
var altitudes = [];     //Should be [time (seconds), alt]

function handle(data){
    // Show text =================================================
    var label = document.getElementById("datafield");
    if(label != null){
        label.innerHTML = data["raw"]
    }

    document.getElementById("longitude").innerHTML = data["longitude"];
    document.getElementById("latitude").innerHTML = data["latitude"];
    document.getElementById("altitude").innerHTML = data["altitude"];

    var lat = data["latitude"];
    var lon = data["longitude"];

    // Display current position on map ============================
    var rocketIcon = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon,lat])),
        name: "Rocket"
    });

    currentPositionSource.clear();                //Remove previous markers 
    currentPositionSource.addFeature(rocketIcon); //Add the new marker

    // Add to trail on map ========================================
    pastLocations.push([lon,lat]);
    var points = pastLocations.map(x => ol.proj.fromLonLat(x));
    var newLine = new ol.Feature({
        geometry: new ol.geom.LineString(points),
        name: "Rocket trail"
    });

    // There's probably an O(1) way to do this, rather than the current O(n),
    // But O(n) is fine for now.
    trailSource.clear();
    trailSource.addFeature(newLine); 

    // Record altitude for plotting ===============================
}
