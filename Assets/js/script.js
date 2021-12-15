var ipStackKey = "5eb2ffeb687e846fd6b8eb7245538ec9";
var ipStack = `http://api.ipstack.com/check?access_key=${ipStackKey}`;
var teleportCitySearch = `https://api.teleport.org/api/cities/?search=`;
var userInputSearchForCityEl = document.querySelector("#user-entry-location");

// on dom load, run foundation & ipstack
$(document).ready(function () {
  $(document).foundation();

  // call ipstack API
  fetch(ipStack).then(function (response) {
    response.json().then(function (data) {
      // call city function that will find city from ip address using ipstack
      city(data);
      //displayUserLocation(data.city, data.region_code);
    });
  });
});

function displayUserLocation(city, state) {
  // set text display in card header to user location
  $("#user-ip-location").text(city + ", " + state);
  // auto fill search input with current location
  $("#user-entry-location").val(city + ", " + state);
  // disable search button unless user wishes to change start city
  $("#search-btn").addClass("disabled");
}

function city(ipLocation) {
  var city = ipLocation.city;
  var state = ipLocation.region_code;
  teleportURL = `${teleportCitySearch}${city}`;
  console.log(teleportURL);
  console.log(`${city}`);
  if (`${city}` !== "undefined") {
    // call on teleport api to return object with geoname some where 1000 levels deep
    fetch(teleportURL).then(function (response) {
        response.json().then(function (data) {
        obtainGeoID(data);
        displayUserLocation(city, state);
        // console.log(data);
    });
  });
  } else {
      $("#undefined-btn").trigger("click");
      $("#location-header").text("Search for a City");
  }
}

function obtainGeoID(data) {
  // console.log(data);
  // geonameid URL some where in here and pass into obtainUrbanCityScores function
  var embeddedHREF =
    data._embedded["city:search-results"][0]["_links"]["city:item"]["href"];
  console.log(embeddedHREF);

  // var urbanCity = embeddedHREF["city:urban_area"];

  // run teleport api for urban city name by geonameid
  fetch(embeddedHREF).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      urbanCityName = data["_links"]["city:urban_area"];
        if (urbanCityName) {
            urbanCityName = urbanCityName["name"];
            displayUrbanCityData(urbanCityName);
        } else {
            // trigger hidden button to open modal window guiding user to Teleport site
            $("#hidden-button").trigger('click');
        }
      console.log(urbanCityName);
      // urbanCityScores = urbanCityHref + "scores";

      // fetch(urbanCityScores).then(function (response) {
      //   response.json().then(function (data) {
      //     // console.log(data);
      //   });
      // });
    });
  });
}

function displayUrbanCityData(urbanCityName) {
  var cityName = urbanCityName.replaceAll(" ", "-");
  cityName = cityName.toLowerCase();
  var lifeQualityScores = `<script
  async
  class="teleport-widget-script"
  id="life-quality-score"
  data-url="http://teleport.org/cities/${cityName}/widget/scores/?currency=USD"
  data-max-width="770"
  data-height="950"
  src="http://teleport.org/assets/firefly/widget-snippet.min.js"
  ></script>`;

  // // console.log(lifeQualityScores);
  $("#user-results").append(lifeQualityScores);
}

// enable search button if user goes to type in the first input field
$("#user-entry-location").on("click", function () {
  if ($(this).is(":focus")) {
    $("#search-btn").removeClass("disabled");
  }
});
// disable search button if empty input field
$("#user-entry-location").on("blur", function () {
  if ($(this).val() == "") {
    $("#compare-btn").addClass("disabled");
  }
});

// enable compare button when user types in input field
$("#user-entry-comparison").on("click", function () {
  if ($(this).is(":focus")) {
    $("#compare-btn").removeClass("disabled");
  }
});
// disable compare button if empty input field
$("#user-entry-comparison").on("blur", function () {
  if ($(this).val() == "") {
    $("#compare-btn").addClass("disabled");
  }
});
