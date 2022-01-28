const formInput = document.getElementById("city");
const cityEl = document.getElementById("city-el");
const searchForm = document.getElementById("search-form");
const cityList = document.getElementById("city-list");
const tempSpan = document.getElementById("temp");
const windSpan = document.getElementById("wind");
const humidSpan = document.getElementById("humidity");
const uvSpan = document.getElementById("uv-index");
const forecastHeader = document.getElementById('forecast-header');
const cardRow = document.getElementById('card-row');

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
    "&exclude=hourly&units=imperial&appid=292188850e48297da1a005edf38e34bf";

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        uvSpan.textContent = data.current.uvi;
        console.log(data);
        displayFiveDay(data);
      });
    }
  });

  var dateObj = new Date(city.dt * 1000);
  var searchDate = dateObj.toLocaleString('en-US', {month: 'numeric', day: 'numeric', year: 'numeric'});

  var imgUrl = 'http://openweathermap.org/img/wn/' + city.weather[0].icon + '@2x.png';
  var icon = document.createElement('img');
  icon.setAttribute('src', imgUrl);

  cityEl.textContent = searchTerm + " " + searchDate ;

  cityEl.appendChild(icon);

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
  listItem.classList = "list-group-item text-center rounded mb-3 border-warning h4";
  listItem.textContent = searchTerm;

  // Prepends search terms to keep most recent near the top
  cityList.prepend(listItem);
};

var displayFiveDay = function(forecast) {
  forecastHeader.classList = 'my-4 text-warning visible';
  cardRow.classList = 'row d-flex justify-content-around text-dark visible';

  cardRow.innerHTML = '';

  for (let i = 1; i < 6; i++) {
    var card = document.createElement('div');
    card.classList = 'card border col-12 col-lg-2 p-0 mb-5';

    var cardHeader = document.createElement('div');
    cardHeader.className = 'card-header';
    var h5 = document.createElement('div');
    h5.className = 'h5';
    var dateObj = new Date(forecast.daily[i].dt * 1000);
    var forecastDate = dateObj.toLocaleString('en-US', {weekday: 'long', month: 'numeric', day: 'numeric', year: 'numeric'});
    h5.textContent = forecastDate;
    cardHeader.appendChild(h5)
    var icon = document.createElement('img');
    var imgUrl = 'http://openweathermap.org/img/wn/' + forecast.daily[i].weather[0].icon + '@2x.png';
    icon.setAttribute('src', imgUrl);
    cardHeader.appendChild(icon);
    card.appendChild(cardHeader);

    var listEl = document.createElement('ul');
    listEl.classList = 'list-group text-left';
    var tempEl = document.createElement('li');
    tempEl.classList = 'list-group-item pl-2';
    tempEl.textContent = 'Temp: ' + forecast.daily[i].temp.day + ' °F';
    var windEl = document.createElement('li');
    windEl.classList = 'list-group-item pl-2';
    windEl.textContent = 'Wind: ' + forecast.daily[i].wind_speed + ' MPH';
    var humidEl = document.createElement('li');
    humidEl.classList = 'list-group-item pl-2';
    humidEl.textContent = 'Humidity: ' + forecast.daily[i].humidity + ' %';

    listEl.appendChild(tempEl);
    listEl.appendChild(windEl);
    listEl.appendChild(humidEl);

    card.appendChild(listEl);

    cardRow.appendChild(card);
  }
  console.log(forecast);
}

searchForm.addEventListener("submit", formHandler);
