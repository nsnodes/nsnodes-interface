"use client";

import { MousePointer, Settings } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { getRouteData } from "@/lib/actions/routes";
import Link from "next/link";
import { InteractiveFlowDiagram } from "@/components/interactive-flow-diagram";

// Type definitions
type Event = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  attendance: number;
  lane: number;
};

type Flow = {
  from: string;
  to: string;
  count: number;
  color: string;
};

export default function RoutesPage() {
  const [interactiveEvents, setInteractiveEvents] = useState<Event[]>([]);
  const [simulationEvents, setSimulationEvents] = useState<Event[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [simulationFlows, setSimulationFlows] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data and simulation data from localStorage
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getRouteData();
        
        const baseEvents: Event[] = data.events.map((e) => ({
          id: e.id,
          name: e.name,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
          attendance: 0,
          lane: e.lane,
        }));

        const loadedFlows: Flow[] = data.connections.map((c) => ({
          from: c.from,
          to: c.to,
          count: 0,
          color: c.color,
        }));

        // Set data for the interactive graph
        setInteractiveEvents(baseEvents);
        setFlows(loadedFlows);

        // Load simulation data from localStorage
        const storedData = localStorage.getItem("simulation-data");
        const simulationData = storedData ? JSON.parse(storedData) : { events: {}, flows: {} };

        const simEvents = data.events.map((e) => ({
          id: e.id,
          name: e.name,
          startDate: new Date(e.startDate),
          endDate: new Date(e.endDate),
          attendance: simulationData.events[e.id] || 0,
          lane: e.lane,
        }));
        setSimulationEvents(simEvents);
        setSimulationFlows(simulationData.flows || {});

      } catch (error) {
        console.error("Error loading route data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Click handler for the interactive graph
  const handleEventClick = (eventId: string) => {
    setInteractiveEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, attendance: event.attendance + 1 }
          : event
      )
    );
  };

  const totalInteractiveAttendance = interactiveEvents.reduce((sum, e) => sum + e.attendance, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-lg font-mono">Loading route data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono">
            [ EVENT ROUTES ]
          </h1>
          <Link
            href="/routes/admin"
            className="px-3 py-2 border-2 border-border bg-background font-mono text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 opacity-40 hover:opacity-100"
          >
            <Settings className="h-3 w-3" />
            ADMIN
          </Link>
        </div>
        <p className="text-muted-foreground font-mono text-sm sm:text-base max-w-3xl">
          Explore relationships between Network State events. The top graph is interactive. The bottom one is a simulation based on numbers from the admin page.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-2 mb-2">
            <MousePointer className="h-4 w-4" />
            <span className="text-xs font-mono text-muted-foreground">
              TOTAL CLICKS
            </span>
          </div>
          <div className="text-2xl font-bold font-mono">{totalInteractiveAttendance}</div>
        </div>
        <div className="border-2 border-border p-4 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">
              EVENTS
            </span>
          </div>
          <div className="text-2xl font-bold font-mono">{interactiveEvents.length}</div>
        </div>
      </section>

      {/* Instructions */}
      <section className="border-2 border-border p-4 bg-card">
        <p className="text-xs font-mono text-muted-foreground">
          <span className="font-bold">HOW IT WORKS:</span> Click on any event in the top graph to increment its "Attendees" counter. The diagram automatically updates.
        </p>
      </section>
      
      {/* Interactive Diagram */}
      <InteractiveFlowDiagram 
        events={interactiveEvents}
        flows={flows}
        title="[ INTERACTIVE FLOW DIAGRAM ]"
        isInteractive={true}
        handleEventClick={handleEventClick}
      />

      {/* Simulation Diagram */}
      <InteractiveFlowDiagram 
        events={simulationEvents}
        flows={flows}
        title="[ SIMULATION ]"
        isInteractive={false}
        manualFlows={simulationFlows}
      />

      {/* Legend */}
      <section className="border-2 border-border p-4 bg-card">
        <h3 className="text-sm font-bold font-mono mb-3">[ LEGEND ]</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-1 h-8 bg-primary"></div>
            <span className="text-muted-foreground">1-day event (thin bar)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 bg-primary"></div>
            <span className="text-muted-foreground">Multi-day event (thick bar)</span>
          </div>
          <div className="flex items-center gap-2">
            <MousePointer className="h-4 w-4" />
            <span className="text-muted-foreground">Click event to increment attendance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1" style={{ backgroundColor: "#3b82f6" }}></div>
            <span className="text-muted-foreground">Low ratio = thin line</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-2" style={{ backgroundColor: "#8b5cf6" }}></div>
            <span className="text-muted-foreground">High ratio = thick line</span>
          </div>
        </div>
      </section>
    </div>
  );
}
