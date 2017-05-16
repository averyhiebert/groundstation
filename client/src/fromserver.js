var mainSocket = new WebSocket("ws://localhost:9000");

mainSocket.onopen = function(event){
    console.log("Connection open");
}

mainSocket.onmessage = function(event){
    //What to do when receiving a string of data from server
    var data = {};
   
    try{
        data = JSON.parse(event.data);
    }catch (err){
        console.log("Error parsing JSON");
        return;
    }

    

    
    //For now, we ignore data points that have error=true
    if(!data["error"]){ 
        handle(data);   
    }
  
      //if centering option is turned on using global variable 
    if (togglecentering === 1) {
        console.log("Autotacking on!");
        setnewCenter();
    }
}//on message

