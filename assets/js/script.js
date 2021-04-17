var apiKey = "f947898377c69bc177656504f9b7d1f2";

var submitBtn = document.getElementById("submitBtn");
var cityInput = document.getElementById("city");

function displayUVI(data) {
    for (var i = 0; i <= 5; i++) {
        var uv = data.daily[i].uvi;
        var uviBox = document.getElementById('uvi' + i);
        uviBox.textContent = uv;
        if (uv >= 6) {
            uviBox.setAttribute("class", "severe");
        }
        else if (uv >= 3) {
            uviBox.setAttribute("class", "moderate");
        }
        else {
            uviBox.setAttribute("class", "favorable");
        }
    }
}

function getResults() {
    var cityName = cityInput.value;
    var requestLatLon = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
    fetch(requestLatLon).then(function (response) {return response.json();}).then(function (data) {
        var cityLat = data[0].lat;
        var cityLon = data[0].lon;
        var requestWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=" + apiKey;
        fetch(requestWeather).then(function (response2) {return response2.json();}).then(function (weather) {
            console.log(weather);
            displayUVI(weather);
            return weather;
        });
        return data;
    });
}

submitBtn.addEventListener("click", getResults);