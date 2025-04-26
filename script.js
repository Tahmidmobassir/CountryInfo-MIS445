const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const countriesContainer = document.getElementById("countriesContainer");

const weatherApiKey = "23aadedcaf5836fbf2129a19de5bcc36";

searchBtn.addEventListener("click", () => {
  const countryName = searchInput.value.trim();
  if (countryName !== "") {
    fetchCountryData(countryName);
  }
});

function fetchCountryData(country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json())
    .then((data) => {
      displayCountries(data);
    })
    .catch((error) => {
      console.log(error);

      console.error("Error fetching countries:", error);
      countriesContainer.innerHTML = `<p>Country not found!</p>`;
    });
}

function displayCountries(countries) {
  countriesContainer.innerHTML = "";
  countries.forEach((country) => {
    const countryCard = document.createElement("div");
    countryCard.className = "country-card";

    countryCard.innerHTML = `
      <img src="${country.flags.svg}" alt="Flag of ${
      country.name.common
    }" class="country-flag">
      <h3 class="country-name">${country.name.common}</h3>
      <p class="country-info"><strong>Region:</strong> ${country.region}</p>
      <p class="country-info"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p class="country-info"><strong>Capital:</strong> ${
        country.capital ? country.capital[0] : "N/A"
      }</p>
      <button class="more-details-btn">More Details</button>
    `;

    const moreDetailsBtn = countryCard.querySelector(".more-details-btn");
    moreDetailsBtn.addEventListener("click", () => {
      showMoreDetails(country);
    });

    countriesContainer.appendChild(countryCard);
  });
}

function showMoreDetails(country) {
  const capitalCity = country.capital ? country.capital[0] : "";
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=${weatherApiKey}&units=metric`
  )
    .then((response) => response.json())
    .then((weatherData) => {
      const modal = document.getElementById("detailsModal");
      const modalBody = document.getElementById("modalBody");
      const closeBtn = document.querySelector(".close-btn");

      modalBody.innerHTML = `
          <h2>${country.name.official}</h2>
          <p><strong>Subregion:</strong> ${country.subregion || "N/A"}</p>
          <p><strong>Area:</strong> ${country.area} km²</p>
          <p><strong>Currencies:</strong> ${
            country.currencies
              ? Object.values(country.currencies)
                  .map((c) => c.name)
                  .join(", ")
              : "N/A"
          }</p>
          <p><strong>Weather:</strong> ${
            weatherData.weather ? weatherData.weather[0].description : "N/A"
          }</p>
          <p><strong>Temperature:</strong> ${
            weatherData.main ? weatherData.main.temp + "°C" : "N/A"
          }</p>
        `;

      modal.style.display = "block";

      closeBtn.onclick = function () {
        modal.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    })
    .catch((error) => {
      console.error("Error fetching weather:", error);
      alert("Could not fetch weather data.");
    });
}
