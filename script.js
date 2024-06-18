const APIKey = `4b65d7973695bfb513b6bf4b5cf4590c`;

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationEl = document.getElementById("location");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const dateEl = document.getElementById("date");
const iconEl = document.getElementById("icon");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

searchButton.addEventListener("click", () => {
  const location = locationInput.value;
  if (location) {
    fetchWeather(location);
  }
});

function fetchWeather(location) {
  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}&units=imperial`;

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      const weatherIcon = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      locationEl.textContent = data.name;
      dateEl.textContent = new Date().toLocaleDateString();
      temperature.textContent = `${Math.round(data.main.temp)} °F`;
      description.textContent = data.weather[0].description;
      iconEl.src = weatherIcon;
      humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
      windEl.textContent = `Wind Speed: ${data.wind.speed} mph`;
    })
    .catch((error) => {
      console.error("Error fetching weather", error);
    });
}
