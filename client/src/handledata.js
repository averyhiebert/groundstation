//Store data for mapping and plotting
var pastLocations = []; //Should be [lon,lat]
var altitudes = [];     //Should be [time (seconds), alt]
var velocities = [];    //Vertical velocities [s, m/s]
var tracker = [];       //Used to track points of the Rocket with long, Lat, Alt
var speed = [];         //Captures the distance between the current point and the last point
var altitudePlot = null;     //The plot object

var t0 = -1;

//timeIndex = 0;

function handle(data){
    // Show text =================================================
    var label = document.getElementById("datafield");
    if(label != null){
        label.innerHTML = data["raw"]
    }

    document.getElementById("longitude").innerHTML = Math.round(data["longitude"] * 100) / 100;
    document.getElementById("latitude").innerHTML = Math.round (data["latitude"] * 100) / 100;
    document.getElementById("altitude").innerHTML = Math.round (data["altitude"] * 100) / 100;

    var lat = data["latitude"];
    var lon = data["longitude"];
    var alt = data["altitude"]
    
    //set global variables to current latlon, these come from index.html
    centerlat = lat;
    centerlon = lon;


    /* TODO: Probably delete
    // Figuring out speed with lon, lat and alt
    var x = alt * Math.cos(lat) * Math.sin(lon);
    var y = alt * Math.sin(lat);
    var z = alt * Math.cos(lat) * Math.sin(lon);
    var point = [x,y,z];
    */

    // Display current position on map ============================
    var rocketIcon = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon,lat])),
        name: "Rocket"
    });

    currentPositionSource.clear();                //Remove previous markers 
    currentPositionSource.addFeature(rocketIcon); //Add the new marker
   
    // Add to trail on map ========================================
    rocketTrail.appendCoordinate(ol.proj.fromLonLat([lon,lat]));

    // Record altitude for plotting ===============================
    // (This bit is quite messy and should be rewritten)
    if (altitudes.length == 0){
        // Set "start time"
        t0 = parseFloat(data["timestamp"]);
    }
  
    timediff = (parseFloat(data["timestamp"])-t0)/1000.0; //Seconds since t0
    altitudes.push([timediff,data["altitude"]]);

    //Record velocity
    if(altitudes.length >= 2){
        prevData = altitudes[altitudes.length-2];
        deltap = data["altitude"] - prevData[1];
        //Velocity in metres (or feet?) per second
        v = deltap / (timediff - prevData[0]);
        velocities.push([timediff,v]);
    }

    if (altitudes.length > 600){
        altitudes.shift();  //Only show last 10 minutes of data
        velocities.shift();
    }

    if (altitudes.length == 1){
        //Plot for the first time
        altitudePlot = $.plot($("#flotAltitudeChart"),[altitudes],
        {crosshair: { mode: "x" }});
    }
 
    //Actually draw the thing
    dataSeries = [{
        label:"Altitude",
        data:altitudes,
        color:"#FF0000",
        yaxis:1},
        {label:"Velocity",
        data:velocities,
        color:"#00FF00",
        yaxis:2}
    ]
    altitudePlot.setData(dataSeries);
    altitudePlot.setupGrid();
    altitudePlot.draw();
}
