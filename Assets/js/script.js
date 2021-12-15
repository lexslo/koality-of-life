// teleport api https://api.teleport.org/api/cities/

// fetch location information from ipstack API
var getUserLocation = function () {

    var apiUrl = "http://api.ipstack.com/134.201.250.155?access_key=5eb2ffeb687e846fd6b8eb7245538ec9";

    fetch(apiUrl)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(data){
                    // pass city and state to displayUserLocation function
                    displayUserLocation(data.city, data.region_code);
                    // pass latitude and longitude to getCityComparison function
                    // getGeonameId(data.city);
                });
            } else {
                console.log("connection failed");
            }
        })
}

var displayUserLocation = function (city, state) {
    // set text display in card header to user location
    $("#user-ip-location").text(city + ", " + state);
    // auto fill search input with current location
    $("#user-entry-location").val(city + ", " + state);
    // disable search button unless user wishes to change start city
    $("#search-btn").addClass("disabled");
}

var getCityComparison = function (lat, long) {

}

// enable search button if user goes to type in the first input field
$("#user-entry-location").on("click", function() {
    if($(this).is(":focus")) {
        $("#search-btn").removeClass("disabled");
    }
});

// enable compare button when user types in input field
$("#user-entry-comparison").on("click", function() {
    if ($(this).is(":focus")) {
        $("#compare-btn").removeClass("disabled");
    }
});
// disable compare button if empty input field
$("#user-entry-comparison").on("blur", function() {
    if ($(this).val() == "") {
        $("#compare-btn").addClass("disabled");
    }
})

//getUserLocation();
displayUserLocation("Oakland", "CA");

// initialize foundation
$(document).ready(function () {
    $(document).foundation();
})