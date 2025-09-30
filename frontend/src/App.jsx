import React, { useState } from 'react';
import { fetchWeather } from './api/weatherApi';
import './App.css';

// Import icons
import {
  WiDaySunny, WiDayCloudy, WiCloud, WiCloudy, WiShowers,
  WiRain, WiThunderstorm, WiSnow, WiFog, WiNightClear,
  WiNightCloudy, WiNightRain,
  WiHumidity, WiStrongWind
} from 'react-icons/wi';
import { FiSearch, FiMapPin } from 'react-icons/fi';

// Map API icon codes to icons
const getWeatherIcon = (iconCode) => {
  switch (iconCode) {
    case '01d': return <WiDaySunny />;
    case '01n': return <WiNightClear />;
    case '02d': return <WiDayCloudy />;
    case '02n': return <WiNightCloudy />;
    case '03d':
    case '03n': return <WiCloud />;
    case '04d':
    case '04n': return <WiCloudy />;
    case '09d':
    case '09n': return <WiShowers />;
    case '10d': return <WiRain />;
    case '10n': return <WiNightRain />;
    case '11d':
    case '11n': return <WiThunderstorm />;
    case '13d':
    case '13n': return <WiSnow />;
    case '50d':
    case '50n': return <WiFog />;
    default: return <WiDaySunny />;
  }
};

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadWeather = async (params) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);
    try {
      const response = await fetchWeather(params);
      setWeatherData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || '⚠️ Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (city) loadWeather({ city });
  };

  const handleGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          loadWeather({ lat: latitude, lon: longitude });
        },
        () => setError('⚠️ Unable to retrieve your location.')
      );
    } else {
      setError('⚠️ Geolocation is not supported by your browser.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="weather-widget">
      {/* --- Search Bar --- */}
      <div className="search-bar">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Enter city name..."
        />
        <button onClick={handleSearch} title="Search">
          <FiSearch size={18} />
        </button>
        <button onClick={handleGeoLocation} title="Use My Location">
          <FiMapPin size={18} />
        </button>
      </div>

      {/* --- Loading State --- */}
      {loading && (
        <p style={{ textAlign: 'center', fontSize: '0.95rem' }}>⏳ Loading weather...</p>
      )}

      {/* --- Error State --- */}
      {error && (
        <div
          style={{
            background: 'rgba(255, 80, 80, 0.15)',
            border: '1px solid rgba(255, 80, 80, 0.5)',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#ff8a8a',
          }}
        >
          {error}
        </div>
      )}

      {/* --- Weather Data --- */}
      {weatherData && (
        <div className="weather-display">
          {/* Current Weather */}
          <div className="current-weather">
            <h2>{weatherData.location}</h2>
            <div className="icon-wrapper">
              {getWeatherIcon(weatherData.current.icon)}
            </div>
            <p className="temperature">
              {weatherData.current.temperature.toFixed(0)}°C
            </p>
            <p className="condition">{weatherData.current.condition}</p>
            <div className="extra-details">
              <span>
                <WiHumidity /> {weatherData.current.humidity}%
              </span>
              <span>
                <WiStrongWind /> {weatherData.current.wind_speed.toFixed(1)} km/h
              </span>
            </div>
          </div>

          {/* Forecast */}
          <div className="forecast-panel">
            <h3>7-Day Forecast</h3>
            {weatherData.forecast.map((day) => (
              <div key={day.date} className="forecast-day">
                <span>
                  {new Date(day.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </span>
                <span className="icon-wrapper-small">{getWeatherIcon(day.icon)}</span>
                <span>
                  {day.temp_max.toFixed(0)}° / {day.temp_min.toFixed(0)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
