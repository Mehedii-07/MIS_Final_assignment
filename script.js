const countryGrid = document.getElementById("countryGrid");
const weatherGrid = document.getElementById("weatherGrid");
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");

// Fetch and display country data
searchButton.addEventListener("click", () => {
    const countryName = searchBox.value.trim();
    searchBox.value = "";

    if (!countryName) {
        alert("Please enter a country name!");
        return;
    }

    const countryAPI = `https://restcountries.com/v3.1/name/${countryName}`;
    fetch(countryAPI)
        .then(response => response.json())
        .then(data => {
            if (!data || data.status === 404) {
                alert("Country not found!");
                return;
            }
            displayCountries(data);
        })
        .catch(error => console.error("Error fetching country data:", error));
});

// Display country cards
function displayCountries(countries) {
    countryGrid.innerHTML = "";
    weatherGrid.innerHTML = "";

    countries.forEach(country => {
        const card = document.createElement("div");
        card.classList.add("col");

        card.innerHTML = `
            <div class="country-card">
                <img src="${country.flags.png}" alt="${country.name.common}" class="img-fluid mb-3">
                <h5>${country.name.common}</h5>
                <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
                <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
                <p><strong>Currency:</strong> ${
                    Object.values(country.currencies)[0]?.name || "N/A"
                } (${Object.values(country.currencies)[0]?.symbol || "N/A"})</p>
                <button class="btn btn-primary mt-3" onclick="getWeather('${country.latlng[0]}', '${country.latlng[1]}', '${country.name.common}')">View Weather</button>
            </div>
        `;

        countryGrid.appendChild(card);
    });
}

// Fetch weather data and display in grid
function getWeather(lat, lon, countryName) {
    const weatherAPI = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    fetch(weatherAPI)
        .then(response => response.json())
        .then(data => {
            const weather = data.current_weather;

            const weatherCard = document.createElement("div");
            weatherCard.classList.add("col");

            weatherCard.innerHTML = `
                <div class="weather-card">
                    <h5>Weather in ${countryName}</h5>
                    <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
                    <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
                    <p><strong>Condition Code:</strong> ${weather.weathercode || "N/A"}</p>
                </div>
            `;

            weatherGrid.appendChild(weatherCard);
        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
            alert("Unable to fetch weather data. Please try again later.");
        });
}
