function WeatherApp() {
  this.apiKey = "YOUR_API_KEY";

  this.cityInput = document.getElementById("cityInput");
  this.searchBtn = document.getElementById("searchBtn");

  this.weatherContainer = document.getElementById("weatherContainer");
  this.forecastContainer = document.getElementById("forecastContainer");

  this.recentList = document.getElementById("recentList");
  this.clearBtn = document.getElementById("clearBtn");

  this.recentSearches = [];
}

WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.loadRecentSearches();
  this.loadLastCity();

  this.clearBtn.addEventListener("click", this.clearHistory.bind(this));
};

WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();
  if (city) {
    this.getWeather(city);
  }
};

WeatherApp.prototype.getWeather = async function (city) {
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${this.apiKey}&units=metric`;

    const [weatherRes, forecastRes] = await Promise.all([
      fetch(weatherUrl),
      fetch(forecastUrl)
    ]);

    const weatherData = await weatherRes.json();
    const forecastData = await forecastRes.json();

    if (weatherData.cod !== 200) {
      this.weatherContainer.innerHTML = "City not found!";
      return;
    }

    this.displayWeather(weatherData);
    this.displayForecast(forecastData);

    this.saveRecentSearch(city);

  } catch (error) {
    this.weatherContainer.innerHTML = "Error fetching data";
  }
};

WeatherApp.prototype.displayWeather = function (data) {
  this.weatherContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.main.temp}°C</p>
    <p>${data.weather[0].description}</p>
  `;
};

WeatherApp.prototype.displayForecast = function (data) {
  this.forecastContainer.innerHTML = "";

  const dailyData = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  dailyData.slice(0, 5).forEach(day => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <p>${new Date(day.dt_txt).toDateString()}</p>
      <p>${day.main.temp}°C</p>
      <p>${day.weather[0].description}</p>
    `;

    this.forecastContainer.appendChild(card);
  });
};

/* ================== LOCAL STORAGE ================== */

WeatherApp.prototype.loadRecentSearches = function () {
  const data = localStorage.getItem("recentSearches");

  if (data) {
    this.recentSearches = JSON.parse(data);
    this.displayRecentSearches();
  }
};

WeatherApp.prototype.saveRecentSearch = function (city) {
  city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();

  this.recentSearches = this.recentSearches.filter(c => c !== city);

  this.recentSearches.unshift(city);

  if (this.recentSearches.length > 5) {
    this.recentSearches.pop();
  }

  localStorage.setItem("recentSearches", JSON.stringify(this.recentSearches));
  localStorage.setItem("lastCity", city);

  this.displayRecentSearches();
};

WeatherApp.prototype.displayRecentSearches = function () {
  this.recentList.innerHTML = "";

  this.recentSearches.forEach(city => {
    const btn = document.createElement("button");
    btn.className = "recent-btn";
    btn.textContent = city;

    btn.addEventListener("click", () => {
      this.getWeather(city);
    });

    this.recentList.appendChild(btn);
  });
};

WeatherApp.prototype.loadLastCity = function () {
  const lastCity = localStorage.getItem("lastCity");

  if (lastCity) {
    this.getWeather(lastCity);
  }
};

WeatherApp.prototype.clearHistory = function () {
  localStorage.removeItem("recentSearches");
  this.recentSearches = [];
  this.displayRecentSearches();
};

/* ================== INIT ================== */

const app = new WeatherApp();
app.init();