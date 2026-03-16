const apiKey = "YOUR_API_KEY";

function getWeather(city){

const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

axios.get(url)

.then(function(response){

const data = response.data;

document.getElementById("city").innerText = data.name;

document.getElementById("temp").innerText =
"Temperature: " + data.main.temp + " °C";

document.getElementById("desc").innerText =
data.weather[0].description;

const icon = data.weather[0].icon;

document.getElementById("icon").src =
`https://openweathermap.org/img/wn/${icon}@2x.png`;

})

.catch(function(error){
console.log("Error:", error);
});

}

getWeather("London");