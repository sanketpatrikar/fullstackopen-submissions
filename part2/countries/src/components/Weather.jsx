import { useEffect } from "react";
import { useState } from "react";

const Weather = ({ Country }) => {
    let [weatherData, setWeatherData] = useState(null);

    const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

    const capitalCity = Country.capital[0];

    const fetchWeather = async () => {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${capitalCity}`
        );

        const data = await response.json();
        const weather = data.current;
        return weather;
    };

    useEffect(() => {
        const fetchWeatherData = async () => {
            const weather = await fetchWeather();
            setWeatherData(weather);
        };

        fetchWeatherData();
    }, [capitalCity]);

    if (!weatherData) {
        return <div>Loading weather data...</div>;
    }

    return (
        <>
            <h2>Weather in {Country.capital[0]}</h2>
			<img src={weatherData.condition.icon} />
            <p>temperature {weatherData.temp_c} Celcius</p>
            <p>wind {weatherData.wind_kph} km/h</p>
        </>
    );
};
export default Weather;
