import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENWEATHER_API_KEY = Deno.env.get('OPENWEATHER_API_KEY');
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_ENTRIES = 100;

interface CacheEntry {
  data: any;
  timestamp: number;
}

// In-memory caches
const weatherCache = new Map<string, CacheEntry>();
const forecastCache = new Map<string, CacheEntry>();
const airQualityCache = new Map<string, CacheEntry>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function cleanCache(cache: Map<string, CacheEntry>) {
  if (cache.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = Array.from(cache.entries())
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
    cache.delete(oldestKey);
    console.log(`Cache limit reached. Removed oldest entry: ${oldestKey}`);
  }
}

function getCachedData(cache: Map<string, CacheEntry>, key: string): any | null {
  const cacheKey = key.toLowerCase();
  const cached = cache.get(cacheKey);
  
  if (cached) {
    const age = Date.now() - cached.timestamp;
    if (age < CACHE_TTL_MS) {
      console.log(`Cache HIT for ${key} (age: ${Math.round(age / 1000)}s)`);
      return cached.data;
    } else {
      console.log(`Cache EXPIRED for ${key}`);
      cache.delete(cacheKey);
    }
  }
  
  console.log(`Cache MISS for ${key}`);
  return null;
}

function setCachedData(cache: Map<string, CacheEntry>, key: string, data: any) {
  cleanCache(cache);
  const cacheKey = key.toLowerCase();
  cache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  console.log(`Cached data for ${key}. Total entries: ${cache.size}`);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { city, lat, lon, type = 'current' } = await req.json();

    const hasCity = city && typeof city === 'string' && city.trim().length > 0;
    const hasCoords = typeof lat === 'number' && typeof lon === 'number';

    if (!hasCity && !hasCoords) {
      return new Response(
        JSON.stringify({ error: 'City name or coordinates (lat/lon) are required' }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let cacheKey: string;
    let locationQuery: string;

    if (hasCoords) {
      cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}-${type}`;
      locationQuery = `lat=${lat}&lon=${lon}`;
    } else {
      const sanitizedCity = city.trim().slice(0, 100);
      cacheKey = `${sanitizedCity}-${type}`;
      locationQuery = `q=${encodeURIComponent(sanitizedCity)}`;
    }

    // Select appropriate cache and endpoint
    let cache: Map<string, CacheEntry>;
    let endpoint: string;
    
    if (type === 'forecast') {
      cache = forecastCache;
      endpoint = 'forecast';
    } else if (type === 'air_quality') {
      cache = airQualityCache;
      endpoint = 'air_pollution';
    } else {
      cache = weatherCache;
      endpoint = 'weather';
    }
    
    // Check cache first
    const cachedData = getCachedData(cache, cacheKey);
    if (cachedData) {
      return new Response(
        JSON.stringify({ ...cachedData, cached: true }), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // For air quality, we need coordinates - if city was provided, first get coords
    let finalLocationQuery = locationQuery;
    if (type === 'air_quality' && hasCity && !hasCoords) {
      // First fetch weather to get coordinates
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?${locationQuery}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const weatherResp = await fetch(weatherUrl);
      if (!weatherResp.ok) {
        const errorData = await weatherResp.json();
        return new Response(
          JSON.stringify({ error: errorData.message || 'City not found', code: errorData.cod }), 
          {
            status: weatherResp.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      const weatherData = await weatherResp.json();
      finalLocationQuery = `lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`;
    }

    console.log(`Fetching ${type} data for ${cacheKey} from API`);
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endpoint}?${finalLocationQuery}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`OpenWeatherMap API error:`, errorData);
      return new Response(
        JSON.stringify({ 
          error: errorData.message || 'Failed to fetch data',
          code: errorData.cod 
        }), 
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const data = await response.json();
    setCachedData(cache, cacheKey, data);

    return new Response(
      JSON.stringify({ ...data, cached: false }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in weather-api function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
