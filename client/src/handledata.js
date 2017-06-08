//Store data for mapping and plotting
var pastLocations = []; //Should be [lon,lat]
var altitudes = [];     //Should be [time (seconds), alt]
var velocities = [];    //Vertical velocities [s, m/s]

var altitudePlot = null;//The plot object for altitude
var velocityPlot = null;//The plot object for velocity

var t0 = -1;            //The time to use as t_0
var a0 = -1;            //The altitude to use as ground level

var maxalt = 0;         //max altitude value for comparison/display
var maxvelo =0;         // "  velocity   "    "          "

//timeIndex = 0;
var legends = $("#flotAltitudeChart .legendLabel");
legends.each(function () {
    $(this).css('width', $(this).width());
});
var updateLegendTimeout = null;
var latestPosition = null;

//----------------------------------Graph Crosshair Data Display------------------------------
function updateLegend() {
    updateLegendTimeout = null;

    var pos = latestPosition;
    //collect position on alt graph
    var axes = altitudePlot.getAxes();
    if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max ||
        pos.y < axes.yaxis.min || pos.y > axes.yaxis.max)
        return;
    //collect data from alt data
    var i, j, dataset = altitudePlot.getData();
    for (i = 0; i < dataset.length; ++i) {
        var series = dataset[i];

        // find the nearest points, x-wise
        for (j = 0; j < series.data.length; ++j)
            if (series.data[j][0] > pos.x)
                break;

        // now interpolate
        var y, p1 = series.data[j - 1], p2 = series.data[j];
        if (p1 == null)
            y = p2[1];
        else if (p2 == null)
            y = p1[1];
        else
            y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
        console.log("Alt Value"+y);
        //round for neatness and display 
        y=Math.round(y * 100) / 100;
        document.getElementById('selecalt').innerHTML = y+'m';
    }
    //collect data from velo data
    var i, j, dataset = velocityPlot.getData();
    for (i = 0; i < dataset.length; ++i) {
        var series = dataset[i];

        // find the nearest points, x-wise
        for (j = 0; j < series.data.length; ++j)
            if (series.data[j][0] > pos.x)
                break;

        //interpolate
        var y, p1 = series.data[j - 1], p2 = series.data[j];
        if (p1 == null)
            y = p2[1];
        else if (p2 == null)
            y = p1[1];
        else
            y = p1[1] + (p2[1] - p1[1]) * (pos.x - p1[0]) / (p2[0] - p1[0]);
        console.log("Velo Value"+y);
        //display 
        y=Math.round(y * 100) / 100;
        document.getElementById('selecvelo').innerHTML = y+'m/s';
    }
}

//------------------------Data Handing---------------------------------------

function handle(data) {
    // Show text =================================================
    var label = document.getElementById("datafield");
    if (label !== null) {
        label.innerHTML = data["raw"];
    }
    
    //update current altitude/position text by replacing text in div, and roundings
    document.getElementById("longitude").innerHTML = Math.round(data["longitude"] * 10000) / 10000;
    document.getElementById("latitude").innerHTML = Math.round(data["latitude"] * 10000) / 10000;
    document.getElementById("altitude").innerHTML = Math.round(data["altitude"] * 100) / 100;
    
    //collect these for positioning icon
    var lat = data["latitude"];
    var lon = data["longitude"];
    var alt = data["altitude"]
    
    //set global variables to current latlon, these come from index.html
    centerlat = lat;
    centerlon = lon;


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
    //compare this value and current max alt and change if needed
    if (data["altitude"] > maxalt) {
            //display value by replacing div text
            document.getElementById('maxalt').innerHTML = data["altitude"] +'m';
            maxalt = data["altitude"];
        }

    //Record velocity
    if(altitudes.length >= 2){
        prevData = altitudes[altitudes.length-2];
        deltap = data["altitude"] - prevData[1];
        //Velocity in metres (or feet?) per second
        v = deltap / (timediff - prevData[0]);
        velocities.push([timediff,v]);
        //compare this value and current  max velocity and change if needed 
        if (v > maxvelo) {
            //display value by replacing div text
            document.getElementById('maxvelo').innerHTML = v+'m/s';
            maxvelo = v;
        }
    }

    if (altitudes.length > 600){
        altitudes.shift();  //Only show last 10 minutes of data
        velocities.shift();
    }
    
//--------------------------------------Graph Creation/updating-------------------------------
    if (altitudes.length == 1) {
        //Plot for the first time
        altitudePlot = $.plot($("#flotAltitudeChart"), [altitudes],
        {crosshair: { mode: "x" },
        grid: { hoverable: true, autoHighlight: false }});
        //setup plot for velocity
        velocityPlot = $.plot($("#flotVelocityChart"), [velocities],
        {crosshair: { mode: "x" }});
    }

    //Set up the graph lines 
    altdataSeries = [{
        data:altitudes,
        color:"#F5AA1C",
        yaxis:1}
    ]
    velodataSeries = [{
        data:velocities,
        color:"#F5AA1C",
        yaxis:1}
    ]
    
    //refresh and draw graphs
    altitudePlot.setData(altdataSeries);
    velocityPlot.setData(velodataSeries);
    altitudePlot.setupGrid();
    velocityPlot.setupGrid();
    altitudePlot.draw();
    
    //Collect and run crosshair value collector on mouseover with delay to ensure no overflow 
     $("#flotAltitudeChart").bind("plothover",  function (event, pos, item) {
        latestPosition = pos;
        //sync crosshairs
        velocityPlot.setCrosshair({x: pos.x})
        if (!updateLegendTimeout)
             updateLegendTimeout = setTimeout(updateLegend, 50);
    });
    //draw the velocity graph
    velocityPlot.draw();
}
