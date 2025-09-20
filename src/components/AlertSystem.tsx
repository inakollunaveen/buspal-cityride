import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, CheckCircle, X, Clock } from "lucide-react";

interface Alert {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  route?: string;
  timestamp: string;
  read: boolean;
}

interface AlertSystemProps {
  expanded?: boolean;
}

const AlertSystem = ({ expanded = false }: AlertSystemProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Route 2B Delayed",
      message: "Bus BUS002 is running 5 minutes late due to traffic congestion near City Mall.",
      route: "Route 2B",
      timestamp: "2 min ago",
      read: false
    },
    {
      id: "2",
      type: "info",
      title: "New Route Added",
      message: "Route 5E (Hospital - Sports Complex) is now operational with buses every 18 minutes.",
      timestamp: "15 min ago",
      read: false
    },
    {
      id: "3",
      type: "success",
      title: "Route 1A Back on Schedule",
      message: "All buses on Route 1A are now running on time after earlier delays.",
      route: "Route 1A",
      timestamp: "30 min ago",
      read: true
    },
    {
      id: "4",
      type: "error",
      title: "Service Disruption",
      message: "Route 4D temporarily suspended due to road construction. Alternative Route 4F available.",
      route: "Route 4D",
      timestamp: "1 hour ago",
      read: true
    }
  ]);

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
        return <X className="h-4 w-4 text-destructive" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getAlertBadgeVariant = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "bg-warning text-warning-foreground";
      case "error":
        return "bg-destructive text-destructive-foreground";
      case "success":
        return "bg-success text-success-foreground";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const displayAlerts = expanded ? alerts : alerts.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Alerts & Notifications
            {unreadCount > 0 && (
              <Badge className="bg-destructive text-destructive-foreground ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {!expanded && unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {expanded && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              {alerts.length} total alerts
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark All Read
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {displayAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all ${
                alert.read ? 'bg-muted/50' : 'bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3 flex-1">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-sm ${
                        alert.read ? 'text-muted-foreground' : 'text-foreground'
                      }`}>
                        {alert.title}
                      </h4>
                      {alert.route && (
                        <Badge variant="outline" className="text-xs">
                          {alert.route}
                        </Badge>
                      )}
                      <Badge className={`text-xs ${getAlertBadgeVariant(alert.type)}`}>
                        {alert.type}
                      </Badge>
                    </div>
                    <p className={`text-sm ${
                      alert.read ? 'text-muted-foreground' : 'text-muted-foreground'
                    }`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!alert.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAsRead(alert.id)}
                      className="h-6 w-6 p-0"
                    >
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissAlert(alert.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!expanded && alerts.length > 3 && (
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              View All Alerts ({alerts.length})
            </Button>
          </div>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts at the moment</p>
            <p className="text-sm text-muted-foreground">
              You'll be notified about bus delays, route changes, and service updates.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlertSystem;