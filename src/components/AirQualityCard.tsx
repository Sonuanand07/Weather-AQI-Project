import { Wind, AlertTriangle, Leaf, Skull } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AirQualityCardProps {
  airQuality: any;
}

const AQI_LEVELS = [
  { level: 1, label: "Good", color: "bg-green-500", textColor: "text-green-500", icon: Leaf, description: "Air quality is satisfactory" },
  { level: 2, label: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500", icon: Leaf, description: "Acceptable air quality" },
  { level: 3, label: "Moderate", color: "bg-orange-500", textColor: "text-orange-500", icon: AlertTriangle, description: "Sensitive groups may be affected" },
  { level: 4, label: "Poor", color: "bg-red-500", textColor: "text-red-500", icon: AlertTriangle, description: "Health effects possible for everyone" },
  { level: 5, label: "Very Poor", color: "bg-purple-600", textColor: "text-purple-600", icon: Skull, description: "Health alert: serious effects" },
];

export const AirQualityCard = ({ airQuality }: AirQualityCardProps) => {
  const data = airQuality.list?.[0];
  if (!data) return null;

  const aqi = data.main.aqi;
  const components = data.components;
  const aqiInfo = AQI_LEVELS[aqi - 1] || AQI_LEVELS[0];
  const AqiIcon = aqiInfo.icon;

  const pollutants = [
    { name: "PM2.5", value: components.pm2_5, unit: "μg/m³", description: "Fine particles" },
    { name: "PM10", value: components.pm10, unit: "μg/m³", description: "Coarse particles" },
    { name: "O₃", value: components.o3, unit: "μg/m³", description: "Ozone" },
    { name: "NO₂", value: components.no2, unit: "μg/m³", description: "Nitrogen dioxide" },
    { name: "SO₂", value: components.so2, unit: "μg/m³", description: "Sulfur dioxide" },
    { name: "CO", value: (components.co / 1000).toFixed(1), unit: "mg/m³", description: "Carbon monoxide" },
  ];

  return (
    <Card className="w-full max-w-4xl p-6 shadow-xl backdrop-blur-sm border-border/50 bg-card/80 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-6">
        <Wind className="h-7 w-7 text-primary" />
        <h3 className="text-2xl font-bold text-foreground">Air Quality Index</h3>
      </div>

      {/* AQI Display */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 p-6 rounded-xl bg-muted/30">
        <div className={`w-24 h-24 rounded-full ${aqiInfo.color} flex items-center justify-center shadow-lg`}>
          <span className="text-4xl font-bold text-white">{aqi}</span>
        </div>
        <div className="text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <AqiIcon className={`h-6 w-6 ${aqiInfo.textColor}`} />
            <span className={`text-2xl font-bold ${aqiInfo.textColor}`}>{aqiInfo.label}</span>
          </div>
          <p className="text-muted-foreground mt-1">{aqiInfo.description}</p>
        </div>
      </div>

      {/* Pollutants Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {pollutants.map((pollutant) => (
          <div 
            key={pollutant.name}
            className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <p className="text-sm text-muted-foreground">{pollutant.description}</p>
            <p className="text-lg font-semibold text-foreground">
              {pollutant.name}: <span className="text-primary">{pollutant.value}</span>
              <span className="text-sm text-muted-foreground ml-1">{pollutant.unit}</span>
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
};
