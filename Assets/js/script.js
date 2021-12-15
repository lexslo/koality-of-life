
var displayUserLocation = function (city, state) {
    // set text display in card header to user location
    $("#user-ip-location").text(city + ", " + state);
    // auto fill search input with current location
    $("#user-entry-location").val(city + ", " + state);
    // disable search button unless user wishes to change start city
    $("#search-btn").addClass("disabled");
}

// enable search button if user goes to type in the first input field
$("#user-entry-location").on("click", function() {
    if($(this).is(":focus")) {
        $("#search-btn").removeClass("disabled");
    }
});
// disable search button if empty input field
$("#user-entry-location").on("blur", function() {
    if ($(this).val() == "") {
        $("#compare-btn").addClass("disabled");
    }
})

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

displayUserLocation("Oakland", "CA");

// initialize foundation
$(document).ready(function () {
    $(document).foundation();
})