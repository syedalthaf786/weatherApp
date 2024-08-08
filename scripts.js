// import mapboxgl from 'mapbox-gl';
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-btn");
const map1=document.querySelector('#map')
const API_KEY = "ae40ea0dd71e662bf5c7bd6cb840f20f"; // OpenWeatherMap API Key

// Initialize Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWZmdTQyMSIsImEiOiJjbHpqdWZoMzYwczdvMm1xeGxjaTRoa2I5In0.fVuWKDXMpxFg-C9EEv9l5Q'; // Replace with your Mapbox access token
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    zoom:1,
    projection: "globe"
});

// Create weather popup content based on weather data
const createWeatherPopupContent = (cityName, weatherData) => {
    const temperature = (weatherData.main.temp - 273.15).toFixed(2); // Convert from Kelvin to Celsius
    const weatherDescription = weatherData.weather[0].description;
    const weatherIcon = weatherData.weather[0].icon;

    return `<div>
                        <h3>${cityName}</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="weather icon">
                        <p>Weather: ${weatherDescription}</p>
                        <p>Temperature: ${temperature}°C</p>
                        <p>Wind: ${weatherData.wind.speed} M/S</p>
                        <p>Humidity: ${weatherData.main.humidity}%</p>
                    </div>`;
}

// Bounce animation for markers
const bounceMarker = (marker) => {
    const el = marker.getElement();
    el.classList.add('bounce');
    setTimeout(() => {
        el.classList.remove('bounce');
    }, 300); // Duration of the bounce animation
};

// Add marker with bounce effect
// Add marker with bounce effect
const addMarkerWithAnimation = (longitude, latitude, popupContent) => {
    const marker = new mapboxgl.Marker({ className: 'marker' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup({
        offset: [0, -25] // adjust the offset to position the popup above the marker
      }).setHTML(popupContent))
      .addTo(map);
    marker.getElement().addEventListener('mouseover', () => {
      marker.togglePopup();
    });
  
    marker.getElement().addEventListener('mouseout', () => {
      marker.togglePopup();
    });
    bounceMarker(marker);
  };

// Smooth zoom to location
const zoomToLocation = (longitude, latitude) => {
    map.flyTo({
        center: [longitude, latitude],
        zoom: 10,
        essential: true
    });
};

// Get current weather details of the city
const getCurrentWeatherDetails = (cityName, latitude, longitude) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
        const popupContent = createWeatherPopupContent(cityName, data);

        addMarkerWithAnimation(longitude, latitude, popupContent);
        zoomToLocation(longitude, latitude);
    }).catch(() => {
        alert("An error occurred while fetching the weather data!");
    });
}

// Get coordinates of entered city name
const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`Enter a correct city name.`);
        const { lat, lon, name } = data[0];
        getCurrentWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

searchButton.addEventListener("click", () => {
    getCityCoordinates();
    map1.style.visibility='visible';
});
