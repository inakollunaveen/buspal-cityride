import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Ticket, MapPin, Clock, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TicketInfo {
  id: string;
  route: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  nextBus: string;
}

const TicketSystem = () => {
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedTicket, setSelectedTicket] = useState<TicketInfo | null>(null);
  const { toast } = useToast();

  const availableTickets: TicketInfo[] = [
    {
      id: "KKD-RJY-01",
      route: "KKD-RJY Express",
      from: "Kakinada",
      to: "Rajahmundry",
      price: 45,
      duration: "1h 30min",
      nextBus: "2:30 PM"
    },
    {
      id: "KKD-AMP-01", 
      route: "KKD-AMP Route",
      from: "Kakinada",
      to: "Amalapuram",
      price: 35,
      duration: "1h 10min",
      nextBus: "3:15 PM"
    },
    {
      id: "KKD-MND-01",
      route: "KKD-MND Local",
      from: "Kakinada", 
      to: "Mandapeta",
      price: 25,
      duration: "45min",
      nextBus: "2:45 PM"
    },
    {
      id: "KKD-VZM-01",
      route: "KKD-VZM Express",
      from: "Kakinada",
      to: "Vizianagaram", 
      price: 65,
      duration: "2h 15min",
      nextBus: "4:00 PM"
    }
  ];

  const handleTicketSelect = (ticket: TicketInfo) => {
    setSelectedTicket(ticket);
    toast({
      title: "Ticket Selected",
      description: `${ticket.route} - ₹${ticket.price}`,
    });
  };

  const handleBookTicket = () => {
    if (!selectedTicket) return;
    
    toast({
      title: "Booking Required",
      description: "Connect to Supabase for full ticket booking functionality with payments and storage.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Ticket Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">From</label>
              <Select value="Kakinada" disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select departure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Kakinada">Kakinada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To</label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rajahmundry">Rajahmundry</SelectItem>
                  <SelectItem value="Amalapuram">Amalapuram</SelectItem>
                  <SelectItem value="Mandapeta">Mandapeta</SelectItem>
                  <SelectItem value="Vizianagaram">Vizianagaram</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableTickets
          .filter(ticket => !selectedRoute || ticket.to === selectedRoute)
          .map((ticket) => (
          <Card 
            key={ticket.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedTicket?.id === ticket.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-lg hover:scale-102'
            }`}
            onClick={() => handleTicketSelect(ticket)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg">{ticket.route}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="w-3 h-3" />
                    {ticket.from} → {ticket.to}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">₹{ticket.price}</div>
                  <Badge variant="outline" className="text-xs">per person</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>Duration: {ticket.duration}</span>
                  </div>
                  <span className="text-muted-foreground">Next: {ticket.nextBus}</span>
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Button 
                    variant={selectedTicket?.id === ticket.id ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                  >
                    {selectedTicket?.id === ticket.id ? "Selected" : "Select"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTicket && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Selected Ticket</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{selectedTicket.route}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedTicket.from} → {selectedTicket.to}
                </div>
              </div>
              <div className="text-xl font-bold text-primary">₹{selectedTicket.price}</div>
            </div>
            
            <Button onClick={handleBookTicket} className="w-full" size="lg">
              <CreditCard className="w-4 h-4 mr-2" />
              Book Ticket
            </Button>
            
            <div className="text-xs text-muted-foreground text-center">
              Full booking functionality requires database connection
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TicketSystem;