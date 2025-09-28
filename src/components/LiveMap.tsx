import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, Clock, Target } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [showTokenInput, setShowTokenInput] = useState<boolean>(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

  const handleTrackBus = (busId: string) => {
    setSelectedBus(busId);
    // Scroll to map when tracking a bus
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Center map on selected bus
    const bus = buses.find(b => b.id === busId);
    if (bus && mapInstance.current) {
      mapInstance.current.flyTo({
        center: [bus.lng, bus.lat],
        zoom: 12,
        duration: 2000
      });
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
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

  // Initialize Mapbox map
  useEffect(() => {
    if (!mapboxToken || !mapRef.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    mapInstance.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [82.2475, 16.9891], // Kakinada coordinates
      zoom: 10
    });

    // Add navigation controls
    mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      mapInstance.current?.remove();
    };
  }, [mapboxToken]);

  // Update bus markers on map
  useEffect(() => {
    if (!mapInstance.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers for each bus
    buses.forEach(bus => {
      const el = document.createElement('div');
      el.className = 'bus-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      
      if (bus.status === 'on-time') {
        el.style.backgroundColor = '#10b981';
      } else if (bus.status === 'delayed') {
        el.style.backgroundColor = '#ef4444';
      } else {
        el.style.backgroundColor = '#3b82f6';
      }

      if (selectedBus === bus.id) {
        el.style.transform = 'scale(1.5)';
        el.style.boxShadow = '0 0 0 4px rgba(255, 193, 7, 0.5)';
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([bus.lng, bus.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <strong>${bus.id}</strong><br/>
                <span style="color: #666;">${bus.route}</span><br/>
                <span style="color: #10b981;">Speed: ${bus.speed}</span><br/>
                <span style="color: #666;">ETA: ${bus.eta}</span><br/>
                <span style="color: #666;">Distance: ${bus.distanceTraveled.toFixed(1)}/${bus.totalDistance.toFixed(1)} km</span>
              </div>
            `)
        )
        .addTo(mapInstance.current);

      el.addEventListener('click', () => {
        setSelectedBus(selectedBus === bus.id ? null : bus.id);
      });

      markersRef.current[bus.id] = marker;
    });
  }, [buses, selectedBus]);

  // Simulate real-time updates every 30 seconds
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

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mapbox Token Input */}
      {showTokenInput && (
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Mapbox Integration Required</h3>
              <p className="text-sm text-muted-foreground">
                Enter your Mapbox public token to enable real-time mapping. Get your token from{" "}
                <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  mapbox.com
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbGV..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
                Connect Map
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Real Mapbox Map */}
      <div 
        ref={mapRef}
        className="h-96 rounded-lg relative overflow-hidden border border-slate-300 dark:border-slate-700"
        style={{ display: showTokenInput ? 'none' : 'block' }}
      >
        {/* Live Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            Live GPS Tracking
          </Badge>
        </div>

        {/* Change Map Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTokenInput(true)}
            className="bg-white/90 dark:bg-slate-800/90"
          >
            Change Token
          </Button>
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