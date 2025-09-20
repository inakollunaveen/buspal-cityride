import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Clock, Users, Navigation } from "lucide-react";

interface BusInfo {
  id: string;
  route: string;
  currentStop: string;
  nextStop: string;
  capacity: number;
  occupancy: number;
  delay: number;
  driver: string;
  lastUpdate: string;
}

const BusTracker = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  const buses: BusInfo[] = [
    {
      id: "BUS001",
      route: "Route 1A - Central to University",
      currentStop: "Central Station",
      nextStop: "Medical College",
      capacity: 40,
      occupancy: 32,
      delay: 0,
      driver: "Rajesh Kumar",
      lastUpdate: "2 min ago"
    },
    {
      id: "BUS002",
      route: "Route 2B - Mall to Airport",
      currentStop: "City Mall",
      nextStop: "Tech Park",
      capacity: 45,
      occupancy: 28,
      delay: 5,
      driver: "Amit Singh",
      lastUpdate: "1 min ago"
    },
    {
      id: "BUS003",
      route: "Route 3C - University to Railway",
      currentStop: "University Gate",
      nextStop: "Sports Complex",
      capacity: 35,
      occupancy: 20,
      delay: -2,
      driver: "Priya Sharma",
      lastUpdate: "30 sec ago"
    }
  ];

  const filteredBuses = buses.filter(bus => 
    bus.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getOccupancyColor = (occupancy: number, capacity: number) => {
    const percentage = (occupancy / capacity) * 100;
    if (percentage < 50) return "bg-live";
    if (percentage < 80) return "bg-warning";
    return "bg-destructive";
  };

  const getDelayStatus = (delay: number) => {
    if (delay === 0) return { text: "On Time", variant: "bg-live text-live-foreground" };
    if (delay > 0) return { text: `${delay}min Late`, variant: "bg-warning text-warning-foreground" };
    return { text: `${Math.abs(delay)}min Early`, variant: "bg-accent text-accent-foreground" };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-primary" />
            Live Bus Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by bus ID or route..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <MapPin className="h-4 w-4 mr-2" />
              Track All
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredBuses.map((bus) => (
              <Card 
                key={bus.id} 
                className={`cursor-pointer transition-all ${
                  selectedBus === bus.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{bus.id}</h3>
                      <p className="text-muted-foreground text-sm">{bus.route}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getDelayStatus(bus.delay).variant}>
                        {getDelayStatus(bus.delay).text}
                      </Badge>
                      <Badge variant="outline">
                        <div className="w-2 h-2 bg-live rounded-full mr-2 animate-pulse"></div>
                        Live
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Current Stop</p>
                        <p className="text-xs text-muted-foreground">{bus.currentStop}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Next Stop</p>
                        <p className="text-xs text-muted-foreground">{bus.nextStop}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Occupancy</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getOccupancyColor(bus.occupancy, bus.capacity)}`}
                              style={{ width: `${(bus.occupancy / bus.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{bus.occupancy}/{bus.capacity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedBus === bus.id && (
                    <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium mb-1">Driver</p>
                        <p className="text-sm text-muted-foreground">{bus.driver}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Last Update</p>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{bus.lastUpdate}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusTracker;