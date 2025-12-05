import { Card } from "@/components/ui/card";

interface ForecastCardProps {
  forecast: any;
}

export const ForecastCard = ({ forecast }: ForecastCardProps) => {
  // Group forecast by day (API returns 3-hour intervals)
  const dailyForecasts = forecast.list.reduce((acc: any[], item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const existingDay = acc.find(d => d.date === date);
    
    if (existingDay) {
      existingDay.temps.push(item.main.temp);
      existingDay.icons.push(item.weather[0].icon);
      existingDay.descriptions.push(item.weather[0].description);
    } else {
      acc.push({
        date,
        temps: [item.main.temp],
        icons: [item.weather[0].icon],
        descriptions: [item.weather[0].description],
        dt: item.dt
      });
    }
    
    return acc;
  }, []).slice(0, 5); // Get next 5 days

  const getDayData = (day: any) => {
    const avgTemp = Math.round(day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length);
    const minTemp = Math.round(Math.min(...day.temps));
    const maxTemp = Math.round(Math.max(...day.temps));
    // Get the most common icon (usually mid-day)
    const midIndex = Math.floor(day.icons.length / 2);
    const icon = day.icons[midIndex] || day.icons[0];
    const description = day.descriptions[midIndex] || day.descriptions[0];
    
    return { avgTemp, minTemp, maxTemp, icon, description };
  };

  return (
    <Card className="w-full max-w-4xl p-6 shadow-xl backdrop-blur-sm border-border/50 bg-card/80 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-foreground mb-6">5-Day Forecast</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {dailyForecasts.map((day: any, index: number) => {
          const { minTemp, maxTemp, icon, description } = getDayData(day);
          const isToday = index === 0;
          
          return (
            <div 
              key={day.dt}
              className={`flex flex-col items-center p-4 rounded-lg transition-all duration-300 hover:scale-105 ${
                isToday 
                  ? 'bg-primary/10 border border-primary/30' 
                  : 'bg-muted/30 hover:bg-muted/50'
              }`}
            >
              <p className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : 'text-muted-foreground'}`}>
                {isToday ? 'Today' : day.date.split(',')[0]}
              </p>
              <img 
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="w-16 h-16"
              />
              <p className="text-xs text-muted-foreground capitalize mb-2 text-center">
                {description}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{maxTemp}°</span>
                <span className="text-sm text-muted-foreground">{minTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
