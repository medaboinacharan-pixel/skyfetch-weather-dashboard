const apiKey = "YOUR_API_KEY"; // 🔑 replace this

const weatherDiv = document.getElementById("weather");
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");

// ⏳ Show Loading
function showLoading(){
  weatherDiv.innerHTML = `<div class="loader"></div>`;
}

// ❌ Show Error
function showError(message){
  weatherDiv.innerHTML = `<p class="error">${message}</p>`;
}

// 🌦 Get Weather (Async/Await)
async function getWeather(city){

  try{
    showLoading();

    searchBtn.disabled = true;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);

    const data = response.data;

    weatherDiv.innerHTML = `
      <h2>${data.name}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>${data.weather[0].description}</p>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"/>
    `;

  }catch(error){
    showError("City not found ❌");
  }finally{
    searchBtn.disabled = false;
  }
}

// 🔍 Button Click
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if(city === ""){
    showError("Please enter a city name ⚠️");
    return;
  }

  getWeather(city);
  cityInput.value = "";
});

// ⌨️ Enter Key Support
cityInput.addEventListener("keypress", (e) => {
  if(e.key === "Enter"){
    searchBtn.click();
  }
});