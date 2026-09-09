import { WebSocketServer, WebSocket } from "ws";

interface RiderLocation {
  orderId: string;
  lat: number;
  lng: number;
  speedKmh: number;
  temperature: number;
  etaMinutes: number;
  timestamp: number;
}

interface Client {
  ws: WebSocket;
  orderId: string;
}

class TrackingServer {
  private wss: WebSocketServer;
  private clients: Map<string, Client[]> = new Map();
  private riderLocations: Map<string, RiderLocation> = new Map();

  constructor(port: number = 8080) {
    this.wss = new WebSocketServer({ port });
    this.setupServer();
    this.startSimulation();
  }

  private setupServer() {
    this.wss.on("connection", (ws: WebSocket, req) => {
      const url = new URL(req.url || "", `http://${req.headers.host}`);
      const orderId = url.searchParams.get("orderId");

      if (!orderId) {
        ws.close(1008, "Order ID required");
        return;
      }

      const client: Client = { ws, orderId };

      // Add client to order-specific group
      if (!this.clients.has(orderId)) {
        this.clients.set(orderId, []);
      }
      this.clients.get(orderId)!.push(client);

      console.log(`Client connected for order ${orderId}`);

      // Send current location if available
      const currentLocation = this.riderLocations.get(orderId);
      if (currentLocation) {
        this.sendToClient(client, {
          type: "location_update",
          data: currentLocation,
        });
      }

      ws.on("close", () => {
        const clients = this.clients.get(orderId);
        if (clients) {
          const index = clients.indexOf(client);
          if (index > -1) {
            clients.splice(index, 1);
          }
          if (clients.length === 0) {
            this.clients.delete(orderId);
          }
        }
        console.log(`Client disconnected for order ${orderId}`);
      });

      ws.on("message", (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(client, data);
        } catch (err) {
          console.error("Invalid message:", err);
        }
      });
    });

    console.log(`WebSocket tracking server running on port ${this.wss.options.port}`);
  }

  private handleMessage(client: Client, data: any) {
    switch (data.type) {
      case "rider_update":
        // Rider sends GPS update
        this.updateRiderLocation(client.orderId, data.payload);
        break;
      default:
        console.log("Unknown message type:", data.type);
    }
  }

  private updateRiderLocation(orderId: string, location: RiderLocation) {
    this.riderLocations.set(orderId, location);
    this.broadcastToOrder(orderId, {
      type: "location_update",
      data: location,
    });
  }

  private broadcastToOrder(orderId: string, message: any) {
    const clients = this.clients.get(orderId);
    if (clients) {
      clients.forEach((client) => this.sendToClient(client, message));
    }
  }

  private sendToClient(client: Client, message: any) {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  }

  // Simulate rider movement for demo purposes
  private startSimulation() {
    setInterval(() => {
      this.riderLocations.forEach((location, orderId) => {
        // Simulate movement
        location.lat += (Math.random() - 0.5) * 0.0001;
        location.lng += (Math.random() - 0.5) * 0.0001;
        location.speedKmh = 15 + Math.random() * 20;
        location.temperature = 2 + Math.random() * 6;
        location.etaMinutes = Math.max(1, location.etaMinutes - 0.1);
        location.timestamp = Date.now();

        this.broadcastToOrder(orderId, {
          type: "location_update",
          data: location,
        });
      });
    }, 2000);
  }

  // Public method to update rider location (called by API)
  public updateRider(orderId: string, location: Partial<RiderLocation>) {
    const current = this.riderLocations.get(orderId) || {
      orderId,
      lat: 12.9716,
      lng: 77.5946,
      speedKmh: 20,
      temperature: 4,
      etaMinutes: 15,
      timestamp: Date.now(),
    };

    this.updateRiderLocation(orderId, { ...current, ...location });
  }
}

// Singleton instance
let trackingServer: TrackingServer | null = null;

export function getTrackingServer(): TrackingServer {
  if (!trackingServer) {
    trackingServer = new TrackingServer(8080);
  }
  return trackingServer;
}
