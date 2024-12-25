const countryContainer = document.getElementById('countryContainer');

async function fetchCountryData() {
  const countryName = document.getElementById('countryInput').value.trim();
  if (!countryName) {
    alert('Please enter a country name!');
    return;
  }

  try {
    // Fetch country data
    const countryResponse = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    if (!countryResponse.ok) {
      throw new Error('Country not found');
    }
    const countryData = await countryResponse.json();
    displayCountryData(countryData);
  } catch (error) {
    alert(error.message);
  }
}

function displayCountryData(data) {
  countryContainer.innerHTML = '';
  data.forEach(country => {
    const countryCard = document.createElement('div');
    countryCard.classList.add('col-md-4', 'col-sm-6');

    // Currency handling
    const currency = Object.values(country.currencies)[0];
    const currencyName = currency?.name || 'N/A';
    const currencySymbol = currency?.symbol || 'N/A';

    // Country card template
    countryCard.innerHTML = `
      <div class="card">
        <img src="${country.flags.svg}" class="card-img-top" alt="Flag of ${country.name.common}">
        <div class="card-body">
          <h5 class="card-title">${country.name.common}</h5>
          <p class="card-text">
            <strong>Currency:</strong> ${currencyName} (${currencySymbol})
          </p>
          <button class="btn btn-primary" onclick="fetchWeatherData('${country.capital[0]}', '${country.name.common}')">View Weather</button>
        </div>
      </div>
    `;

    countryContainer.appendChild(countryCard);
  });
}

async function fetchWeatherData(capital, countryName) {
  try {
    const apiKey = 'YOUR_API_KEY'; // Replace with a valid weather API key
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`
    );
    if (!weatherResponse.ok) {
      throw new Error('Weather data not found');
    }
    const weatherData = await weatherResponse.json();

    // Display weather data
    alert(`Weather in ${capital}, ${countryName}:
    - Temperature: ${weatherData.main.temp}°C
    - Description: ${weatherData.weather[0].description}
    - Humidity: ${weatherData.main.humidity}%`);
  } catch (error) {
    alert(error.message);
  }
}
