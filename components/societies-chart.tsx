"use client";

import { useState, useRef } from "react";
import type { SocietyDatabase } from "@/lib/data/societies-database";
import { BarChart3, ChevronDown, TrendingUp } from "lucide-react";

interface SocietiesChartProps {
  societies: SocietyDatabase[];
}

// Helper function to get founding year for a society
// Returns the chart year (may be adjusted to 2010+ for pre-2010 societies)
const getFoundedFromSociety = (society: SocietyDatabase): string => {
  let foundedYear: string | null = null;

  // Prioritize founded field from Airtable (live synced data)
  if (society.founded) {
    const foundedYearStr = society.founded.toString().trim();
    
    // Skip "Unknown" or invalid values
    if (foundedYearStr.toLowerCase() !== "unknown" && foundedYearStr !== "" && foundedYearStr !== "null") {
      // Validate it's a reasonable year (between 1900 and current year + 1)
      const yearNum = parseInt(foundedYearStr, 10);
      const currentYear = new Date().getFullYear();
      if (!isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear + 1) {
        foundedYear = foundedYearStr;
      }
    }
  }

  // Fallback: Estimate founding year based on tier and known societies
  // This only runs if Airtable data is missing or invalid
  if (!foundedYear) {
    if (society.name.includes("Próspera")) foundedYear = "2020";
    else if (society.name.includes("Sealand")) foundedYear = "1967";
    else if (society.name.includes("Liberland")) foundedYear = "2015";
    else if (society.name.includes("Network School") || society.name.includes("The Network School")) foundedYear = "2023";
    else if (society.name.includes("Edge City")) foundedYear = "2023";
    else if (society.name.includes("Don't Die")) foundedYear = "2023";
    else if (society.name.includes("Zuzalu")) foundedYear = "2023";
    else if (society.name.includes("Logos")) foundedYear = "2022";
    else if (society.name.includes("VDAO")) foundedYear = "2023";
    else if (society.tier === 1) foundedYear = "2023";
    else if (society.tier === 2) foundedYear = "2022";
    else if (society.tier === 3) foundedYear = "2021";
    else foundedYear = "2023";
  }

  // Convert pre-2010 years to 2010 for chart purposes
  if (foundedYear) {
    const yearNum = parseInt(foundedYear, 10);
    if (!isNaN(yearNum) && yearNum < 2010) {
      return "2010";
    }
  }

  return foundedYear || "2023";
};

// Generate chart data
const generateChartData = (societies: SocietyDatabase[]) => {
  const yearData: { [year: string]: number } = {};

  // Count societies by founding year (using live synced Airtable data)
  societies.forEach(society => {
    const year = getFoundedFromSociety(society);
    if (year) {
      yearData[year] = (yearData[year] || 0) + 1;
    }
  });

  // Chart starts from 2010 (pre-2010 societies are counted in 2010)
  const minYear = 2010;
  const maxYear = Math.max(
    ...Object.keys(yearData)
      .map(Number)
      .filter(y => !isNaN(y) && y >= minYear),
    new Date().getFullYear()
  );

  // Fill in missing years with 0
  for (let year = minYear; year <= maxYear; year++) {
    if (!yearData[year.toString()]) {
      yearData[year.toString()] = 0;
    }
  }

  // Calculate cumulative counts
  const cumulativeData: { [year: string]: number } = {};
  let cumulative = 0;
  for (let year = minYear; year <= maxYear; year++) {
    cumulative += yearData[year.toString()];
    cumulativeData[year.toString()] = cumulative;
  }

  // Calculate stats
  const currentYear = new Date().getFullYear().toString();
  const thisYear = yearData[currentYear] || 0;
  const total = societies.length;
  const latestCumulative = cumulativeData[Object.keys(cumulativeData).sort().pop() || currentYear] || 0;

  return {
    yearData,
    cumulativeData,
    years: Object.keys(cumulativeData).sort(),
    maxCount: Math.max(...Object.values(cumulativeData)),
    thisYear,
    total,
    latestCumulative,
  };
};

interface SocietiesChartProps {
  societies: SocietyDatabase[];
  onToggleChart?: (show: boolean) => void;
  showChart?: boolean;
}

export function SocietiesChartStats({ societies, onToggleChart, showChart }: { societies: SocietyDatabase[]; onToggleChart?: (show: boolean) => void; showChart?: boolean }) {
  const chartData = generateChartData(societies);
  const { thisYear, total } = chartData;

  const handleToggle = () => {
    onToggleChart?.(!showChart);
  };

  return (
    <div className="border-2 border-border bg-card p-6">
      <div className="space-y-2">
        {/* Total Societies */}
        <div className="border-2 border-border p-3 text-center bg-background">
          <div className="flex justify-center mb-1">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div className="text-xl font-bold font-mono mb-0.5">
            {total}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            TOTAL SOCIETIES
          </div>
        </div>

        {/* New This Year */}
        <div className="border-2 border-border p-3 text-center bg-background">
          <div className="flex justify-center mb-1">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-xl font-bold font-mono mb-0.5">
            {thisYear}
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            NEW THIS YEAR
          </div>
        </div>
      </div>

      {/* See More Stats Link */}
      <div className="mt-4">
        <button
          onClick={handleToggle}
          className="w-full flex items-center justify-between font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>See growth chart</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showChart ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export function SocietiesChartGraph({ societies, onClose }: { societies: SocietyDatabase[]; onClose?: () => void }) {
  const moreStatsRef = useRef<HTMLDivElement>(null);
  const chartData = generateChartData(societies);
  const { cumulativeData, years, maxCount } = chartData;

  return (
    <section ref={moreStatsRef} className="border-2 border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold font-mono">
          [ SOCIETIES GROWTH ]
        </h2>
        <button
          onClick={onClose}
          className="font-mono text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Close
        </button>
      </div>

      {/* Desktop Chart */}
      <div className="hidden md:block mt-6">
        <div className="space-y-1">
          {/* Bar Chart Area */}
          <div className="grid gap-2 items-end" style={{ gridTemplateColumns: `60px repeat(${years.length}, minmax(50px, 1fr))`, minHeight: '200px' }}>
            {/* Y-axis label */}
            <div className="text-xs font-mono text-muted-foreground flex items-center justify-end pr-2">
              Societies
            </div>

            {/* Vertical Bars */}
            {years.map((year, index) => {
              const count = cumulativeData[year];
              const heightPercent = (count / maxCount) * 100;
              const previousCount = index > 0 ? cumulativeData[years[index - 1]] : 0;
              const growthPercent = previousCount > 0
                ? Math.round(((count - previousCount) / previousCount) * 100)
                : 0;

              return (
                <div key={year} className="flex flex-col justify-end items-center gap-1" style={{ height: '200px' }}>
                  {/* Count label above bar */}
                  <div className="text-xs font-mono font-bold text-primary mb-auto pt-2">
                    {count}
                  </div>

                  {/* Growth percentage */}
                  {index > 0 && growthPercent > 0 && (
                    <div className="text-[10px] font-mono font-bold text-green-500">
                      +{growthPercent}%
                    </div>
                  )}

                  {/* Vertical bar */}
                  <div
                    className="bg-primary/90 border-2 border-border relative group transition-all hover:bg-primary cursor-pointer"
                    style={{ height: `${heightPercent}%`, width: '60%' }}
                    title={`${year}: ${count} societies`}
                  >
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-popover border-2 border-border p-2 whitespace-nowrap text-xs font-mono shadow-lg">
                      <div className="font-bold">{year}</div>
                      <div className="text-muted-foreground">{count} societies</div>
                      <div className="text-muted-foreground text-[10px]">+{chartData.yearData[year]} new</div>
                      {index > 0 && growthPercent > 0 && (
                        <div className="text-green-500 text-[10px]">+{growthPercent}% growth</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Year Headers */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `60px repeat(${years.length}, minmax(50px, 1fr))` }}>
            <div className="text-xs font-mono font-bold text-muted-foreground"></div>
            {years.map((year) => (
              <div key={year} className="text-center">
                <div className="text-xs font-mono font-bold">{year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Chart */}
      <div className="md:hidden mt-6">
        <div className="space-y-4">
          {years.map((year, index) => {
            const count = cumulativeData[year];
            const widthPercent = (count / maxCount) * 100;
            const previousCount = index > 0 ? cumulativeData[years[index - 1]] : 0;
            const growthPercent = previousCount > 0
              ? Math.round(((count - previousCount) / previousCount) * 100)
              : 0;

            return (
              <div key={year} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold">{year}</span>
                  <div className="flex items-center gap-2">
                    {index > 0 && growthPercent > 0 && (
                      <span className="text-green-500 font-bold text-[10px]">+{growthPercent}%</span>
                    )}
                    <span className="text-primary font-bold">{count}</span>
                  </div>
                </div>
                <div className="w-full bg-muted border border-border h-8 relative">
                  <div
                    className="h-full bg-primary/90 border-r-2 border-border flex items-center justify-end pr-2"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <span className="text-xs font-mono text-primary-foreground font-bold">
                      +{chartData.yearData[year]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Default export for backwards compatibility
export default function SocietiesChart({ societies }: SocietiesChartProps) {
  const [showMoreStats, setShowMoreStats] = useState(false);

  return (
    <>
      <SocietiesChartStats societies={societies} onToggleChart={setShowMoreStats} />
      {showMoreStats && (
        <SocietiesChartGraph societies={societies} onClose={() => setShowMoreStats(false)} />
      )}
    </>
  );
}
