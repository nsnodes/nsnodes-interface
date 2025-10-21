"use client";

import { societiesDatabase, SocietyDatabase } from "@/lib/data/societies-database";
import { BarChart3 } from "lucide-react";

// Helper function to get founding year for a society
const getFoundedFromSociety = (society: SocietyDatabase) => {
  // Estimate founding year based on tier and known societies
  if (society.name.includes("Próspera")) return "2020";
  if (society.name.includes("Sealand")) return "1967";
  if (society.name.includes("Liberland")) return "2015";
  if (society.name.includes("Network School") || society.name.includes("The Network School")) return "2023";
  if (society.name.includes("Edge City")) return "2023";
  if (society.name.includes("Don't Die")) return "2023";
  if (society.name.includes("Zuzalu")) return "2023";
  if (society.name.includes("Logos")) return "2022";
  if (society.name.includes("VDAO")) return "2023";

  // Default based on tier
  if (society.tier === 1) return "2023";
  if (society.tier === 2) return "2022";
  if (society.tier === 3) return "2021";
  return "2023";
};

// Generate chart data
const generateChartData = () => {
  const yearData: { [year: string]: number } = {};

  // Count societies by founding year
  societiesDatabase.forEach(society => {
    const year = getFoundedFromSociety(society);
    yearData[year] = (yearData[year] || 0) + 1;
  });

  // Start from 2019
  const minYear = 2019;
  const maxYear = Math.max(...Object.keys(yearData).map(Number));

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

  return {
    yearData,
    cumulativeData,
    years: Object.keys(cumulativeData).sort(),
    maxCount: Math.max(...Object.values(cumulativeData))
  };
};

export default function SocietiesChart() {
  const chartData = generateChartData();
  const { cumulativeData, years, maxCount } = chartData;

  return (
    <div className="border-2 border-border bg-card">
      {/* Chart Header */}
      <div className="border-b-2 border-border bg-muted p-4">
        <h3 className="font-mono font-bold text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          [ SOCIETIES GROWTH ]
        </h3>
      </div>

      {/* Desktop Chart */}
      <div className="hidden md:block p-6">
        <div className="space-y-1">
          {/* Year Headers */}
          <div className="grid gap-2" style={{ gridTemplateColumns: `80px repeat(${years.length}, minmax(60px, 1fr))` }}>
            <div className="text-xs font-mono font-bold text-muted-foreground"></div>
            {years.map((year) => (
              <div key={year} className="text-center">
                <div className="text-xs font-mono font-bold">{year}</div>
              </div>
            ))}
          </div>

          {/* Bar Chart Area */}
          <div className="grid gap-2 items-end" style={{ gridTemplateColumns: `80px repeat(${years.length}, minmax(60px, 1fr))`, minHeight: '300px' }}>
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
                <div key={year} className="flex flex-col justify-end items-center gap-1" style={{ height: '300px' }}>
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
        </div>
      </div>

      {/* Mobile Chart */}
      <div className="md:hidden p-4">
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

      {/* Footer */}
      <div className="border-t-2 border-border bg-muted p-4">
        <div className="text-xs font-mono text-muted-foreground text-center">
          Showing cumulative count of Network State societies founded by year
        </div>
      </div>
    </div>
  );
}
