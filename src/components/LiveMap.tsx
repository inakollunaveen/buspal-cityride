import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock } from "lucide-react";

interface BusLocation {
  id: string;
  route: string;
  lat: number;
  lng: number;
  status: "on-time" | "delayed" | "ahead";
  nextStop: string;
  eta: string;
}

const LiveMap = () => {
  const [buses, setBuses] = useState<BusLocation[]>([
    { id: "AP39Z1234", route: "KKD-RJY-01", lat: 16.8500, lng: 82.1200, status: "on-time", nextStop: "Samalkot Junction", eta: "12 min" },
    { id: "AP39Z5678", route: "KKD-RJY-02", lat: 16.7800, lng: 81.9500, status: "delayed", nextStop: "Amalapuram", eta: "18 min" },
    { id: "AP39Z9012", route: "KKD-AMP-01", lat: 16.7500, lng: 82.1800, status: "ahead", nextStop: "Razole Market", eta: "8 min" },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => ({
        ...bus,
        lat: bus.lat + (Math.random() - 0.5) * 0.001,
        lng: bus.lng + (Math.random() - 0.5) * 0.001,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Map Placeholder - In real implementation, this would be an actual map */}
      <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg relative overflow-hidden border">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-live text-live-foreground">
            <div className="w-2 h-2 bg-live-foreground rounded-full mr-2 animate-pulse"></div>
            Live Tracking Active
          </Badge>
        </div>
        
        {/* Simulated bus markers */}
        {buses.map((bus, index) => (
          <div
            key={bus.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
            style={{
              left: `${30 + index * 25}%`,
              top: `${40 + index * 15}%`,
            }}
          >
            <div className="relative">
              <div className={`w-4 h-4 rounded-full ${
                bus.status === 'on-time' ? 'bg-live' : 
                bus.status === 'delayed' ? 'bg-warning' : 'bg-accent'
              } shadow-lg`}></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-card border rounded px-2 py-1 text-xs whitespace-nowrap">
                {bus.route}
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 right-4 flex gap-2">
          <Badge variant="outline" className="bg-card/80">
            <MapPin className="w-3 h-3 mr-1" />
            East Godavari District
          </Badge>
        </div>
      </div>

      {/* Bus Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {buses.map((bus) => (
          <Card key={bus.id} className="p-3">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs">{bus.id}</Badge>
              <Badge 
                className={
                  bus.status === 'on-time' ? 'bg-live text-live-foreground' :
                  bus.status === 'delayed' ? 'bg-warning text-warning-foreground' :
                  'bg-accent text-accent-foreground'
                }
              >
                {bus.status}
              </Badge>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-1">
                <Navigation className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{bus.route}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{bus.nextStop}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">{bus.eta}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveMap;