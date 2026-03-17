function WeatherApp() {
  this.API_KEY = "YOUR_API_KEY";

  this.searchInput = document.getElementById("searchInput");
  this.searchBtn = document.getElementById("searchBtn");
  this.weatherContainer = document.getElementById("weatherContainer");
  this.forecastContainer = document.getElementById("forecastContainer");
}

// INIT
WeatherApp.prototype.init = function () {
  this.showWelcome();

  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      this.handleSearch();
    }
  });
};

// SEARCH
WeatherApp.prototype.handleSearch = function () {
  const city = this.searchInput.value.trim();

  if (!city) {
    this.showError("Please enter a city name");
    return;
  }

  this.getWeather(city);
};

// FETCH WEATHER + FORECAST
WeatherApp.prototype.getWeather = async function (city) {
  try {
    this.showLoading();

    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}&units=metric`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.API_KEY}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherURL),
      fetch(forecastURL),
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) {
      throw new Error("City not found");
    }

    this.displayWeather(weatherData);

    const processed = this.processForecastData(forecastData.list);
    this.displayForecast(processed);

  } catch (error) {
    this.showError(error.message);
  }
};

// DISPLAY CURRENT WEATHER
WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p>🌡 ${data.main.temp}°C</p>
    <p>🌥 ${data.weather[0].description}</p>
  `;
};

// PROCESS FORECAST DATA
WeatherApp.prototype.processForecastData = function (list) {
  const result = [];

  list.forEach((item) => {
    if (item.dt_txt.includes("12:00:00")) {
      result.push(item);
    }
  });

  return result.slice(0, 5);
};

// DISPLAY FORECAST
WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";

  data.forEach((day) => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    this.forecastContainer.innerHTML += `
      <div class="card">
        <h3>${dayName}</h3>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" />
        <p>${day.main.temp}°C</p>
        <p>${day.weather[0].description}</p>
      </div>
    `;
  });
};

// LOADING
WeatherApp.prototype.showLoading = function () {
  this.weatherContainer.innerHTML = "<p>Loading...</p>";
  this.forecastContainer.innerHTML = "";
};

// ERROR
WeatherApp.prototype.showError = function (msg) {
  this.weatherContainer.innerHTML = `<p>${msg}</p>`;
  this.forecastContainer.innerHTML = "";
};

// WELCOME
WeatherApp.prototype.showWelcome = function () {
  this.weatherContainer.innerHTML = "<p>Search for a city to get weather 🌍</p>";
};

// START APP
const app = new WeatherApp();
app.init();