const formInput = document.getElementById("city");
const cityEl = document.getElementById("city-el");
const searchForm = document.getElementById("search-form");
const cityList = document.getElementById("city-list");
const tempSpan = document.getElementById("temp");
const windSpan = document.getElementById("wind");
const humidSpan = document.getElementById("humidity");
const uvSpan = document.getElementById("uv-index");

var formHandler = function (event) {
  event.preventDefault();

  var city = formInput.value.trim();

  if (city) {
    getWeatherData(city);

    cityEl.textContent = "";
    formInput.value = "";
  } else {
    alert("Please enter the name of a city");
  }
};

var getWeatherData = function (city) {
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=292188850e48297da1a005edf38e34bf";

  fetch(apiUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data, city);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather API");
    });
};

var displayWeather = function (city, searchTerm) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    city.coord.lat +
    "&lon=" +
    city.coord.lon +
    "&exclude=hourly&appid=292188850e48297da1a005edf38e34bf";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        uvSpan.textContent = data.current.uvi;
      });
    }
  });

  var dateObj = new Date(city.dt * 1000);
  var searchDate = dateObj.toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});

  cityEl.textContent = searchTerm + " (" + searchDate + ")";

  tempSpan.textContent = city.main.temp;
  windSpan.textContent = city.wind.speed;
  humidSpan.textContent = city.main.humidity;
    // Save term to list history
    saveSearchTerm(searchTerm);
};

var saveSearchTerm = function (searchTerm) {
    // Ensures duplicates are not appended
  for (let i = 0; i < cityList.children.length; i++) {
      if (cityList.children[i].textContent === searchTerm) {
          return;
      }
  }
  var listItem = document.createElement("li");
  listItem.classList = "list-group-item text-center rounded mb-3";
  listItem.textContent = searchTerm;
  cityList.appendChild(listItem);
};

searchForm.addEventListener("submit", formHandler);
