// CONSTANTS
const formInput = document.getElementById("city");
const cityEl = document.getElementById("city-el");
const searchForm = document.getElementById("search-form");
const cityList = document.getElementById("city-list");
const tempSpan = document.getElementById("temp");
const windSpan = document.getElementById("wind");
const humidSpan = document.getElementById("humidity");
const uvSpan = document.getElementById("uv-index");
const forecastHeader = document.getElementById("forecast-header");
const cardRow = document.getElementById("card-row");

let searchHistory = [];

// The formHandler function is called when the user submits the form.
function formHandler(event) {
  // Prevents the default refresh from happening
  event.preventDefault();

  // Gets the city name from the user (forces uppercase)
  const city = formInput.value.trim().toUpperCase();

  if (city) {
    // Gets weather data from API
    getWeatherData(city);

    // Clears current city and form input
    cityEl.textContent = "";
    formInput.value = "";
  } else {
    // If the city name is blank, it alerts the user that they need to enter a city name.
    alert("Please enter the name of a city");
  }
}

// Initial API call to get weather data against city name
function getWeatherData(city) {
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=292188850e48297da1a005edf38e34bf";

  // Calls the api given our specific params
  fetch(apiUrl)
    // takes the response
    .then(function (response) {
      // if we get a 200 (success)
      if (response.ok) {
        // ensure response gets converted to json
        response.json().then(function (data) {
          console.log(data);
          // calls displayWeather function using the json object
          // as well as the name of the city as its inputted string
          displayWeather(data, city);
        });
      } else {
        // alerts user with error message if response not a success
        alert("Error: " + response.statusText);
      }
    })
    // simple catch in case unable to connect to API
    .catch(function (error) {
      alert("Unable to connect to Open Weather API");
    });
}

// function takes city as a JSON object and cityName as a string
// to display weather data in slab as well as 5day forecast on cards
function displayWeather(city, cityName) {
  // uses separate api based on the coordinates of the chosen city
  const apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    city.coord.lat +
    "&lon=" +
    city.coord.lon +
    "&exclude=hourly&units=imperial&appid=292188850e48297da1a005edf38e34bf";

  // fetch data from API
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        // updates HTML to show city's uv index
        const uvIndex = data.current.uvi;
        uvSpan.textContent = uvIndex;

        // sets background color of uv index span depending on severity
        let severity;
        if (uvIndex < 3) {
          severity = "#3F9500";
        } else if (uvIndex >= 3 && uvIndex <= 5) {
          severity = "#f5e300";
        } else if (uvIndex >= 6 && uvIndex <= 7) {
          severity = "#ef5800";
        } else if (uvIndex >= 8 && uvIndex <= 10) {
          severity = "#cf000E";
        } else {
          severity = "#694bcd";
        }
        uvSpan.setAttribute("style", "background-color: " + severity + ";");
        console.log(data);

        // displays five day forecast
        displayFiveDay(data);
      });
    }
  });

  // Uses Date constructor to grab UNIX timestamp of api fetch
  let dateObj = new Date(city.dt * 1000);
  // localeString converts UTC date to human-readable string
  const searchDate = dateObj.toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  // access openWeather database to display an enlarged appropriate icon
  // based on city's current weather condition
  const imgUrl =
    "http://openweathermap.org/img/wn/" + city.weather[0].icon + "@2x.png";
  var icon = document.createElement("img");
  icon.setAttribute("src", imgUrl);

  // Display city name, date, current weather icon, as well as other vital information
  cityEl.textContent = cityName + " " + searchDate;
  cityEl.appendChild(icon);
  tempSpan.textContent = city.main.temp;
  windSpan.textContent = city.wind.speed;
  humidSpan.textContent = city.main.humidity;

  // Passes city name to save function
  savecityName(cityName);
}

/**
 * Save the city name to the search history array and display it in the search history list
 * @param cityName - The city name that was entered into the search bar.
 */
function savecityName(cityName) {
  // Ensures duplicates are not appended
  for (let i = 0; i < cityList.children.length; i++) {
    if (cityList.children[i].textContent === cityName) {
      return;
    }
  }
  searchHistory.push(cityName);
  localStorage.setItem("history", JSON.stringify(searchHistory));
  displaySearchHistory(cityName);
}

/**
 * Create a list item with the city name and add it to the list
 * @param cityName - the name of the city that was searched
 */
function displaySearchHistory(cityName) {
  const listItem = document.createElement("li");
  listItem.classList =
    "list-group-item text-center rounded mb-3 border-warning h4";
  listItem.textContent = cityName;
  listItem.setAttribute("style", "cursor:pointer;");

  // Prepends search terms to keep most recent near the top
  cityList.prepend(listItem);

  // Hover effects
  listItem.addEventListener("mouseenter", function (event) {
    event.target.classList += " bg-warning";
  });
  listItem.addEventListener("mouseleave", function (event) {
    event.target.classList.remove("bg-warning");
  });
  // click/touch listeners on search history
  listItem.addEventListener("click", historyHandler);
  listItem.addEventListener("touch", historyHandler);
}

// Display the five day forecast.
function displayFiveDay(forecast) {
  /* Create a row of cards to display forecast. */
  forecastHeader.classList = "my-4 text-warning visible";
  cardRow.classList = "row d-flex justify-content-around text-dark visible";
  cardRow.innerHTML = "";

  /* Create a card for each day of the forecast. */
  for (let i = 1; i < 6; i++) {
    const card = document.createElement("div");
    card.classList =
      "card border col-12 col-lg-2 p-0 mb-5 bg-warning border-warning";

    const cardHeader = document.createElement("div");
    cardHeader.classList = "card-header bg-warning";
    const h5 = document.createElement("div");
    h5.className = "h5";

    // Displays human-readable date for each day
    const dateObj = new Date(forecast.daily[i].dt * 1000);
    const forecastDate = dateObj.toLocaleString("en-US", {
      weekday: "long",
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
    h5.textContent = forecastDate;
    cardHeader.appendChild(h5);

    // Adds weather icon depending on condition
    const icon = document.createElement("img");
    const imgUrl =
      "http://openweathermap.org/img/wn/" +
      forecast.daily[i].weather[0].icon +
      "@2x.png";
    icon.setAttribute("src", imgUrl);
    cardHeader.appendChild(icon);
    card.appendChild(cardHeader);

    const listEl = document.createElement("ul");
    listEl.classList = "list-group text-left bg-warning";
    const tempEl = document.createElement("li");
    tempEl.classList = "list-group-item pl-2 bg-light";
    tempEl.textContent = "Temp: " + forecast.daily[i].temp.day + " °F";
    const windEl = document.createElement("li");
    windEl.classList = "list-group-item pl-2 bg-light";
    windEl.textContent = "Wind: " + forecast.daily[i].wind_speed + " MPH";
    const humidEl = document.createElement("li");
    humidEl.classList = "list-group-item pl-2 bg-light";
    humidEl.textContent = "Humidity: " + forecast.daily[i].humidity + " %";

    listEl.appendChild(tempEl);
    listEl.appendChild(windEl);
    listEl.appendChild(humidEl);

    card.appendChild(listEl);

    cardRow.appendChild(card);
  }
}

// The historyHandler function is called when the user clicks on a search history item.
function historyHandler(event) {
  // The event.preventDefault() method prevents the browser from following the link.
  event.preventDefault();

  // The event.target.textContent property returns the text content of the element that was clicked.
  var itemClicked = event.target.textContent;

  // If the itemClicked variable is truthy, the getWeatherData function is called with the itemClicked
  // value as an argument.
  if (itemClicked) {
    getWeatherData(itemClicked);
  }
}

/**
 * Loads the search history from local storage
 */
function loadSearchHistory() {
  searchHistory = JSON.parse(localStorage.getItem("history"));

  // creates empty array if not history in localstorage is found
  if (!searchHistory) {
    searchHistory = [];
  }

  /* Looping through the searchHistory array and displaying each item in the array. */
  for (let i = 0; i < searchHistory.length; i++) {
    displaySearchHistory(searchHistory[i]);
  }
}

loadSearchHistory();

searchForm.addEventListener("submit", formHandler);
