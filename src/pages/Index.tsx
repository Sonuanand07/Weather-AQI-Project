import { useState } from "react";
import { WeatherSearch } from "@/components/WeatherSearch";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastCard } from "@/components/ForecastCard";
import { AirQualityCard } from "@/components/AirQualityCard";
import { Loader2, Cloud } from "lucide-react";

const Index = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [airQualityData, setAirQualityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-weather-sky-light/10 to-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Weather Search
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get real-time weather, air quality, and 5-day forecast for any location worldwide
          </p>
        </div>

        {/* Search */}
        <div className="flex justify-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <WeatherSearch 
            onWeatherData={setWeatherData} 
            onForecastData={setForecastData}
            onAirQualityData={setAirQualityData}
            onLoading={setLoading} 
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">Fetching weather data...</p>
            </div>
          </div>
        )}

        {/* Weather Results */}
        {!loading && weatherData && (
          <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom duration-700">
            <WeatherCard weather={weatherData} />
            {airQualityData && <AirQualityCard airQuality={airQualityData} />}
            {forecastData && <ForecastCard forecast={forecastData} />}
          </div>
        )}

        {/* Empty State */}
        {!loading && !weatherData && (
          <div className="text-center py-20 animate-in fade-in duration-700">
            <Cloud className="h-24 w-24 text-muted-foreground/20 mx-auto mb-6" />
            <p className="text-xl text-muted-foreground">
              Search for a city or use your current location to see weather conditions
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border/50 mt-16">
        <p>Weather data provided by OpenWeatherMap API • Cached for 10 minutes for optimal performance</p>
      </footer>
    </div>
  );
};

export default Index;
