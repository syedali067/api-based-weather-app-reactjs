import { useState } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard.jsx";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const API_KEY = "ff2b8e6cb0015555604532d60a8771ea";

  const toggleTheme = () => {
  setDarkMode(!darkMode);
};

  const getWeather = async () => {
  if (!city) return;

  setLoading(true);
  setError("");

  try {
    // Current weather
    const res1 = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data1 = await res1.json();

    if (data1.cod === "404") {
      setWeather(null);
      setForecast([]);
      setError("City not found ❌");
      setLoading(false);
      return;
    }

    setWeather(data1);

    // Forecast (5 day)
    const res2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data2 = await res2.json();

    // we take only 1 per day (every 8th item = 24h gap)
    const dailyData =
  data2?.list?.filter((_, index) => index % 8 === 0) || [];

    setForecast(dailyData);
    setLoading(false);
  } catch (err) {
    setError("Something went wrong ❌");
    setLoading(false);
  }
};

const getLocationWeather = () => {
  setLoading(true);
  setError("");

  console.log("Requesting location...");

  if (!navigator.geolocation) {
    setError("Geolocation not supported ❌");
    setLoading(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      console.log("Location granted ✔");

      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
      );

      const data = await res.json();

      setWeather(data);
      setCity(data.name);

      setLoading(false);
    },
    (error) => {
      console.log("Location error:", error);

      setError("Location permission denied ❌");
      setLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

 return (
  <div className={darkMode ? "app dark" : "app"}>
    <h1>Weather App 🌤️</h1>
    <div className="input-container">
  <input
    type="text"
    placeholder="Enter city..."
    value={city}
    onChange={(e) => setCity(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") getWeather();
    }}
  />

  <button onClick={getWeather}>Search</button>

  <button onClick={getLocationWeather}>
    📍 Use My Location
  </button>

  <button onClick={toggleTheme}>
    {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
  </button>
</div>

    {loading && <p>Loading...</p>}
    {error && <p className="error">{error}</p>}

    {weather && <WeatherCard weather={weather} />}

    {/* FORECAST CODE HERE */}
    {forecast.length > 0 && (
      <div className="forecast">
        {forecast.map((item, index) => (
          <div key={index} className="forecast-card">
            <p>
  {new Date(item.dt_txt).toLocaleDateString("en-US", {
    weekday: "short",
  })}
</p>
            <p>{item.main.temp} °C</p>
            <p>{item.weather[0].main}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default App;