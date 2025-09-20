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
}

const RouteSelector = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const routes: Route[] = [
    {
      id: "1A",
      name: "Central - University Express",
      from: "Central Station",
      to: "University Campus",
      distance: "12.5 km",
      duration: "35 min",
      stops: 8,
      fare: 25,
      frequency: "Every 15 min",
      nextBus: "5 min"
    },
    {
      id: "2B",
      name: "Mall - Airport Connect",
      from: "City Mall",
      to: "International Airport",
      distance: "18.2 km",
      duration: "45 min",
      stops: 12,
      fare: 40,
      frequency: "Every 20 min",
      nextBus: "12 min"
    },
    {
      id: "3C",
      name: "University - Railway Circle",
      from: "University Gate",
      to: "Railway Station",
      distance: "8.7 km",
      duration: "25 min",
      stops: 6,
      fare: 20,
      frequency: "Every 10 min",
      nextBus: "3 min"
    },
    {
      id: "4D",
      name: "Tech Park Shuttle",
      from: "Metro Station",
      to: "IT Tech Park",
      distance: "6.3 km",
      duration: "20 min",
      stops: 4,
      fare: 15,
      frequency: "Every 12 min",
      nextBus: "8 min"
    }
  ];

  const filteredRoutes = routes.filter(route => 
    (fromLocation === "" || route.from.toLowerCase().includes(fromLocation.toLowerCase())) &&
    (toLocation === "" || route.to.toLowerCase().includes(toLocation.toLowerCase()))
  );

  const quickLocations = [
    "Central Station", "University Campus", "City Mall", "International Airport",
    "Railway Station", "Tech Park", "Medical College", "Sports Complex"
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
                <div className="mt-4 pt-4 border-t">
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