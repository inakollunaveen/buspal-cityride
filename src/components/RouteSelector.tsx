import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, Route as RouteIcon, Search } from "lucide-react";

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  stops: number;
  fare: number;
  frequency: string;
  nextBus: string;
  buses: { id: string; currentStop: string; eta: string; status: string; }[];
}

const RouteSelector = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes: Route[] = [
    {
      id: "KKD-RJY-01",
      name: "Kakinada - Rajahmundry Express",
      from: "Kakinada Bus Station",
      to: "Rajahmundry Bus Station",
      distance: "61 km",
      duration: "1h 45min",
      stops: 12,
      fare: 65,
      frequency: "Every 30 min",
      nextBus: "8 min",
      buses: [
        { id: "AP39Z1234", currentStop: "Peddapuram", eta: "12 min", status: "on-time" },
        { id: "AP39Z1235", currentStop: "Samalkot Junction", eta: "25 min", status: "delayed" }
      ]
    },
    {
      id: "KKD-RJY-02",
      name: "Kakinada - Rajahmundry Local",
      from: "Kakinada Port",
      to: "Rajahmundry Railway Station",
      distance: "63 km",
      duration: "2h 15min",
      stops: 18,
      fare: 45,
      frequency: "Every 45 min",
      nextBus: "22 min",
      buses: [
        { id: "AP39Z5678", currentStop: "Amalapuram", eta: "18 min", status: "delayed" },
        { id: "AP39Z5679", currentStop: "Sakhinetipalli", eta: "35 min", status: "on-time" }
      ]
    },
    {
      id: "KKD-AMP-01",
      name: "Kakinada - Amalapuram",
      from: "Kakinada Bus Station",
      to: "Amalapuram Bus Stand",
      distance: "28 km",
      duration: "50 min",
      stops: 8,
      fare: 35,
      frequency: "Every 20 min",
      nextBus: "5 min",
      buses: [
        { id: "AP39Z9012", currentStop: "Razole Market", eta: "8 min", status: "ahead" },
        { id: "AP39Z9013", currentStop: "Amalapuram Bus Stand", eta: "22 min", status: "on-time" }
      ]
    },
    {
      id: "AMP-RJY-01",
      name: "Amalapuram - Rajahmundry",
      from: "Amalapuram Bus Stand",
      to: "Rajahmundry Bus Station",
      distance: "33 km",
      duration: "55 min",
      stops: 7,
      fare: 40,
      frequency: "Every 25 min",
      nextBus: "12 min",
      buses: [
        { id: "AP39Z3456", currentStop: "Near Tanuku", eta: "15 min", status: "delayed" },
        { id: "AP39Z3457", currentStop: "Rajahmundry Railway Station", eta: "28 min", status: "on-time" }
      ]
    },
    {
      id: "KKD-RZL-01",
      name: "Kakinada - Razole Shuttle",
      from: "Kakinada Port",
      to: "Razole Market",
      distance: "15 km",
      duration: "25 min",
      stops: 4,
      fare: 20,
      frequency: "Every 15 min",
      nextBus: "3 min",
      buses: [
        { id: "AP39Z7801", currentStop: "Kakinada Port", eta: "3 min", status: "on-time" },
        { id: "AP39Z7802", currentStop: "Razole Market", eta: "18 min", status: "ahead" }
      ]
    }
  ];

  const filteredRoutes = routes.filter(route => 
    (fromLocation === "" || route.from.toLowerCase().includes(fromLocation.toLowerCase())) &&
    (toLocation === "" || route.to.toLowerCase().includes(toLocation.toLowerCase()))
  );

  const quickLocations = [
    "Kakinada Bus Station", "Rajahmundry Bus Station", "Amalapuram Bus Stand", "Kakinada Port",
    "Rajahmundry Railway Station", "Razole Market", "Peddapuram", "Samalkot Junction"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5 text-primary" />
            Route Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter starting location"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter destination"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Quick Locations</p>
            <div className="flex flex-wrap gap-2">
              {quickLocations.map((location) => (
                <Button
                  key={location}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (!fromLocation) {
                      setFromLocation(location);
                    } else if (!toLocation) {
                      setToLocation(location);
                    }
                  }}
                  className="text-xs"
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <Button className="flex-1">
              <Search className="h-4 w-4 mr-2" />
              Find Routes
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const temp = fromLocation;
                setFromLocation(toLocation);
                setToLocation(temp);
              }}
            >
              <ArrowRight className="h-4 w-4 rotate-90" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredRoutes.map((route) => (
          <Card 
            key={route.id}
            className={`cursor-pointer transition-all ${
              selectedRoute === route.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedRoute(selectedRoute === route.id ? null : route.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono">{route.id}</Badge>
                    <h3 className="font-semibold">{route.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{route.from}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span>{route.to}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-live text-live-foreground mb-1">
                    Next bus: {route.nextBus}
                  </Badge>
                  <p className="text-sm text-muted-foreground">{route.frequency}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{route.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{route.duration}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Stops: </span>
                  <span className="font-medium">{route.stops}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Fare: </span>
                  <span className="font-medium">₹{route.fare}</span>
                </div>
              </div>

              {selectedRoute === route.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Active Buses on this Route</h4>
                    <div className="space-y-2">
                      {route.buses.map((bus) => (
                        <div key={bus.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-mono">{bus.id}</Badge>
                            <span className="text-sm">{bus.currentStop}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              className={
                                bus.status === 'on-time' ? 'bg-live text-live-foreground' :
                                bus.status === 'delayed' ? 'bg-warning text-warning-foreground' :
                                'bg-accent text-accent-foreground'
                              }
                            >
                              {bus.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{bus.eta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      Track This Route
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Set Alert
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRoutes.length === 0 && (fromLocation || toLocation) && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No routes found for the selected locations.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setFromLocation("");
              setToLocation("");
            }}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RouteSelector;