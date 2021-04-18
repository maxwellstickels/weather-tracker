var apiKey = "f947898377c69bc177656504f9b7d1f2";

var submitBtn = document.getElementById("submitBtn");
var clearBtn = document.getElementById("clearBtn");
var cityInput = document.getElementById("city");

var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
if (searchHistory === null) {
    searchHistory = ["", "", "", "", ""];
}
setHistory();

function displayForecast(weather) {
    for (var i = 0; i <= 5; i++) {
        var uv = weather.daily[i].uvi;


        var dayBox = document.getElementById('day' + i);
        var resultsBox = document.createElement('section');
        var weatherType = document.createElement('p');

        resultsBox.setAttribute("class", "results-box");
        weatherType.setAttribute("class", "weather-type");
        resultsBox.appendChild(weatherType);

        dayBox.innerHTML = "";


        var uviBox = document.createElement('p');
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
        resultsBox.appendChild(uviBox);
        dayBox.appendChild(resultsBox);
    }
}

function notFound() {
    for (var i = 0; i <= 5; i++) {
        dayBox = document.getElementById('day' + i);
        dayBox.innerHTML = "";
        var errorMessage = document.createElement('h3');
        errorMessage.textContent = "Location Not Found";
        var errorSubtext = document.createElement('p');
        errorSubtext.textContent = "Try entering a different name!"
        dayBox.appendChild(errorMessage);
        dayBox.appendChild(errorSubtext);
    }
}


function setHistory() {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    for (var i = 0; i < searchHistory.length; i++) {
        document.getElementById("history" + i).textContent = searchHistory[i];
    }
}

function clearHistory() {
    searchHistory = ["", "", "", "", ""];
    setHistory();
}

function getResults(event) {
    var target = event.target;
    if (target === submitBtn) {
        var cityName = cityInput.value;
        if (cityName.length > 0) {
            searchHistory.unshift(cityName);
            searchHistory.pop();
            setHistory();
        }
        
    }
    else {
        var cityName = target.textContent;
    }
    if (cityName.length > 0) {
        var requestLatLon = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=1&appid=" + apiKey;
        fetch(requestLatLon).then(function (response) { return response.json(); }).then(function (data) {
            if (data[0] === undefined) {
                notFound();
            }
            else {
                var cityLat = data[0].lat;
                var cityLon = data[0].lon;
                var requestWeather = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,alerts&appid=" + apiKey;
                fetch(requestWeather).then(function (response2) {return response2.json();}).then(function (weather) {
                    console.log(weather);
                    displayForecast(weather);
                    return weather;
                });
                return data;
            }
        });
    }
}

submitBtn.addEventListener("click", getResults);
clearBtn.addEventListener("click", clearHistory);
for (var i = 0; i < searchHistory.length; i++) {
    document.getElementById("history" + i).addEventListener("click", getResults);
}