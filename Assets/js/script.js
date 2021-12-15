var ipStackKey = "5eb2ffeb687e846fd6b8eb7245538ec9";
var ipStack = `http://api.ipstack.com/check?access_key=${ipStackKey}`;
var teleportCitySearch = `https://api.teleport.org/api/cities/?search=`;
var userInputSearchForCityEl = document.querySelector("#user-entry-location");
var userResultsEl = document.querySelector("#user-results");

// dom load to run ipstack
$(document).ready(function () {
  fetch(ipStack)
    .then(function (response) {
      response.json().then(function (data) {
        city(data);
      });
    })
    .catch(function (data) {
      alert("Your location was not found, please use search instead.");
    });
});

// geoid function from
function city(ipLocation) {
  var city = ipLocation.city;
  teleportURL = `${teleportCitySearch}hayward`;
  console.log(teleportURL);

  fetch(teleportURL).then(function (response) {
    response.json().then(function (data) {
      obtainUrbanCityScores(data);
      // console.log(data);
    });
  });
  // .catch(function (data) {
  //   alert("Your location was not found, please use search instead.");
  // });
}

// function manualUserCityEntry() {
//   $("#search-for-cty").on("submit", function (event) {
//     event.preventDefault();

//     var cityname = userInputSearchForCityEl.value.trim();

//     if (cityname) {
//       getCityCoordinates(cityname, true);
//       console.log(cityname);
//       cityInputEl.value = "";
//     } else {
//       alert("Please enter a City destination");
//     }
//   });
// }

function obtainUrbanCityScores(data) {
  // console.log(data);
  var embeddedHREF =
    data._embedded["city:search-results"][0]["_links"]["city:item"]["href"];
  // console.log(embeddedHREF);

  // var urbanCity = embeddedHREF["city:urban_area"];

  fetch(embeddedHREF).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      urbanCityNameTest = data["_links"]["city:urban_area"]["name"];
      var ua = urbanCityNameTest.replace(" ", "-");

      console.log(urbanCityNameTest);

      urbanCityName = data["_links"]["city:urban_area"]["name"];
      console.log(urbanCityName);
      displayUrbanCityData(urbanCityName);
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
  console.log(cityName);
  var lifeQualityScores = `<script
  async
  class="teleport-widget-script"
  id="life-quality-score"
  data-url="https://teleport.org/cities/${cityName}/widget/scores/?currency=USD"
  data-max-width="770"
  data-height="950"
  src="https://teleport.org/assets/firefly/widget-snippet.min.js"
  ></script>`;

  // // console.log(lifeQualityScores);

  $("#user-results").append(lifeQualityScores);
}
