// api key for IP address
// https://api.ipstack.com/134.201.250.155?access_key=5eb2ffeb687e846fd6b8eb7245538ec9

var getUserLocation = function () {

    var apiUrl = "http://api.ipstack.com/134.201.250.155?access_key=5eb2ffeb687e846fd6b8eb7245538ec9";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){
                    console.log(data);
                    console.log(data.city);
                    console.log(data.region_code);
                    displayUserLocation(data.city, data.region_code);
                });
            } else {
                console.log("connection failed");
            }
        })
}

var displayUserLocation = function (city, state) {
    $("#user-ip-location").text(city + ", " + state);
}

//getUserLocation();
