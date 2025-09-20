import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, MapPin, Navigation, Bell, Bus, Route } from "lucide-react";
import LiveMap from "@/components/LiveMap";
import BusTracker from "@/components/BusTracker";
import RouteSelector from "@/components/RouteSelector";
import AlertSystem from "@/components/AlertSystem";
import BusSchedule from "@/components/BusSchedule";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bus className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-2xl font-bold text-primary-foreground">East Godavari Transit</h1>
                <p className="text-primary-foreground/80 text-sm">Kakinada - Rajahmundry Transportation</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-live text-live-foreground">
                <div className="w-2 h-2 bg-live-foreground rounded-full mr-2 animate-pulse"></div>
                Live
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl mx-auto mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="routes" className="flex items-center gap-2">
              <Route className="h-4 w-4" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Live Track
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Live Transportation Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LiveMap />
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="bg-gradient-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Active Routes</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Buses Online</span>
                      <Badge className="bg-live text-live-foreground">8</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Avg Delay</span>
                      <Badge variant="outline">3 min</Badge>
                    </div>
                  </CardContent>
                </Card>
                <AlertSystem />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="routes">
            <RouteSelector />
          </TabsContent>

          <TabsContent value="schedule">
            <BusSchedule />
          </TabsContent>

          <TabsContent value="tracker">
            <BusTracker />
          </TabsContent>

          <TabsContent value="alerts">
            <div className="max-w-2xl mx-auto">
              <AlertSystem expanded />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;