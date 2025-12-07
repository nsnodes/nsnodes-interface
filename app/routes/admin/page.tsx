"use client";

import { useState, useEffect } from "react";
import { Lock, Plus, Trash2, Save, Eye, AlertCircle, Edit, Check, X } from "lucide-react";
import { verifyRoutesAdminPassword, getRouteData } from "@/lib/actions/routes";
import { getEvents } from "@/lib/actions/events";
import type { UIEvent } from "@/lib/types/events";
import type { RouteData, RouteEvent, RouteConnection } from "@/lib/data/event-routes";

const flowColors = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#06b6d4", "#ef4444", "#f97316",
];

export default function RoutesAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Route data
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [availableEvents, setAvailableEvents] = useState<UIEvent[]>([]);

  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showConnectionForm, setShowConnectionForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    startDate: "",
    endDate: "",
    lane: 0,
  });
  const [newConnection, setNewConnection] = useState({
    from: "",
    to: "",
    color: flowColors[0],
  });

  // Handle password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const isValid = await verifyRoutesAdminPassword(password);

    if (isValid) {
      setIsAuthenticated(true);
      // Load route data and events
      loadData();
    } else {
      setError("Invalid password");
    }

    setLoading(false);
  };

  // Load route data and available events
  const loadData = async () => {
    try {
      const [routes, events] = await Promise.all([
        getRouteData(),
        getEvents(),
      ]);
      setRouteData(routes);
      setAvailableEvents(events);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load data");
    }
  };

  // Add event
  const handleAddEvent = () => {
    if (!routeData || !newEvent.name || !newEvent.startDate || !newEvent.endDate) {
      setError("Please fill in all required fields");
      return;
    }

    const id = newEvent.name.toLowerCase().replace(/\s+/g, "-");
    const event: RouteEvent = {
      id,
      name: newEvent.name,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate,
      lane: newEvent.lane,
    };

    setRouteData({
      ...routeData,
      events: [...routeData.events, event],
    });

    setNewEvent({ name: "", startDate: "", endDate: "", lane: 0 });
    setShowEventForm(false);
  };

  // Update event
  const handleUpdateEvent = (eventId: string, updates: Partial<RouteEvent>) => {
    if (!routeData) return;

    setRouteData({
      ...routeData,
      events: routeData.events.map((e) =>
        e.id === eventId ? { ...e, ...updates } : e
      ),
    });
  };

  // Delete event
  const handleDeleteEvent = (eventId: string) => {
    if (!routeData) return;

    // Also delete any connections involving this event
    setRouteData({
      events: routeData.events.filter((e) => e.id !== eventId),
      connections: routeData.connections.filter(
        (c) => c.from !== eventId && c.to !== eventId
      ),
    });
  };

  // Add connection
  const handleAddConnection = () => {
    if (!routeData || !newConnection.from || !newConnection.to) {
      setError("Please select both events");
      return;
    }

    if (newConnection.from === newConnection.to) {
      setError("Cannot connect an event to itself");
      return;
    }

    const connection: RouteConnection = {
      from: newConnection.from,
      to: newConnection.to,
      color: newConnection.color,
    };

    setRouteData({
      ...routeData,
      connections: [...routeData.connections, connection],
    });

    setNewConnection({ from: "", to: "", color: flowColors[0] });
    setShowConnectionForm(false);
  };

  // Delete connection
  const handleDeleteConnection = (index: number) => {
    if (!routeData) return;

    setRouteData({
      ...routeData,
      connections: routeData.connections.filter((_, i) => i !== index),
    });
  };

  // State for simulation data
  const [simulationAttendance, setSimulationAttendance] = useState<{ [key: string]: number }>({});
  const [simulationFlows, setSimulationFlows] = useState<{ [key: string]: number }>({});

  // Effect to load simulation data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("simulation-data");
    if (storedData) {
      const data = JSON.parse(storedData);
      setSimulationAttendance(data.events || {});
      setSimulationFlows(data.flows || {});
    }
  }, []);

  // Handler for updating simulation numbers
  const handleSimAttendanceChange = (eventId: string, value: string) => {
    setSimulationAttendance(prev => ({
      ...prev,
      [eventId]: Number(value) || 0,
    }));
  };

  const handleSimFlowChange = (flowKey: string, value: string) => {
    setSimulationFlows(prev => ({
      ...prev,
      [flowKey]: Number(value) || 0,
    }));
  };

  // Handler for saving simulation data
  const handleSaveSimulation = () => {
    const dataToSave = {
      events: simulationAttendance,
      flows: simulationFlows,
    };
    localStorage.setItem("simulation-data", JSON.stringify(dataToSave));
    alert("Simulation data saved to localStorage!");
  };

  // Import event from database
  const handleImportEvent = (event: UIEvent) => {
    if (!routeData) return;

    const id = event.title.toLowerCase().replace(/\s+/g, "-");

    // Use event dates directly
    const start = new Date(event.start_at);
    const end = new Date(event.end_at);
    const endDate = end.toISOString().split('T')[0];

    const newEvent: RouteEvent = {
      id,
      name: event.title,
      startDate: event.date,
      endDate: endDate,
      lane: routeData.events.length % 3, // Auto-assign lane
      sourceEventId: event.title,
    };

    setRouteData({
      ...routeData,
      events: [...routeData.events, newEvent],
    });
  };

  // Save changes (for now, just show JSON that can be copied)
  const handleSave = () => {
    alert("Route data updated! In production, this would save to a file or database.\n\nFor now, copy the JSON below and paste it into lib/data/event-routes.ts");
    console.log("Route Data:", routeData);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Lock className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold font-mono">[ ROUTES ADMIN ]</h1>
            <p className="text-sm text-muted-foreground font-mono">
              Enter password to access route management
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="border-2 border-border p-4 bg-card">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border-2 border-border bg-background font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="border-2 border-red-500 bg-red-500/10 p-3 text-red-500 text-sm font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 border-2 border-border bg-primary text-primary-foreground font-mono font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            >
              {loading ? "[ VERIFYING... ]" : "[ ACCESS ADMIN ]"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!routeData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-2">
          <div className="text-lg font-mono">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold font-mono">
            [ ROUTES ADMIN ]
          </h1>
          <div className="flex gap-2">
            <a
              href="/routes"
              className="px-4 py-2 border-2 border-border bg-background font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              [ VIEW PAGE ]
            </a>
            <button
              onClick={handleSave}
              className="px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              [ SAVE ROUTE CHANGES ]
            </button>
          </div>
        </div>
        <div className="border-2 border-border bg-yellow-500/10 border-yellow-500 p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-mono text-yellow-500">
            <strong>NOTE:</strong> Route changes (Events and Connections) are stored in memory. Click "SAVE ROUTE CHANGES" to get the JSON to manually update the data file. Simulation data is saved separately.
          </p>
        </div>
      </section>

      {/* Events Management */}
      <section className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-mono">[ EVENTS ]</h2>
          <button
            onClick={() => setShowEventForm(!showEventForm)}
            className="px-3 py-1 border-2 border-border bg-background font-mono text-xs flex items-center gap-1 hover:bg-accent transition-colors"
          >
            <Plus className="h-3 w-3" />
            ADD EVENT
          </button>
        </div>

        {/* Add Event Form */}
        {showEventForm && (
          <div className="border-2 border-border p-4 mb-4 bg-muted/50 space-y-3">
            <h3 className="text-sm font-bold font-mono">New Event</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Event Name"
                value={newEvent.name}
                onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({ ...newEvent, endDate: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-muted-foreground mb-1 block">Lane</label>
                  <input
                    type="number"
                    placeholder="Lane (0, 1, 2...)"
                    value={newEvent.lane}
                    onChange={(e) => setNewEvent({ ...newEvent, lane: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddEvent}
                className="px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-xs"
              >
                ADD
              </button>
              <button
                onClick={() => setShowEventForm(false)}
                className="px-4 py-2 border-2 border-border bg-background font-mono text-xs"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-2">
          {routeData.events.map((event) => (
            <div
              key={event.id}
              className="border-2 border-border p-3 bg-background"
            >
              {editingEventId === event.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={event.name}
                    onChange={(e) => handleUpdateEvent(event.id, { name: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm font-bold"
                    placeholder="Event Name"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1 block">Start Date</label>
                      <input
                        type="date"
                        value={event.startDate}
                        onChange={(e) => handleUpdateEvent(event.id, { startDate: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1 block">End Date</label>
                      <input
                        type="date"
                        value={event.endDate}
                        onChange={(e) => handleUpdateEvent(event.id, { endDate: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono text-muted-foreground mb-1 block">Lane</label>
                      <input
                        type="number"
                        value={event.lane}
                        onChange={(e) => handleUpdateEvent(event.id, { lane: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="px-3 py-1 border-2 border-border bg-primary text-primary-foreground font-mono text-xs flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      DONE
                    </button>
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="px-3 py-1 border-2 border-border bg-background font-mono text-xs flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      CANCEL
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="font-mono font-bold text-sm">{event.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {event.startDate} to {event.endDate} • Lane {event.lane}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingEventId(event.id)}
                      className="p-2 border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
                      title="Edit event"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 border-2 border-border bg-background hover:bg-red-500 hover:text-white transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Connections Management */}
      <section className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-mono">[ CONNECTIONS ]</h2>
          <button
            onClick={() => setShowConnectionForm(!showConnectionForm)}
            className="px-3 py-1 border-2 border-border bg-background font-mono text-xs flex items-center gap-1 hover:bg-accent transition-colors"
          >
            <Plus className="h-3 w-3" />
            ADD CONNECTION
          </button>
        </div>

        {/* Add Connection Form */}
        {showConnectionForm && (
          <div className="border-2 border-border p-4 mb-4 bg-muted/50 space-y-3">
            <h3 className="text-sm font-bold font-mono">New Connection</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={newConnection.from}
                onChange={(e) => setNewConnection({ ...newConnection, from: e.target.value })}
                className="px-3 py-2 border-2 border-border bg-background font-mono text-sm"
              >
                <option value="">From Event</option>
                {routeData.events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <select
                value={newConnection.to}
                onChange={(e) => setNewConnection({ ...newConnection, to: e.target.value })}
                className="px-3 py-2 border-2 border-border bg-background font-mono text-sm"
              >
                <option value="">To Event</option>
                {routeData.events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={newConnection.color}
                  onChange={(e) => setNewConnection({ ...newConnection, color: e.target.value })}
                  className="h-10 w-20 border-2 border-border cursor-pointer"
                />
                <select
                  value={newConnection.color}
                  onChange={(e) => setNewConnection({ ...newConnection, color: e.target.value })}
                  className="flex-1 px-3 py-2 border-2 border-border bg-background font-mono text-xs"
                >
                  {flowColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddConnection}
                className="px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-xs"
              >
                ADD
              </button>
              <button
                onClick={() => setShowConnectionForm(false)}
                className="px-4 py-2 border-2 border-border bg-background font-mono text-xs"
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Connections List */}
        <div className="space-y-2">
          {routeData.connections.map((connection, index) => {
            const fromEvent = routeData.events.find((e) => e.id === connection.from);
            const toEvent = routeData.events.find((e) => e.id === connection.to);

            return (
              <div
                key={index}
                className="border-2 border-border p-3 bg-background flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 border-2 border-border"
                    style={{ backgroundColor: connection.color }}
                  />
                  <div className="font-mono text-sm">
                    {fromEvent?.name || connection.from} → {toEvent?.name || connection.to}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteConnection(index)}
                  className="p-2 border-2 border-border bg-background hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Simulation Settings */}
      <section className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-mono">[ SIMULATION SETTINGS ]</h2>
          <button
            onClick={handleSaveSimulation}
            className="px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            [ SAVE SIMULATION ]
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Event Attendance Column */}
          <div className="space-y-3">
            <h3 className="text-md font-bold font-mono underline">Event Attendance</h3>
            {routeData.events.map(event => (
              <div key={event.id} className="grid grid-cols-2 items-center gap-4">
                <label className="font-mono text-sm text-right">{event.name}</label>
                <input
                  type="number"
                  value={simulationAttendance[event.id] || 0}
                  onChange={(e) => handleSimAttendanceChange(event.id, e.target.value)}
                  className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm"
                  placeholder="Attendees"
                />
              </div>
            ))}
          </div>

          {/* Flow Percentage Column */}
          <div className="space-y-3">
            <h3 className="text-md font-bold font-mono underline">Flow Percentage Overrides</h3>
            {routeData.connections.map(flow => {
              const flowKey = `${flow.from}-to-${flow.to}`;
              const fromEvent = routeData.events.find(e => e.id === flow.from);
              const toEvent = routeData.events.find(e => e.id === flow.to);
              return (
                <div key={flowKey} className="grid grid-cols-2 items-center gap-4">
                  <label className="font-mono text-sm text-right truncate" title={`${fromEvent?.name} → ${toEvent?.name}`}>{fromEvent?.name} → {toEvent?.name}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={simulationFlows[flowKey] || 0}
                      onChange={(e) => handleSimFlowChange(flowKey, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-border bg-background font-mono text-sm pr-8"
                      placeholder="%"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-4">
          These numbers power the non-interactive simulation graph. Click "Save Simulation" to update the data in your browser.
        </p>
      </section>

      {/* Import from Database */}
      <section className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <h2 className="text-lg font-bold font-mono mb-4">
          [ IMPORT FROM EVENT DATABASE ]
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableEvents.slice(0, 20).map((event, index) => (
            <div
              key={index}
              className="border-2 border-border p-3 bg-background flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="font-mono font-bold text-sm">{event.title}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {event.date} • {event.location} • {event.networkState}
                </div>
              </div>
              <button
                onClick={() => handleImportEvent(event)}
                disabled={routeData.events.some(
                  (e) => e.name === event.title
                )}
                className="px-3 py-1 border-2 border-border bg-primary text-primary-foreground font-mono text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                IMPORT
              </button>
            </div>
          ))}
        </div>
        <p className="text-xs font-mono text-muted-foreground mt-3">
          Showing first 20 upcoming events
        </p>
      </section>

      {/* JSON Output */}
      <section className="border-2 border-border p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
        <h2 className="text-lg font-bold font-mono mb-4">
          [ CURRENT DATA (JSON) ]
        </h2>
        <pre className="p-4 bg-muted border-2 border-border font-mono text-xs overflow-x-auto">
          {JSON.stringify(routeData, null, 2)}
        </pre>
        <p className="text-xs font-mono text-muted-foreground mt-3">
          Copy this JSON and paste it into lib/data/event-routes.ts to persist changes
        </p>
      </section>
    </div>
  );
}

