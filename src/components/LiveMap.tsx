import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Clock, Target } from "lucide-react";

interface BusLocation {
  id: string;
  route: string;
  lat: number;
  lng: number;
  status: "on-time" | "delayed" | "ahead";
  nextStop: string;
  eta: string;
  speed: string;
  direction: string;
  distanceTraveled: number;
  totalDistance: number;
}

interface RoutePoint {
  name: string;
  lat: number;
  lng: number;
}

const LiveMap = () => {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleTrackBus = (busId: string) => {
    setSelectedBus(busId);
    // Scroll to map when tracking a bus
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Route points for Kakinada to Rajahmundry
  const routePoints: RoutePoint[] = [
    { name: "Kakinada", lat: 16.9891, lng: 82.2475 },
    { name: "Samalkot", lat: 16.8833, lng: 82.1667 },
    { name: "Amalapuram", lat: 16.5833, lng: 82.0167 },
    { name: "Razole", lat: 16.4833, lng: 81.8333 },
    { name: "Peddapuram", lat: 17.0833, lng: 82.1333 },
    { name: "Rajahmundry", lat: 17.0005, lng: 81.7880 },
  ];

  const [buses, setBuses] = useState<BusLocation[]>([
    { 
      id: "AP39Z1234", 
      route: "KKD-RJY-01", 
      lat: 16.8833, 
      lng: 82.1667, 
      status: "on-time", 
      nextStop: "Samalkot Junction", 
      eta: "12 min",
      speed: "45 km/h",
      direction: "towards Rajahmundry",
      distanceTraveled: 15.2,
      totalDistance: 65.8
    },
    { 
      id: "AP39Z5678", 
      route: "KKD-RJY-02", 
      lat: 16.5833, 
      lng: 82.0167, 
      status: "delayed", 
      nextStop: "Amalapuram", 
      eta: "18 min",
      speed: "38 km/h",
      direction: "towards Rajahmundry",
      distanceTraveled: 42.1,
      totalDistance: 65.8
    },
    { 
      id: "AP39Z9012", 
      route: "KKD-AMP-01", 
      lat: 16.4833, 
      lng: 81.8333, 
      status: "ahead", 
      nextStop: "Razole Market", 
      eta: "8 min",
      speed: "52 km/h",
      direction: "towards Amalapuram",
      distanceTraveled: 38.5,
      totalDistance: 48.2
    },
    { 
      id: "AP39Z8901", 
      route: "KKD-RJY-EXPRESS", 
      lat: 17.0833, 
      lng: 82.1333, 
      status: "on-time", 
      nextStop: "Peddapuram", 
      eta: "5 min",
      speed: "55 km/h",
      direction: "towards Rajahmundry",
      distanceTraveled: 55.3,
      totalDistance: 65.8
    },
    { 
      id: "AP39Z7701", 
      route: "KKD-AMP-02", 
      lat: 16.6833, 
      lng: 82.0500, 
      status: "ahead", 
      nextStop: "Razole", 
      eta: "10 min",
      speed: "48 km/h",
      direction: "towards Amalapuram",
      distanceTraveled: 28.7,
      totalDistance: 48.2
    },
    { 
      id: "AP39Z9301", 
      route: "KKD-MND-01", 
      lat: 16.9000, 
      lng: 82.1500, 
      status: "delayed", 
      nextStop: "Kotipalli", 
      eta: "15 min",
      speed: "35 km/h",
      direction: "towards Mandapeta",
      distanceTraveled: 12.4,
      totalDistance: 32.5
    },
    { 
      id: "AP39Z4401", 
      route: "KKD-VZM-01", 
      lat: 16.8200, 
      lng: 82.1000, 
      status: "on-time", 
      nextStop: "Ramachandrapuram", 
      eta: "8 min",
      speed: "42 km/h",
      direction: "towards Vizianagaram",
      distanceTraveled: 8.9,
      totalDistance: 85.2
    },
  ]);

  // Simulate real-time updates every 30 seconds with accurate distance tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const currentSpeed = parseInt(bus.speed);
        const speedInKmPerSecond = currentSpeed / 3600; // Convert km/h to km/s
        const distanceIncrement = speedInKmPerSecond * 30; // Distance traveled in 30 seconds
        
        // Update distance traveled
        const newDistanceTraveled = Math.min(bus.distanceTraveled + distanceIncrement, bus.totalDistance);
        const progressRatio = newDistanceTraveled / bus.totalDistance;
        
        // Simulate realistic movement along route (simplified linear progression)
        const routeStart = { lat: 16.9891, lng: 82.2475 }; // Kakinada
        const routeEnd = bus.route.includes('RJY') 
          ? { lat: 17.0005, lng: 81.7880 } // Rajahmundry
          : bus.route.includes('AMP')
          ? { lat: 16.5833, lng: 82.0167 } // Amalapuram  
          : { lat: 16.8200, lng: 82.1000 }; // Other destinations
        
        const newLat = routeStart.lat + (routeEnd.lat - routeStart.lat) * progressRatio;
        const newLng = routeStart.lng + (routeEnd.lng - routeStart.lng) * progressRatio;
        
        // Update ETA based on remaining distance and current speed
        const remainingDistance = bus.totalDistance - newDistanceTraveled;
        const newEta = Math.max(1, Math.round((remainingDistance / currentSpeed) * 60)); // Convert to minutes
        
        // Occasionally update speed (±5 km/h)
        const speedChange = Math.random() > 0.8 ? (Math.random() - 0.5) * 10 : 0;
        const newSpeed = Math.max(20, Math.min(80, currentSpeed + speedChange));
        
        // Update status based on progress and delays
        let newStatus = bus.status;
        if (Math.random() > 0.9) {
          if (newEta > 20) {
            newStatus = "delayed";
          } else if (newEta < 5 && progressRatio > 0.8) {
            newStatus = "ahead";
          } else {
            newStatus = "on-time";
          }
        }
        
        return {
          ...bus,
          lat: newLat,
          lng: newLng,
          eta: `${newEta} min`,
          speed: `${Math.round(newSpeed)} km/h`,
          status: newStatus,
          distanceTraveled: newDistanceTraveled,
        };
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Enhanced Map with Route Visualization */}
      <div 
        ref={mapRef}
        className="h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg relative overflow-hidden border border-slate-300 dark:border-slate-700"
      >
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Route Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 15% 80% Q 30% 60% 45% 40% Q 60% 30% 75% 20% Q 85% 15% 90% 10%"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            className="animate-pulse"
          />
        </svg>

        {/* Route Stops */}
        {routePoints.map((point, index) => (
          <div
            key={point.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${15 + index * 15}%`,
              top: `${80 - index * 12}%`,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-primary border-2 border-white rounded-full shadow-lg"></div>
              <div className="mt-1 bg-white dark:bg-slate-800 border rounded px-2 py-1 text-xs font-medium shadow-sm">
                {point.name}
              </div>
            </div>
          </div>
        ))}

        {/* Moving Bus Markers */}
        {buses.map((bus, index) => {
          // Calculate position based on actual progress ratio
          const progressRatio = bus.distanceTraveled / bus.totalDistance;
          const xPos = 15 + progressRatio * 75;
          const yPos = 80 - progressRatio * 70;
          const isSelected = selectedBus === bus.id;
          
          return (
            <div
              key={bus.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
                isSelected ? 'scale-150 z-20' : 'hover:scale-110'
              }`}
              style={{
                left: `${xPos}%`,
                top: `${yPos}%`,
              }}
              onClick={() => setSelectedBus(isSelected ? null : bus.id)}
            >
              <div className="relative group cursor-pointer">
                {/* Bus Icon */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg ${
                  isSelected ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''
                } ${
                  bus.status === 'on-time' ? 'bg-green-500' : 
                  bus.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500'
                } animate-pulse`}>
                  <div className="w-2 h-2 bg-white rounded-sm"></div>
                </div>
                
                {/* Bus Info Tooltip */}
                <div className={`absolute -top-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-800 border rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg transition-opacity pointer-events-none z-10 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <div className="font-medium">{bus.id}</div>
                  <div className="text-muted-foreground">{bus.route}</div>
                  <div className="text-green-600">{bus.speed}</div>
                  <div className="text-blue-600">{bus.distanceTraveled.toFixed(1)}/{bus.totalDistance.toFixed(1)} km</div>
                  <div className="text-xs text-muted-foreground">Click to track</div>
                </div>
                
                {/* Direction Arrow */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full flex items-center justify-center">
                  <Navigation className="w-2 h-2 text-white" style={{ transform: 'rotate(45deg)' }} />
                </div>

                {/* Selection Pulse Effect */}
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-yellow-400 opacity-30 animate-ping"></div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Live GPS Tracking
          </Badge>
        </div>

        {/* Coordinate Display */}
        <div className="absolute top-4 right-4">
          <Badge variant="outline" className="bg-white/90 dark:bg-slate-800/90">
            <MapPin className="w-3 h-3 mr-1" />
            Kakinada Region
          </Badge>
        </div>

        {/* Map Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-800/90 rounded-lg p-3 text-xs">
          <div className="font-medium mb-2">Legend</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>On Time</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Delayed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Ahead</span>
          </div>
        </div>

        {/* Real-time Update Info */}
        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-slate-800/90 rounded px-2 py-1 text-xs">
          Updates every 30s
        </div>
      </div>

      {/* Enhanced Bus Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {buses.map((bus) => {
          const isSelected = selectedBus === bus.id;
          
          return (
            <Card 
              key={bus.id} 
              className={`p-4 cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-lg scale-105 bg-primary/5' 
                  : 'hover:shadow-lg hover:scale-102'
              }`}
              onClick={() => setSelectedBus(isSelected ? null : bus.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-xs font-mono">{bus.id}</Badge>
                <Badge 
                  className={
                    bus.status === 'on-time' ? 'bg-green-500 text-white' :
                    bus.status === 'delayed' ? 'bg-red-500 text-white' :
                    'bg-blue-500 text-white'
                  }
                >
                  {bus.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">{bus.route}</div>
                    <div className="text-muted-foreground text-xs">{bus.direction}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Next: {bus.nextStop}</div>
                    <div className="text-muted-foreground text-xs">GPS: {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}</div>
                    <div className="text-muted-foreground text-xs">
                      Distance: {bus.distanceTraveled.toFixed(1)}/{bus.totalDistance.toFixed(1)} km
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{bus.eta}</span>
                  </div>
                  <div className="font-medium text-primary">{bus.speed}</div>
                </div>

                <div className="flex gap-2 pt-3">
                  <Button 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTrackBus(bus.id);
                    }}
                    className="flex-1"
                    variant={isSelected ? "default" : "secondary"}
                  >
                    <Target className="w-3 h-3 mr-1" />
                    {isSelected ? "Tracking" : "Track on Map"}
                  </Button>
                </div>

                {isSelected && (
                  <div className="mt-2 p-2 bg-primary/10 rounded text-xs text-center text-primary font-medium">
                    📍 Bus location highlighted on map
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LiveMap;