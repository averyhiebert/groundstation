var mainSocket = new WebSocket("ws://localhost:9000");

//No longer necessary; parsing done server side
function parseBRB(dataString){
    //Parse bigredbee data
    //return [longitude,latitude,altitude]
    var expr = /(\d\d)([\d\.]{5})([NS]).*?(\d{3})([\d\.]{5})([WE]).*?A=(\d*)/;
    var result = expr.exec(dataString);
    var longitude = 0;
    if(result){
        var latitude = parseFloat(result[1]) + (parseFloat(result[2])/60.0);
        latitude *= (result[3]=="S"?-1:1);
        
        var longitude = parseFloat(result[4]) + (parseFloat(result[5])/60.0);
        longitude *= (result[6]=="W"?-1:1);
        
        return [longitude,latitude,parseFloat(result[7])];
    }else{
        return null;
    }
}





mainSocket.onopen = function(event){
    console.log("Connection open");
}

mainSocket.onmessage = function(event){
    //console.log(event.data)
    var data = {};
    
    try{
        data = JSON.parse(event.data);
        console.log("Parsed well");
        console.log(data["raw"]);
    }catch (err){
        console.log("Error parsing JSON");
        return;
    }
     
    //data = {"latitude":-123.3,"longitude":48.6,"altitude":200,"raw":"wrwerwr"};

    var label = document.getElementById("datafield");
    if(label != null){
        //label.innerHTML = event.data;
        label.innerHTML = data["raw"]
    }
    //var data = parseBRB(event.data);
    if(data != null){
        //document.getElementById("longitude").innerHTML = data[0];
        //document.getElementById("latitude").innerHTML = data[1];
        //document.getElementById("altitude").innerHTML = data[2];
        document.getElementById("longitude").innerHTML = data["longitude"];
        document.getElementById("latitude").innerHTML = data["latitude"];
        document.getElementById("altitude").innerHTML = data["altitude"];

        var lat = data["latitude"];
        var lon = data["longitude"];

        //Add rocket to map.
        var rocketIcon = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform(lon,lat, 'EPSG:4326','EPSG:3857')),
            name: "Rocket"
        });
 
        vectorSource.clear();                //Remove previous markers 
        vectorSource.addFeature(rocketIcon); //Add the new marker
        
    }
}

