const axios = require('axios');
require('dotenv').config()

// const apiKey = 'e98e4c97b896dfeda612ca8c873734f9';
const apiKey = process.env.OPEN_WEATHER_API_KEY;
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(latitude = 6.827028, longitude = 79.918472) {
    const params = {
        lat: latitude,
        lon: longitude,
        appid: apiKey,
    };

    try {
        const response = await axios.get(apiUrl, { params });
        const { weather, main, clouds, dt, name } = response.data;

        const weatherInfo = {
            weather: weather[0].main,
            description: weather[0].description,
            icon: weather[0].icon,
            temperature: main.temp,
            humidity: main.humidity,
            cloudiness: clouds.all,
            timeUTC: new Date(dt * 1000).toUTCString(),
            location: name,
        };

        const emoji = {
            rain: '🌧️',
            temperature: '🌡️',
            humidity: '💧',
            cloudiness: '☁️',
            location: '📍',
            clock: '🕒',
        };

        const temperatureInCelsius = (weatherInfo.temperature - 273.15).toFixed(2);
        const temperature = `${temperatureInCelsius} °C`;

        const message = `
            ${emoji.rain} *Weather*: ${weatherInfo.weather}
            *Description*: ${weatherInfo.description}
            ${emoji.temperature} *Temperature*: ${temperature}
            ${emoji.humidity} *Humidity*: ${weatherInfo.humidity}%
            ${emoji.cloudiness} *Cloudiness*: ${weatherInfo.cloudiness}%
            ${emoji.clock} *Time UTC*: ${weatherInfo.timeUTC}
            ${emoji.location} *Location*: ${weatherInfo.location}
        `;

        // Send a sticker based on the weather condition (uncomment and implement if needed)
        // if (weatherInfo.weather.toLowerCase().includes('rain')) {
        //     sendSticker(sticker.sad);
        // } else {
        //     sendSticker(sticker.happy);
        // }

        return message;
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        return 'Sorry, there was an error fetching weather data. Please try again later.';
    }
}

module.exports = { getWeather };
