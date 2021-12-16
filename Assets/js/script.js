var ipStackKey = "5eb2ffeb687e846fd6b8eb7245538ec9";
var ipStack = `http://api.ipstack.com/check?access_key=${ipStackKey}`;
var teleportCitySearch = `https://api.teleport.org/api/cities/?search=`;

var prevSearchObj = {};
var counter = 0;

// on dom load, run foundation & ipstack
$(document).ready(function () {
  $(document).foundation();

  loadSearch();

  // call ipstack API
  fetch(ipStack).then(function (response) {
    response.json().then(function (data) {
      // call city function that will find city from ip address using ipstack
      city(data);
      //displayUserLocation(data.city, data.region_code);
    });
  });
});

function displayUserLocation(city) {
  // set text display in card header to user location
  $("#user-ip-location").text(city);
  // auto fill search input with current location
  $("#user-entry-location").val(city);
  // disable search button unless user wishes to change start city
  $("#search-btn").addClass("disabled");
  // display city name to header of first comparison column
  $("#user-city").text(" - " + city);
}

//var userCityEntry = $("#user-entry-location").val();
//$("#search-btn").on("click", city(userCityEntry));

function city(ipLocation) {
  // var city = ipLocation.city;
  var city = "hayward";
  teleportURL = `${teleportCitySearch}${city}`;
  //console.log(teleportURL);
  //console.log(`${city}`);
  if (`${city}` !== "undefined") {
    // call on teleport api to return object with geoname some where 1000 levels deep
    fetch(teleportURL).then(function (response) {
      response.json().then(function (data) {
        obtainGeoID(data);
        displayUserLocation(city);
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
  //console.log(embeddedHREF);

  // var urbanCity = embeddedHREF["city:urban_area"];

  // run teleport api for urban city name by geonameid
  fetch(embeddedHREF).then(function (response) {
    response.json().then(function (data) {
      //console.log(data);
      urbanCityName = data["_links"]["city:urban_area"];
      if (urbanCityName) {
        urbanCityName = urbanCityName["name"];
        displayUrbanCityData(urbanCityName);
      } else {
        // trigger hidden button to open modal window guiding user to Teleport site
        $("#hidden-button").trigger("click");
      }
      //console.log(urbanCityName);
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

function saveSearch () {

    var firstCity = $("#user-entry-location").val();
    var secondCity = $("#user-entry-comparison").val();
    var prevSearchArr = [];
    // only store comparison searches, check for both fields completed
    if (firstCity && secondCity) {
        // push both cities to an array
        prevSearchArr.push(firstCity, secondCity);
        // add the array of 2 cities to object at next index
        prevSearchObj[counter] = prevSearchArr;
        // store a maximum of 3 previous searches
        console.log("counter = " + counter + " from saveSearch");
        if (counter == 3) {
            counter = 0;
        } else {
            counter++;
        }
        localStorage.setItem("search", JSON.stringify(prevSearchObj));
    }
}

function loadSearch () {
    console.log("counter = " + counter + " from loadSearch")
    // variable to hold localstorage string
    var searches = localStorage.getItem("search");
    // check if anything is stored, hide the "no searches" message if there are stored items
    if (searches) {
        $("#no-search-text").hide();
    } else {
        $("#no-search-text").show();
        $(".storage-btn").hide();
    }
    // turn local storage string into object
    prevSearchObj = JSON.parse(searches) || {};

    // get number of items stored in prevSearchObj
    var numStored = (Object.keys(prevSearchObj)).length;
    // set storage counter to be up to date with number of items stored
    if (numStored > 0) {
        counter = numStored- 1;
    } else {
        counter = numStored;
    }
    console.log("numStored = " + numStored);
    // hide empty buttons depending on how many items are in storage
    if (numStored === 2) {
        $(`[data-id='2']`).hide();
    } else if (numStored === 1) {
        $(`[data-id='2']`).hide();
        $(`[data-id='1']`).hide();
    } 
    // iterate through object and write text to buttons in previous search section
    for (var index in prevSearchObj) {
        
        $(`[data-id='${index}']`)
            .show()
            .text(prevSearchObj[index][0] + " vs. " + prevSearchObj[index][1]);
        
    }
}

$(".storage-btn").on("click", function () {
    // get text from button that was clicked
    var btnText = $(this).text();
    // split and remove the " vs. "
    btnText = btnText.split(" vs. ");
    // put text in proper input fields
    $("#user-entry-location").val(btnText[0]);
    $("#user-entry-comparison").val(btnText[1]);
    $("#compare-btn").removeClass("disabled");
})

$("#compare-btn").on("click", function () {
    saveSearch();
})