
function WeatherCard({ weather }) {
  const icon = weather.weather[0].icon;

  return (
    <div className="card">
      <h2>{weather.name}</h2>

      <img
        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        alt="weather icon"
      />

      <h3>{weather.main.temp} °C</h3>
      <p>{weather.weather[0].main}</p>
      <p>Humidity: {weather.main.humidity}%</p>
    </div>
  );
}

export default WeatherCard;