import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Calendar, Search, Filter } from "lucide-react";

interface ScheduleEntry {
  id: string;
  route: string;
  busId: string;
  departure: string;
  arrival: string;
  from: string;
  to: string;
  status: "on-time" | "delayed" | "cancelled" | "early";
  delay?: number;
}

const BusSchedule = () => {
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDay, setSelectedDay] = useState("today");

  const schedules: ScheduleEntry[] = [
    {
      id: "1",
      route: "KKD-RJY-01",
      busId: "AP39Z1234",
      departure: "05:30",
      arrival: "07:15",
      from: "Kakinada Bus Station",
      to: "Rajahmundry Bus Station",
      status: "on-time"
    },
    {
      id: "2",
      route: "KKD-RJY-01",
      busId: "AP39Z1235",
      departure: "06:00",
      arrival: "07:45",
      from: "Kakinada Bus Station",
      to: "Rajahmundry Bus Station",
      status: "delayed",
      delay: 8
    },
    {
      id: "3",
      route: "KKD-RJY-02",
      busId: "AP39Z5678",
      departure: "06:15",
      arrival: "08:30",
      from: "Kakinada Port",
      to: "Rajahmundry Railway Station",
      status: "on-time"
    },
    {
      id: "4",
      route: "KKD-AMP-01",
      busId: "AP39Z9012",
      departure: "05:45",
      arrival: "06:35",
      from: "Kakinada Bus Station",
      to: "Amalapuram Bus Stand",
      status: "early",
      delay: -3
    },
    {
      id: "5",
      route: "AMP-RJY-01",
      busId: "AP39Z3456",
      departure: "06:20",
      arrival: "07:15",
      from: "Amalapuram Bus Stand",
      to: "Rajahmundry Bus Station",
      status: "on-time"
    },
    {
      id: "6",
      route: "KKD-RZL-01",
      busId: "AP39Z7890",
      departure: "07:00",
      arrival: "07:25",
      from: "Kakinada Port",
      to: "Razole Market",
      status: "on-time"
    }
  ];

  const routes = ["all", ...Array.from(new Set(schedules.map(s => s.route)))];

  const filteredSchedules = schedules.filter(schedule => {
    const matchesRoute = selectedRoute === "all" || schedule.route === selectedRoute;
    const matchesSearch = searchTerm === "" || 
      schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.busId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRoute && matchesSearch;
  });

  const getStatusBadge = (status: ScheduleEntry["status"], delay?: number) => {
    switch (status) {
      case "on-time":
        return <Badge className="bg-live text-live-foreground">On Time</Badge>;
      case "delayed":
        return <Badge className="bg-warning text-warning-foreground">
          Delayed {delay}min
        </Badge>;
      case "early":
        return <Badge className="bg-accent text-accent-foreground">
          Early {Math.abs(delay || 0)}min
        </Badge>;
      case "cancelled":
        return <Badge className="bg-destructive text-destructive-foreground">
          Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const upcomingSchedules = filteredSchedules.filter(schedule => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [depHour, depMin] = schedule.departure.split(':').map(Number);
    const departureTime = depHour * 60 + depMin;
    return departureTime >= currentTime;
  }).slice(0, 5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Bus Schedules & Timetables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search routes, stops, or bus IDs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={selectedRoute}
                onChange={(e) => setSelectedRoute(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {routes.map(route => (
                  <option key={route} value={route}>
                    {route === "all" ? "All Routes" : route}
                  </option>
                ))}
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Upcoming Departures</h3>
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Badge>
                </div>

                {upcomingSchedules.map((schedule) => (
                  <Card key={schedule.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {schedule.busId}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{schedule.route}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{schedule.from}</span>
                            <span>→</span>
                            <span>{schedule.to}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(schedule.status, schedule.delay)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Departure</p>
                          <p className="text-muted-foreground">{schedule.departure}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Arrival</p>
                          <p className="text-muted-foreground">{schedule.arrival}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="mt-6">
                  <h3 className="font-semibold mb-3">All Schedules</h3>
                  <div className="space-y-2">
                    {filteredSchedules.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {schedule.busId}
                          </Badge>
                          <div className="text-sm">
                            <span className="font-medium">{schedule.route}</span>
                            <span className="text-muted-foreground ml-2">
                              {schedule.departure} - {schedule.arrival}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {schedule.from} → {schedule.to}
                          </div>
                        </div>
                        {getStatusBadge(schedule.status, schedule.delay)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tomorrow" className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tomorrow's schedule will be available soon</p>
              </div>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Weekly schedule view coming soon</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusSchedule;