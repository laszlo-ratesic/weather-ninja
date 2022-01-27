const formInput = document.getElementById('city');
const cityEl = document.getElementById('city-el');
const searchForm = document.getElementById('search-form');

var formHandler = function(event) {
    event.preventDefault();

    var city = formInput.value.trim();

    if (city) {
        getWeatherData(city)

        cityEl.textContent = '';
        formInput.value = '';
    } else {
        alert('Please enter the name of a city');
    }
}

var getWeatherData = function(city) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=292188850e48297da1a005edf38e34bf';

    fetch(apiUrl)
    .then(function(response) {
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayWeather(data, city);
            })
        } else {
            alert('Error: ' + response.statusText);
        }
    })
    .catch(function(error) {
        alert('Unable to connect to Open Weather API');
    })
}

var displayWeather = function(city, searchTerm) {
    cityEl.textContent = searchTerm;
}

searchForm.addEventListener('submit', formHandler);