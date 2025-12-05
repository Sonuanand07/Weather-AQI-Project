import { Cloud, Droplets, Wind, Eye, Gauge, Sunrise, Sunset, Thermometer } from "lucide-react";
import { Card } from "@/components/ui/card";

interface WeatherCardProps {
  weather: any;
}

export const WeatherCard = ({ weather }: WeatherCardProps) => {
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const weatherMain = weather.weather[0].main.toLowerCase();
  const description = weather.weather[0].description;
  const iconCode = weather.weather[0].icon;

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWeatherGradient = () => {
    if (weatherMain.includes('clear')) return 'bg-gradient-to-br from-weather-sun-yellow/20 to-weather-sun-orange/20';
    if (weatherMain.includes('cloud')) return 'bg-gradient-to-br from-weather-cloud/10 to-muted/20';
    if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) return 'bg-gradient-to-br from-weather-rain/20 to-weather-sky-bright/20';
    if (weatherMain.includes('snow')) return 'bg-gradient-to-br from-sky-200/20 to-blue-100/20';
    return 'bg-gradient-to-br from-primary/10 to-accent/10';
  };

  return (
    <Card className={`w-full max-w-4xl p-8 shadow-xl backdrop-blur-sm border-border/50 ${getWeatherGradient()} animate-in fade-in duration-500`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="text-xl text-muted-foreground capitalize">{description}</p>
        </div>
        <img 
          src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
          alt={description}
          className="w-32 h-32 drop-shadow-lg"
        />
      </div>

      {/* Main Temperature */}
      <div className="mb-8">
        <div className="flex items-baseline gap-2">
          <span className="text-7xl font-bold text-foreground">{temp}°</span>
          <span className="text-3xl text-muted-foreground">C</span>
        </div>
        <p className="text-lg text-muted-foreground mt-2 flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Feels like {feelsLike}°C
        </p>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm">
          <Droplets className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Humidity</p>
            <p className="text-2xl font-semibold text-foreground">{weather.main.humidity}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm">
          <Wind className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Wind Speed</p>
            <p className="text-2xl font-semibold text-foreground">{weather.wind.speed} m/s</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm">
          <Gauge className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Pressure</p>
            <p className="text-2xl font-semibold text-foreground">{weather.main.pressure} hPa</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm">
          <Eye className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Visibility</p>
            <p className="text-2xl font-semibold text-foreground">{(weather.visibility / 1000).toFixed(1)} km</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm">
          <Cloud className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Cloudiness</p>
            <p className="text-2xl font-semibold text-foreground">{weather.clouds.all}%</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-card/60 backdrop-blur-sm">
          <Thermometer className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">Min / Max</p>
            <p className="text-2xl font-semibold text-foreground">
              {Math.round(weather.main.temp_min)}° / {Math.round(weather.main.temp_max)}°
            </p>
          </div>
        </div>
      </div>

      {/* Sun Times */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-weather-sun-yellow/20 to-weather-sun-orange/20">
          <Sunrise className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Sunrise</p>
            <p className="text-xl font-semibold text-foreground">{formatTime(weather.sys.sunrise)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-weather-sun-orange/20 to-weather-sun-yellow/20">
          <Sunset className="h-8 w-8 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Sunset</p>
            <p className="text-xl font-semibold text-foreground">{formatTime(weather.sys.sunset)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
