const APIKey = "4b65d7973695bfb513b6bf4b5cf4590c";

const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationEl = document.getElementById("location");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const dateEl = document.getElementById("date");
const iconEl = document.getElementById("icon");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const historyEl = document.getElementById("history");
const forecastEl = document.getElementById("forecast");

function fetchWeather(location) {
  const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${APIKey}&units=imperial`;

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

      locationEl.textContent = data.name;
      dateEl.textContent = new Date().toLocaleDateString();
      temperature.textContent = `${Math.round(data.main.temp)} °F`;
      description.textContent = data.weather[0].description;
      iconEl.src = weatherIcon;
      humidityEl.textContent = `Humidity: ${data.main.humidity}%`;
      windEl.textContent = `Wind Speed: ${data.wind.speed} mph`;
    })
    .catch((error) => {
      console.error("Error fetching weather. Please try again!", error);
    });
}

function fetchForecast(location) {
  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIKey}&units=imperial`;

  fetch(queryURL)
    .then((response) => response.json())
    .then((data) => {
      displayForecast(data);
    })
    .catch((error) => {
      console.error("Error fetching forecast. Please try again!", error);
    });
}

function displayForecast(data) {
  forecastEl.innerHTML = "";
  const forecastList = data.list;

  // Filter for one forecast per day at 12:00:00
  const dailyForecast = forecastList.filter((item) =>
    item.dt_txt.includes("12:00:00")
  );

  dailyForecast.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    const temp = `${Math.round(item.main.temp)} °F`;
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    const desc = item.weather[0].description;

    const forecastItem = document.createElement("div");
    forecastItem.className = "forecast-item";

    forecastItem.innerHTML = `
      <p>${date}</p>
      <img src="${icon}" alt="Weather icon" />
      <p>${temp}</p>
      <p>${desc}</p>
    `;

    forecastEl.appendChild(forecastItem);
  });
}

function updateHistory(location) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(location)) {
    history.push(location);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }
  displayHistory();
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyEl.innerHTML = "";
  history.forEach((location) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.textContent = location;
    historyItem.addEventListener("click", () => {
      fetchWeather(location);
      fetchForecast(location);
    });
    historyEl.appendChild(historyItem);
  });
}

searchButton.addEventListener("click", () => {
  const location = locationInput.value;
  if (location) {
    fetchWeather(location);
    fetchForecast(location);
    updateHistory(location);
  }
});

// Display history on page load
displayHistory();
