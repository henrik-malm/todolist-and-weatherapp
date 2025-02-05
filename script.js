// WEATHER APP

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const toggleButton = document.getElementById("toggle-mode");
const searchBox = document.getElementById("searchBox");
const filterCheckbox = document.getElementById("filterCheckbox");
const apiKey = "0c01d0e1657b86b2c3baecfc3d0be932";

let isForecast = false;         // false: current weather, true: forecast mode
let forecastDataCache = [];     // holds forecast list (from API)

// Toggle between Weather and Forecast modes
toggleButton.addEventListener("click", () => {
  isForecast = !isForecast;
  toggleButton.textContent = isForecast ? "Forecast" : "Weather";
  // Clear card and search when mode changes
  card.innerHTML = "";
  searchBox.value = "";
  forecastDataCache = [];
});

// Handle form submission
weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    displayError("Please enter a city.");
    return;
  }
  if (isForecast) {
    try {
      const forecastData = await getForecastData(city);
      forecastDataCache = forecastData.list; // store forecast list
      addToDOMForecast(forecastData.list);
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      displayError("Oops, something went wrong. Please try again.");
    }
  } else {
    try {
      const weatherData = await getWeatherData(city);
      addToDOM(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      displayError("Oops, something went wrong. Please try again.");
    }
  }
});

// Event listeners for search & filter in forecast mode
searchBox.addEventListener("input", filterForecast);
filterCheckbox.addEventListener("change", filterForecast);

// Fetch current weather data from the API
async function getWeatherData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiURL);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

// Fetch 5-day forecast data from the API
async function getForecastData(city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiURL);
  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return await response.json();
}

// Display current weather data in the DOM
function addToDOM(data) {
  const { name: city, main: { temp }, weather: [{ description }] } = data;
  card.style.display = "flex";
  card.innerHTML = `
    <div class="weather-details">
      <h1 class="cityDisplay">City: ${city}</h1>
      <h2 class="tempDisplay">Temperature: ${temp.toFixed(1)}°C</h2>
      <p class="descDisplay">Condition: ${description}</p>
    </div>
  `;
}

// Display forecast data in the DOM as a list
function addToDOMForecast(forecastList) {
  card.style.display = "flex";
  card.innerHTML = `<div class="forecast-container"></div>`;
  const container = card.querySelector(".forecast-container");
  forecastList.forEach((item) => {
    const dt = new Date(item.dt * 1000);
    const timeStr = dt.toLocaleString();
    const temp = item.main.temp.toFixed(1);
    const description = item.weather[0].description;
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("forecast-entry");
    entryDiv.innerHTML = `
      <p class="forecast-time">${timeStr}</p>
      <p class="forecast-temp">Temp: ${temp}°C</p>
      <p class="forecast-desc">Condition: ${description}</p>
    `;
    container.appendChild(entryDiv);
  });
}

// Filter forecast entries based on search query and checkbox
function filterForecast() {
  if (!isForecast || forecastDataCache.length === 0) return;
  const query = searchBox.value.trim().toLowerCase();
  const showAboveZero = filterCheckbox.checked;
  const filtered = forecastDataCache.filter((item) => {
    const temp = item.main.temp;
    const description = item.weather[0].description.toLowerCase();
    const matchesQuery = query === "" || description.includes(query) || temp.toString().includes(query);
    const matchesFilter = !showAboveZero || (temp > 0);
    return matchesQuery && matchesFilter;
  });
  addToDOMForecast(filtered);
}

// Display a friendly error message in the DOM
function displayError(message) {
  card.style.display = "flex";
  card.innerHTML = `<p class="errorDisplay">${message}</p>`;
  setTimeout(() => {
    card.style.display = "none";
    card.innerHTML = "";
  }, 5000);
}
