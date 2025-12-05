import { useState } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface WeatherSearchProps {
  onWeatherData: (data: any) => void;
  onForecastData: (data: any) => void;
  onAirQualityData: (data: any) => void;
  onLoading: (loading: boolean) => void;
}

export const WeatherSearch = ({ onWeatherData, onForecastData, onAirQualityData, onLoading }: WeatherSearchProps) => {
  const [city, setCity] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);
  const { toast } = useToast();

  const fetchWeather = async (params: { city?: string; lat?: number; lon?: number }) => {
    onLoading(true);

    try {
      // Fetch current weather
      const { data: currentData, error: currentError } = await supabase.functions.invoke('weather-api', {
        body: { ...params, type: 'current' }
      });

      if (currentError) throw currentError;

      if (currentData.error) {
        toast({
          title: "Location Not Found",
          description: currentData.error,
          variant: "destructive",
        });
        onWeatherData(null);
        onForecastData(null);
        onAirQualityData(null);
        return;
      }

      onWeatherData(currentData);

      // Fetch 5-day forecast and air quality in parallel
      const [forecastResult, airQualityResult] = await Promise.all([
        supabase.functions.invoke('weather-api', {
          body: { ...params, type: 'forecast' }
        }),
        supabase.functions.invoke('weather-api', {
          body: { ...params, type: 'air_quality' }
        })
      ]);

      if (!forecastResult.error && !forecastResult.data?.error) {
        onForecastData(forecastResult.data);
      }

      if (!airQualityResult.error && !airQualityResult.data?.error) {
        onAirQualityData(airQualityResult.data);
      }

      if (currentData.cached) {
        toast({
          title: "Cached Result",
          description: "Showing cached weather data for faster response",
        });
      }
    } catch (error) {
      console.error('Weather search error:', error);
      toast({
        title: "Search Failed",
        description: "Unable to fetch weather data. Please try again.",
        variant: "destructive",
      });
      onWeatherData(null);
      onForecastData(null);
      onAirQualityData(null);
    } finally {
      onLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!city.trim()) {
      toast({
        title: "City Required",
        description: "Please enter a city name to search",
        variant: "destructive",
      });
      return;
    }

    await fetchWeather({ city: city.trim() });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setGeoLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setGeoLoading(false);
        await fetchWeather({ lat: latitude, lon: longitude });
      },
      (error) => {
        setGeoLoading(false);
        let message = "Unable to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access denied. Please enable location permissions.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out.";
        }
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            placeholder="Enter city name (e.g., London, Tokyo)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="h-14 text-lg bg-card/80 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline"
            size="lg"
            onClick={handleGeolocation}
            disabled={geoLoading}
            className="h-14 px-4 bg-card/80 backdrop-blur-sm border-border/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
          >
            {geoLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
            <span className="ml-2 hidden sm:inline">My Location</span>
          </Button>
          <Button 
            type="submit" 
            size="lg"
            className="h-14 px-8 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};
