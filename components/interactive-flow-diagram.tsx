"use client";

import { useMemo } from "react";
import { MousePointer } from "lucide-react";

// Type definitions (can be moved to a central types file later)
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
  count: number; // Note: this is not used in the new simplified logic but kept for type consistency
  color: string;
};

interface InteractiveFlowDiagramProps {
  events: Event[];
  flows: Flow[];
  title: string;
  isInteractive: boolean;
  handleEventClick?: (eventId: string) => void;
  manualFlows?: { [key: string]: number };
}

export function InteractiveFlowDiagram({
  events,
  flows,
  title,
  isInteractive,
  handleEventClick,
  manualFlows,
}: InteractiveFlowDiagramProps) {
  // Calculate timeline dimensions
  const timelineStart = useMemo(() => {
    if (events.length === 0) return new Date();
    return new Date(Math.min(...events.map((e) => e.startDate.getTime())));
  }, [events]);

  const timelineEnd = useMemo(() => {
    if (events.length === 0) return new Date();
    return new Date(Math.max(...events.map((e) => e.endDate.getTime())));
  }, [events]);

  const totalDays = useMemo(() => {
    if (events.length === 0) return 1;
    return Math.ceil((timelineEnd.getTime() - timelineStart.getTime()) / 86400000) + 1;
  }, [timelineStart, timelineEnd, events]);

  // SVG dimensions
  const pixelsPerDay = 40;
  const svgWidth = Math.max(1200, totalDays * pixelsPerDay);
  const svgHeight = 600;
  const margin = { top: 80, right: 40, bottom: 40, left: 40 };
  const chartWidth = svgWidth - margin.left - margin.right;
  const chartHeight = svgHeight - margin.top - margin.bottom;
  const laneHeight = chartHeight / 3;

  // --- Helper functions moved from page.tsx ---

  const getEventPosition = (event: Event) => {
    const startDayOffset =
      (event.startDate.getTime() - timelineStart.getTime()) / 86400000;
    const endDayOffset =
      (event.endDate.getTime() - timelineStart.getTime()) / 86400000;
    const durationDays = endDayOffset - startDayOffset + 1;

    const x = margin.left + (startDayOffset / totalDays) * chartWidth;
    const y = margin.top + event.lane * laneHeight + laneHeight / 2;
    const width = (durationDays / totalDays) * chartWidth;

    return { x, y, width, duration: durationDays };
  };

  const getDateMarkers = () => {
    const markers: { date: Date; x: number; label: string; isMonth: boolean }[] = [];
    if (events.length === 0) return markers;
    
    const current = new Date(timelineStart);
    while (current <= timelineEnd) {
      const dayOffset = (current.getTime() - timelineStart.getTime()) / 86400000;
      const x = margin.left + (dayOffset / totalDays) * chartWidth;
      const isFirstOfMonth = current.getDate() === 1;
      const label = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      markers.push({ date: new Date(current), x, label, isMonth: isFirstOfMonth });

      if (totalDays > 90) {
        current.setMonth(current.getMonth() + 1);
        current.setDate(1);
      } else if (totalDays > 30) {
        current.setDate(current.getDate() + 7);
      } else {
        current.setDate(current.getDate() + Math.max(1, Math.floor(totalDays / 15)));
      }
    }
    return markers;
  };

  const getFlowPath = (flow: Flow) => {
    const fromEvent = events.find((e) => e.id === flow.from);
    const toEvent = events.find((e) => e.id === flow.to);
    if (!fromEvent || !toEvent) return "";

    const fromPos = getEventPosition(fromEvent);
    const toPos = getEventPosition(toEvent);

    const startX = fromPos.x + fromPos.width;
    const startY = fromPos.y;
    const endX = toPos.x;
    const endY = toPos.y;

    const controlX1 = startX + (endX - startX) * 0.3;
    const controlX2 = startX + (endX - startX) * 0.7;

    return `M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`;
  };
  
  if (events.length === 0) {
    return null; // Don't render anything if there are no events
  }

  return (
    <section className="border-2 border-border p-4 sm:p-6 bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
      <h2 className="text-lg sm:text-xl font-bold font-mono mb-6">{title}</h2>

      <div className="overflow-x-auto">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="font-mono"
          style={{ minWidth: svgWidth }}
        >
          {/* Timeline axis */}
          <line
            x1={margin.left}
            y1={margin.top - 20}
            x2={margin.left + chartWidth}
            y2={margin.top - 20}
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Flow paths */}
          {flows.map((flow, index) => {
            const path = getFlowPath(flow);
            const fromEvent = events.find((e) => e.id === flow.from);
            const toEvent = events.find((e) => e.id === flow.to);

            let width: number;
            let percentage: string;
            let showLabel: boolean;

            if (manualFlows) {
              const flowKey = `${flow.from}-to-${flow.to}`;
              const manualPercentage = manualFlows[flowKey] || 0;
              percentage = manualPercentage.toFixed(0);
              width = Math.max(2, (manualPercentage / 100) * 40);
              showLabel = manualPercentage > 0;
            } else {
              const ratio = (fromEvent && toEvent && toEvent.attendance > 0)
                ? fromEvent.attendance / toEvent.attendance
                : 0;
              percentage = (ratio * 100).toFixed(0);
              width = Math.max(2, ratio * 40);
              showLabel = !!(fromEvent && toEvent && toEvent.attendance > 0);
            }

            return (
              <g key={`flow-${index}`}>
                <path d={path} fill="none" stroke={flow.color} strokeWidth={width + 4} opacity="0.2" />
                <path d={path} fill="none" stroke={flow.color} strokeWidth={width} opacity="0.7" />
                {showLabel && (
                  <text
                    x={fromEvent ? getEventPosition(fromEvent).x + getEventPosition(fromEvent).width + (getEventPosition(toEvent!).x - (getEventPosition(fromEvent).x + getEventPosition(fromEvent).width)) / 2 : 0}
                    y={fromEvent ? (getEventPosition(fromEvent).y + getEventPosition(toEvent!).y) / 2 : 0}
                    textAnchor="middle"
                    className="text-xs font-bold font-mono"
                    fill={flow.color}
                  >
                    {percentage}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Event nodes */}
          {events.map((event) => {
            const pos = getEventPosition(event);
            const nodeHeight = 80;

            return (
              <g
                key={event.id}
                onClick={() => isInteractive && handleEventClick?.(event.id)}
                className={isInteractive ? "cursor-pointer transition-transform hover:translate-x-1 hover:translate-y-1" : ""}
              >
                <rect x={pos.x} y={pos.y - nodeHeight / 2} width={pos.duration === 1 ? 4 : 8} height={nodeHeight} className="fill-primary" />
                <rect x={pos.x + 12} y={pos.y - nodeHeight / 2} width={pos.width - 12} height={nodeHeight} className="fill-card stroke-border" strokeWidth="2" filter="drop-shadow(4px 4px 0px rgba(0,0,0,0.3))" />
                <text x={pos.x + 20} y={pos.y - 10} className="text-sm font-bold fill-current">{event.name}</text>
                <text x={pos.x + 20} y={pos.y + 10} className="text-xs fill-current opacity-60">Attendees: {event.attendance}</text>
                <text x={pos.x + 20} y={pos.y + 25} className="text-xs fill-current opacity-40">{pos.duration === 1 ? "1 day" : `${pos.duration} days`}</text>
              </g>
            );
          })}

          {/* Date markers */}
          {getDateMarkers().map((marker, index) => (
            <g key={`marker-${index}`}>
              <line x1={marker.x} y1={margin.top - 20} x2={marker.x} y2={margin.top - (marker.isMonth ? 30 : 25)} stroke="currentColor" strokeWidth={marker.isMonth ? "2" : "1"} opacity={marker.isMonth ? "0.4" : "0.2"} />
              <text x={marker.x} y={margin.top - (marker.isMonth ? 40 : 35)} textAnchor="middle" className={marker.isMonth ? "text-xs font-bold fill-current" : "text-xs fill-current opacity-60"}>
                {marker.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}