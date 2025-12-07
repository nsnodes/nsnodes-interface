// Event Routes Data
// This file stores the configuration for event routes and connections

export type RouteEvent = {
  id: string;
  name: string;
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
  lane: number; // vertical position (0, 1, 2, etc.)
  // Optional: can link to real event from database
  sourceEventId?: string;
};

export type RouteConnection = {
  from: string; // event id
  to: string; // event id
  color: string; // hex color
};

export type RouteData = {
  events: RouteEvent[];
  connections: RouteConnection[];
};

// Initial route data
export const eventRoutesData: RouteData = {
  "events": [
    {
      "id": "eth-latam",
      "name": "ETH Latam",
      "startDate": "2025-11-08",
      "endDate": "2025-11-08",
      "lane": 0
    },
    {
      "id": "eth-floripa",
      "name": "ETH Floripa",
      "startDate": "2025-11-11",
      "endDate": "2025-11-12",
      "lane": 1
    },
    {
      "id": "edge-city",
      "name": "Edge City",
      "startDate": "2025-10-18",
      "endDate": "2025-11-17",
      "lane": 2
    },
    {
      "id": "devconnect",
      "name": "Devconnect",
      "startDate": "2025-11-16",
      "endDate": "2025-12-16",
      "lane": 0
    },
    {
      "id": "floripa-foundership",
      "name": "Floripa Foundership",
      "startDate": "2025-12-20",
      "endDate": "2025-12-20",
      "lane": 0
    },
    {
      "id": "ns-oct-25",
      "name": "Network School (Oct '25)",
      "startDate": "2025-10-20",
      "endDate": "2025-10-24",
      "lane": 1
    },
    {
      "id": "ns-nov-25",
      "name": "Network School (Nov '25)",
      "startDate": "2025-11-01",
      "endDate": "2025-11-05",
      "lane": 1
    },
    {
      "id": "ns-dec-25",
      "name": "Network School (Dec '25)",
      "startDate": "2025-12-01",
      "endDate": "2025-12-05",
      "lane": 1
    },
    {
      "id": "ns-jan-26",
      "name": "Network School (Jan '26)",
      "startDate": "2026-01-20",
      "endDate": "2026-01-24",
      "lane": 1
    }
  ],
  "connections": [
    {
      "from": "eth-latam",
      "to": "devconnect",
      "color": "#3b82f6"
    },
    {
      "from": "eth-floripa",
      "to": "devconnect",
      "color": "#8b5cf6"
    },
    {
      "from": "edge-city",
      "to": "devconnect",
      "color": "#ec4899"
    },
    {
      "from": "eth-latam",
      "to": "eth-floripa",
      "color": "#3cf6a5"
    },
    {
      "from": "ns-oct-25",
      "to": "eth-latam",
      "color": "#f59e0b"
    },
    {
      "from": "ns-nov-25",
      "to": "devconnect",
      "color": "#10b981"
    },
    {
      "from": "ns-dec-25",
      "to": "floripa-foundership",
      "color": "#06b6d4"
    }
  ]
}